interface BrazilianHoliday {
  diaMes: string;
  diaSemana: string;
  nomeFeriado: string;
}

type FebrabanHolidaysResponse = BrazilianHoliday[];

export async function getBrazilianHolidays(year: number): Promise<string[]> {
  // TODO: cache request

  try {
    const response = await fetch(
      `https://feriadosbancarios.febraban.org.br/Home/ObterFeriadosFederais?ano=${year}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const holidays = (await response.json()) as FebrabanHolidaysResponse;

    return holidays.map((holiday) =>
      datePtBrToISO(`${holiday.diaMes} de ${year}`)
    );
  } catch (error) {
    throw new Error(`Unable to retrieve the ${year} holidays`, {
      cause: error,
    });
  }
}

export function datePtBrToISO(date: string) {
  const months: { [key: string]: number } = {
    janeiro: 1,
    fevereiro: 2,
    março: 3,
    abril: 4,
    maio: 5,
    junho: 6,
    julho: 7,
    agosto: 8,
    setembro: 9,
    outubro: 10,
    novembro: 11,
    dezembro: 12,
  };

  const matches = date
    .toLocaleLowerCase()
    .match(/^(\d{1,2}) de ([a-zç]+) de (\d{4})$/);

  if (matches === null || matches.length < 4) {
    throw new Error("Invalid date provided");
  }

  const [, day, monthName, year] = matches;
  const monthNumber = months[monthName];

  return `${year}-${monthNumber.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}
