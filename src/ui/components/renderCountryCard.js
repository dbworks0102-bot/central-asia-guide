// 国選択カード（トップページ用）
import { el } from "../../utils/dom.js";
import { labels } from "../../utils/labels.js";

export function renderCountryCard(country) {
  return el("a", { class: "country-card", href: `/${country.id}`, "data-link": "" }, [
    el("img", {
      class: "country-card__img",
      src: country.heroImage,
      alt: `${country.name}の風景`,
      loading: "lazy",
    }),
    el("div", { class: "country-card__body" }, [
      el("h3", { class: "country-card__name" }, country.name),
      el("p", { class: "country-card__tagline" }, country.tagline),
      el("span", { class: "country-card__cta" }, labels.common.selectCountry),
    ]),
  ]);
}

export default renderCountryCard;
