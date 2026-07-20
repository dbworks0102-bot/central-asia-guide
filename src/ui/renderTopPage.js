// トップページ：サイト紹介 + 国選択カード一覧
import { el } from "../utils/dom.js";
import { labels } from "../utils/labels.js";
import { renderCountryCard } from "./components/renderCountryCard.js";

export function renderTopPage(countries) {
  return el("div", { class: "page page-top" }, [
    el("section", { class: "hero" }, [
      el("div", { class: "container" }, [
        el("h1", { class: "hero__title" }, labels.siteName),
        el("p", { class: "hero__lead" }, labels.tagline),
      ]),
    ]),
    el("section", { class: "container country-select" }, [
      el("h2", { class: "section-title" }, labels.common.selectCountry),
      el(
        "div",
        { class: "country-grid" },
        countries.map((c) => renderCountryCard(c))
      ),
    ]),
  ]);
}

export default renderTopPage;
