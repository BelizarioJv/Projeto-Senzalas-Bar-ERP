"use client";

import { useState } from "react";
import Link from "next/link";
import { Loading } from "@/components/layout/Loading";
import { Error } from "@/components/layout/Error";
import { useGetMonthlySaleReport } from "@/hooks/reports/monthlySaleReport";
import { Card } from "@/components/ui/card";
import { ScrollText, Calendar } from "lucide-react";
import { monthlySalesReportResponse } from "@/types/report";
import { generateSalesReportPDF } from "@/utils/PDF/monthSalePdf";

export default function MonthSalePage() {
  // Define o estado inicial para o ano corrente ou um intervalo padrão
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");

  const { data, isFetching, error, refetch } = useGetMonthlySaleReport({
    startDate,
    endDate,
  });

  const handleGenerateReport = async () => {
    const result = await refetch();

    if (result.data) {
      generateSalesReportPDF(result.data);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Cabeçalho */}
      <header className="flex flex-col justify-center items-center gap-4">
        <div className="flex gap-4 items-center">
          <h1 className="text-4xl font-extrabold text-accent">
            Relatório - VENDAS MENSAIS
          </h1>
          <ScrollText size={50} />
        </div>
      </header>

      {/* Filtro de Período */}
      <Card className="p-6 shadow-md rounded-lg">
        <div className="flex flex-wrap items-center gap-6 mb-6">
          <div className="flex items-center gap-2 font-medium">
            <Calendar size={20} />
            <span>Filtrar por Período:</span>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="startDate" className="text-sm font-medium">
              De:
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded p-2 text-sm bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="endDate" className="text-sm font-medium">
              Até:
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded p-2 text-sm bg-background"
            />
          </div>
        </div>

        {/* Botao para gera r o relatório */}
        <div className="flex justify-end">
          <button
            onClick={handleGenerateReport}
            disabled={isFetching}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition disabled:opacity-50">
            {isFetching ? "Gerando..." : "Gerar Relatório"}
          </button>
        </div>

        {error && (
          <p className="text-red-500 mt-4">
            Erro ao buscar os dados do relatório.
          </p>
        )}
      </Card>
    </div>
  );
}
