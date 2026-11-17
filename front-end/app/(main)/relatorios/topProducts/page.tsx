"use client";

import { useState } from "react";
import { ScrollText } from "lucide-react";
import { ReportPeriodFilter } from "@/components/reports/ReportPeriodFilter";
import { useGetTopProductsReport } from "@/hooks/reports/topProductsReport";
import { useReportPeriod } from "@/hooks/reports/useReportPeriod";
import { Card } from "@/components/ui/card";
import { formatReportCurrency } from "@/utils/reportFormat";

export default function TopProductsPage() {
  const { period, isValid, setStartDate, setEndDate } = useReportPeriod();
  const [limit, setLimit] = useState(10);
  const reportQuery = useGetTopProductsReport({ ...period, limit });

  return (
    <div className="min-h-screen space-y-8 bg-background p-6">
      <header className="flex items-center justify-center gap-4">
        <h1 className="text-4xl font-extrabold text-accent">
          Produtos Mais Vendidos
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
        }}>
        <div className="flex flex-col gap-1">
          <label htmlFor="report-limit" className="text-sm font-medium">
            Quantidade:
          </label>
          <select
            id="report-limit"
            value={limit}
            onChange={(event) => setLimit(Number(event.target.value))}
            className="rounded border bg-background p-2 text-sm">
            {[5, 10, 20, 50].map((value) => (
              <option key={value} value={value}>
                Top {value}
              </option>
            ))}
          </select>
        </div>
      </ReportPeriodFilter>

      {reportQuery.data && !reportQuery.isError && (
        <Card className="overflow-x-auto p-6">
          <h2 className="mb-4 text-xl font-semibold">Ranking do período</h2>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Posição</th>
                <th className="p-2">Produto</th>
                <th className="p-2">Unidades vendidas</th>
                <th className="p-2">Receita dos itens</th>
              </tr>
            </thead>
            <tbody>
              {reportQuery.data.data.map((product, index) => (
                <tr key={product.productId} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{product.productName}</td>
                  <td className="p-2">{product.totalQuantitySold}</td>
                  <td className="p-2">
                    {formatReportCurrency(product.totalRevenue)}
                  </td>
                </tr>
              ))}
              {reportQuery.data.data.length === 0 && (
                <tr>
                  <td className="p-4 text-center" colSpan={4}>
                    Nenhum produto vendido nesse período.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
