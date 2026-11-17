import { registry } from "../registry.js";

import {
  ReportsFinancialSummaryResponseSchema,
  ReportsInventoryResponseSchema,
  ReportsSalesResponseSchema,
  ReportsPurchaseResponseSchema,
  ReportsPeriodQuerySchema,
  ReportsTopProductsQuerySchema,
  ReportsTopProductsResponseSchema,
} from "../schemas/ReportsRequestSchema.js";


registry.registerPath({
  method: "get",
  path: "/reports/purchases",
  tags: ["Reports"],
  summary: "Relatório de compras (filtro por período)",
  request: { query: ReportsPeriodQuerySchema },
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
    400: {
      description: "Período inválido.",
    },
  },
});


registry.registerPath({
  method: "get",
  path: "/reports/sales",
  tags: ["Reports"],
  summary: "Relatório de vendas (filtro por período)",
  request: { query: ReportsPeriodQuerySchema },
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
    400: {
      description: "Período inválido.",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/reports/financial-summary",
  tags: ["Reports"],
  summary: "Relatório de resumo financeiro (filtro por período)",
  request: { query: ReportsPeriodQuerySchema },
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
    400: {
      description: "Período inválido.",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/reports/top-products",
  tags: ["Reports"],
  summary: "Produtos mais vendidos (filtro por período e limite)",
  request: { query: ReportsTopProductsQuerySchema },
  responses: {
    200: {
      description: "Ranking de produtos retornado.",
      content: {
        "application/json": {
          schema: ReportsTopProductsResponseSchema,
        },
      },
    },
    400: {
      description: "Período ou limite inválido.",
    },
    401: {
      description: "Erro ao gerar relatório de produtos mais vendidos.",
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