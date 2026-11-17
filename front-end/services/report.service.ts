import { api } from "@/services/api";
import { handleAxiosError } from "@/utils/handleAxiosError";
import {
  filtersReportRequest,
  monthlyPurchasesReportResponse,
  monthlySalesReportResponse,
  financialReportResponse,
  topSellingProductsReportResponse,
  topSellingProductsReportRequest,
} from "@/types/report";

export const reportService = {
  // Relatório de compras mensais
  getMonthlyPurchasesReport: async (filters: filtersReportRequest) => {
    try {
      const response = await api.get<monthlyPurchasesReportResponse>(
        "/reports/purchases",
        { params: filters },
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  // Relatório de vendas mensais
  getMonthlySalesReport: async (filters: filtersReportRequest) => {
    try {
      const response = await api.get<monthlySalesReportResponse>(
        "/reports/sales",
        { params: filters },
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  // Relatório financeiro
  getFinancialReport: async (filters: filtersReportRequest) => {
    try {
      const response = await api.get<financialReportResponse>(
        "/reports/financial-summary",
        { params: filters },
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },

  // Relatório de produtos mais vendidos
  getTopSellingProductsReport: async (
    filters: topSellingProductsReportRequest,
  ) => {
    try {
      const response = await api.get<topSellingProductsReportResponse>(
        "/reports/top-products",
        { params: filters },
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  },
};
