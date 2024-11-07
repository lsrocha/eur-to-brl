type IncomeReportEntry = [
  date: string,
  code: string,
  occupationCode: string | null,
  amount: string,
  deductionAmount: string | null,
  description: string | null,
  type: "PF" | "PJ" | "EX",
];

type PaymentReportEntry = [
  date: string,
  code: string,
  amount: string,
  description: string | null,
];

type InputFileEntry = {
  date: Date;
  description: string;
  amounts: number[];
};

type ReportFormatter = (
  entry: InputFileEntry,
) => IncomeReportEntry | PaymentReportEntry;
