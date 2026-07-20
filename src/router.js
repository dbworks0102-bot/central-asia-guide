// History APIベースの簡易クライアントサイドルーター。
// ルート定義: "/" → ウズベキスタンガイド（トップ）, "/about" → About, "*" → 404
import { clear } from "./utils/dom.js";
import { getCountryData } from "./core/getCountryData.js";
import { buildMeta, buildCountryJsonLd, applyMeta } from "./utils/meta.js";
import { labels } from "./utils/labels.js";
import { renderHeader } from "./ui/components/renderHeader.js";
import { renderFooter } from "./ui/components/renderFooter.js";
import { renderCountryPage } from "./ui/renderCountryPage.js";
import { renderAboutPage } from "./ui/renderAboutPage.js";
import { renderNotFound } from "./ui/renderNotFound.js";

// ウズベキスタン専門サイト：トップページはウズベキスタンのガイドそのもの。
const HOME_COUNTRY_ID = "uzbekistan";

// path から { view: DOMNode, meta, jsonLd } を解決する
function resolve(path) {
  if (path === "/" || path === "") {
    const country = getCountryData(HOME_COUNTRY_ID);
    return {
      view: renderCountryPage(country),
      meta: buildMeta({
        title: labels.siteName,
        description: country.overview,
        url: "/",
        image: country.heroImage,
      }),
      jsonLd: buildCountryJsonLd(country),
    };
  }

  if (path === "/about") {
    return {
      view: renderAboutPage(),
      meta: buildMeta({ title: labels.nav.about, description: "当サイトの目的と運営方針について。", url: "/about" }),
      jsonLd: null,
    };
  }

  // フォールバック 404
  return {
    view: renderNotFound(),
    meta: buildMeta({ title: "404 Not Found", description: "ページが見つかりませんでした。", url: path }),
    jsonLd: null,
  };
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
