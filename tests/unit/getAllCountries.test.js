import { describe, it, expect } from "vitest";
import { getAllCountries } from "../../src/core/getAllCountries.js";

describe("getAllCountries", () => {
  it("対象国（ウズベキスタンのみ）を返す", () => {
    const list = getAllCountries();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(1);
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

  it("ウズベキスタンを含み、キルギスは含まない（専門サイト化）", () => {
    const ids = getAllCountries().map((c) => c.id);
    expect(ids).toContain("uzbekistan");
    expect(ids).not.toContain("kyrgyzstan");
  });
});
