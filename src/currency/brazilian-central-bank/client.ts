import { URL } from 'node:url'
import { formatUsdDate } from '../../utils/date.ts'

/**
 * Brazilian Central Bank HTTP client
 *
 * @see https://opendata.bcb.gov.br/dataset/exchange-rates-daily-bulletins
 */

const BASE_URL = 'https://olinda.bcb.gov.br/olinda/service/PTAX/version/v1/odata/'

function buildRequest(date: Date): URL {
  const formattedDate = formatUsdDate(date)

  const url = new URL('DollarRateDate(dataCotacao=@dataCotacao)', BASE_URL)

  url.searchParams.set('@dataCotacao', `'${formattedDate}'`)
  url.searchParams.set('$format', 'json')
  url.searchParams.set('$select', 'cotacaoCompra')
  url.searchParams.set('$top', '1')

  return url
}

export async function quoteUsdToBrlExchangeRate(date: Date) {
  const request = buildRequest(date)
  const response = await fetch(request)

  if (!response.ok) {
    throw new Error('Failed to fetch exchange rate')
  }

  const data = (await response.json()) as BrazilianCentralBankResponse

  if (!data?.value) {
    throw new Error('No quotation available for the date')
  }

  return data.value[0].cotacaoCompra
}
