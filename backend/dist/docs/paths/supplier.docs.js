import { registry } from "../registry.js";
import { SupplierRequestSchema, SupplierResponseSchema, UpdateSupplierRequestSchema, } from "../schemas/SupplierRequestSchema.js";
registry.registerPath({
    method: "get",
    path: "/supplier/",
    tags: ["Supplier"],
    summary: "Listar fornecedores",
    responses: {
        200: {
            description: "Lista de fornecedores retornada.",
            content: {
                "application/json": {
                    schema: SupplierResponseSchema.array(),
                },
            },
        },
        401: {
            description: "Erro ao listar fornecedores.",
        },
    },
});
registry.registerPath({
    method: "post",
    path: "/supplier/",
    tags: ["Supplier"],
    summary: "Criar fornecedor",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: SupplierRequestSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Criação de fornecedor realizada.",
        },
        401: {
            description: "Erro ao criar fornecedor.",
        },
    },
});
registry.registerPath({
    method: "put",
    path: "/supplier/:id",
    tags: ["Supplier"],
    summary: "Atualizar fornecedor",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: UpdateSupplierRequestSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Fornecedor atualizado com sucesso.",
        },
        401: {
            description: "Erro ao atualizar fornecedor.",
        },
    },
});
registry.registerPath({
    method: "delete",
    path: "/supplier/:id",
    tags: ["Supplier"],
    summary: "Remover fornecedor",
    responses: {
        200: {
            description: "Fornecedor removido com sucesso.",
        },
        401: {
            description: "Erro ao remover fornecedor.",
        },
    },
});
