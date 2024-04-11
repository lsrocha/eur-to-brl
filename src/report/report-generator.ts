import { parse } from "csv-parse";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

import { IncomeTaxReportTransformer } from "./stream-transformer.js";
import {
  formatIncomeReportEntry,
  formatPaymentReportEntry,
} from "./formatters.js";

const CSV_SEPARATOR = ";";

export const REPORT_TYPES = ["income", "payment"];

export type ReportType = (typeof REPORT_TYPES)[number];

export async function generateIncomeTaxReport(
  reportType: ReportType,
  inputFile: string,
  outputFile?: string
) {
  const csvParser = parse({
    cast: true,
    castDate: true,
    delimiter: CSV_SEPARATOR,
    skipEmptyLines: true,
    toLine: 1000,
  });

  const reportFormatterPerType: { [key: ReportType]: ReportFormatter } = {
    income: formatIncomeReportEntry,
    payment: formatPaymentReportEntry,
  };

  await pipeline(
    createReadStream(inputFile),
    csvParser,
    new IncomeTaxReportTransformer({
      separator: CSV_SEPARATOR,
      formatter: reportFormatterPerType[reportType],
    }),
    createWriteStream(outputFile ?? `${reportType}-${Date.now()}.csv`)
  );
}
