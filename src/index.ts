import { parseArgs } from "node:util";
import {
  REPORT_TYPES,
  type ReportType,
  generateIncomeTaxReport,
} from "./report/report-generator.js";

async function main() {
  const { values: args, positionals } = parseArgs({
    options: {
      input: {
        short: "i",
        type: "string",
      },
      output: {
        short: "o",
        type: "string",
      },
      reportType: {
        default: "income",
        short: "t",
        type: "string",
      },
    },
  });

  if (!args.input) {
    throw new Error("-i, --input argument missing");
  }

  const reportType: ReportType =
    args.reportType && REPORT_TYPES.includes(args.reportType)
      ? args.reportType
      : REPORT_TYPES[0];

  await generateIncomeTaxReport(reportType, args.input, args.output);
}

main().catch((err) => console.error(err));
