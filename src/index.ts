import { URL } from 'node:url';

function generateEcbUrl(currency: string, baseCurrency: string, date: Date) {
  const host = 'https://data-api.ecb.europa.eu';
  const dataflow = 'EXR';
  const resource = `D.${currency}.${baseCurrency}.SP00.A`;

  const [ isoDateString ] = date.toISOString().split('T');

  const url = new URL(`/service/data/${dataflow}/${resource}`, host);

  url.searchParams.set('format', 'jsondata');
  url.searchParams.set('startPeriod', isoDateString);
  url.searchParams.set('endPeriod', isoDateString);
  url.searchParams.set('detail', 'dataonly');

  return url;
}

async function fetchFromEcb(currency: string, baseCurrency: string, date: Date) {
  const url = generateEcbUrl(currency, baseCurrency, date);

  return fetch(url);
}

async function quoteUsdExchangeRate(date: Date) {
  const response = await fetchFromEcb('USD', 'EUR', date);

  if (!response.ok) {
    throw new Error('Failed to fetch exchange rate');
  }

  if (response.headers.get('content-length') === '0') {
    return null;
  }

  const data = await response.json();

  return data.dataSets[0].series['0:0:0:0:0'].observations['0'][0];
}

async function main() {
  const date = new Date('2024-02-16');
  const usdExchangeRate = await quoteUsdExchangeRate(date);

  console.log(usdExchangeRate);
}

main().catch((err) => console.error(err));