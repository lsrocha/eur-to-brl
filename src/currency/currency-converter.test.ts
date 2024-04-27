import { describe, expect, it, jest } from "@jest/globals";

const quoteFromEuropeanCentralBankMock = jest.fn();
const quoteUsdToBrlExchangeRateMock = jest.fn();

jest.unstable_mockModule("./brazilian-central-bank/client.js", () => ({
  quoteUsdToBrlExchangeRate: quoteUsdToBrlExchangeRateMock,
}));

jest.unstable_mockModule("./european-central-bank/client.js", () => ({
  quoteFromEuropeanCentralBank: quoteFromEuropeanCentralBankMock,
}));

const { convertFromEurToBrl } = await import("./currency-converter.js");

describe("convertFromEurToBrl function", () => {
  const date = new Date();

  it("should resolve to 0 when the given amount is 0", async () => {
    expect(convertFromEurToBrl(0, date)).resolves.toBe(0);
  });

  it("should throw an exception when the response from Brazilian Central Bank is not HTTP 200", async () => {
    quoteUsdToBrlExchangeRateMock.mockImplementationOnce(async () => {
      throw new Error("HTTP request error");
    });

    expect(convertFromEurToBrl(10, date)).rejects.toThrow();
  });

  it("should throw an exception when the response from European Central Bank is not HTTP 200", async () => {
    quoteFromEuropeanCentralBankMock.mockImplementationOnce(async () => {
      throw new Error("HTTP request error");
    });

    expect(convertFromEurToBrl(10, date)).rejects.toThrow();
  });

  it("should throw an exception when the response from European Central Bank is not HTTP 200", async () => {
    quoteFromEuropeanCentralBankMock.mockImplementationOnce(async () => {
      throw new Error("HTTP request error");
    });

    expect(convertFromEurToBrl(10, date)).rejects.toThrow();
  });

  it("should resolve to the converted amount when the currency quotations are successfully retrieved", async () => {
    quoteUsdToBrlExchangeRateMock.mockImplementationOnce(async () => 5);
    quoteFromEuropeanCentralBankMock.mockImplementationOnce(async () => 1);

    expect(convertFromEurToBrl(10, date)).resolves.toBe(50);
  });
});
