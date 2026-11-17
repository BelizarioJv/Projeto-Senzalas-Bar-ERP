import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/report.service";
import { filtersReportRequest } from "@/types/report";

export const useGetFinancialReport = (filters: filtersReportRequest) => {
  return useQuery({
    queryKey: ["financialReport", filters],
    queryFn: () => reportService.getFinancialReport(filters),
    enabled: false,
  });
};
