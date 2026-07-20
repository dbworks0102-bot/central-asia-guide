import { describe, it, expect } from "vitest";
import { buildMeta, buildCountryMeta, buildCountryJsonLd } from "../../src/utils/meta.js";
import { getCountryData } from "../../src/core/getCountryData.js";

describe("buildMeta", () => {
  it("与えた値からtitle/description/OGPを正規化して返す", () => {
    const m = buildMeta({
      title: "テストタイトル",
      description: "説明文",
      url: "/uzbekistan",
      image: "/images/uzbekistan/hero.jpg",
      type: "article",
    });
    expect(m.title).toContain("テストタイトル");
    expect(m.description).toBe("説明文");
    expect(m.og.title).toContain("テストタイトル");
    expect(m.og.image).toBe("/images/uzbekistan/hero.jpg");
    expect(m.og.type).toBe("article");
    expect(m.twitter.card).toBe("summary_large_image");
  });

  it("type未指定時は website にフォールバックする", () => {
    const m = buildMeta({ title: "T", description: "D" });
    expect(m.og.type).toBe("website");
  });
});

describe("buildCountryMeta", () => {
  it("国データからtitle/description/OGP画像を生成する", () => {
    const uz = getCountryData("uzbekistan");
    const m = buildCountryMeta(uz);
    expect(m.title).toContain("ウズベキスタン");
    expect(m.og.image).toBe(uz.heroImage);
    expect(m.description.length).toBeGreaterThan(0);
  });
});

describe("buildCountryJsonLd", () => {
  it("TouristDestination相当のJSON-LDを生成する", () => {
    const uz = getCountryData("uzbekistan");
    const ld = buildCountryJsonLd(uz);
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("TouristDestination");
    expect(ld.name).toBe(uz.nameEn);
  });
});
