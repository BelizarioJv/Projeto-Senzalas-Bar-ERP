import { useState } from "react";
import { ReportPeriod } from "@/types/report";

function getDefaultReportPeriod(): ReportPeriod {
  const today = new Date().toISOString().slice(0, 10);
  return {
    startDate: `${today.slice(0, 7)}-01`,
    endDate: today,
  };
}

export function useReportPeriod() {
  const [period, setPeriod] = useState(getDefaultReportPeriod);
  const isValid =
    Boolean(period.startDate) &&
    Boolean(period.endDate) &&
    period.startDate <= period.endDate;

  return {
    period,
    isValid,
    setStartDate: (startDate: string) =>
      setPeriod((current) => ({ ...current, startDate })),
    setEndDate: (endDate: string) =>
      setPeriod((current) => ({ ...current, endDate })),
  };
}
