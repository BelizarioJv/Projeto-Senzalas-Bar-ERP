import { prisma } from "../database/prisma.js";
import { getStartOfMonth, getEndOfMonth } from "../utils/date.js";
export class ReportsController {
    /**
     * Relatório de compras (filtro por período)
     * GET /reports/purchases?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
     */
    monthlyPurchasesReport = async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            const start = startDate ? new Date(String(startDate)) : getStartOfMonth();
            const end = endDate ? new Date(String(endDate)) : getEndOfMonth();
            const purchases = await prisma.purchase.findMany({
                where: {
                    createdAt: {
                        gte: start,
                        ...(end && { lte: end }),
                    },
                },
                include: {
                    supplier: {
                        select: { id: true, name: true },
                    },
                    products: {
                        include: {
                            product: { select: { id: true, name: true } },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
            const totalAmount = purchases.reduce((acc, p) => acc + (Number(p.total) || 0), 0);
            res.json({
                summary: {
                    totalPurchases: purchases.length,
                    totalAmount,
                },
                data: purchases,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Relatório de vendas (filtro por período)
     * GET /reports/sales?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
     */
    monthlySalesReport = async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            const start = startDate ? new Date(String(startDate)) : getStartOfMonth();
            const end = endDate ? new Date(String(endDate)) : getEndOfMonth();
            const sales = await prisma.sale.findMany({
                where: {
                    createdAt: {
                        gte: start,
                        ...(end && { lte: end }),
                    },
                },
                include: {
                    customer: {
                        select: { id: true, name: true },
                    },
                    products: {
                        include: {
                            product: { select: { id: true, name: true } },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
            const totalAmount = sales.reduce((acc, s) => acc + (Number(s.total) || 0), 0);
            res.json({
                summary: {
                    totalSales: sales.length,
                    totalAmount,
                },
                data: sales,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Resumo Financeiro (Comparativo de Entradas x Saídas)
     * GET /reports/financial-summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
     */
    financialSummaryReport = async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            const start = startDate ? new Date(String(startDate)) : getStartOfMonth();
            const end = endDate ? new Date(String(endDate)) : getEndOfMonth();
            const dateFilter = {
                gte: start,
                ...(end && { lte: end }),
            };
            const [salesAggregate, purchasesAggregate] = await Promise.all([
                prisma.sale.aggregate({
                    _sum: { total: true },
                    _count: { id: true },
                    where: { createdAt: dateFilter },
                }),
                prisma.purchase.aggregate({
                    _sum: { total: true },
                    _count: { id: true },
                    where: { createdAt: dateFilter },
                }),
            ]);
            const totalRevenue = Number(salesAggregate._sum.total) || 0;
            const totalExpenses = Number(purchasesAggregate._sum.total) || 0;
            const netProfit = totalRevenue - totalExpenses;
            res.json({
                period: { start, end: end || new Date() },
                summary: {
                    salesCount: salesAggregate._count.id,
                    purchasesCount: purchasesAggregate._count.id,
                    totalRevenue,
                    totalExpenses,
                    netProfit,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Relatório de Posição de Estoque e Alerta de Estoque Baixo
     * GET /reports/inventory
     */
    inventoryReport = async (_req, res, next) => {
        try {
            const products = await prisma.product.findMany({
                select: {
                    id: true,
                    name: true,
                    currentQuantity: true,
                    minimumQuantity: true,
                    salePrice: true,
                },
                orderBy: { name: "asc" },
            });
            const lowStockProducts = products.filter((p) => p.currentQuantity <= (p.minimumQuantity ?? 5));
            const totalInventoryValue = products.reduce((acc, p) => acc + p.currentQuantity * Number(p.salePrice || 0), 0);
            res.json({
                summary: {
                    totalProducts: products.length,
                    lowStockCount: lowStockProducts.length,
                    totalInventoryValue,
                },
                lowStockProducts,
                data: products,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Relatório de Produtos Mais Vendidos
     * GET /reports/top-products?limit=10
     */
    topProductsReport = async (req, res, next) => {
        try {
            const limit = Number(req.query.limit) || 10;
            const topProducts = await prisma.saleProducts.groupBy({
                by: ["productId"],
                _sum: {
                    quantity: true,
                },
                orderBy: {
                    _sum: {
                        quantity: "desc",
                    },
                },
                take: limit,
            });
            // Busca os detalhes dos produtos agrupados
            const productIds = topProducts.map((p) => p.productId);
            const productDetails = await prisma.product.findMany({
                where: { id: { in: productIds } },
                select: { id: true, name: true, salePrice: true },
            });
            const result = topProducts.map((item) => {
                const product = productDetails.find((p) => p.id === item.productId);
                return {
                    product,
                    totalSold: item._sum.quantity,
                };
            });
            res.json({ data: result });
        }
        catch (error) {
            next(error);
        }
    };
}
