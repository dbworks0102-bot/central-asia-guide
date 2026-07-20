import { describe, it, expect } from "vitest";
import { getAllCountries } from "../../src/core/getAllCountries.js";

describe("getAllCountries", () => {
  it("MVP対象の全国分（2件以上）を返す", () => {
    const list = getAllCountries();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThanOrEqual(2);
  });

  it("各項目はトップページ表示に必要なフィールドを含む", () => {
    const list = getAllCountries();
    for (const c of list) {
      expect(c).toHaveProperty("id");
      expect(c).toHaveProperty("name");
      expect(c).toHaveProperty("tagline");
      expect(c).toHaveProperty("heroImage");
      expect(typeof c.id).toBe("string");
      expect(c.name.length).toBeGreaterThan(0);
    }
  });

  it("ウズベキスタンとキルギスを含む", () => {
    const ids = getAllCountries().map((c) => c.id);
    expect(ids).toContain("uzbekistan");
    expect(ids).toContain("kyrgyzstan");
  });
});
