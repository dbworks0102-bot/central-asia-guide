import { test, expect } from "@playwright/test";

// モデルコースの日程（itinerary）が表示される
test("モデルコースの日程が表示される", async ({ page }) => {
  await page.goto("/uzbekistan");

  // モデルコースセクション見出し
  await expect(page.getByRole("heading", { name: "おすすめモデルコース" })).toBeVisible();

  // コースタイトル
  await expect(page.getByRole("heading", { name: "サマルカンド集中3日間" })).toBeVisible();

  // 日程（itinerary）の Day 表記とステップが表示される
  await expect(page.getByText("Day 1", { exact: false }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "レギスタン広場" }).first()).toBeVisible();

  // itinerary のステップ要素が複数存在する
  const steps = page.locator(".itinerary-step");
  expect(await steps.count()).toBeGreaterThan(1);
});
