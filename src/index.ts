import { type ParseArgsConfig, parseArgs } from "node:util";
import {
  generateIncomeTaxReport,
  type ReportType,
} from "./report/report-generator.ts";
import { convertFromEurToBrl } from "./currency/currency-converter.ts";
import { formatAmount } from "./report/formatters.ts";
import { DEFAULT_REPORT_TYPE, REPORT_TYPES } from "./report/constants.ts";

type CommandOptions = ParseArgsConfig["options"];
type CommandExecutor = (
  options: ReturnType<typeof parseArgs>["values"]
) => Promise<void>;

type Command = {
  options: CommandOptions;
  execute: CommandExecutor;
};

const commands: {
  [key: string]: Command;
} = {
  // $ eur-to-brl csv --type <income|payment> --input "income.csv" --output "converted-income.csv"
  csv: {
    options: {
      input: {
        short: "i",
        type: "string",
      },
      output: {
        short: "o",
        type: "string",
      },
      type: {
        short: "t",
        type: "string",
      },
    },
    execute: async (
      options: Partial<{
        type: string;
        input: string;
        output: string;
      }>
    ) => {
      if (!options.input) {
        throw new Error("-i, --input argument missing");
      }

      const reportType: ReportType =
        options.type && REPORT_TYPES.includes(options.type)
          ? options.type
          : DEFAULT_REPORT_TYPE;

      await generateIncomeTaxReport(reportType, options.input, options.output);
    },
  },
  // $ eur-to-brl single-amount --date "12/25/2023" --amount "110.00"
  "single-amount": {
    options: {
      amount: {
        short: "a",
        type: "string",
      },
      date: {
        short: "d",
        type: "string",
      },
    },
    execute: async (options: Partial<{ amount: string; date: string }>) => {
      const parsedAmount = Number.parseFloat(options.amount ?? "");

      if (Number.isNaN(parsedAmount)) {
        throw new Error("-a, --amount is required and should be a number");
      }

      const milliseconds = Date.parse(`${options.date} UTC`);

      if (Number.isNaN(milliseconds)) {
        throw new Error("-d, --date is required and should be a valid date");
      }

      const parsedDate = new Date(milliseconds);

      const convertedAmount = await convertFromEurToBrl(
        parsedAmount,
        parsedDate
      );

      const formattedAmount = formatAmount(convertedAmount);

      console.log(formattedAmount);
    },
  },
};

async function main() {
  const { values: options, positionals: args } = parseArgs({
    options: Object.assign(
      {},
      ...Object.keys(commands).map(
        (commandName) => commands[commandName].options
      )
    ),
    allowPositionals: true,
  });

  const [commandName = "single-amount"] = args;

  await commands[commandName].execute(options);
}

main().catch((err) => console.error(err));
