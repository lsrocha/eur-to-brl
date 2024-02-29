import { URL } from "node:url";
import { formatIsoDate } from "../utils/date.js";

/**
 * European Central Bank Http Client
 *
 * @see https://data.ecb.europa.eu/help/api/data
 * @see https://data.ecb.europa.eu/data/datasets/EXR
 */

type Char =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";
type ThreeLetterUppercaseCode = Uppercase<`${Char}${Char}${Char}`>;

type QuotationObservation = number;

interface QuotationDataSet {
  series: Record<string, QuotationSerie>;
}

interface QuotationSerie {
  observations: Record<string, QuotationObservation[]>;
}

interface ExchangeRateQuote {
  dataSets: QuotationDataSet[];
}

const BASE_URL = "https://data-api.ecb.europa.eu/";

const EXCHANGE_RATE_DATASET_ID = "EXR";
const DAILY_FREQUENCY = "D";
const FOREIGN_EXCHANGE_RATE_TYPE = "SP00";
const AVERAGE_SERIES_VARIATION = "A";

function buildRequest(
  baseCurrency: ThreeLetterUppercaseCode,
  targetCurrency: ThreeLetterUppercaseCode,
  date: Date,
): URL {
  const isoDateString = formatIsoDate(date);
  const dimensions = buildRequestDimensions(baseCurrency, targetCurrency);

  const url = new URL(
    `service/data/${EXCHANGE_RATE_DATASET_ID}/${dimensions}`,
    BASE_URL,
  );

  url.searchParams.set("format", "jsondata");
  url.searchParams.set("startPeriod", isoDateString);
  url.searchParams.set("endPeriod", isoDateString);
  url.searchParams.set("detail", "dataonly");

  return url;
}

function buildRequestDimensions(
  baseCurrency: ThreeLetterUppercaseCode,
  targetCurrency: ThreeLetterUppercaseCode,
): string {
  return [
    DAILY_FREQUENCY, // Frequency dimension
    targetCurrency,
    baseCurrency,
    FOREIGN_EXCHANGE_RATE_TYPE, // Exchange rate type
    AVERAGE_SERIES_VARIATION, // Series variation
  ].join(".");
}

export async function quoteFromEuropeanCentralBank(
  baseCurrency: ThreeLetterUppercaseCode,
  targetCurrency: ThreeLetterUppercaseCode,
  date: Date,
) {
  const url = buildRequest(baseCurrency, targetCurrency, date);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch exchange rate");
  }

  if (response.headers.get("content-length") === "0") {
    throw new Error("No quotation available for the date");
  }

  const data: ExchangeRateQuote = await response.json();

  return data.dataSets[0].series["0:0:0:0:0"].observations["0"][0];
}
