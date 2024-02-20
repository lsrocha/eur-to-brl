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
    fixed: string[]
    [ key: number ]: string[]
  } = {
    fixed: [
      '1-1',
      '4-21',
      '5-1',
      '9-7',
      '10-12',
      '11-2',
      '11-15',
      '11-20',
      '12-25'
    ],
    2023: [
      '2-20',
      '2-21',
      '4-7',
      '6-8'
    ],
    2024: [
      '2-12',
      '2-13',
      '3-29',
      '5-30'
    ]
  }

  const dateIndex = `${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
  const year = date.getUTCFullYear();

  return brazilianHolidays.fixed.includes(dateIndex) || brazilianHolidays?.[year].includes(dateIndex);
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

async function main() {
  const date = new Date('2023-12-11');
  const usdExchangeRate = await quoteUsdExchangeRate(date);

  console.log(usdExchangeRate);
  console.log(getLastBusinessDay(date));
}

main().catch((err) => console.error(err));