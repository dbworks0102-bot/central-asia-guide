// 記事データの取得・整形（DOM非依存 = ユニットテスト対象）。
// 公開ルール：status === "published" の記事だけを外部に出す。draft は一覧にも詳細にも出さない。
import { articles } from "../data/articles.js";

// published のみを残し publishDate 降順に並べた新しい配列を返す（純粋関数・注入可能）
export function selectPublished(list) {
  return list
    .filter((a) => a.status === "published")
    .sort((a, b) => (a.publishDate < b.publishDate ? 1 : a.publishDate > b.publishDate ? -1 : 0));
}

// slug に一致し、かつ published の記事のみ返す。該当なし・draft・不正引数は null（純粋関数・注入可能）
export function findPublished(list, slug) {
  if (!slug || typeof slug !== "string") return null;
  const found = list.find((a) => a.slug === slug);
  return found && found.status === "published" ? found : null;
}

// --- 実データを対象にした利用側API ---

export function getPublishedArticles() {
  return selectPublished(articles);
}

export function getPublishedArticleBySlug(slug) {
  return findPublished(articles, slug);
}

export default { getPublishedArticles, getPublishedArticleBySlug, selectPublished, findPublished };
