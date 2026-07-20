import { test, expect } from "@playwright/test";

// モバイルビューポート（375x667）でヘッダー/コンテンツが崩れず表示される
test.use({ viewport: { width: 375, height: 667 } });

test("モバイルビューポートでトップページが崩れず表示される", async ({ page }) => {
  await page.goto("/");

  // ヘッダー・ロゴ・ナビが可視
  await expect(page.locator(".site-header")).toBeVisible();
  await expect(page.getByRole("link", { name: "ウズベキスタン旅行ガイド" })).toBeVisible();

  // コンテンツ（観光地カード）が可視
  await expect(page.locator(".attraction-card").first()).toBeVisible();

  // 横スクロール（レイアウト崩れ）が発生していないこと
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("モバイルビューポートでコンテンツ全体が崩れず表示される", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "ウズベキスタン" })).toBeVisible();
  await expect(page.locator(".attraction-card").first()).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
