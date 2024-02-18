import { URL } from 'node:url';

function generateEcbUrl(currency, baseCurrency, date) {
  const host = 'https://data-api.ecb.europa.eu';
  const dataflow = 'EXR';
  const resource = `D.${currency}.${baseCurrency}.SP00.A`;

  const url = new URL(`${host}/service/data/${dataflow}/${resource}`);

  url.searchParams.set('format', 'jsondata');
  url.searchParams.set('startPeriod', date);
  url.searchParams.set('endPeriod', date);
  url.searchParams.set('detail', 'dataonly');

  return url;
}

async function fetchFromEcb(currency, baseCurrency, date) {
  const url = generateEcbUrl(currency, baseCurrency, date);

  return fetch(url);
}

async function quoteUsdExchangeRate(date) {
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
  const date = '2024-02-16';
  const usdExchangeRate = await quoteUsdExchangeRate('2024-02-16');

  console.log(usdExchangeRate);
}

main().catch((err) => console.error(err));