import { registry } from "../registry.js";
import { ProductRequestSchema, UpdateProductRequestSchema, } from "../schemas/ProductRequestSchema.js";
registry.registerPath({
    method: "get",
    path: "/products/",
    tags: ["Products"],
    summary: "Listar produtos",
    responses: {
        200: {
            description: "Lista de produtos retornada.",
            content: {
                "application/json": {
                    schema: ProductRequestSchema,
                },
            },
        },
        401: {
            description: "Erro ao listar produtos.",
        },
    },
});
registry.registerPath({
    method: "post",
    path: "/products/",
    tags: ["Products"],
    summary: "Criar produto",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: ProductRequestSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Criaçao de produto realizada.",
        },
        401: {
            description: "Erro criar produto.",
        },
    },
});
registry.registerPath({
    method: "put",
    path: "/products/:id",
    tags: ["Products"],
    summary: "Produto atualizado",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: UpdateProductRequestSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Produto atualizado com sucesso.",
        },
        401: {
            description: "Erro ao atualizar produto.",
        },
    },
});
registry.registerPath({
    method: "delete",
    path: "/products/:id",
    tags: ["Products"],
    summary: "Remover produto",
    responses: {
        200: {
            description: "Produto removido com sucesso.",
        },
        401: {
            description: "Erro ao remover produto.",
        },
    },
});
