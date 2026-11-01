import express from "express";
import { ReportsController } from "../controllers/reportsController.js";
export const reportsRouter = express.Router();
const reportsController = new ReportsController();
// GET /reports/purchases - Relatório de compras (filtro por período)
reportsRouter.get("/purchases", reportsController.monthlyPurchasesReport);
// GET /reports/sales - Relatório de vendas (filtro por período)
reportsRouter.get("/sales", reportsController.monthlySalesReport);
// GET /reports/financial-summary - Relatório de resumo financeiro (filtro por período)
reportsRouter.get("/financial-summary", reportsController.financialSummaryReport);
// GET /reports/inventory - Relatório de inventário
reportsRouter.get("/inventory", reportsController.inventoryReport);
// GET /reports/top-products - Relatório de produtos mais vendidos
reportsRouter.get("/top-products", reportsController.topProductsReport);
