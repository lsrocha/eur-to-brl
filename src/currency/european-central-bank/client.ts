import { URL } from 'node:url'
import { formatIsoDate } from '../../utils/date.ts'

/**
 * European Central Bank HTTP client
 *
 * @see https://data.ecb.europa.eu/help/api/data
 * @see https://data.ecb.europa.eu/data/datasets/EXR
 */

const BASE_URL = 'https://data-api.ecb.europa.eu/'

const EXCHANGE_RATE_DATASET_ID = 'EXR'
const DAILY_FREQUENCY = 'D'
const FOREIGN_EXCHANGE_RATE_TYPE = 'SP00'
const AVERAGE_SERIES_VARIATION = 'A'

function buildRequest(baseCurrency: CurrencyCode, targetCurrency: CurrencyCode, date: Date): URL {
  const isoDateString = formatIsoDate(date)
  const dimensions = buildRequestDimensions(baseCurrency, targetCurrency)

  const url = new URL(`service/data/${EXCHANGE_RATE_DATASET_ID}/${dimensions}`, BASE_URL)

  url.searchParams.set('format', 'jsondata')
  url.searchParams.set('startPeriod', isoDateString)
  url.searchParams.set('endPeriod', isoDateString)
  url.searchParams.set('detail', 'dataonly')

  return url
}

function buildRequestDimensions(baseCurrency: CurrencyCode, targetCurrency: CurrencyCode): string {
  return [
    DAILY_FREQUENCY, // Frequency dimension
    targetCurrency,
    baseCurrency,
    FOREIGN_EXCHANGE_RATE_TYPE, // Exchange rate type
    AVERAGE_SERIES_VARIATION, // Series variation
  ].join('.')
}

export async function quoteFromEuropeanCentralBank({
  baseCurrency,
  targetCurrency,
  date,
}: {
  baseCurrency: CurrencyCode
  targetCurrency: CurrencyCode
  date: Date
}) {
  const request = buildRequest(baseCurrency, targetCurrency, date)
  const response = await fetch(request)

  if (!response.ok) {
    throw new Error('Failed to fetch exchange rate')
  }

  if (response.headers.get('content-length') === '0') {
    throw new Error('No quotation available for the date')
  }

  const data = (await response.json()) as EuropeanCentralBankResponse

  return data.dataSets[0].series['0:0:0:0:0'].observations['0'][0]
}
