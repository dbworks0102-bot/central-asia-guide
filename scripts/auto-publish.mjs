// 3日に1本の自動公開ローテーション（Windowsタスクスケジューラ→auto-publish.ps1から呼ばれる想定）。
// src/data/articles.js の出現順（=作成順）で最初に見つかった status:"draft" を published に切り替える。
// フォーマット・コメント・他記事を壊さないよう、AST変換ではなく該当ブロックだけの文字列置換で行う。
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_PATH = resolve(__dirname, "../src/data/articles.js");

// レビュー（docs/pending-review.md 2026-07-27）で要修正と判定された記事はローテーション対象外。
// 本文を修正し次第、ここから外せば通常どおり順番に含まれる。
export const SKIP_SLUGS = ["khiva-taxi-app-transport-highlights"];

export function publishNextDraft(sourceText, skipSlugs = SKIP_SLUGS, today = new Date().toISOString().slice(0, 10)) {
  const slugMatches = [...sourceText.matchAll(/slug: "([^"]+)",/g)];

  for (let i = 0; i < slugMatches.length; i++) {
    const slug = slugMatches[i][1];
    if (skipSlugs.includes(slug)) continue;

    const blockStart = slugMatches[i].index;
    const blockEnd = i + 1 < slugMatches.length ? slugMatches[i + 1].index : sourceText.length;
    const block = sourceText.slice(blockStart, blockEnd);
    if (!/status: "draft",/.test(block)) continue;

    const newBlock = block.replace(
      /publishDate: "[^"]*",(\s*)status: "draft",/,
      (_m, ws) => `publishDate: "${today}",${ws}status: "published",`
    );
    if (newBlock === block) {
      throw new Error(`slug "${slug}" は status:"draft" だが publishDate/status のパターン置換に失敗した`);
    }

    return { slug, sourceText: sourceText.slice(0, blockStart) + newBlock + sourceText.slice(blockEnd) };
  }

  return null;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const src = readFileSync(ARTICLES_PATH, "utf8");
  const result = publishNextDraft(src);
  if (!result) {
    console.log("NONE");
  } else {
    writeFileSync(ARTICLES_PATH, result.sourceText, "utf8");
    console.log(result.slug);
  }
}
