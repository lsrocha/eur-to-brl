import { describe, expect, it } from "@jest/globals";

import { datePtBrToISO } from "./public-holidays.js";

describe("datePtBrToISO function", () => {
  it("should return '01' as the numeric representation of 'janeiro'", () => {
    expect(datePtBrToISO("10 de janeiro de 2020")).toBe("2020-01-10");
  });

  it("should return '02' as the numeric representation of 'fevereiro'", () => {
    expect(datePtBrToISO("10 de fevereiro de 2020")).toBe("2020-02-10");
  });

  it("should return '03' as the numeric representation of 'março'", () => {
    expect(datePtBrToISO("10 de março de 2020")).toBe("2020-03-10");
  });

  it("should return '04' as the numeric representation of 'abril'", () => {
    expect(datePtBrToISO("10 de abril de 2020")).toBe("2020-04-10");
  });

  it("should return '05' as the numeric representation of 'maio'", () => {
    expect(datePtBrToISO("10 de maio de 2020")).toBe("2020-05-10");
  });

  it("should return '06' as the numeric representation of 'junho'", () => {
    expect(datePtBrToISO("10 de junho de 2020")).toBe("2020-06-10");
  });

  it("should return '07' as the numeric representation of 'julho'", () => {
    expect(datePtBrToISO("10 de julho de 2020")).toBe("2020-07-10");
  });

  it("should return '08' as the numeric representation of 'agosto'", () => {
    expect(datePtBrToISO("10 de agosto de 2020")).toBe("2020-08-10");
  });

  it("should return '09' as the numeric representation of 'setembro'", () => {
    expect(datePtBrToISO("10 de setembro de 2020")).toBe("2020-09-10");
  });

  it("should return '10' as the numeric representation of 'outubro'", () => {
    expect(datePtBrToISO("10 de outubro de 2020")).toBe("2020-10-10");
  });

  it("should return '11' as the numeric representation of 'novembro'", () => {
    expect(datePtBrToISO("10 de novembro de 2020")).toBe("2020-11-10");
  });

  it("should return '12' as the numeric representation of 'dezembro'", () => {
    expect(datePtBrToISO("10 de dezembro de 2020")).toBe("2020-12-10");
  });

  it("should add a zero prefix to numbers less than 10", () => {
    expect(datePtBrToISO("1 de dezembro de 2020")).toBe("2020-12-01");
  });
});
