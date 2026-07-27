import { describe, it, expect } from "vitest";
import { publishNextDraft } from "../../scripts/auto-publish.mjs";

function article({ slug, status }) {
  return `  {
    slug: "${slug}",
    title: "タイトル",
    description: "説明",
    keywords: ["キーワード"],
    heroImage: "/images/uzbekistan/hero.jpg",
    publishDate: "2026-07-21",
    status: "${status}",
    body: [{ type: "paragraph", text: "本文" }],
    relatedLinks: [],
  },
`;
}

function source(articles) {
  return `export const articles = [\n${articles.join("")}];\n\nexport default articles;\n`;
}

describe("scripts/auto-publish - publishNextDraft", () => {
  it("出現順で最初のdraftをpublishedに切り替え、publishDateを更新する", () => {
    const src = source([
      article({ slug: "a", status: "published" }),
      article({ slug: "b", status: "draft" }),
      article({ slug: "c", status: "draft" }),
    ]);
    const result = publishNextDraft(src, [], "2026-08-01");
    expect(result.slug).toBe("b");
    expect(result.sourceText).toContain('slug: "b",\n    title: "タイトル"');
    expect(result.sourceText).toMatch(/slug: "b",[\s\S]*?publishDate: "2026-08-01",\s*status: "published",/);
    // 他の記事は変更されない
    expect(result.sourceText).toMatch(/slug: "a",[\s\S]*?status: "published",/);
    expect(result.sourceText).toMatch(/slug: "c",[\s\S]*?status: "draft",/);
  });

  it("skipSlugsに含まれるslugは飛ばして次のdraftを選ぶ", () => {
    const src = source([
      article({ slug: "a", status: "draft" }),
      article({ slug: "b", status: "draft" }),
    ]);
    const result = publishNextDraft(src, ["a"], "2026-08-01");
    expect(result.slug).toBe("b");
  });

  it("公開可能なdraftが無ければnullを返す", () => {
    const src = source([
      article({ slug: "a", status: "published" }),
      article({ slug: "b", status: "draft" }),
    ]);
    const result = publishNextDraft(src, ["b"], "2026-08-01");
    expect(result).toBeNull();
  });

  it("全記事がpublishedならnullを返す", () => {
    const src = source([article({ slug: "a", status: "published" })]);
    expect(publishNextDraft(src, [], "2026-08-01")).toBeNull();
  });
});
