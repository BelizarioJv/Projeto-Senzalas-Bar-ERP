import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/report.service";
import { topSellingProductsReportRequest } from "@/types/report";

export const useGetTopProductsReport = (
  filters: topSellingProductsReportRequest,
) => {
  return useQuery({
    queryKey: ["topProductsReport", filters],
    queryFn: () => reportService.getTopSellingProductsReport(filters),
    enabled: false,
  });
};
