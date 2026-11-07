import { z } from "zod";

export const DeliverySaleRequestSchema = z.object({
  payment: z.enum(["DINHEIRO", "PIX", "CARTAO_CREDITO", "CARTAO_DEBITO"]),
  customerId: z.number().int().positive().nullable().optional(),
  observation: z.string().trim().max(500).optional(),
  products: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
}).superRefine((data, ctx) => {
  const productIds = data.products.map((product) => product.productId);

  if (new Set(productIds).size !== productIds.length) {
    ctx.addIssue({
      code: "custom",
      message: "Não envie o mesmo produto mais de uma vez na venda.",
      path: ["products"],
    });
  }
});
