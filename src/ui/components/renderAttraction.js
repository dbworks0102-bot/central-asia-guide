// 観光地カード。画像は objectFit:contain のため dominantColor を背景色に設定する
// （メモリ「画像背景色ルール」準拠）。alt を必ず付与（アクセシビリティ）。
import { el } from "../../utils/dom.js";

export function renderAttraction(attraction) {
  return el("article", { class: "attraction-card" }, [
    el(
      "div",
      {
        class: "attraction-card__media",
        style: { backgroundColor: attraction.dominantColor },
      },
      [
        el("img", {
          class: "attraction-card__img",
          src: attraction.image,
          alt: `${attraction.name}（${attraction.city}）`,
          loading: "lazy",
        }),
      ]
    ),
    el("div", { class: "attraction-card__body" }, [
      el("h3", { class: "attraction-card__name" }, attraction.name),
      el("span", { class: "attraction-card__city" }, attraction.city),
      el("p", { class: "attraction-card__desc" }, attraction.description),
    ]),
  ]);
}

export default renderAttraction;
