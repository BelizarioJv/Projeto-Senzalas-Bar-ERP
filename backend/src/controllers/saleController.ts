import { RequestHandler } from "express";
import { prisma } from "../database/prisma.js";
import { HttpError } from "../errors/HttpError.js";
import { getStartOfMonth } from "../utils/date.js";
import {
  SaleRequestSchema,
  MetaSaleRequestSchema,
} from "../docs/schemas/SaleRequestSchema.js";
import { Prisma } from "@prisma/client";

export class SaleController {
  //Buscar todos as vendas
  index: RequestHandler = async (req, res, next) => {
    try {
      const query = MetaSaleRequestSchema.parse(req.query);
      const { page, pageSize, total, sortBy, order } = query;
      const pageNumber = Number(page);
      const pageSizeNumber = Number(pageSize);

      const where: Prisma.SaleWhereInput = {};

      if (total) {
        where.total = {
          equals: total,
        };
      }

      const sales = await prisma.sale.findMany({
        where,
        skip: (pageNumber - 1) * pageSizeNumber,
        take: pageSizeNumber,
        orderBy: {
          [sortBy]: order,
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const totalRecords = await prisma.sale.count({
        where,
      });

      res.json({
        data: sales,
        meta: {
          page: pageNumber,
          pageSize: pageSizeNumber,
          totalRecords,
          totalPages: Math.ceil(totalRecords / pageSizeNumber),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  //Buscar venda
  show: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const saleId = Number(id);

      if (isNaN(saleId)) {
        return res.status(400).json({ message: "O ID fornecido é inválido." });
      }

      const sale = await prisma.sale.findUnique({
        where: { id: saleId },
        include: {
          user: {
            select: { id: true, name: true },
          },
          products: {
            include: {
              product: true,
            },
          },
          customer: {
            select: { id: true, name: true },
          },
        },
      });

      if (!sale) {
        return res.status(404).json({ message: "Venda não encontrada." });
      }

      res.status(201).json(sale);
    } catch (error) {
      next(error);
    }
  };

  //Criar venda
  create: RequestHandler = async (req, res, next) => {
    try {
      const body = SaleRequestSchema.parse(req.body);

      // Validação estrita do usuário autenticado (JWT Middleware)
      if (!req.user || typeof req.user !== "number") {
        throw new HttpError(401, "Usuário não autenticado ou inválido");
      }

      if (!body.products || body.products.length === 0) {
        throw new HttpError(400, "A venda deve conter pelo menos um produto");
      }

      const userId = req.user;

      const subtotal = body.products.reduce(
        (acc, product) => acc + product.quantity * product.price,
        0,
      );

      const discountPercent = Number(body.discountPercent || 0);
      const discountValue = (subtotal * discountPercent) / 100;
      const total = subtotal - discountValue;

      // Executa toda a operação em uma transação isolada
      const saleTransaction = await prisma.$transaction(async (tx) => {
        // 1. Caso haja customerId, valida se o cliente realmente existe antes de prosseguir
        if (body.customerId) {
          const customerExists = await tx.customer.findUnique({
            where: { id: body.customerId },
          });
          if (!customerExists) {
            throw new HttpError(
              404,
              `Cliente com ID ${body.customerId} não encontrado`,
            );
          }
        }

        // 2. Cria a venda com os dados recebidos (e vincula o customerId se houver)
        const sale = await tx.sale.create({
          data: {
            discountPercent,
            discountValue,
            total,
            payment: body.payment,
            observation: body.observation,
            userId: userId,
            customerId: body.customerId || null,
            products: {
              create: body.products.map((p) => ({
                productId: p.productId,
                quantity: p.quantity,
                price: p.price,
                subtotal: p.quantity * p.price,
              })),
            },
          },
          include: {
            products: true,
            user: true,
            customer: true,
          },
        });

        // 3. Se o método de pagamento for FIADO, atualiza o saldo devedor do cliente
        if (body.payment === "FIADO" && body.customerId) {
          await tx.customer.update({
            where: { id: body.customerId },
            data: {
              debtBalance: {
                increment: total,
              },
            },
          });
        }

        // 4. Verificação de estoque, decremento e geração do histórico de movimentação
        for (const p of body.products) {
          const product = await tx.product.findUnique({
            where: { id: p.productId },
          });

          if (!product) {
            throw new HttpError(404, `Produto #${p.productId} não encontrado`);
          }

          if (product.currentQuantity < p.quantity) {
            throw new HttpError(
              400,
              `Estoque insuficiente para o produto "${product.name}". Atual: ${product.currentQuantity}, Solicitado: ${p.quantity}`,
            );
          }

          // Atualizando a quantidade do produto no estoque
          const updatedProduct = await tx.product.updateMany({
            where: {
              id: p.productId,
              currentQuantity: {
                gte: p.quantity,
              },
            },
            data: {
              currentQuantity: {
                decrement: p.quantity,
              },
            },
          });

          if (updatedProduct.count !== 1) {
            throw new HttpError(400, "Estoque insuficiente");
          }

          // Criando movimentação de estoque para auditoria
          await tx.stockMovement.create({
            data: {
              productId: p.productId,
              saleId: sale.id,
              movementType: "SAIDA",
              quantity: p.quantity,
              observations: `Venda #${sale.id}${body.payment === "FIADO" ? " (Adicionado ao Fiado)" : ""}`,
            },
          });
        }

        return sale;
      });

      res.status(201).json(saleTransaction);
    } catch (error) {
      next(error);
    }
  };

  //Deletar venda
  delete: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;

      const deletedSale = await prisma.$transaction(async (tx) => {
        // 1. Buscar a venda e seus produtos
        const sale = await tx.sale.findUnique({
          where: { id: Number(id) },
          include: { products: true }, // relação com itens da venda
        });

        if (!sale) {
          throw new HttpError(404, "Sale not found");
        }

        // 2. Atualizar estoque dos produtos vendidos
        for (const item of sale.products) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              currentQuantity: {
                increment: item.quantity, // devolve ao estoque
              },
            },
          });
        }

        // 3. Deletar a venda
        const deleted = await tx.sale.delete({
          where: { id: Number(id) },
        });

        return deleted;
      });

      res.json(deletedSale);
    } catch (erro) {
      next(erro);
    }
  };

  // Valor total de vendas no mês atual
  monthlyTotal: RequestHandler = async (req, res, next) => {
    try {
      const startDate = getStartOfMonth();

      const endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0,
        23,
        59,
        59,
      );

      const result = await prisma.sale.aggregate({
        _sum: {
          total: true,
        },
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      return res.json({ totalSales: result._sum.total ?? 0 });
    } catch (error) {
      next(error);
    }
  };
}
