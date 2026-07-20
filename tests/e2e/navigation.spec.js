import { test, expect } from "@playwright/test";

// ヘッダーからトップ/Aboutへ遷移でき、ブラウザの戻るボタンが機能する
test("ヘッダーナビゲーションで About / トップへ遷移できる", async ({ page }) => {
  await page.goto("/");

  const header = page.locator(".site-header");

  // ヘッダーの「このサイトについて」で /about へ
  await header.getByRole("link", { name: "このサイトについて" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1, name: "このサイトについて" })).toBeVisible();

  // ヘッダーの「ホーム」でトップ（＝ウズベキスタンガイド）へ
  await header.getByRole("link", { name: "ホーム" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ウズベキスタン");
});

test("ブラウザの戻るボタンが機能する", async ({ page }) => {
  await page.goto("/");

  // About ページへ遷移
  await page.locator(".site-header").getByRole("link", { name: "このサイトについて" }).click();
  await expect(page).toHaveURL(/\/about$/);

  // 戻るとトップページ（ウズベキスタンガイド）に戻る
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ウズベキスタン");
});
