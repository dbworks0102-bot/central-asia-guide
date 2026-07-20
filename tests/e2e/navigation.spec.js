import { test, expect } from "@playwright/test";

// ヘッダーからトップ/Aboutへ遷移でき、ブラウザの戻るボタンが機能する
test("ヘッダーナビゲーションで About / トップへ遷移できる", async ({ page }) => {
  await page.goto("/");

  const header = page.locator(".site-header");

  // ヘッダーの「このサイトについて」で /about へ
  await header.getByRole("link", { name: "このサイトについて" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1, name: "このサイトについて" })).toBeVisible();

  // ヘッダーの「ホーム」でトップへ
  await header.getByRole("link", { name: "ホーム" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("中央アジア観光ガイド");
});

test("ブラウザの戻るボタンが機能する", async ({ page }) => {
  await page.goto("/");

  // 国別ページへ遷移
  await page.getByRole("link", { name: /ウズベキスタン/ }).click();
  await expect(page).toHaveURL(/\/uzbekistan$/);

  // 戻るとトップページに戻る
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("中央アジア観光ガイド");
});
