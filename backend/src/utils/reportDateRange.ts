import { HttpError } from "../errors/HttpError.js";

export interface ReportDateRange {
  start: Date;
  end: Date;
  endExclusive: Date;
}

function parseDate(value: unknown, fieldName: string): Date {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new HttpError(400, `${fieldName} deve estar no formato YYYY-MM-DD.`);
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new HttpError(400, `${fieldName} não é uma data válida.`);
  }

  return date;
}

export function getReportDateRange(
  startDateValue: unknown,
  endDateValue: unknown,
  now = new Date(),
): ReportDateRange {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const start = startDateValue === undefined
    ? new Date(Date.UTC(year, month, 1))
    : parseDate(startDateValue, "startDate");
  const end = endDateValue === undefined
    ? new Date(Date.UTC(year, month + 1, 0))
    : parseDate(endDateValue, "endDate");

  if (start.getTime() > end.getTime()) {
    throw new HttpError(400, "startDate deve ser anterior ou igual a endDate.");
  }

  const endExclusive = new Date(end);
  endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);

  return { start, end, endExclusive };
}
