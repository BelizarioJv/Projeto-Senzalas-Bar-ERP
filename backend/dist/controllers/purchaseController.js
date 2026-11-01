import { prisma } from "../database/prisma.js";
import { Prisma } from "@prisma/client";
import { HttpError } from "../errors/HttpError.js";
import { getStartOfMonth } from "../utils/date.js";
import { PurchaseRequestSchema, MetaPurchaseRequestSchema, } from "../docs/schemas/PurchaseRequestSchema.js";
export class PurchaseController {
    //Buscar compras com paginaçao e filtros
    index = async (req, res, next) => {
        try {
            const query = MetaPurchaseRequestSchema.parse(req.query);
            const { page, pageSize, total, sortBy, order } = query;
            const pageNumber = Number(page);
            const pageSizeNumber = Number(pageSize);
            const where = {};
            if (total) {
                where.total = {
                    equals: total,
                };
            }
            const purchases = await prisma.purchase.findMany({
                where,
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageSizeNumber,
                orderBy: {
                    [sortBy]: order,
                },
                include: {
                    user: true,
                    supplier: {
                        select: { id: true, name: true },
                    },
                },
            });
            const totalRecords = await prisma.purchase.count({
                where,
            });
            res.json({
                data: purchases,
                meta: {
                    page: pageNumber,
                    pageSize: pageSizeNumber,
                    totalRecords,
                    totalPages: Math.ceil(totalRecords / pageSizeNumber),
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    // Mostrar dados da compra
    show = async (req, res, next) => {
        try {
            const { id } = req.params;
            const purchaseId = Number(id);
            if (isNaN(purchaseId)) {
                return res.status(400).json({ message: "O ID fornecido é inválido." });
            }
            const purchase = await prisma.purchase.findUnique({
                where: { id: purchaseId },
                include: {
                    supplier: true,
                    user: {
                        select: { id: true, name: true },
                    },
                    products: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            if (!purchase) {
                return res.status(404).json({ message: "Compra não encontrada." });
            }
            return res.json(purchase);
        }
        catch (error) {
            next(error);
        }
    };
    // Criação de compra
    create = async (req, res, next) => {
        try {
            // 1. Validação do Body com Zod
            const body = PurchaseRequestSchema.parse(req.body);
            // 2. Validação estrita do usuário autenticado (JWT Middleware)
            if (!req.user || typeof req.user !== "number") {
                throw new HttpError(401, "Usuário não autenticado ou inválido");
            }
            const userId = req.user;
            // 3. Cálculo do valor total da compra
            const total = body.products.reduce((acc, product) => acc + product.quantity * product.price, 0);
            // 4. Execução da transação no banco de dados
            const purchaseTransaction = await prisma.$transaction(async (tx) => {
                // Cria a compra e os itens (PurchaseProduct) de uma só vez
                const purchase = await tx.purchase.create({
                    data: {
                        supplierId: body.supplierId,
                        userId: userId,
                        payment: body.payment,
                        total: new Prisma.Decimal(total),
                        products: {
                            create: body.products.map((item) => ({
                                productId: item.productId,
                                quantity: item.quantity,
                                price: item.price,
                                subtotal: new Prisma.Decimal(item.price).times(item.quantity),
                            })),
                        },
                    },
                    include: {
                        products: true,
                        user: true,
                    },
                });
                // Mapeia as operações de estoque para rodarem em paralelo dentro da transaction
                const stockOperations = body.products.flatMap((product) => [
                    // Operação A: Atualizar preço de custo e incrementar quantidade no estoque do produto
                    tx.product.update({
                        where: { id: product.productId },
                        data: {
                            costPrice: product.price,
                            currentQuantity: { increment: product.quantity },
                        },
                    }),
                    // Operação B: Registrar a movimentação de entrada no estoque
                    tx.stockMovement.create({
                        data: {
                            productId: product.productId,
                            purchaseId: purchase.id,
                            movementType: "ENTRADA",
                            quantity: product.quantity,
                            observations: `Compra realizada - Registro #${purchase.id}`,
                        },
                    }),
                ]);
                // Executa todas as atualizações de estoque concorrentemente na transação
                await Promise.all(stockOperations);
                return purchase;
            });
            // 5. Retorno de sucesso
            return res.status(201).json(purchaseTransaction);
        }
        catch (error) {
            next(error);
        }
    };
    //Deletar compra
    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            const deletedPurchase = await prisma.$transaction(async (tx) => {
                // 1. Buscar a compra e seus itens
                const purchase = await tx.purchase.findUnique({
                    where: { id: Number(id) },
                    include: { products: true }, // supondo que tenha relação "products"
                });
                if (!purchase) {
                    throw new HttpError(404, "Purchase not found");
                }
                // 2. Atualizar estoque dos produtos (remover a quantidade que entrou)
                for (const item of purchase.products) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            currentQuantity: { decrement: item.quantity },
                        },
                    });
                }
                // 3. Deletar a compra
                const deleted = await tx.purchase.delete({
                    where: { id: Number(id) },
                });
                return deleted;
            });
            res.json(deletedPurchase);
        }
        catch (erro) {
            next(erro);
        }
    };
    // Valor total de compras no mês atual
    monthlyTotal = async (req, res, next) => {
        try {
            const startDate = getStartOfMonth();
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);
            const result = await prisma.purchase.aggregate({
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
            return res.json({ totalPurchases: result._sum.total ?? 0 });
        }
        catch (error) {
            next(error);
        }
    };
}
