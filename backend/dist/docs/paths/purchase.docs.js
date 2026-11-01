import { registry } from "../registry.js";
import { PurchaseRequestSchema, PurchaseResponseSchema, } from "../schemas/PurchaseRequestSchema.js";
registry.registerPath({
    method: "get",
    path: "/purchase/",
    tags: ["Purchase"],
    summary: "Listar compras",
    responses: {
        200: {
            description: "Lista de compras retornada.",
            content: {
                "application/json": {
                    schema: PurchaseResponseSchema,
                },
            },
        },
        401: {
            description: "Erro ao listar compras.",
        },
    },
});
registry.registerPath({
    method: "post",
    path: "/purchase/",
    tags: ["Purchase"],
    summary: "Criar compra",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: PurchaseRequestSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Criação de compra realizada.",
        },
        401: {
            description: "Erro ao criar compra.",
        },
    },
});
registry.registerPath({
    method: "delete",
    path: "/purchase/:id",
    tags: ["Purchase"],
    summary: "Remover compra",
    responses: {
        200: {
            description: "Compra removida com sucesso.",
        },
        401: {
            description: "Erro ao remover compra.",
        },
    },
});
