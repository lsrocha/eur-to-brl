import { parse } from "csv-parse";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { IncomeTaxReportTransformer } from "./report/stream-transformer.js";
import { formatIncomeReportEntry } from "./report/formatters.js";

const CSV_SEPARATOR = ";";

async function main() {
  const csvParser = parse({
    cast: true,
    castDate: true,
    delimiter: CSV_SEPARATOR,
    skipEmptyLines: true,
    toLine: 1000,
  });

  await pipeline(
    createReadStream("./rendimentos.csv"),
    csvParser,
    new IncomeTaxReportTransformer({
      separator: CSV_SEPARATOR,
      formatter: formatIncomeReportEntry,
    }),
    createWriteStream("./rendimentos-carne-leao.csv")
  );
}

main().catch((err) => console.error(err));
