import { describe, it, expect } from "vitest";
import { labels } from "../../src/utils/labels.js";

describe("labels", () => {
  it("サイト名を持つ", () => {
    expect(typeof labels.siteName).toBe("string");
    expect(labels.siteName.length).toBeGreaterThan(0);
  });

  it("国別ページの全セクション見出しを定義している", () => {
    const required = [
      "overview",
      "basicInfo",
      "safety",
      "bestSeason",
      "budget",
      "preparation",
      "modelCourses",
      "attractions",
    ];
    for (const key of required) {
      expect(labels.sections).toHaveProperty(key);
      expect(labels.sections[key].length).toBeGreaterThan(0);
    }
  });

  it("basicInfoのラベルは国データのbasicInfoフィールドと一致する", () => {
    expect(Object.keys(labels.basicInfo).sort()).toEqual(
      ["currency", "language", "timezone", "visa"].sort()
    );
    for (const v of Object.values(labels.basicInfo)) {
      expect(typeof v).toBe("string");
      expect(v.length).toBeGreaterThan(0);
    }
  });

  it("ナビゲーションラベル（home/about）を持つ", () => {
    expect(labels.nav).toHaveProperty("home");
    expect(labels.nav).toHaveProperty("about");
  });
});
