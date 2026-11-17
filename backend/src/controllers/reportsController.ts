import { RequestHandler } from "express";
import { prisma } from "../database/prisma.js";
import { HttpError } from "../errors/HttpError.js";
import { getReportDateRange } from "../utils/reportDateRange.js";

export class ReportsController {
  /**
   * Relatório de compras (filtro por período)
   * GET /reports/purchases?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
   */
  monthlyPurchasesReport: RequestHandler = async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      const { start, endExclusive } = getReportDateRange(
        startDate,
        endDate,
      );

      const purchases = await prisma.purchase.findMany({
        where: {
          createdAt: {
            gte: start,
            lt: endExclusive,
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

      const totalAmount = purchases.reduce(
        (acc, p) => acc + (Number(p.total) || 0),
        0,
      );

      res.json({
        summary: {
          totalPurchases: purchases.length,
          totalAmount,
        },
        data: purchases,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Relatório de vendas (filtro por período)
   * GET /reports/sales?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
   */
  monthlySalesReport: RequestHandler = async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      const { start, endExclusive } = getReportDateRange(
        startDate,
        endDate,
      );

      const sales = await prisma.sale.findMany({
        where: {
          createdAt: {
            gte: start,
            lt: endExclusive,
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

      const totalAmount = sales.reduce(
        (acc, s) => acc + (Number(s.total) || 0),
        0,
      );

      res.json({
        summary: {
          totalSales: sales.length,
          totalAmount,
        },
        data: sales,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Resumo Financeiro (Comparativo de Entradas x Saídas)
   * GET /reports/financial-summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
   */
  financialSummaryReport: RequestHandler = async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      const { start, end, endExclusive } = getReportDateRange(
        startDate,
        endDate,
      );

      const dateFilter = {
        gte: start,
        lt: endExclusive,
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
    } catch (error) {
      next(error);
    }
  };

  /**
   * Relatório de Posição de Estoque e Alerta de Estoque Baixo
   * GET /reports/inventory
   */
  inventoryReport: RequestHandler = async (_req, res, next) => {
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

      const lowStockProducts = products.filter(
        (p) => p.currentQuantity <= (p.minimumQuantity ?? 5),
      );

      const totalInventoryValue = products.reduce(
        (acc, p) => acc + p.currentQuantity * Number(p.salePrice || 0),
        0,
      );

      res.json({
        summary: {
          totalProducts: products.length,
          lowStockCount: lowStockProducts.length,
          totalInventoryValue,
        },
        lowStockProducts,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Relatório de Produtos Mais Vendidos
   * GET /reports/top-products?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&limit=10
   */
  topProductsReport: RequestHandler = async (req, res, next) => {
    try {
      const rawLimit = req.query.limit;
      let limit = 10;
      if (rawLimit !== undefined) {
        if (
          typeof rawLimit !== "string" ||
          !/^\d+$/.test(rawLimit) ||
          Number(rawLimit) < 1 ||
          Number(rawLimit) > 100
        ) {
          throw new HttpError(400, "limit deve ser um inteiro entre 1 e 100.");
        }
        limit = Number(rawLimit);
      }

      const { startDate, endDate } = req.query;
      const { start, endExclusive } = getReportDateRange(
        startDate,
        endDate,
      );
      const sales = await prisma.sale.findMany({
        where: { createdAt: { gte: start, lt: endExclusive } },
        select: {
          products: {
            select: {
              productId: true,
              quantity: true,
              subtotal: true,
              product: { select: { name: true } },
            },
          },
        },
      });

      const totalsByProduct = new Map<
        number,
        { productName: string; totalQuantitySold: number; totalRevenue: number }
      >();

      for (const sale of sales) {
        for (const item of sale.products) {
          const totals = totalsByProduct.get(item.productId) ?? {
            productName: item.product.name,
            totalQuantitySold: 0,
            totalRevenue: 0,
          };
          totals.totalQuantitySold += item.quantity;
          totals.totalRevenue += Number(item.subtotal) || 0;
          totalsByProduct.set(item.productId, totals);
        }
      }

      const data = Array.from(totalsByProduct, ([productId, totals]) => ({
        productId,
        ...totals,
      }))
        .sort(
          (a, b) =>
            b.totalQuantitySold - a.totalQuantitySold ||
            a.productName.localeCompare(b.productName),
        )
        .slice(0, limit);

      res.json({ data });
    } catch (error) {
      next(error);
    }
  };
}
