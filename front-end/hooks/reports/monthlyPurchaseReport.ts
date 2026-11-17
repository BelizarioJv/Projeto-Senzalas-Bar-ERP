import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/report.service";
import { filtersReportRequest } from "@/types/report";

export const useGetMonthlyPurchasesReport = (filters: filtersReportRequest) => {
  return useQuery({
    queryKey: ["monthlyPurchasesReport", filters],
    queryFn: () => reportService.getMonthlyPurchasesReport(filters),
    enabled: false,
  });
};
