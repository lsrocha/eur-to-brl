type CurrencyCode = "USD" | "EUR" | "BRL";

type QuotationObservation = number;

interface QuotationDataSet {
  series: Record<string, QuotationSerie>;
}

interface QuotationSerie {
  observations: Record<string, QuotationObservation[]>;
}

interface EuropeanCentralBankResponse {
  dataSets: QuotationDataSet[];
}
