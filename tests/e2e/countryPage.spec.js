import { test, expect } from "@playwright/test";

// ウズベキスタンページで基本情報・治安・ビザ・費用感のセクションが表示される
test("トップ（ウズベキスタンガイド）に基本情報・治安・ビザ・費用感が表示される", async ({ page }) => {
  await page.goto("/");

  // 各セクション見出し
  await expect(page.getByRole("heading", { name: "基本情報" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "治安・安全情報" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "費用感" })).toBeVisible();

  // ビザ情報（基本情報テーブルの行見出し th[scope=row]）
  await expect(page.getByRole("rowheader", { name: "ビザ" })).toBeVisible();
  await expect(page.getByText("ビザ不要", { exact: false }).first()).toBeVisible();

  // 治安の安全度・費用感の日額が表示される
  await expect(page.getByText("安全度:", { exact: false })).toBeVisible();
  await expect(page.getByText("1日 5,000〜12,000円", { exact: false })).toBeVisible();
});
