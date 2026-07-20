// History APIベースの簡易クライアントサイドルーター。
// ルート定義: "/" → ウズベキスタンガイド（トップ）, "/about" → About, "*" → 404
//
// コード分割（Step 10-5）：記事関連コード（getArticles / renderArticleListPage /
// renderArticleDetailPage）と、記事データを内包する routeMeta は動的 import() で分離する。
// これにより "/" や "/about" しか訪れないユーザーは記事関連コードを初期バンドルで
// ダウンロードせずに済む（記事コードは /articles・/articles/:slug を訪れたときだけ取得）。
import { clear } from "./utils/dom.js";
import { getCountryData } from "./core/getCountryData.js";
import { buildMeta, applyMeta } from "./utils/meta.js";
import { renderHeader } from "./ui/components/renderHeader.js";
import { renderFooter } from "./ui/components/renderFooter.js";
import { renderCountryPage } from "./ui/renderCountryPage.js";
import { renderAboutPage } from "./ui/renderAboutPage.js";
import { renderNotFound } from "./ui/renderNotFound.js";

// 記事ルート（/articles・/articles/:slug）のビューを動的 import で解決する。
// 記事コード（getArticles・renderArticle*）は本関数が呼ばれたとき＝実際に記事ルートを
// 訪れたときにだけダウンロードされる。published でない詳細は null を返し、呼び出し側で 404 へ。
async function resolveArticleView(path) {
  // コラム一覧：published 記事のみ・publishDate 降順（フィルタは core/getArticles.js）
  if (path === "/articles") {
    const [{ getPublishedArticles }, { renderArticleListPage }] = await Promise.all([
      import("./core/getArticles.js"),
      import("./ui/renderArticleListPage.js"),
    ]);
    return renderArticleListPage(getPublishedArticles());
  }

  // コラム詳細：/articles/:slug。published なら詳細、そうでなければ null（→ 404 フォールスルー）
  const articleMatch = path.match(/^\/articles\/([^/]+)\/?$/);
  if (articleMatch) {
    const { getPublishedArticleBySlug } = await import("./core/getArticles.js");
    const article = getPublishedArticleBySlug(decodeURIComponent(articleMatch[1]));
    if (article) {
      const { renderArticleDetailPage } = await import("./ui/renderArticleDetailPage.js");
      return renderArticleDetailPage(article);
    }
  }

  return null;
}

// path に対応するビュー（DOMNode）を解決する。記事ルートのみ動的 import（上記）へ委譲。
// homeCountryId は resolve() が routeMeta から受け取った定数（再 import を避けるため引き回す）。
async function resolveView(path, homeCountryId) {
  if (path === "/" || path === "") return renderCountryPage(getCountryData(homeCountryId));
  if (path === "/about") return renderAboutPage();

  if (path === "/articles" || /^\/articles\/[^/]+\/?$/.test(path)) {
    const view = await resolveArticleView(path);
    if (view) return view;
  }

  return renderNotFound();
}

// path から { view: DOMNode, meta, jsonLd } を解決する。
// メタは core/routeMeta.js と共有（プリレンダリングと同一ロジック・DRY）。routeMeta は記事データを
// 内包するため動的 import し、初期バンドルから切り離す。null＝404フォールバック。
async function resolve(path) {
  const { resolveRouteMeta, HOME_COUNTRY_ID } = await import("./core/routeMeta.js");
  const routeMeta = resolveRouteMeta(path);
  const fallbackMeta = {
    meta: buildMeta({ title: "404 Not Found", description: "ページが見つかりませんでした。", url: path }),
    jsonLd: null,
  };
  const { meta, jsonLd } = routeMeta || fallbackMeta;
  const view = await resolveView(path, HOME_COUNTRY_ID);
  return { view, meta, jsonLd };
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

  async function render(path) {
    const { view, meta, jsonLd } = await resolve(path);
    clear(main);
    main.appendChild(view);
    applyMeta(meta, jsonLd);
    window.scrollTo(0, 0);
  }

  function navigate(path, { replace = false } = {}) {
    if (replace) history.replaceState({}, "", path);
    else history.pushState({}, "", path);
    return render(path);
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
      return render(window.location.pathname);
    },
    navigate,
  };
}

export default createRouter;
