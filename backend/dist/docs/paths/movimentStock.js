import { registry } from "../registry.js";
import { StockMovementResponseSchema } from "../schemas/MovementStockRequestSchema.js";
registry.registerPath({
    method: "get",
    path: "/moviment-stock/",
    tags: ["MovimentStock"],
    summary: "Listar movimentações de estoque",
    responses: {
        200: {
            description: "Lista de movimentações de estoque retornada.",
            content: {
                "application/json": {
                    schema: StockMovementResponseSchema,
                },
            },
        },
        401: {
            description: "Erro ao listar movimentações de estoque.",
        },
    },
});
