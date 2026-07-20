// 国別ページ：概要・基本情報・治安・ベストシーズン・費用・渡航準備・モデルコース・観光地
import { el } from "../utils/dom.js";
import { labels } from "../utils/labels.js";
import { renderModelCourse } from "./components/renderModelCourse.js";
import { renderAttraction } from "./components/renderAttraction.js";

// ヒーローのフォールバック背景色（CSS変数 --color-primary-dark と一致）。
// 画像ロード前でもオーバーレイ文字の可読性を確保するため inline 指定する。
const HERO_BG_COLOR = "#0f2a3f";

// 汎用セクションラッパ
function section(titleKey, children) {
  return el("section", { class: "country-section" }, [
    el("h2", { class: "section-title" }, labels.sections[titleKey]),
    ...(Array.isArray(children) ? children : [children]),
  ]);
}

function basicInfoTable(basicInfo) {
  const rows = Object.keys(labels.basicInfo).map((key) =>
    el("tr", {}, [
      el("th", { scope: "row" }, labels.basicInfo[key]),
      el("td", {}, basicInfo[key]),
    ])
  );
  return el("table", { class: "info-table" }, [el("tbody", {}, rows)]);
}

function list(items) {
  return el("ul", { class: "bullet-list" }, items.map((t) => el("li", {}, t)));
}

export function renderCountryPage(country) {
  return el("article", { class: "page page-country" }, [
    // ヒーロー
    el(
      "section",
      { class: "country-hero", style: { backgroundColor: HERO_BG_COLOR } },
      [
        el("img", {
          class: "country-hero__img",
          src: country.heroImage,
          alt: `${country.name}の風景`,
          loading: "lazy",
        }),
        el("div", { class: "country-hero__overlay container" }, [
          el("h1", { class: "country-hero__title" }, country.name),
          el("p", { class: "country-hero__tagline" }, country.tagline),
        ]),
      ]
    ),

    el("div", { class: "container country-body" }, [
      // 概要
      section("overview", el("p", { class: "lead" }, country.overview)),

      // 基本情報
      section("basicInfo", basicInfoTable(country.basicInfo)),

      // 治安
      section("safety", [
        el("p", { class: "safety-level" }, `${labels.common.safetyLevel}: ${country.safety.level}`),
        el("p", {}, country.safety.summary),
        list(country.safety.notes),
      ]),

      // ベストシーズン
      section("bestSeason", [
        el("p", { class: "season-recommended" }, country.bestSeason.recommended),
        el("p", {}, country.bestSeason.reason),
      ]),

      // 費用感
      section("budget", [
        el("p", { class: "budget-daily" }, `${labels.common.dailyBudget}: ${country.budget.daily}`),
        el(
          "ul",
          { class: "bullet-list" },
          country.budget.breakdown.map((b) => el("li", {}, `${b.item}: ${b.cost}`))
        ),
        ...(country.budget.note ? [el("p", { class: "budget-note" }, country.budget.note)] : []),
      ]),

      // 渡航準備
      section("preparation", [
        el("h3", { class: "sub-title" }, labels.common.preparationItems),
        list(country.preparation.items),
        el("h3", { class: "sub-title" }, labels.common.notes),
        list(country.preparation.notes),
      ]),

      // モデルコース
      section(
        "modelCourses",
        el(
          "div",
          { class: "model-course-list" },
          country.modelCourses.map((c) => renderModelCourse(c))
        )
      ),

      // 観光地
      section(
        "attractions",
        el(
          "div",
          { class: "attraction-grid" },
          country.attractions.map((a) => renderAttraction(a))
        )
      ),

      el("p", { class: "back-link" }, [
        el("a", { href: "/", "data-link": "" }, labels.common.backToTop),
      ]),
    ]),
  ]);
}

export default renderCountryPage;
