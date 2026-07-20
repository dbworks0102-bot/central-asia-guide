import { describe, it, expect } from "vitest";
import articles from "../../src/data/articles.js";
import { buildArticleMeta, buildArticleJsonLd } from "../../src/utils/meta.js";
import {
  selectPublished,
  findPublished,
  getPublishedArticles,
  getPublishedArticleBySlug,
} from "../../src/core/getArticles.js";

// テスト用のダミー下書き/公開記事（コア関数の純粋ロジック検証用に注入する）
const draft = { slug: "secret-draft", title: "下書き", status: "draft", publishDate: "2026-06-01" };
const pubA = { slug: "pub-a", title: "公開A", status: "published", publishDate: "2026-01-01" };
const pubB = { slug: "pub-b", title: "公開B", status: "published", publishDate: "2026-05-01" };

describe("core/getArticles - selectPublished", () => {
  it("published のみを残し、publishDate 降順で並べる", () => {
    const result = selectPublished([pubA, draft, pubB]);
    expect(result.map((a) => a.slug)).toEqual(["pub-b", "pub-a"]);
  });

  it("draft は一切含めない", () => {
    const result = selectPublished([draft]);
    expect(result).toHaveLength(0);
  });
});

describe("core/getArticles - findPublished", () => {
  it("published 記事は slug で取得できる", () => {
    expect(findPublished([pubA, draft], "pub-a")).toBe(pubA);
  });

  it("draft の slug を直接指定しても null を返す（下書きは見えない）", () => {
    expect(findPublished([pubA, draft], "secret-draft")).toBeNull();
  });

  it("存在しない slug は null を返す", () => {
    expect(findPublished([pubA], "nope")).toBeNull();
  });

  it("不正な引数は null を返す", () => {
    expect(findPublished([pubA], "")).toBeNull();
    expect(findPublished([pubA], undefined)).toBeNull();
  });
});

describe("core/getArticles - 実データAPI", () => {
  it("getPublishedArticles は published 記事のみを返す", () => {
    const list = getPublishedArticles();
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((a) => a.status === "published")).toBe(true);
  });

  it("getPublishedArticleBySlug は実在の公開記事を返す", () => {
    const list = getPublishedArticles();
    const first = list[0];
    expect(getPublishedArticleBySlug(first.slug)).toBe(first);
  });
});

describe("utils/meta - buildArticleMeta", () => {
  it("記事データから title/description/OGP を生成し、絶対URLに変換する", () => {
    const article = getPublishedArticles()[0];
    const m = buildArticleMeta(article);
    expect(m.title).toContain(article.title);
    expect(m.description).toBe(article.description);
    expect(m.canonicalUrl).toBe(`https://tabi-uzbekistan.com/articles/${article.slug}`);
    expect(m.og.image).toBe(`https://tabi-uzbekistan.com${article.heroImage}`);
    expect(m.og.type).toBe("article");
    expect(m.twitter.card).toBe("summary_large_image");
  });
});

describe("utils/meta - buildArticleJsonLd", () => {
  it("Article 相当の JSON-LD を生成する", () => {
    const article = getPublishedArticles()[0];
    const ld = buildArticleJsonLd(article);
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("Article");
    expect(ld.headline).toBe(article.title);
    expect(ld.datePublished).toBe(article.publishDate);
    expect(ld.image).toBe(`https://tabi-uzbekistan.com${article.heroImage}`);
    expect(ld.author).toEqual({ "@type": "Organization", name: "ウズベキスタン旅行ガイド" });
  });
});

describe("data/articles - データ整合性", () => {
  it("status は published / draft のいずれか", () => {
    for (const a of articles) {
      expect(["published", "draft"]).toContain(a.status);
    }
  });

  it("slug は一意である", () => {
    const slugs = articles.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("全 published 記事が必須フィールドを備える", () => {
    const published = articles.filter((a) => a.status === "published");
    expect(published.length).toBeGreaterThan(0);
    for (const a of published) {
      expect(typeof a.slug).toBe("string");
      expect(a.slug.length).toBeGreaterThan(0);
      expect(typeof a.title).toBe("string");
      expect(a.title.length).toBeGreaterThan(0);
      expect(typeof a.description).toBe("string");
      expect(a.description.length).toBeGreaterThan(0);
      expect(Array.isArray(a.keywords)).toBe(true);
      expect(a.keywords.length).toBeGreaterThan(0);
      expect(typeof a.heroImage).toBe("string");
      expect(a.heroImage.startsWith("/images/uzbekistan/")).toBe(true);
      // ISO日付（YYYY-MM-DD）
      expect(a.publishDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Array.isArray(a.body)).toBe(true);
      expect(a.body.length).toBeGreaterThan(0);
    }
  });
});
