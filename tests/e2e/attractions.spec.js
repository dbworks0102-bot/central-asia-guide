import { test, expect } from "@playwright/test";

// 観光地カードが表示され、画像に alt 属性がある
test("観光地カードが alt 付き画像とともに表示される", async ({ page }) => {
  await page.goto("/");

  // 観光地セクション見出し
  await expect(page.getByRole("heading", { name: "主要観光地" })).toBeVisible();

  // 観光地カードが複数表示される
  const cards = page.locator(".attraction-card");
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);

  // 各カードの画像に空でない alt がある
  const images = page.locator(".attraction-card__img");
  const imgCount = await images.count();
  expect(imgCount).toBe(count);

  for (let i = 0; i < imgCount; i++) {
    const alt = await images.nth(i).getAttribute("alt");
    expect(alt).toBeTruthy();
    expect(alt.length).toBeGreaterThan(0);
  }
});
