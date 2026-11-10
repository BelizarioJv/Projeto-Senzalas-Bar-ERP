import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { HttpError } from "../errors/HttpError.js";
import { prisma } from "../database/prisma.js";
import { DeliverySaleRequestSchema, deliveryIdempotencyKeySchema, } from "../docs/schemas/DeliverySaleRequestSchema.js";
export class DeliveryController {
    create = async (req, res, next) => {
        try {
            const body = DeliverySaleRequestSchema.parse(req.body);
            const idempotencyKey = deliveryIdempotencyKeySchema.parse(req.header("Idempotency-Key"));
            const requestHash = createHash("sha256")
                .update(JSON.stringify(body))
                .digest("hex");
            if (typeof req.user !== "number") {
                throw new HttpError(401, "Usuário não autenticado ou inválido.");
            }
            const existingSale = await prisma.sale.findUnique({
                where: { idempotencyKey },
                include: { products: true, customer: true },
            });
            if (existingSale) {
                if (existingSale.idempotencyHash !== requestHash) {
                    throw new HttpError(409, "Esta chave de idempotência já foi usada com dados diferentes.");
                }
                res.status(200).json(existingSale);
                return;
            }
            const productIds = body.products.map((product) => product.productId);
            const sale = await prisma.$transaction(async (tx) => {
                const products = await tx.product.findMany({
                    where: {
                        id: { in: productIds },
                    },
                });
                if (products.length !== productIds.length) {
                    const foundIds = new Set(products.map((product) => product.id));
                    const missingId = productIds.find((id) => !foundIds.has(id));
                    throw new HttpError(404, `Produto #${missingId} não encontrado.`);
                }
                const productsById = new Map(products.map((product) => [product.id, product]));
                for (const item of body.products) {
                    const product = productsById.get(item.productId);
                    if (product.status !== "ATIVO") {
                        throw new HttpError(400, `O produto "${product.name}" não está ativo.`);
                    }
                    if (product.currentQuantity < item.quantity) {
                        throw new HttpError(400, `Estoque insuficiente para o produto "${product.name}". Atual: ${product.currentQuantity}, solicitado: ${item.quantity}.`);
                    }
                }
                if (body.customerId) {
                    const customer = await tx.customer.findUnique({
                        where: { id: body.customerId },
                        select: { id: true },
                    });
                    if (!customer) {
                        throw new HttpError(404, `Cliente #${body.customerId} não encontrado.`);
                    }
                }
                const saleItems = body.products.map((item) => {
                    const product = productsById.get(item.productId);
                    const price = Number(product.salePrice);
                    return {
                        productId: item.productId,
                        quantity: item.quantity,
                        price,
                        subtotal: price * item.quantity,
                    };
                });
                const total = saleItems.reduce((sum, item) => sum + item.subtotal, 0);
                let createdSale;
                try {
                    createdSale = await tx.sale.create({
                        data: {
                            payment: body.payment,
                            observation: body.observation,
                            customerId: body.customerId ?? null,
                            userId: req.user,
                            discountPercent: 0,
                            discountValue: 0,
                            total,
                            idempotencyKey,
                            idempotencyHash: requestHash,
                            products: {
                                create: saleItems.map((item) => ({
                                    productId: item.productId,
                                    quantity: item.quantity,
                                    price: item.price,
                                    subtotal: item.subtotal,
                                })),
                            },
                        },
                        include: {
                            products: true,
                            customer: true,
                        },
                    });
                }
                catch (error) {
                    if (error instanceof Prisma.PrismaClientKnownRequestError &&
                        error.code === "P2002") {
                        const concurrentSale = await tx.sale.findUnique({
                            where: { idempotencyKey },
                            include: { products: true, customer: true },
                        });
                        if (concurrentSale &&
                            concurrentSale.idempotencyHash === requestHash) {
                            return concurrentSale;
                        }
                    }
                    throw error;
                }
                for (const item of body.products) {
                    const updatedProduct = await tx.product.updateMany({
                        where: {
                            id: item.productId,
                            currentQuantity: {
                                gte: item.quantity,
                            },
                        },
                        data: {
                            currentQuantity: {
                                decrement: item.quantity,
                            },
                        },
                    });
                    if (updatedProduct.count !== 1) {
                        throw new HttpError(409, `Estoque alterado durante a venda do produto #${item.productId}. Tente novamente.`);
                    }
                    await tx.stockMovement.create({
                        data: {
                            productId: item.productId,
                            saleId: createdSale.id,
                            movementType: "SAIDA",
                            quantity: item.quantity,
                            observations: `Venda Delivery #${createdSale.id}`,
                        },
                    });
                }
                return createdSale;
            });
            res.status(201).json(sale);
        }
        catch (error) {
            next(error);
        }
    };
}
