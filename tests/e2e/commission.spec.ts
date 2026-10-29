import { expect, test, type Page } from "@playwright/test";
import { captureTranslationReview } from "./review-artifacts";

const suffix = "/real-estate-agent-commission-calculator";

async function openTool(page: Page, prefix = "") {
  await page.goto(`${prefix}${suffix}`);
  await expect(page.locator("html")).toHaveAttribute("data-client-ready", "true");
}

for (const [locale, prefix] of [["en-AU", ""], ["zh-Hans", "/zh-Hans"], ["ko", "/ko"]]) {
  test(`${locale} commission money exponent drafts stay invalid while percentage exponents remain valid`, async ({ page }) => {
    await openTool(page, prefix);
    const price = page.locator("#commission-sale-price");
    const rate = page.locator("#standalone-commission-rate");
    const amount = page.getByTestId("commission-amount");
    await price.fill("1000000");
    await rate.fill("2");
    await expect(amount).toHaveText("$20,000.00");
    for (const draft of ["1e6", "1E+6", "1e-7", "1e"]) {
      await price.fill(draft);
      await expect(amount).toHaveCount(0);
      await rate.focus();
      await expect(price).toHaveValue(draft);
      await expect(price).toHaveAttribute("aria-invalid", "true");
      await price.fill("1000000");
      await expect(amount).toHaveText("$20,000.00");
    }
    await price.fill("1");
    for (const exponentRate of ["1e-7", "5e-324"]) {
      await rate.fill(exponentRate);
      await expect(rate).not.toHaveAttribute("aria-invalid", "true");
      await expect(amount).toHaveText("$0.00");
    }
  });

  test(`${locale} commission tool works with two inputs, cents, zero and maximum values`, async ({ page }) => {
    await openTool(page, prefix);
    const price = page.locator("#commission-sale-price");
    const rate = page.locator("#standalone-commission-rate");
    const amount = page.getByTestId("commission-amount");
    await expect(page.locator("input")).toHaveCount(2);
    await expect(amount).toHaveCount(0);
    await price.fill("1000000");
    await expect(amount).toHaveCount(0);
    await rate.fill("2.2");
    await expect(amount).toHaveText("$22,000.00");
    await expect(page.getByTestId("commission-equation")).toHaveText("$1,000,000.00 × 2.2% ≈ $22,000.00");
    await price.fill("1000001.49");
    await rate.fill("2.37");
    await expect(amount).toHaveText("$23,700.04");
    expect(await rate.evaluate((input: HTMLInputElement) => input.validity.valid)).toBe(true);
    await price.fill("1.15");
    await rate.fill("10");
    await expect(amount).toHaveText("$0.12");
    await expect(page.getByTestId("commission-equation")).toHaveText("$1.15 × 10% ≈ $0.12");
    await price.fill("11");
    await rate.fill("1.5");
    await expect(amount).toHaveText("$0.17");
    await rate.fill("0");
    await expect(amount).toHaveText("$0.00");
    await rate.fill("-0");
    await expect(amount).toHaveText("$0.00");
    await price.fill("1");
    await rate.fill("0.5");
    await expect(amount).toHaveText("$0.01");
    await price.fill("1000000000000");
    await rate.fill("99.9");
    await expect(amount).toHaveText("$999,000,000,000.00");
    for (const width of [320, 375]) {
      await page.setViewportSize({ width, height: 812 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, `${locale} at ${width}px`).toBe(false);
    }
    await captureTranslationReview(page, locale, "commission");
    await page.getByRole("button", { name: /Reset|重置|초기화/ }).click();
    await expect(price).toHaveValue("");
    await expect(rate).toHaveValue("");
    await expect(amount).toHaveCount(0);
  });
}

test("commission tool hides stale results for blank, unfinished and out-of-range inputs", async ({ page }) => {
  await openTool(page);
  const price = page.locator("#commission-sale-price");
  const rate = page.locator("#standalone-commission-rate");
  const amount = page.getByTestId("commission-amount");
  await price.fill("750000");
  await rate.fill("2");
  await expect(amount).toHaveText("$15,000.00");
  for (const value of ["", "0", "-1", "1000000000001", "-", ".", "-."]) {
    await price.fill(value);
    await rate.focus();
    await expect(amount).toHaveCount(0);
    await price.fill("750000");
    await expect(amount).toHaveText("$15,000.00");
  }
  for (const value of ["", "-1", "99.91", "100"]) {
    await rate.fill(value);
    await expect(amount).toHaveCount(0);
    await rate.fill("2");
    await expect(amount).toHaveText("$15,000.00");
  }
  // A real number control exposes an unfinished exponent as an empty value.
  await rate.press("End");
  await rate.press("e");
  await expect(amount).toHaveCount(0);
  await rate.fill("2.2");
  await expect(amount).toHaveText("$16,500.00");
  await rate.press("ControlOrMeta+A");
  await rate.press("-");
  await expect(amount).toHaveCount(0);
  await rate.fill("0");
  await expect(amount).toHaveText("$0.00");
});

test("commission language switching preserves the task and warns before clearing input", async ({ page }) => {
  await openTool(page);
  await page.locator("#commission-sale-price").fill("1000000");
  await page.locator("#standalone-commission-rate").fill("2.2");
  const chinese = page.locator(`.language-switcher a[href="/zh-Hans${suffix}"]`);
  page.once("dialog", dialog => dialog.dismiss());
  await chinese.click();
  await expect(page.getByTestId("commission-amount")).toHaveText("$22,000.00");
  page.once("dialog", dialog => dialog.accept());
  await chinese.click();
  await expect(page).toHaveURL(new RegExp(`/zh-Hans${suffix}$`));
  await expect(page.locator("#commission-sale-price")).toHaveValue("");
  await expect(page.locator("#standalone-commission-rate")).toHaveValue("");
});

test("commission tool emits no usage events and keeps entered figures off requests and storage", async ({ page, context }) => {
  const requests: string[] = [];
  const usage: string[] = [];
  page.on("request", request => {
    requests.push(`${request.url()} ${request.postData() ?? ""}`);
    if (request.url().includes("/api/usage-events")) usage.push(request.url());
  });
  await openTool(page);
  await page.locator("#commission-sale-price").fill("987654.32");
  await page.locator("#standalone-commission-rate").fill("2.37");
  await expect(page.getByTestId("commission-amount")).toHaveText("$23,407.41");
  expect(usage).toEqual([]);
  expect(requests.join("\n")).not.toMatch(/987654|987,654|23407|23,407/);
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  expect(new URL(page.url()).search).toBe("");
  expect(new URL(page.url()).hash).toBe("");
  await page.reload();
  await expect(page.locator("#commission-sale-price")).toHaveValue("");
  await expect(page.getByTestId("commission-amount")).toHaveCount(0);
});

test("the early commission shortcut is localized, keyboard accessible and preserves the full estimate", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const [locale, prefix, label, announcement] of [
    ["en-AU", "", "Real estate agent commission calculator", "(opens in a new tab)"],
    ["zh-Hans", "/zh-Hans", "房产中介佣金计算器", "（在新标签页打开）"],
    ["ko", "/ko", "부동산 중개 수수료 계산기", "(새 탭에서 열림)"],
  ]) {
    await page.goto(prefix || "/");
    await expect(page.locator("html")).toHaveAttribute("data-client-ready", "true");
    const shortcut = page.locator(`.hero a[href="${prefix}${suffix}"]`);
    await expect(shortcut).toHaveText(`${label} ${announcement}`);
    await expect(shortcut).toBeInViewport({ ratio: 1 });
    await expect(shortcut).toHaveAttribute("target", "_blank");
    await expect(shortcut).toHaveAttribute("rel", "noopener noreferrer");
    await expect(page.locator(`.related-tool a[href="${prefix}${suffix}"]`)).toHaveCount(1);
    for (const width of [320, 375]) {
      await page.setViewportSize({ width, height: 812 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${locale} at ${width}px`).toBe(false);
      const bounds = await shortcut.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    }
    await captureTranslationReview(page, locale, "home-discovery");
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.locator("#sale-price").fill("1000000");
    await page.locator("#purchase-price").fill("650000");
    await page.locator("#commission-rate").fill("2.2");
    await page.locator("#other-selling-costs").fill("5000");
    await expect(page.locator(".primary-result")).toContainText("$323,000");
    const opened = page.waitForEvent("popup");
    await shortcut.focus();
    await expect(shortcut).toBeFocused();
    await page.keyboard.press("Enter");
    const tool = await opened;
    await expect(tool).toHaveURL(new RegExp(`${prefix}${suffix}$`));
    expect(new URL(tool.url()).search).toBe("");
    expect(new URL(tool.url()).hash).toBe("");
    expect(await tool.evaluate(() => window.opener === null)).toBe(true);
    await expect(tool.locator("#commission-sale-price")).toHaveValue("");
    await expect(page).toHaveURL(prefix || "/");
    await expect(page.locator("#sale-price")).toHaveValue("1,000,000");
    await expect(page.locator("#purchase-price")).toHaveValue("650,000");
    await expect(page.locator("#commission-rate")).toHaveValue("2.2");
    await expect(page.locator("#other-selling-costs")).toHaveValue("5,000");
    await expect(page.locator(".primary-result")).toContainText("$323,000");
    await tool.close();
  }
});
