// sitemap.xml 自動生成スクリプト（Node実行）。
// 対象：既知の静的ルート（/, /about, /articles）＋ published 記事のみ（draft は絶対に含めない）。
// すべて絶対URL（SITE_URL）で出力し、public/sitemap.xml に書き出す。
// package.json の prebuild で自動実行される。
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { getPublishedArticles } from "../src/core/getArticles.js";

const SITE_URL = "https://tabi-uzbekistan.com";
const STATIC_ROUTES = ["/", "/about", "/articles"];

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, "../public/sitemap.xml");

// XML特殊文字のエスケープ（URLに & が含まれる場合の安全策）
function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function urlEntry(loc, lastmod) {
  const lines = [`    <loc>${escapeXml(loc)}</loc>`];
  if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
  return `  <url>\n${lines.join("\n")}\n  </url>`;
}

function buildSitemap() {
  const entries = [];

  for (const route of STATIC_ROUTES) {
    entries.push(urlEntry(`${SITE_URL}${route}`));
  }

  for (const article of getPublishedArticles()) {
    entries.push(urlEntry(`${SITE_URL}/articles/${article.slug}`, article.publishDate));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join(
    "\n"
  )}\n</urlset>\n`;
}

const xml = buildSitemap();
writeFileSync(OUTPUT_PATH, xml, { encoding: "utf8" });
console.log(`sitemap.xml generated: ${OUTPUT_PATH} (${getPublishedArticles().length} article(s))`);
