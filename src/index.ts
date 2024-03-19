import { quoteUsdToBrlExchangeRate } from "./clients/brazilian-central-bank/client.js";
import { quoteFromEuropeanCentralBank } from "./clients/european-central-bank/client.js";
import { getLastBusinessDayOfPreviousMonthFirstHalf } from "./utils/date.js";

async function convertFromEurToBrl(
  amount: number,
  date: Date
): Promise<number> {
  const businessDate = getLastBusinessDayOfPreviousMonthFirstHalf(date);

  const [usdExchangeRate, brlExchangeRate] = await Promise.all([
    quoteFromEuropeanCentralBank({
      baseCurrency: "EUR",
      targetCurrency: "USD",
      date,
    }),
    quoteUsdToBrlExchangeRate(businessDate),
  ]);

  return amount * usdExchangeRate * brlExchangeRate;
}

async function main() {
  const date = new Date("2023-12-11");
  console.log(await convertFromEurToBrl(100, date));
}

main().catch((err) => console.error(err));
