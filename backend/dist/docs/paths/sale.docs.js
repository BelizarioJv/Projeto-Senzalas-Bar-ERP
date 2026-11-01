import { registry } from "../registry.js";
import { SaleRequestSchema, SaleResponseSchema, } from "../schemas/SaleRequestSchema.js";
registry.registerPath({
    method: "get",
    path: "/sale/",
    tags: ["Sale"],
    summary: "Listar vendas",
    responses: {
        200: {
            description: "Lista de vendas retornada.",
            content: {
                "application/json": {
                    schema: SaleResponseSchema,
                },
            },
        },
        401: {
            description: "Erro ao listar vendas.",
        },
    },
});
registry.registerPath({
    method: "post",
    path: "/sale/",
    tags: ["Sale"],
    summary: "Criar venda",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: SaleRequestSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Criação de venda realizada.",
        },
        401: {
            description: "Erro ao criar venda.",
        },
    },
});
registry.registerPath({
    method: "delete",
    path: "/sale/:id",
    tags: ["Sale"],
    summary: "Remover venda",
    responses: {
        200: {
            description: "Venda removida com sucesso.",
        },
        401: {
            description: "Erro ao remover venda.",
        },
    },
});
