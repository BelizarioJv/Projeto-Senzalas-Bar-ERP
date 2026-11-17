export type ReportNumeric = number | string;

export interface ReportPeriod {
  startDate: string;
  endDate: string;
}

export type filtersReportRequest = Partial<ReportPeriod>;

export interface monthlyPurchasesReportResponse {
  summary: {
    totalPurchases: number;
    totalAmount: number;
  };
  data: {
    id: number;
    createdAt: string;
    total: ReportNumeric;
    supplier: {
      id: number;
      name: string;
    };
    products: {
      product: {
        id: number;
        name: string;
      };
      quantity: number;
      price: ReportNumeric;
    }[];
  }[];
}

export interface monthlySalesReportResponse {
  summary: {
    totalSales: number;
    totalAmount: number;
  };
  data: {
    id: number;
    createdAt: string;
    total: ReportNumeric;
    customer: {
      id: number;
      name: string;
    } | null;
    products: {
      product: {
        id: number;
        name: string;
      };
      quantity: number;
      price: ReportNumeric;
    }[];
  }[];
}

export interface financialReportResponse {
  period: {
    start: string;
    end: string;
  };
  summary: {
    salesCount: number;
    purchasesCount: number;
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
  };
}

export interface topSellingProductsReportRequest extends ReportPeriod {
  limit: number;
}

export interface topSellingProductsReportResponse {
  data: {
    productId: number;
    productName: string;
    totalQuantitySold: number;
    totalRevenue: number;
  }[];
}
