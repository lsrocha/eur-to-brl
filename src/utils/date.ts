import { getBrazilianHolidays } from './public-holidays.ts'

export function formatIsoDate(date: Date): string {
  const [isoDateString] = date.toISOString().split('T')

  return isoDateString
}

export function formatUsdDate(date: Date): string {
  return date
    .toLocaleDateString('en-US', {
      timeZone: 'UTC',
    })
    .replace(/\//g, '-')
}

export async function getLastBusinessDayOfPreviousMonthFirstHalf(date: Date): Promise<Date> {
  const businessDate = new Date()

  businessDate.setUTCDate(15)
  businessDate.setUTCFullYear(date.getUTCFullYear())
  businessDate.setUTCMonth(date.getUTCMonth() - 1)
  businessDate.setUTCHours(0, 0, 0, 0)

  while (isWeekend(businessDate) || (await isPublicHolidayInBrazil(businessDate))) {
    const subtrahend = businessDate.getUTCDay() === 0 ? 2 : 1
    businessDate.setUTCDate(businessDate.getUTCDate() - subtrahend)
  }

  return businessDate
}

export async function isPublicHolidayInBrazil(date: Date): Promise<boolean> {
  const isoDate = formatIsoDate(date)
  const year = date.getUTCFullYear()

  const holidays = await getBrazilianHolidays(year)

  return holidays.includes(isoDate)
}

export function isWeekend(date: Date): boolean {
  return [0, 6].includes(date.getUTCDay())
}
