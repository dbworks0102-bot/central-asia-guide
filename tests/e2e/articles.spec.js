import { test, expect } from "@playwright/test";
import { articles } from "../../src/data/articles.js";

// 公開記事のslug（src/data/articles.js のサンプル記事と一致させる）
const PUBLISHED_SLUG = "uzbekistan-11days-highlights";
const PUBLISHED_TITLE = "ウズベキスタン11日間モデルコースの見どころダイジェスト";

// 実在する draft 記事のslugを動的に1件取得する。
// 特定のslugをハードコードせず「status === 'draft' の先頭記事」を選ぶことで、
// 将来その記事が published へ昇格しても本テストが壊れない（別のdraftが選ばれる）。
const draftArticle = articles.find((a) => a.status === "draft");

test("コラム一覧に公開記事が表示される", async ({ page }) => {
  await page.goto("/articles");

  await expect(page.getByRole("heading", { level: 1, name: "コラム" })).toBeVisible();
  // 公開記事へのリンクが一覧に出る
  await expect(page.getByRole("link", { name: PUBLISHED_TITLE })).toBeVisible();
});

test("一覧から記事詳細へ遷移して本文が表示される", async ({ page }) => {
  await page.goto("/articles");

  await page.getByRole("link", { name: PUBLISHED_TITLE }).click();
  await expect(page).toHaveURL(new RegExp(`/articles/${PUBLISHED_SLUG}$`));
  await expect(page.getByRole("heading", { level: 1, name: PUBLISHED_TITLE })).toBeVisible();

  // 記事下のサイト内部リンク導線（relatedLinks）が表示される
  await expect(page.getByRole("link", { name: "コラム一覧へ戻る" })).toBeVisible();
});

test("記事詳細URLを直接開いても正しく描画される", async ({ page }) => {
  await page.goto(`/articles/${PUBLISHED_SLUG}`);
  await expect(page.getByRole("heading", { level: 1, name: PUBLISHED_TITLE })).toBeVisible();
});

test("存在しない記事slugへの直接アクセスは404になる", async ({ page }) => {
  await page.goto("/articles/this-slug-does-not-exist");
  await expect(page.getByRole("heading", { level: 1, name: "404" })).toBeVisible();
});

test("下書き（未公開）扱いのslugへの直接アクセスは404になる", async ({ page }) => {
  // published でないslug（データ上存在しない=未公開と同様に扱われる）は詳細を出さず404にフォールバックする
  await page.goto("/articles/secret-draft");
  await expect(page.getByRole("heading", { level: 1, name: "404" })).toBeVisible();
});

test("実在する draft 記事のslugへの直接アクセスは404になる", async ({ page }) => {
  // データ上は存在するが status:"draft" の記事は、詳細URLを直接開いても公開せず404にフォールバックする。
  // 公開判定は core/getArticles.js が一元管理しており、draftが詳細に漏れないことをここで担保する。
  expect(draftArticle, "テスト前提: src/data/articles.js に status:'draft' の記事が最低1件必要").toBeTruthy();

  await page.goto(`/articles/${draftArticle.slug}`);
  await expect(page.getByRole("heading", { level: 1, name: "404" })).toBeVisible();
});
