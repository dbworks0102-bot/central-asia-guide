// コラム一覧ページ。published 記事のみ・publishDate 降順で受け取り、カード一覧を描画する。
// （published フィルタと並び替えは core/getArticles.js の責務。ここは描画のみ。）
import { el } from "../utils/dom.js";
import { labels } from "../utils/labels.js";
import { formatDate } from "../utils/formatDate.js";

function articleCard(article) {
  const href = `/articles/${article.slug}`;
  return el("article", { class: "article-card" }, [
    el("time", { class: "article-card__date", datetime: article.publishDate }, formatDate(article.publishDate)),
    el("h2", { class: "article-card__title" }, [
      el("a", { href, "data-link": "" }, article.title),
    ]),
    el("p", { class: "article-card__desc" }, article.description),
  ]);
}

export function renderArticleListPage(articles) {
  const items = articles.length
    ? articles.map((a) => articleCard(a))
    : [el("p", { class: "article-empty" }, labels.articles.empty)];

  return el("div", { class: "page page-article-list container" }, [
    el("h1", { class: "section-title" }, labels.articles.listTitle),
    el("p", { class: "lead" }, labels.articles.listLead),
    el("div", { class: "article-list" }, items),
  ]);
}

export default renderArticleListPage;
