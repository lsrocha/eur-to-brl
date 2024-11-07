import { describe, expect, it, jest } from "@jest/globals";
import { quoteUsdToBrlExchangeRate } from "./client.js";

describe("quoteUsdToBrlExchangeRate function", () => {
  const date = new Date();

  const jsonFunctionMock = jest.fn(
    async () => ({ value: [{ cotacaoCompra: 10 }] }) as unknown,
  );

  const fetchFunctionMock = jest.spyOn(global, "fetch").mockImplementation(
    async () =>
      ({
        ok: true,
        json: jsonFunctionMock,
      }) as unknown as Response,
  );

  it("should throw an exception when the API response is not an HTTP 200", async () => {
    fetchFunctionMock.mockResolvedValueOnce({ ok: false } as Response);

    expect(quoteUsdToBrlExchangeRate(date)).rejects.toThrow();
  });

  it("should throw an exception when the 'value' field is missing in the API response", async () => {
    jsonFunctionMock.mockResolvedValueOnce({});

    expect(quoteUsdToBrlExchangeRate(date)).rejects.toThrow();
  });

  it("should resolve to a number when the API responds successfully", async () => {
    expect(quoteUsdToBrlExchangeRate(date)).resolves.toBe(10);
  });
});
