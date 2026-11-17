"use client";

import { ScrollText } from "lucide-react";
import { ReportPeriodFilter } from "@/components/reports/ReportPeriodFilter";
import { useGetFinancialReport } from "@/hooks/reports/financialReport";
import { useReportPeriod } from "@/hooks/reports/useReportPeriod";
import { Card } from "@/components/ui/card";
import { formatReportCurrency } from "@/utils/reportFormat";

export default function MonthProfitPage() {
  const { period, isValid, setStartDate, setEndDate } = useReportPeriod();
  const reportQuery = useGetFinancialReport(period);

  return (
    <div className="min-h-screen space-y-8 bg-background p-6">
      <header className="flex items-center justify-center gap-4">
        <h1 className="text-4xl font-extrabold text-accent">
          Resumo Financeiro
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card className="p-5">
            <p className="text-muted-foreground">Vendas</p>
            <p className="text-2xl font-semibold">
              {reportQuery.data.summary.salesCount}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-muted-foreground">Faturamento</p>
            <p className="text-2xl font-semibold">
              {formatReportCurrency(reportQuery.data.summary.totalRevenue)}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-muted-foreground">Compras</p>
            <p className="text-2xl font-semibold">
              {reportQuery.data.summary.purchasesCount}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-muted-foreground">Despesas</p>
            <p className="text-2xl font-semibold">
              {formatReportCurrency(reportQuery.data.summary.totalExpenses)}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-muted-foreground">Resultado líquido</p>
            <p className="text-2xl font-semibold">
              {formatReportCurrency(reportQuery.data.summary.netProfit)}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
