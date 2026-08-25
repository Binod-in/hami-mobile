import { describe, expect, it } from "vitest";

import { calculateTogetherDuration, getDaysUntilNextDate } from "../lib/hami-context";

describe("HAMI relationship calculations", () => {
  it("calculates calendar duration using a fixed reference date", () => {
    const duration = calculateTogetherDuration("2021-08-08T00:00:00.000Z", new Date("2026-08-25T00:00:00.000Z"));
    expect(duration.years).toBe(5);
    expect(duration.months).toBe(0);
    expect(duration.days).toBe(17);
    expect(duration.totalDays).toBe(1843);
  });

  it("uses the next calendar occurrence for recurring dates", () => {
    const beforeAnniversary = getDaysUntilNextDate(8, 8, new Date("2026-07-30T00:00:00.000Z"));
    const afterAnniversary = getDaysUntilNextDate(8, 8, new Date("2026-08-25T00:00:00.000Z"));
    expect(beforeAnniversary).toBe(9);
    expect(afterAnniversary).toBe(348);
  });

  it("does not return negative values for a future start date", () => {
    const duration = calculateTogetherDuration("2027-01-01T00:00:00.000Z", new Date("2026-08-25T00:00:00.000Z"));
    expect(duration.totalDays).toBe(0);
  });
});
