import { test, expect } from "@playwright/test";

// トップページから「ウズベキスタン」カードをクリック → /uzbekistan へ遷移し概要が表示される
test("トップから国別ページへ遷移し概要が表示される", async ({ page }) => {
  await page.goto("/");

  // トップページの見出し（サイト名）が表示される
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("中央アジア観光ガイド");

  // ウズベキスタンの国選択カード（リンク）をクリック
  await page.getByRole("link", { name: /ウズベキスタン/ }).click();

  // /uzbekistan に遷移
  await expect(page).toHaveURL(/\/uzbekistan$/);

  // 国名の見出し（h1）が表示される
  await expect(page.getByRole("heading", { level: 1, name: "ウズベキスタン" })).toBeVisible();

  // 概要テキストが表示される
  await expect(page.getByText("シルクロードの隊商都市", { exact: false })).toBeVisible();
});
