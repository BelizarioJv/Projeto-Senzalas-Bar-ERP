import { z } from "zod";
const paymentMethod = z
    .enum(["DINHEIRO", "PIX", "CARTAO_CREDITO", "CARTAO_DEBITO"])
    .optional();
//schema para validação dos dados de criação de compra
export const PurchaseResponseSchema = z.object({
    id: z.number().int().positive().openapi({
        example: 1,
        description: "ID da compra",
    }),
    supplierId: z.number().int().positive().openapi({
        example: 1,
        description: "ID do Fornecedor",
    }),
    payment: paymentMethod.openapi({
        example: "Dinheiro",
        description: "Método de pagamento da compra",
    }),
    total: z.number().positive().openapi({
        example: "100.50",
        description: "Total da compra",
    }),
    createdAt: z.string().datetime().openapi({
        example: "2023-01-01T00:00:00Z",
        description: "Data de criação da compra",
    }),
    updatedAt: z.string().datetime().openapi({
        example: "2023-01-01T00:00:00Z",
        description: "Data de criação da compra",
    }),
    products: z
        .array(z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
    }))
        .openapi({
        description: "Lista de produtos da compra",
    }),
});
//schema para validação dos dados de atualização de compra, onde todos os campos são opcionais
export const MetaPurchaseRequestSchema = z.object({
    page: z.coerce.number().default(1),
    pageSize: z.coerce.number().default(10),
    total: z.coerce.number().optional(),
    sortBy: z.string().default("total"),
    order: z.enum(["asc", "desc"]).default("asc"),
});
//schema para validação dos dados de criação de compra
export const PurchaseRequestSchema = z.object({
    supplierId: z.number().int().positive(),
    payment: paymentMethod,
    products: z
        .array(z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
    }))
        .min(1),
});
