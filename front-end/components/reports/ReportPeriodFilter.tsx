"use client";

import { ReactNode } from "react";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ReportPeriod } from "@/types/report";

interface ReportPeriodFilterProps {
  period: ReportPeriod;
  isValid: boolean;
  isFetching: boolean;
  error?: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onGenerate: () => void | Promise<void>;
  children?: ReactNode;
}

export function ReportPeriodFilter({
  period,
  isValid,
  isFetching,
  error,
  onStartDateChange,
  onEndDateChange,
  onGenerate,
  children,
}: ReportPeriodFilterProps) {
  return (
    <Card className="space-y-5 p-6">
      <div className="flex flex-wrap items-end gap-5">
        <div className="flex items-center gap-2 font-medium">
          <Calendar size={20} />
          <span>Filtrar por período</span>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="report-start-date" className="text-sm font-medium">
            De:
          </label>
          <input
            id="report-start-date"
            type="date"
            value={period.startDate}
            max={period.endDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            className="rounded border bg-background p-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="report-end-date" className="text-sm font-medium">
            Até:
          </label>
          <input
            id="report-end-date"
            type="date"
            value={period.endDate}
            min={period.startDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            className="rounded border bg-background p-2 text-sm"
          />
        </div>
        {children}
        <button
          type="button"
          onClick={onGenerate}
          disabled={!isValid || isFetching}
          className="rounded bg-primary px-4 py-2 text-white transition hover:bg-primary/90 disabled:opacity-50">
          {isFetching ? "Buscando..." : "Gerar Relatório"}
        </button>
      </div>
      {!isValid && (
        <p className="text-sm text-red-600" role="alert">
          Informe um período válido, com a data inicial anterior ou igual à
          final.
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </Card>
  );
}
