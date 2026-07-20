// 404 フォールバックページ
import { el } from "../utils/dom.js";
import { labels } from "../utils/labels.js";

export function renderNotFound() {
  return el("div", { class: "page page-404 container" }, [
    el("h1", { class: "notfound__code" }, "404"),
    el("p", { class: "notfound__msg" }, "お探しのページは見つかりませんでした。"),
    el("p", {}, [
      el("a", { href: "/", "data-link": "", class: "button" }, labels.common.backToTop),
    ]),
  ]);
}

export default renderNotFound;
