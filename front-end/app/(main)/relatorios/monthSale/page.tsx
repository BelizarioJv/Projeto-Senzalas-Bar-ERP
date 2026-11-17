"use client";

import { ScrollText } from "lucide-react";
import { ReportPeriodFilter } from "@/components/reports/ReportPeriodFilter";
import { useGetMonthlySaleReport } from "@/hooks/reports/monthlySaleReport";
import { useReportPeriod } from "@/hooks/reports/useReportPeriod";
import { Card } from "@/components/ui/card";
import { formatReportCurrency, formatReportDate } from "@/utils/reportFormat";
import { generateSalesReportPDF } from "@/utils/PDF/monthSalePdf";

export default function MonthSalePage() {
  const { period, isValid, setStartDate, setEndDate } = useReportPeriod();
  const reportQuery = useGetMonthlySaleReport(period);

  const handleGenerateReport = async () => {
    if (!isValid) return;

    const result = await reportQuery.refetch();
    if (result.isSuccess && result.data) {
      generateSalesReportPDF(result.data);
    }
  };

  return (
    <div className="min-h-screen space-y-8 bg-background p-6">
      <header className="flex items-center justify-center gap-4">
        <h1 className="text-4xl font-extrabold text-accent">
          Relatório - Vendas
        </h1>
        <ScrollText size={42} />
      </header>

      <ReportPeriodFilter
        period={period}
        isValid={isValid}
        isFetching={reportQuery.isFetching}
        error={reportQuery.error?.message}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onGenerate={handleGenerateReport}
      />

      {reportQuery.data && !reportQuery.isError && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-5">
              <p className="text-muted-foreground">Vendas no período</p>
              <p className="text-2xl font-semibold">
                {reportQuery.data.summary.totalSales}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-muted-foreground">Faturamento</p>
              <p className="text-2xl font-semibold">
                {formatReportCurrency(reportQuery.data.summary.totalAmount)}
              </p>
            </Card>
          </div>

          <Card className="overflow-x-auto p-6">
            <h2 className="mb-4 text-xl font-semibold">Vendas encontradas</h2>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Data</th>
                  <th className="p-2">Cliente</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {reportQuery.data.data.map((sale) => (
                  <tr key={sale.id} className="border-b">
                    <td className="p-2">{formatReportDate(sale.createdAt)}</td>
                    <td className="p-2">
                      {sale.customer?.name ?? "Cliente não identificado"}
                    </td>
                    <td className="p-2">{formatReportCurrency(sale.total)}</td>
                  </tr>
                ))}
                {reportQuery.data.data.length === 0 && (
                  <tr>
                    <td className="p-4 text-center" colSpan={3}>
                      Nenhuma venda encontrada nesse período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </div>
  );
}
