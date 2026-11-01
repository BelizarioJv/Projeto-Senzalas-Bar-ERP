import { z } from "zod";
const paymentMethod = z.enum([
    "DINHEIRO",
    "PIX",
    "CARTAO_CREDITO",
    "CARTAO_DEBITO",
    "FIADO",
]);
export const MetaSaleRequestSchema = z.object({
    page: z.coerce.number().default(1),
    pageSize: z.coerce.number().default(10),
    total: z.coerce.number().optional(),
    sortBy: z.string().default("total"),
    order: z.enum(["asc", "desc"]).default("asc"),
});
//schema para validação dos dados de criação de vendas
export const SaleRequestSchema = z
    .object({
    payment: paymentMethod,
    customerId: z.number().int().positive().optional().nullable(), // Adicionado para identificar quem está comprando
    observation: z.string().optional(),
    discountPercent: z
        .number()
        .min(0, { message: "O desconto não pode ser negativo" })
        .max(100, { message: "O desconto não pode ser maior que 100%" })
        .optional(),
    products: z
        .array(z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
    }))
        .min(1),
})
    .refine((data) => {
    // Se o pagamento for FIADO, o customerId obrigatoriamente precisa existir
    if (data.payment === "FIADO" && !data.customerId) {
        return false;
    }
    return true;
}, {
    message: "Para vendas fiadas (conta da casa), é obrigatório selecionar um cliente.",
    path: ["customerId"], // O erro apontará diretamente no campo do cliente
});
//schema para validação dos dados de resposta da API, incluindo os campos adicionais id, createdAt e updatedAt
export const SaleResponseSchema = z.object({
    id: z.number().int().positive(),
    payment: paymentMethod,
    customerId: z.number().int().positive().optional().nullable(),
    observation: z.string().optional(),
    discountPercent: z.number().optional(),
    total: z.number().positive(),
    createdAt: z.string(),
    products: z.array(z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
    })),
});
