// サイトについて／お問い合わせ（簡易）
import { el } from "../utils/dom.js";
import { labels } from "../utils/labels.js";

export function renderAboutPage() {
  return el("div", { class: "page page-about container" }, [
    el("h1", { class: "section-title" }, labels.nav.about),
    el(
      "p",
      { class: "lead" },
      "当サイトは、中央アジア（ウズベキスタン・キルギス）に興味を持ち始めた日本人個人旅行者向けの観光情報メディアです。シルクロード・世界遺産・遊牧文化などの魅力を、旅行前の情報収集に役立つ形でまとめています。"
    ),
    el("h2", { class: "sub-title" }, "運営方針"),
    el("ul", { class: "bullet-list" }, [
      el("li", {}, "情報の正確性に努めますが、渡航前には必ず公式情報（大使館・外務省）をご確認ください。"),
      el("li", {}, "現時点で広告・アフィリエイトによる収益化は行っていません。"),
      el("li", {}, "対象国は今後、カザフスタン等へ順次拡張予定です。"),
    ]),
    el("h2", { class: "sub-title" }, "お問い合わせ"),
    el("p", {}, [
      "ご意見・誤り報告は ",
      el("a", { href: "mailto:info@example.com" }, "info@example.com"),
      " までお寄せください。",
    ]),
  ]);
}

export default renderAboutPage;
