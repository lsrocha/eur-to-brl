/**
 * Brazilian Income Tax Report Formatters
 *
 * @see https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/dirpf/carne-leao/topicos-ajuda-carne-leao-web#escritura--o
 */

import { OTHER_INCOME_CODE, REPORT_LOCALE, TAX_PAID_ABROAD_PAYMENT_CODE } from './constants.ts'

export function formatAmount(amount: number) {
  return amount.toLocaleString(REPORT_LOCALE, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    useGrouping: false,
  })
}

function formatDescriptionField(description: string) {
  return description.slice(0, 255)
}

export function formatIncomeReportEntry({ date, description, amounts }: InputFileEntry): IncomeReportEntry {
  const formattedAmountFields = amounts.map((amount) => formatAmount(amount))

  return [
    date.toLocaleDateString(REPORT_LOCALE, {
      timeZone: 'UTC',
    }),
    OTHER_INCOME_CODE,
    null,
    formattedAmountFields[0] ?? '0,00',
    formattedAmountFields[1] ?? null,
    formatDescriptionField(description),
    'EX',
  ]
}

export function formatPaymentReportEntry({ date, description, amounts }: InputFileEntry): PaymentReportEntry {
  const formattedAmountFields = amounts.map((amount) => formatAmount(amount))

  return [
    date.toLocaleDateString(REPORT_LOCALE, {
      timeZone: 'UTC',
    }),
    TAX_PAID_ABROAD_PAYMENT_CODE,
    formattedAmountFields[0] ?? '0,00',
    formatDescriptionField(description),
  ]
}
