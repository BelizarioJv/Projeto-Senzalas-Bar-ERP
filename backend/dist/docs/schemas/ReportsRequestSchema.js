import { z } from "zod";
// Schema para o relatório de compras, incluindo detalhes do fornecedor e produtos comprados
export const ReportsPurchaseResponseSchema = z.object({
    summary: z.object({
        totalPurchases: z.number().int().nonnegative().openapi({
            description: "Total de compras realizadas no período",
        }),
        totalAmount: z.number().nonnegative().openapi({
            description: "Valor total gasto em compras no período",
        }),
    }),
    data: z.array(z.object({
        id: z.number().int().positive(),
        createdAt: z.string().openapi({
            description: "Data de criação da compra",
        }),
        total: z.number().nonnegative().openapi({
            description: "Total gasto na compra",
        }),
        supplier: z.object({
            id: z.number().int().positive().openapi({
                description: "ID do fornecedor",
            }),
            name: z.string().openapi({
                description: "Nome do fornecedor",
            }),
        }),
        products: z.array(z.object({
            product: z.object({
                id: z.number().int().positive().openapi({
                    description: "ID do produto",
                }),
                name: z.string().openapi({
                    description: "Nome do produto",
                }),
            }),
            quantity: z.number().int().positive().openapi({
                description: "Quantidade do produto comprado",
            }),
            price: z.number().nonnegative().openapi({
                description: "Preço unitário do produto na compra",
            }),
        })),
    })),
});
// Schema para o relatório de vendas, incluindo detalhes do cliente e produtos vendidos
export const ReportsSalesResponseSchema = z.object({
    summary: z.object({
        totalSales: z.number().int().nonnegative().openapi({
            description: "Total de vendas realizadas no período",
        }),
        totalAmount: z.number().nonnegative().openapi({
            description: "Valor total (R$) faturado nas vendas no período",
        }),
    }),
    data: z.array(z.object({
        id: z.number().int().positive(),
        createdAt: z
            .string()
            .openapi({ description: "Data de criação da venda" }),
        total: z
            .number()
            .nonnegative()
            .openapi({ description: "Total faturado na venda" }),
        customer: z
            .object({
            id: z
                .number()
                .int()
                .positive()
                .openapi({ description: "ID do cliente" }),
            name: z.string().openapi({ description: "Nome do cliente" }),
        })
            .nullable(),
        items: z.array(z.object({
            product: z.object({
                id: z
                    .number()
                    .int()
                    .positive()
                    .openapi({ description: "ID do produto" }),
                name: z.string().openapi({ description: "Nome do produto" }),
            }),
            quantity: z
                .number()
                .int()
                .positive()
                .openapi({ description: "Quantidade do produto vendido" }),
            price: z
                .number()
                .nonnegative()
                .openapi({ description: "Preço unitário do produto na venda" }),
        })),
    })),
});
// Schema para o relatório de resumo financeiro, incluindo receita, despesas e lucro líquido
export const ReportsFinancialSummaryResponseSchema = z.object({
    period: z.object({
        start: z
            .string()
            .openapi({ description: "Data de início considerada no cálculo" }),
        end: z
            .string()
            .openapi({ description: "Data de término considerada no cálculo" }),
    }),
    summary: z.object({
        salesCount: z
            .number()
            .int()
            .nonnegative()
            .openapi({ description: "Quantidade total de vendas" }),
        purchasesCount: z
            .number()
            .int()
            .nonnegative()
            .openapi({ description: "Quantidade total de compras" }),
        totalRevenue: z
            .number()
            .nonnegative()
            .openapi({ description: "Receita total gerada pelas vendas" }),
        totalExpenses: z
            .number()
            .nonnegative()
            .openapi({ description: "Despesa total gerada pelas compras" }),
        netProfit: z.number().openapi({
            description: "Lucro líquido (Receitas - Despesas). Pode ser negativo.",
            example: 1540.5,
        }),
    }),
});
const ProductInventorySchema = z.object({
    id: z.number().int().positive().openapi({ description: "ID do produto" }),
    name: z.string().openapi({ description: "Nome do produto" }),
    quantity: z
        .number()
        .int()
        .openapi({ description: "Quantidade atual em estoque" }),
    minQuantity: z
        .number()
        .int()
        .nullable()
        .openapi({ description: "Quantidade mínima de segurança" }),
    price: z
        .number()
        .nonnegative()
        .openapi({ description: "Preço base do produto" }),
});
// Schema para o relatório de inventário, incluindo produtos com estoque baixo
export const ReportsInventoryResponseSchema = z.object({
    summary: z.object({
        totalProducts: z
            .number()
            .int()
            .nonnegative()
            .openapi({ description: "Total de produtos cadastrados" }),
        lowStockCount: z
            .number()
            .int()
            .nonnegative()
            .openapi({ description: "Quantidade de produtos com estoque crítico" }),
        totalInventoryValue: z
            .number()
            .nonnegative()
            .openapi({ description: "Valor financeiro total estimado do estoque" }),
    }),
    lowStockProducts: z.array(ProductInventorySchema).openapi({
        description: "Lista de produtos cuja quantidade atual é menor ou igual à quantidade mínima",
    }),
    data: z.array(ProductInventorySchema).openapi({
        description: "Lista de todos os produtos do estoque",
    }),
});
