// コラム詳細ページ。渡される記事は必ず published（フィルタは core/getArticles.js で担保）。
// body ブロック（heading/paragraph/list）を描画し、relatedLinks からサイト内部リンク導線を出力する。
import { el } from "../utils/dom.js";
import { labels } from "../utils/labels.js";
import { formatDate } from "../utils/formatDate.js";

// ヒーローのフォールバック背景色（renderCountryPage と統一）
const HERO_BG_COLOR = "#0f2a3f";

// body ブロック1件を対応するDOM要素に変換する
function renderBlock(block) {
  if (block.type === "heading") {
    return el("h2", { class: "article-body__heading" }, block.text);
  }
  if (block.type === "list") {
    return el("ul", { class: "bullet-list" }, block.items.map((t) => el("li", {}, t)));
  }
  // 既定は段落
  return el("p", { class: "article-body__paragraph" }, block.text);
}

// relatedLinks からサイト内部リンク（data-link で委譲遷移）を出力する
function renderRelatedLinks(relatedLinks) {
  if (!Array.isArray(relatedLinks) || relatedLinks.length === 0) return null;
  return el("nav", { class: "article-related", "aria-label": labels.articles.relatedTitle }, [
    el("h2", { class: "sub-title" }, labels.articles.relatedTitle),
    el(
      "ul",
      { class: "bullet-list" },
      relatedLinks.map((link) =>
        el("li", {}, [el("a", { href: link.url, "data-link": "" }, link.label)])
      )
    ),
  ]);
}

export function renderArticleDetailPage(article) {
  return el("article", { class: "page page-article-detail" }, [
    // ヒーロー
    el("section", { class: "country-hero", style: { backgroundColor: HERO_BG_COLOR } }, [
      el("img", {
        class: "country-hero__img",
        src: article.heroImage,
        alt: article.title,
        // above-the-fold の LCP 候補のため遅延読み込みしない（Core Web Vitals 対策）
        loading: "eager",
      }),
      el("div", { class: "country-hero__overlay container" }, [
        el("time", { class: "article-detail__date", datetime: article.publishDate }, formatDate(article.publishDate)),
        el("h1", { class: "country-hero__title" }, article.title),
      ]),
    ]),

    el("div", { class: "container article-body" }, [
      el("p", { class: "lead" }, article.description),
      ...article.body.map((block) => renderBlock(block)),
      renderRelatedLinks(article.relatedLinks),
      el("p", { class: "article-back" }, [
        el("a", { href: "/articles", "data-link": "", class: "button" }, labels.articles.backToList),
      ]),
    ]),
  ]);
}

export default renderArticleDetailPage;
