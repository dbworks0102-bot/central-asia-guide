// ルート（パス）→ メタ情報（meta / jsonLd）の解決を一元化する DOM 非依存モジュール。
// ブラウザ側ルーター（src/router.js）とビルド時プリレンダリング（scripts/prerender-meta.js）の
// 両方が本モジュールを利用することで、ルートごとのメタ生成ロジックを1箇所に保つ（DRY）。
//
// 純粋関数・document 非依存なので Node からも安全に import できる。
import { getCountryData } from "./getCountryData.js";
import { getPublishedArticles, getPublishedArticleBySlug } from "./getArticles.js";
import {
  buildMeta,
  buildCountryJsonLd,
  buildArticleMeta,
  buildArticleJsonLd,
} from "../utils/meta.js";
import { labels } from "../utils/labels.js";

// ウズベキスタン専門サイト：トップページはウズベキスタンのガイドそのもの。
export const HOME_COUNTRY_ID = "uzbekistan";
const ABOUT_DESCRIPTION = "当サイトの目的と運営方針について。";

// path から { meta, jsonLd } を解決する。
// 既知の公開ルート（/・/about・/articles・published な /articles/:slug）に一致すればメタを返し、
// 未知・未公開（draft）・404 相当のパスでは null を返す（＝プリレンダリング対象外）。
export function resolveRouteMeta(path) {
  if (path === "/" || path === "") {
    const country = getCountryData(HOME_COUNTRY_ID);
    return {
      meta: buildMeta({
        title: "ウズベキスタン旅行ガイド｜サマルカンド・ブハラ・ヒヴァの観光モデルコース",
        description: country.overview,
        url: "/",
        image: country.heroImage,
      }),
      jsonLd: buildCountryJsonLd(country),
    };
  }

  if (path === "/about") {
    return {
      meta: buildMeta({ title: labels.nav.about, description: ABOUT_DESCRIPTION, url: "/about" }),
      jsonLd: null,
    };
  }

  if (path === "/articles") {
    return {
      meta: buildMeta({
        title: labels.articles.listTitle,
        description: labels.articles.listLead,
        url: "/articles",
      }),
      jsonLd: null,
    };
  }

  const articleMatch = path.match(/^\/articles\/([^/]+)\/?$/);
  if (articleMatch) {
    const slug = decodeURIComponent(articleMatch[1]);
    const article = getPublishedArticleBySlug(slug);
    if (article) {
      return { meta: buildArticleMeta(article), jsonLd: buildArticleJsonLd(article) };
    }
  }

  return null;
}

// プリレンダリング対象となる全ルートのパス一覧を返す。
// 静的ルート（/・/about・/articles）＋ published 記事の詳細 URL のみ（draft は getPublishedArticles が除外）。
export function getPrerenderPaths() {
  const staticPaths = ["/", "/about", "/articles"];
  const articlePaths = getPublishedArticles().map((a) => `/articles/${a.slug}`);
  return [...staticPaths, ...articlePaths];
}

export default { resolveRouteMeta, getPrerenderPaths, HOME_COUNTRY_ID };
