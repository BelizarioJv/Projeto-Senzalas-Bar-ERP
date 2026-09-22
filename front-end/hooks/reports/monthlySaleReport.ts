import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/report.service";
import { filtersReportRequest } from "@/types/report";

export const useGetMonthlySaleReport = (filters: filtersReportRequest) => {
  return useQuery({
    queryKey: ["monthlySaleReport", filters],
    queryFn: () => reportService.getMonthlySalesReport(filters),
    enabled: false,
  });
};
