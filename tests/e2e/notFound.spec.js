import { test, expect } from "@playwright/test";

// 存在しないURLにアクセスすると 404 表示になる
test("未定義URLで404ページが表示される", async ({ page }) => {
  await page.goto("/nonexistent");

  await expect(page.getByRole("heading", { level: 1, name: "404" })).toBeVisible();
  await expect(page.getByText("お探しのページは見つかりませんでした", { exact: false })).toBeVisible();

  // トップへ戻るリンクが機能する（トップ＝ウズベキスタンガイド）
  await page.getByRole("link", { name: "トップへ戻る" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ウズベキスタン");
});
