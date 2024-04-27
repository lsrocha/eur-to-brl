import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { quoteFromEuropeanCentralBank } from "./client.js";

describe("quoteFromEuropeanCentralBank function", () => {
  const date = new Date();

  const headersMock = new Map();

  const jsonFunctionMock = jest.fn(async () => ({
    dataSets: [
      {
        series: {
          "0:0:0:0:0": {
            observations: {
              "0": [10],
            },
          },
        },
      },
    ],
  }));

  const fetchFunctionMock = jest.spyOn(global, "fetch").mockImplementation(
    async () =>
      ({
        ok: true,
        headers: headersMock,
        json: jsonFunctionMock,
      }) as unknown as Response
  );

  beforeEach(() => {
    headersMock.set("content-length", "100");
  });

  it("should throw an exception when the API response is not an HTTP 200", async () => {
    fetchFunctionMock.mockResolvedValueOnce({ ok: false } as Response);

    expect(
      quoteFromEuropeanCentralBank({
        date,
        baseCurrency: "EUR",
        targetCurrency: "USD",
      })
    ).rejects.toThrow();
  });

  it("should throw an exception when the API response has length 0", async () => {
    headersMock.set("content-length", "0");

    expect(
      quoteFromEuropeanCentralBank({
        date,
        baseCurrency: "EUR",
        targetCurrency: "USD",
      })
    ).rejects.toThrow();
  });

  it("should resolve to a number when the API responds successfully", async () => {
    expect(
      quoteFromEuropeanCentralBank({
        date,
        baseCurrency: "EUR",
        targetCurrency: "USD",
      })
    ).resolves.toBe(10);
  });
});
