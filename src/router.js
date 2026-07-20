// History APIベースの簡易クライアントサイドルーター。
// ルート定義: "/" → ウズベキスタンガイド（トップ）, "/about" → About, "*" → 404
import { clear } from "./utils/dom.js";
import { getCountryData } from "./core/getCountryData.js";
import { getPublishedArticles, getPublishedArticleBySlug } from "./core/getArticles.js";
import { buildMeta, applyMeta } from "./utils/meta.js";
import { resolveRouteMeta, HOME_COUNTRY_ID } from "./core/routeMeta.js";
import { renderHeader } from "./ui/components/renderHeader.js";
import { renderFooter } from "./ui/components/renderFooter.js";
import { renderCountryPage } from "./ui/renderCountryPage.js";
import { renderAboutPage } from "./ui/renderAboutPage.js";
import { renderArticleListPage } from "./ui/renderArticleListPage.js";
import { renderArticleDetailPage } from "./ui/renderArticleDetailPage.js";
import { renderNotFound } from "./ui/renderNotFound.js";

// path に対応するビュー（DOMNode）を解決する。メタ情報は resolveRouteMeta（DRY・core/routeMeta.js）に委譲。
function resolveView(path) {
  if (path === "/" || path === "") return renderCountryPage(getCountryData(HOME_COUNTRY_ID));
  if (path === "/about") return renderAboutPage();
  // コラム一覧：published 記事のみ・publishDate 降順（フィルタは core/getArticles.js）
  if (path === "/articles") return renderArticleListPage(getPublishedArticles());

  // コラム詳細：/articles/:slug。published なら詳細、そうでなければ 404 へフォールスルー
  const articleMatch = path.match(/^\/articles\/([^/]+)\/?$/);
  if (articleMatch) {
    const article = getPublishedArticleBySlug(decodeURIComponent(articleMatch[1]));
    if (article) return renderArticleDetailPage(article);
  }

  return renderNotFound();
}

// path から { view: DOMNode, meta, jsonLd } を解決する。
// メタは core/routeMeta.js と共有（プリレンダリングと同一ロジック）。null＝404フォールバック。
function resolve(path) {
  const routeMeta = resolveRouteMeta(path);
  const fallbackMeta = {
    meta: buildMeta({ title: "404 Not Found", description: "ページが見つかりませんでした。", url: path }),
    jsonLd: null,
  };
  const { meta, jsonLd } = routeMeta || fallbackMeta;
  return { view: resolveView(path), meta, jsonLd };
}

export function createRouter(rootEl) {
  // 静的なヘッダー/フッターとページ差し替え用コンテナを用意
  const header = renderHeader();
  const main = document.createElement("main");
  main.className = "site-main";
  const footer = renderFooter();

  clear(rootEl);
  rootEl.appendChild(header);
  rootEl.appendChild(main);
  rootEl.appendChild(footer);

  function render(path) {
    const { view, meta, jsonLd } = resolve(path);
    clear(main);
    main.appendChild(view);
    applyMeta(meta, jsonLd);
    window.scrollTo(0, 0);
  }

  function navigate(path, { replace = false } = {}) {
    if (replace) history.replaceState({}, "", path);
    else history.pushState({}, "", path);
    render(path);
  }

  // 内部リンク（data-link）を委譲クリックで処理
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-link]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("mailto:")) return;
    e.preventDefault();
    if (href !== window.location.pathname) navigate(href);
  });

  // ブラウザの戻る/進む
  window.addEventListener("popstate", () => render(window.location.pathname));

  return {
    start() {
      render(window.location.pathname);
    },
    navigate,
  };
}

export default createRouter;
