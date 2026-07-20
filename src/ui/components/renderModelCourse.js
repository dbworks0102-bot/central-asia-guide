// モデルコース（日程 itinerary 展開表示）
import { el } from "../../utils/dom.js";
import { labels } from "../../utils/labels.js";

export function renderModelCourse(course) {
  return el("article", { class: "model-course" }, [
    el("header", { class: "model-course__head" }, [
      el("h3", { class: "model-course__title" }, course.title),
      el("span", { class: "model-course__days" }, `${course.days}${labels.common.daysSuffix}`),
    ]),
    el("p", { class: "model-course__summary" }, course.summary),
    el(
      "ol",
      { class: "model-course__itinerary" },
      course.itinerary.map((step) =>
        el("li", { class: "itinerary-step" }, [
          el("span", { class: "itinerary-step__day" }, `${labels.common.dayPrefix} ${step.day}`),
          el("div", { class: "itinerary-step__body" }, [
            el("h4", { class: "itinerary-step__title" }, step.title),
            el("p", { class: "itinerary-step__detail" }, step.detail),
          ]),
        ])
      )
    ),
  ]);
}

export default renderModelCourse;
