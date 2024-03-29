/**
 * Income Tax Report Formatters
 *
 * @see https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/dirpf/carne-leao/topicos-ajuda-carne-leao-web#escritura--o
 */

const LOCALE = "pt-BR";

const OTHER_INCOME_CODE = "R01.004.001";

const TAX_PAID_ABROAD_PAYMENT_CODE = "P20.01.00003";

function formatAmountFields(amounts: number[]) {
  return amounts.map((amount) =>
    amount.toLocaleString(LOCALE, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })
  );
}

export function formatIncomeReportEntry({
  date,
  description,
  amounts,
}: InputFileEntry): IncomeReportEntry {
  const formattedAmountFields = formatAmountFields(amounts);

  return [
    date.toLocaleDateString(LOCALE, {
      timeZone: "UTC",
    }),
    OTHER_INCOME_CODE,
    null,
    formattedAmountFields[0] ?? "0,00",
    formattedAmountFields[1] ?? null,
    description.slice(0, 255),
    "EX",
  ];
}

export function formatPaymentReportEntry({
  date,
  description,
  amounts,
}: InputFileEntry): PaymentReportEntry {
  const formattedAmountFields = formatAmountFields(amounts);

  return [
    date.toLocaleDateString(LOCALE, {
      timeZone: "UTC",
    }),
    TAX_PAID_ABROAD_PAYMENT_CODE,
    formattedAmountFields[0] ?? "0,00",
    description.slice(0, 255),
  ];
}
