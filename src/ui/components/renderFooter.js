// サイトフッター
import { el } from "../../utils/dom.js";
import { labels } from "../../utils/labels.js";

export function renderFooter() {
  const year = new Date().getFullYear();
  return el("footer", { class: "site-footer" }, [
    el("div", { class: "container" }, [
      el("p", {}, `© ${year} ${labels.siteName}`),
      el("nav", { class: "footer-nav", "aria-label": "フッターナビゲーション" }, [
        el("a", { href: "/", "data-link": "" }, labels.nav.home),
        el("a", { href: "/about", "data-link": "" }, labels.nav.about),
      ]),
    ]),
  ]);
}

export default renderFooter;
