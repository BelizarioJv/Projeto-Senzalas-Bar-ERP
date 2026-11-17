"use client";

import { ScrollText } from "lucide-react";
import { ReportPeriodFilter } from "@/components/reports/ReportPeriodFilter";
import { useGetMonthlyPurchasesReport } from "@/hooks/reports/monthlyPurchaseReport";
import { useReportPeriod } from "@/hooks/reports/useReportPeriod";
import { Card } from "@/components/ui/card";
import { formatReportCurrency, formatReportDate } from "@/utils/reportFormat";

export default function MonthPurchasePage() {
  const { period, isValid, setStartDate, setEndDate } = useReportPeriod();
  const reportQuery = useGetMonthlyPurchasesReport(period);

  return (
    <div className="min-h-screen space-y-8 bg-background p-6">
      <header className="flex items-center justify-center gap-4">
        <h1 className="text-4xl font-extrabold text-accent">
          Relatório - Compras
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
        onGenerate={() => {
          void reportQuery.refetch();
        }}
      />

      {reportQuery.data && !reportQuery.isError && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-5">
              <p className="text-muted-foreground">Compras no período</p>
              <p className="text-2xl font-semibold">
                {reportQuery.data.summary.totalPurchases}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-muted-foreground">Total comprado</p>
              <p className="text-2xl font-semibold">
                {formatReportCurrency(reportQuery.data.summary.totalAmount)}
              </p>
            </Card>
          </div>

          <Card className="overflow-x-auto p-6">
            <h2 className="mb-4 text-xl font-semibold">Compras encontradas</h2>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Data</th>
                  <th className="p-2">Fornecedor</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {reportQuery.data.data.map((purchase) => (
                  <tr key={purchase.id} className="border-b">
                    <td className="p-2">
                      {formatReportDate(purchase.createdAt)}
                    </td>
                    <td className="p-2">{purchase.supplier.name}</td>
                    <td className="p-2">
                      {formatReportCurrency(purchase.total)}
                    </td>
                  </tr>
                ))}
                {reportQuery.data.data.length === 0 && (
                  <tr>
                    <td className="p-4 text-center" colSpan={3}>
                      Nenhuma compra encontrada nesse período.
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
