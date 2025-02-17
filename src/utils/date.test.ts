import { describe, expect, it, jest } from "@jest/globals";

import {
  getLastBusinessDayOfPreviousMonthFirstHalf,
  isPublicHolidayInBrazil,
} from "./date.js";

const getBrazilianHolidaysMock = jest.fn(async () => [
  {
    diaMes: "15 de novembro",
    diaSemana: "sexta-feira",
    nomeFeriado: "Proclamação da República",
  },
]);

// const isPublicHolidayInBrazilMock = jest.fn(async () => false);

jest.unstable_mockModule("./public-holidays.js", () => ({
  getBrazilianHolidays: getBrazilianHolidaysMock,
}));

jest.unstable_mockModule("./date.js", () => {
  const originalModule = jest.requireActual("./date.js");

  return {
    ...(originalModule as object),
    isPublicHolidayInBrazil: jest.fn(async () => false),
  };
});

describe("getLastBusinessDayOfPreviousMonthFirstHalf function", () => {
  it("should return the 15th of the previous month if it's a business day", async () => {
    (
      isPublicHolidayInBrazil as jest.Mock<() => Promise<boolean>>
    ).mockResolvedValueOnce(false);

    const date = new Date("2024-04-29");
    const output = await getLastBusinessDayOfPreviousMonthFirstHalf(date);

    expect(output.getUTCDate()).toBe(15);
    expect(output.getUTCMonth()).toBe(3 - 1);
    expect(output.getUTCFullYear()).toBe(2024);
  });

  it("should return the 14th of the previous month if the 15th is a Saturday", async () => {
    const date = new Date("2023-08-01");
    const output = await getLastBusinessDayOfPreviousMonthFirstHalf(date);

    expect(output.getUTCDate()).toBe(14);
    expect(output.getUTCMonth()).toBe(7 - 1);
    expect(output.getUTCFullYear()).toBe(2023);
  });

  it("should return the 14th of the previous month if the 15th is a holiday in Brazil", async () => {
    const date = new Date("2024-12-01");
    const output = await getLastBusinessDayOfPreviousMonthFirstHalf(date);

    expect(output.getUTCDate()).toBe(14);
    expect(output.getUTCMonth()).toBe(11 - 1);
    expect(output.getUTCFullYear()).toBe(2024);
  });

  it("should return the 13th of the previous month if the 15th is a Sunday", async () => {
    const date = new Date("2024-10-01");
    const output = await getLastBusinessDayOfPreviousMonthFirstHalf(date);

    expect(output.getUTCDate()).toBe(13);
    expect(output.getUTCMonth()).toBe(9 - 1);
    expect(output.getUTCFullYear()).toBe(2024);
  });
});

// describe("isPublicHolidayInBrazil function", () => {
//   it("should return false ");
// });
