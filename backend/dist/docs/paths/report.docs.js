import { registry } from "../registry.js";
import { ReportsFinancialSummaryResponseSchema, ReportsInventoryResponseSchema, ReportsSalesResponseSchema, ReportsPurchaseResponseSchema, } from "../schemas/ReportsRequestSchema.js";
registry.registerPath({
    method: "get",
    path: "/reports/purchases",
    tags: ["Reports"],
    summary: "Relatório de compras (filtro por período)",
    responses: {
        200: {
            description: "Relatório de compras retornado.",
            content: {
                "application/json": {
                    schema: ReportsPurchaseResponseSchema,
                },
            },
        },
        401: {
            description: "Erro ao gerar relatório de compras.",
        },
    },
});
registry.registerPath({
    method: "get",
    path: "/reports/sales",
    tags: ["Reports"],
    summary: "Relatório de vendas (filtro por período)",
    responses: {
        200: {
            description: "Relatório de vendas retornado.",
            content: {
                "application/json": {
                    schema: ReportsSalesResponseSchema,
                },
            },
        },
        401: {
            description: "Erro ao gerar relatório de vendas.",
        },
    },
});
registry.registerPath({
    method: "get",
    path: "/reports/financial-summary",
    tags: ["Reports"],
    summary: "Relatório de resumo financeiro (filtro por período)",
    responses: {
        200: {
            description: "Relatório de resumo financeiro retornado.",
            content: {
                "application/json": {
                    schema: ReportsFinancialSummaryResponseSchema,
                },
            },
        },
        401: {
            description: "Erro ao gerar relatório de resumo financeiro.",
        },
    },
});
registry.registerPath({
    method: "get",
    path: "/reports/inventory",
    tags: ["Reports"],
    summary: "Relatório de inventário",
    responses: {
        200: {
            description: "Relatório de inventário retornado.",
            content: {
                "application/json": {
                    schema: ReportsInventoryResponseSchema,
                },
            },
        },
        401: {
            description: "Erro ao gerar relatório de inventário.",
        },
    },
});
