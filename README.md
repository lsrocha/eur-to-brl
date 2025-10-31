# eur-to-brl

`eur-to-brl` is a command-line (CLI) tool designed to assist users in converting Euro (EUR) amounts to Brazilian Real (BRL) using official exchange rates provided by the [Brazilian Central Bank](https://www.bcb.gov.br/en) and the [European Central Bank](https://www.ecb.europa.eu). The tool is particularly tailored for individuals and businesses preparing income reports in compliance with tax regulations defined by the [Brazilian Federal Revenue Service](https://www.gov.br/receitafederal/).

> ⚠ **Disclaimer**: **This project is currently in the alpha stage** and may contain errors or incomplete functionality. **Ensure results are reviewed by a qualified fiscal advisor before using them for official income reports**.

## Features

- Convert multiple transactions listed in a CSV file.
- Perform single-amount conversions for specific dates.
- Tailored for income and tax payment reporting requirements.

## Conversion rules

The tool applies a two-step process to convert amounts from EUR to BRL, following the rules below:

1. **EUR to USD Conversion**
   - The Euro amount is first converted to USD using the exchange rate provided by the European Central Bank for the specified event date.

2. **USD to BRL Conversion**
   - The USD amount is then converted to BRL using the bid rate published by the Brazilian Central Bank.

   - The exchange rate used corresponds to the last business day of the first half of the month before the specified event date.

**Example:** For an event on **April 15, 2023**:

- The **EUR to USD** conversion uses the European Central Bank's rate for **April 15, 2023**.

- The **USD to BRL** conversion uses the Brazilian Central Bank's bid rate for **March 15, 2023** (last business day of the first half of March).

## Usage

## Convert a single amount

Converts a single amount of EUR to BRL for a specific date:

```bash
eur-to-brl single-amount \
  --date "MM/DD/YYYY" \
  --amount "EUR-amount"
```

Options:

- `--date`: The date to fetch the exchange rate for (formatted as `MM/DD/YYYY`).
- `--amount`: The EUR amount to convert.

Example:

```bash
eur-to-brl single-amount \
  --date "12/22/2023" \
  --amount "110.00"
```

## Convert a CSV File

Convert multiple EUR amounts listed in a CSV file, specifying the type of report (_income_ or _payment_):

```bash
eur-to-brl csv \
  --type <income|payment> \
  --input "income-file.csv" \
  --output "output-file.csv"
```

Options:

- `--type`: Specify the type of report:
  - `income`: For income reports.
  - `payment`: For tax payment reports.
- `--input`: Path to the input CSV file containing EUR amounts.
- `--output`: Path to save the resulting CSV file with converted BRL amounts.

Example:

```bash
eur-to-brl csv \
  --type income \
  --input "income.csv" \
  --output "converted-income.csv"
```
