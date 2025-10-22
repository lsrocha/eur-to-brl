import { quoteUsdToBrlExchangeRate } from "./brazilian-central-bank/client.ts";
import { quoteFromEuropeanCentralBank } from "./european-central-bank/client.ts";
import { getLastBusinessDayOfPreviousMonthFirstHalf } from "../utils/date.ts";

export async function convertFromEurToBrl(
  amount: number,
  date: Date
): Promise<number> {
  if (amount === 0) {
    return amount;
  }

  const businessDate = await getLastBusinessDayOfPreviousMonthFirstHalf(date);

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
