import { describe, it, expect } from "vitest";
import { validateCountry } from "../../src/core/validateCountry.js";

function makeValid() {
  return {
    id: "testland",
    name: "テストランド",
    nameEn: "Testland",
    tagline: "テスト用の国",
    heroImage: "/images/testland/hero.jpg",
    overview: "概要テキスト",
    basicInfo: {
      language: "テスト語",
      currency: "テストコイン",
      timezone: "UTC+0",
      visa: "ビザ不要",
    },
    safety: { level: "安全", summary: "問題なし", notes: [] },
    currency: { code: "TST", roughRate: "1円 ≒ 1コイン" },
    bestSeason: { recommended: "春", reason: "快適" },
    budget: { daily: "1日 1万円", breakdown: [] },
    preparation: { items: ["パスポート"], notes: [] },
    modelCourses: [{ id: "c1", title: "コース", days: 3, summary: "", itinerary: [] }],
    attractions: [
      { id: "a1", name: "名所", city: "都市", image: "/x.jpg", description: "", dominantColor: "#123456" },
    ],
  };
}

describe("validateCountry", () => {
  it("全必須フィールドが揃っていれば valid=true・missing=[]", () => {
    const res = validateCountry(makeValid());
    expect(res.valid).toBe(true);
    expect(res.missing).toEqual([]);
  });

  it("トップレベルの欠損を検出し不足一覧を返す", () => {
    const data = makeValid();
    delete data.safety;
    delete data.budget;
    const res = validateCountry(data);
    expect(res.valid).toBe(false);
    expect(res.missing).toContain("safety");
    expect(res.missing).toContain("budget");
  });

  it("basicInfo のネスト欠損を検出する", () => {
    const data = makeValid();
    delete data.basicInfo.visa;
    const res = validateCountry(data);
    expect(res.valid).toBe(false);
    expect(res.missing).toContain("basicInfo.visa");
  });

  it("modelCourses が空配列なら不足として扱う", () => {
    const data = makeValid();
    data.modelCourses = [];
    const res = validateCountry(data);
    expect(res.valid).toBe(false);
    expect(res.missing).toContain("modelCourses");
  });

  it("null/undefined を渡しても例外を投げず valid=false", () => {
    expect(validateCountry(null).valid).toBe(false);
    expect(validateCountry(undefined).valid).toBe(false);
  });
});
