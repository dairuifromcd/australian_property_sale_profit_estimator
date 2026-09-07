import { expect, test } from "@playwright/test";
import { captureTranslationReview } from "./review-artifacts";

test("guide supports keyboard navigation to explanations and localized calculators", async ({ page }) => {
  await page.goto("/selling-costs-guide");
  const example = page.locator('nav a[href="#worked-example"]');
  await example.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#worked-example$/);
  await expect(page.locator("#worked-example")).toContainText("$323,000");
  await expect(page.locator("#worked-example")).toContainText("$573,000");
  await page.getByRole("link", { name: "简体中文", exact: true }).click();
  await expect(page).toHaveURL("/zh-Hans/selling-costs-guide");
  await page.getByRole("link", { name: "한국어", exact: true }).click();
  await expect(page).toHaveURL("/ko/selling-costs-guide");
  await page.locator(".guide-calculator-link").first().focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/ko");
  await expect(page.locator("#sale-price")).toHaveValue("");
});

test("every guide fits a mobile viewport without storing or transmitting example figures", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const sentRequests: string[] = [];
  page.on("request", request => {
    sentRequests.push(`${request.url()} ${request.postData() ?? ""}`);
  });
  for (const prefix of ["", "/zh-Hans", "/ko"]) {
    await page.goto(`${prefix}/selling-costs-guide`);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("article section")).toHaveCount(7);
    await expect(page.locator('.guide-method a')).toHaveAttribute("href", "mailto:support@propertysaleprofit.au");
    await expect(page.locator('.guide-method a')).toHaveText("support@propertysaleprofit.au");
    await captureTranslationReview(page, prefix.slice(1), "guide");
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await expect(page.locator(".guide-footer a").nth(1)).toHaveAttribute("href", `${prefix}/privacy`);
    expect(await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }))).toEqual({ local: {}, session: {} });
  }
  expect(await page.context().cookies()).toEqual([]);
  expect(sentRequests.join("\n")).not.toMatch(/1000000|650000|323000|573000|1%2C000%2C000/);
  expect(sentRequests.filter(request => request.includes("/api/usage"))).toEqual([]);
});

test("opening the guide preserves entered calculator figures in the original tab", async ({ page, context }) => {
  for (const [prefix, announcement] of [
    ["", "(opens in new tab)"],
    ["/zh-Hans", "（在新标签页中打开）"],
    ["/ko", "(새 탭에서 열림)"],
  ]) {
    await page.goto(prefix || "/");
    await expect(page.locator("html")).toHaveAttribute("data-client-ready", "true");
    await page.locator("#sale-price").fill("1000000");
    await page.locator("#purchase-price").fill("650000");
    await page.locator("#commission-rate").fill("2.2");
    await page.locator("#other-selling-costs").fill("5000");
    const link = page.locator(`a[href="${prefix}/selling-costs-guide"]`);
    await expect(link).toContainText(announcement);
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await page.emulateMedia({ media: "print" });
    await expect(link).toBeHidden();
    await page.emulateMedia({ media: "screen" });
    const popupPromise = context.waitForEvent("page");
    await link.focus();
    await page.keyboard.press("Enter");
    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded");
    expect(new URL(popup.url()).pathname).toBe(`${prefix}/selling-costs-guide`);
    expect(new URL(popup.url()).search).toBe("");
    expect(new URL(popup.url()).hash).toBe("");
    expect(await popup.evaluate(() => window.opener === null)).toBe(true);
    await expect(page).toHaveURL(prefix || "/");
    await expect(page.locator("#sale-price")).toHaveValue("1,000,000");
    await expect(page.locator("#purchase-price")).toHaveValue("650,000");
    await expect(page.locator("#commission-rate")).toHaveValue("2.2");
    await expect(page.locator("#other-selling-costs")).toHaveValue("5,000");
    await expect(page.locator(".primary-result")).toContainText("$323,000");
    await popup.close();
  }
});


test("localized share cards are served as usable static PNGs", async ({ request }) => {
  for (const locale of ["en-AU", "zh-Hans", "ko"]) {
    const response = await request.get(`/share/${locale}.png`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    const png = await response.body();
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  }
});
