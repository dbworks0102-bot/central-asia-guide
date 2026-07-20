import { describe, it, expect } from "vitest";
import { getCountryData } from "../../src/core/getCountryData.js";

describe("getCountryData", () => {
  it("存在するIDでその国のデータを返す", () => {
    const uz = getCountryData("uzbekistan");
    expect(uz).not.toBeNull();
    expect(uz.id).toBe("uzbekistan");
    expect(uz.name).toBe("ウズベキスタン");
  });

  it("キルギスのデータも取得できる", () => {
    const kg = getCountryData("kyrgyzstan");
    expect(kg).not.toBeNull();
    expect(kg.id).toBe("kyrgyzstan");
  });

  it("未存在IDでは null を返す", () => {
    expect(getCountryData("atlantis")).toBeNull();
  });

  it("空文字・undefined でも null を返す（安全にフォールバック）", () => {
    expect(getCountryData("")).toBeNull();
    expect(getCountryData(undefined)).toBeNull();
  });
});
