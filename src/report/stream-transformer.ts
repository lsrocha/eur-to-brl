import { Transform } from "node:stream";
import { TransformCallback } from "stream";
import { convertFromEurToBrl } from "../currency/currency-converter.js";

export class IncomeTaxReportTransformer extends Transform {
  private csvSeparator: string;
  private formatter: ReportFormatter;

  constructor({
    separator,
    formatter,
  }: {
    separator: string;
    formatter: ReportFormatter;
  }) {
    super({ objectMode: true });

    this.csvSeparator = separator;
    this.formatter = formatter;
  }

  async _transform(
    entry: [string, string, ...number[]],
    _: BufferEncoding,
    done: TransformCallback
  ): Promise<void> {
    const [dateString, description, ...amountFields] = entry;
    const date = new Date(dateString);

    const convertedAmounts = await Promise.all(
      amountFields.map(
        async (amount) => await convertFromEurToBrl(amount, date)
      )
    );

    const reportFields = this.formatter({
      date,
      description,
      amounts: convertedAmounts,
    });

    done(null, `${reportFields.join(this.csvSeparator)}\n`);
  }
}
