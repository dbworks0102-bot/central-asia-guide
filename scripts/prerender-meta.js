// ビルド後プリレンダリング（Node 実行）。
// vite build が生成した dist/index.html を土台に、各公開ルートごとに
// ルート専用の <title>・<meta>（OGP/Twitter）・canonical・JSON-LD を <head> に埋め込んだ
// 静的 HTML を dist/ 配下へ書き出す。<body> は既存 SPA テンプレートのまま（JS でハイドレーション）。
//
// 目的：JavaScript を実行しない OGP スクレイパー（X / LINE 等）や検索エンジンに、
//       記事ごとに正しいメタ情報が載った生 HTML を返す。
//
// DRY：メタ生成ロジックは src/core/routeMeta.js（→ utils/meta.js・core/getArticles.js）を再利用。
//      対象パスも getPrerenderPaths() 経由で published 記事のみに限定（draft は絶対に含めない）。
//
// 出力先（拡張子なしパスへ .html を解決する Vercel / vite preview(sirv) の挙動に合わせたフラットな .html 形式）：
//   /                       -> dist/index.html
//   /about                  -> dist/about.html
//   /articles               -> dist/articles.html
//   /articles/<slug>        -> dist/articles/<slug>.html
// ※ ディレクトリ index.html 形式（例 dist/about/index.html）は sirv では末尾スラッシュ無しの
//   リクエストで解決されず SPA フォールバックしてしまうため、フラットな .html を採用する。
//
// package.json の "build"（vite build の後段）で自動実行される。
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { resolveRouteMeta, getPrerenderPaths } from "../src/core/routeMeta.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(__dirname, "../dist");
const TEMPLATE_PATH = join(DIST_DIR, "index.html");

// HTML 属性値のエスケープ（" と & と < > を無害化）
function escapeAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// JSON-LD 本文のエスケープ（</script> によるスクリプト脱出を防止）
function escapeJsonLd(jsonLd) {
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}

// meta / jsonLd から <head> に差し込む HTML 断片を生成する
function buildHeadHtml(meta, jsonLd) {
  const lines = [
    `<title>${escapeAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    `<link rel="canonical" href="${escapeAttr(meta.canonicalUrl)}" />`,
    `<meta property="og:type" content="${escapeAttr(meta.og.type)}" />`,
    `<meta property="og:title" content="${escapeAttr(meta.og.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.og.description)}" />`,
    `<meta property="og:image" content="${escapeAttr(meta.og.image)}" />`,
    `<meta property="og:url" content="${escapeAttr(meta.og.url)}" />`,
    `<meta property="og:site_name" content="${escapeAttr(meta.og.siteName)}" />`,
    `<meta name="twitter:card" content="${escapeAttr(meta.twitter.card)}" />`,
    `<meta name="twitter:title" content="${escapeAttr(meta.twitter.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.twitter.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(meta.twitter.image)}" />`,
  ];
  if (jsonLd) {
    lines.push(`<script type="application/ld+json" data-meta="jsonld">${escapeJsonLd(jsonLd)}</script>`);
  }
  return lines.join("\n    ");
}

// テンプレート HTML から既存のメタ系タグ（title / description / og:* / twitter:* / canonical）を除去する。
// これらはトップページ用の汎用値なので、ルート専用のものへ置き換えるために一度剥がす。
function stripExistingMeta(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+property=["']og:[^"']*["'][^>]*>\s*/gi, "")
    .replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*>\s*/gi, "")
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, "");
}

// テンプレートにルート専用メタを埋め込んだ完成 HTML を返す
function renderHtml(template, meta, jsonLd) {
  const stripped = stripExistingMeta(template);
  const head = buildHeadHtml(meta, jsonLd);
  if (!stripped.includes("</head>")) {
    throw new Error("dist/index.html に </head> が見つかりません。テンプレートの前提が壊れています。");
  }
  return stripped.replace("</head>", `    ${head}\n  </head>`);
}

// パス（例 "/articles/foo"）をフラットな出力ファイルパス（dist/articles/foo.html）へ変換する
function outputPathFor(routePath) {
  if (routePath === "/" || routePath === "") return TEMPLATE_PATH;
  const clean = routePath.replace(/^\/+|\/+$/g, "");
  return join(DIST_DIR, `${clean}.html`);
}

function main() {
  const template = readFileSync(TEMPLATE_PATH, "utf8");
  const paths = getPrerenderPaths();
  let count = 0;

  for (const routePath of paths) {
    const routeMeta = resolveRouteMeta(routePath);
    if (!routeMeta) {
      // getPrerenderPaths と resolveRouteMeta の整合が崩れた場合の防御（通常は起きない）
      console.warn(`prerender: skip (no meta): ${routePath}`);
      continue;
    }
    const outPath = outputPathFor(routePath);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, renderHtml(template, routeMeta.meta, routeMeta.jsonLd), { encoding: "utf8" });
    count += 1;
    console.log(`prerender: ${routePath} -> ${outPath}`);
  }

  console.log(`prerender-meta: ${count} page(s) generated into dist/`);
}

main();
