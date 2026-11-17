import { describe, expect, it } from "vitest";
import { HttpError } from "@/errors/HttpError.js";
import { getReportDateRange } from "@/utils/reportDateRange.js";

describe("getReportDateRange", () => {
  it("includes the full end date by returning the following day as an exclusive bound", () => {
    const range = getReportDateRange("2026-03-04", "2026-03-08");

    expect(range.start.toISOString()).toBe("2026-03-04T00:00:00.000Z");
    expect(range.end.toISOString()).toBe("2026-03-08T00:00:00.000Z");
    expect(range.endExclusive.toISOString()).toBe("2026-03-09T00:00:00.000Z");
  });

  it("defaults to the current UTC month", () => {
    const range = getReportDateRange(
      undefined,
      undefined,
      new Date("2026-03-15T12:00:00.000Z"),
    );

    expect(range.start.toISOString()).toBe("2026-03-01T00:00:00.000Z");
    expect(range.end.toISOString()).toBe("2026-03-31T00:00:00.000Z");
    expect(range.endExclusive.toISOString()).toBe("2026-04-01T00:00:00.000Z");
  });

  it("rejects malformed or impossible dates", () => {
    expect(() => getReportDateRange("2026-02-30", "2026-03-08")).toThrow(
      HttpError,
    );
    expect(() => getReportDateRange("03-04-2026", "2026-03-08")).toThrow(
      HttpError,
    );
  });

  it("rejects a start date later than the end date", () => {
    expect(() => getReportDateRange("2026-03-09", "2026-03-08")).toThrow(
      HttpError,
    );
  });
});
