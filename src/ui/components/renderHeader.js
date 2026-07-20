// サイトヘッダー（ナビゲーション）。内部リンクは data-link で委譲処理される。
import { el } from "../../utils/dom.js";
import { labels } from "../../utils/labels.js";

export function renderHeader() {
  return el("header", { class: "site-header" }, [
    el("div", { class: "container header-inner" }, [
      el("a", { href: "/", "data-link": "", class: "site-logo" }, labels.siteName),
      el("nav", { class: "site-nav", "aria-label": "メインナビゲーション" }, [
        el("a", { href: "/", "data-link": "" }, labels.nav.home),
        el("a", { href: "/articles", "data-link": "" }, labels.nav.articles),
        el("a", { href: "/about", "data-link": "" }, labels.nav.about),
      ]),
    ]),
  ]);
}

export default renderHeader;
