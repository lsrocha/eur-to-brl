import { brazilianHolidays } from "./public-holidays.js";

export function formatIsoDate(date: Date): string {
  const [isoDateString] = date.toISOString().split("T");

  return isoDateString;
}

export function formatUsdDate(date: Date): string {
  return date
    .toLocaleDateString("en-US", {
      timeZone: "UTC",
    })
    .replace(/\//g, "-");
}

export function getLastBusinessDayOfPreviousMonthFirstHalf(date: Date): Date {
  const businessDate = new Date();

  businessDate.setUTCDate(15);
  businessDate.setUTCFullYear(date.getUTCFullYear());
  businessDate.setUTCMonth(date.getUTCMonth() - 1);
  businessDate.setUTCHours(0, 0, 0, 0);

  while (isWeekend(businessDate) || isPublicHolidayInBrazil(businessDate)) {
    const subtrahend = businessDate.getUTCDay() === 0 ? 2 : 1;
    businessDate.setUTCDate(businessDate.getUTCDate() - subtrahend);
  }

  return businessDate;
}

export function isPublicHolidayInBrazil(date: Date): boolean {
  const dateIndex = `${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
  const year = date.getUTCFullYear();

  return (
    brazilianHolidays.fixed.includes(dateIndex) ||
    brazilianHolidays[year]?.includes(dateIndex)
  );
}

export function isWeekend(date: Date): boolean {
  return [0, 6].includes(date.getUTCDay());
}
