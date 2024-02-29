import { URL } from "node:url";
import { quoteFromEuropeanCentralBank } from "./clients/european-central-bank.js";

function generateBcbUrl(date: Date): URL {
  const host =
    "https://olinda.bcb.gov.br/olinda/service/PTAX/version/v1/odata/";

  const formattedDate = date
    .toLocaleDateString("en-US", {
      timeZone: "UTC",
    })
    .replace(/\//g, "-");

  const url = new URL("DollarRateDate(dataCotacao=@dataCotacao)", host);

  url.searchParams.set("@dataCotacao", `'${formattedDate}'`);
  url.searchParams.set("$format", "json");
  url.searchParams.set("$select", "cotacaoCompra");
  url.searchParams.set("$top", "1");

  return url;
}

async function fetchFromBcb(date: Date) {
  const url = generateBcbUrl(date);

  return fetch(url);
}

async function quoteBrlExchangeRate(date: Date) {
  const response = await fetchFromBcb(date);

  if (!response.ok) {
    throw new Error("Failed to fetch exchange rate");
  }

  const data = await response.json();

  if (!data?.value) {
    return null;
  }

  return data.value[0].cotacaoCompra;
}

function isPublicHoliday(date: Date): boolean {
  /**
   * annual:
   * - 01-01: Confraternização Universal
   * - 04-21: Tiradentes
   * - 05-01: Dia do trabalho
   * - 09-07: Independência do Brasil
   * - 10-12: Nossa Senhora Aparecida
   * - 11-02: Finados
   * - 11-15: Proclamação da república
   * - 11-20: Consciência Negra
   * - 12-25: Natal
   *
   * 2023:
   * - 02-20: Carnaval
   * - 02-21: Carnaval
   * - 04-07: Paixão de Cristo
   * - 06-08: Corpus Christi
   *
   * 2024:
   * - 02-12: Carnaval
   * - 02-13: Carnaval
   * - 03-29: Paixão de Cristo
   * - 05-30: Corpus Christi
   */
  const brazilianHolidays: {
    fixed: string[];
    [key: number]: string[];
  } = {
    fixed: [
      "1-1",
      "4-21",
      "5-1",
      "9-7",
      "10-12",
      "11-2",
      "11-15",
      "11-20",
      "12-25",
    ],
    2023: ["2-20", "2-21", "4-7", "6-8"],
    2024: ["2-12", "2-13", "3-29", "5-30"],
  };

  const dateIndex = `${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
  const year = date.getUTCFullYear();

  return (
    brazilianHolidays.fixed.includes(dateIndex) ||
    brazilianHolidays?.[year].includes(dateIndex)
  );
}

function isWeekend(date: Date): boolean {
  return [0, 6].includes(date.getUTCDay());
}

function getLastBusinessDay(date: Date): Date {
  const businessDate = new Date();

  businessDate.setUTCDate(15);
  businessDate.setUTCFullYear(date.getUTCFullYear());
  businessDate.setUTCMonth(date.getUTCMonth() - 1);
  businessDate.setUTCHours(0, 0, 0, 0);

  while (isWeekend(businessDate) || isPublicHoliday(businessDate)) {
    const subtrahend = businessDate.getUTCDay() === 0 ? 2 : 1;
    businessDate.setUTCDate(businessDate.getUTCDate() - subtrahend);
  }

  return businessDate;
}

async function convertFromEurToBrl(
  amount: number,
  date: Date,
): Promise<number> {
  const businessDate = getLastBusinessDay(date);

  const [usdExchangeRate, brlExchangeRate] = await Promise.all([
    quoteFromEuropeanCentralBank("EUR", "USD", date),
    quoteBrlExchangeRate(businessDate),
  ]);

  return amount * usdExchangeRate * brlExchangeRate;
}

async function main() {
  const date = new Date("2023-12-11");
  console.log(await convertFromEurToBrl(100, date));
}

main().catch((err) => console.error(err));
