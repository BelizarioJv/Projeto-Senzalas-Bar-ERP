import { registry } from "../registry.js";
import { CustomerRequestSchema, UpdateCustomerRequestSchema, CustomerResponseSchema, } from "../schemas/CustomerResquestSchema.js";
registry.registerPath({
    method: "get",
    path: "/customer/",
    tags: ["Customer"],
    summary: "Listar clientes",
    responses: {
        200: {
            description: "Lista de clientes retornada.",
            content: {
                "application/json": {
                    schema: CustomerResponseSchema,
                },
            },
        },
        401: {
            description: "Erro ao listar clientes.",
        },
    },
});
registry.registerPath({
    method: "post",
    path: "/customer/",
    tags: ["Customer"],
    summary: "Criar cliente",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CustomerRequestSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Criação de clientes realizada.",
        },
        401: {
            description: "Erro ao criar cliente.",
        },
    },
});
registry.registerPath({
    method: "put",
    path: "/customer/:id",
    tags: ["Customer"],
    summary: "Atualizar cliente",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: UpdateCustomerRequestSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Cliente atualizado com sucesso.",
        },
        401: {
            description: "Erro ao atualizar cliente.",
        },
    },
});
registry.registerPath({
    method: "delete",
    path: "/customer/:id",
    tags: ["Customer"],
    summary: "Remover cliente",
    responses: {
        200: {
            description: "Cliente removido com sucesso.",
        },
        401: {
            description: "Erro ao remover cliente.",
        },
    },
});
