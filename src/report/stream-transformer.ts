import { Readable } from 'node:stream'
import { convertFromEurToBrl } from '../currency/currency-converter.ts'

export function formatIncomeTaxReport({
  formatter,
  separator = ';',
}: {
  formatter: ReportFormatter
  separator?: string
}) {
  return async function* (upstream: Readable) {
    for await (const entry of upstream) {
      const [dateString, description, ...amountFields]: [string, string, ...number[]] = entry
      const date = new Date(dateString)

      const convertedAmounts = await Promise.all(
        amountFields.map(async (amount) => await convertFromEurToBrl(amount, date)),
      )

      const reportFields = formatter({
        date,
        description,
        amounts: convertedAmounts,
      })

      yield `${reportFields.join(separator)}\n`
    }
  }
}
