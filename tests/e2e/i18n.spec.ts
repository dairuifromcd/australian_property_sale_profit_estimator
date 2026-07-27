import { expect, test, type Page } from "@playwright/test";

async function waitForClient(page: Page) {
  await expect(page.locator("html")).toHaveAttribute(
    "data-client-ready",
    "true",
    { timeout: 15_000 },
  );
}

async function enterCompleteScenario(page: Page) {
  await page.locator("#sale-price").fill("1000000");
  await page.locator("#purchase-price").fill("600000");
  await page.locator("#commission-rate").fill("2");
  await page.locator("#other-selling-costs").fill("10000");
  await page.locator(".transaction-details > summary").click();
  await page.locator("#sale-preparation-costs").fill("5000");
  await page.locator("#purchase-costs").fill("30000");
  await page.locator("#renovations-and-improvements").fill("50000");
  await page.locator(".holding-details > summary").click();
  await page.locator("#total-holding-costs").fill("55000");
  await page.locator("#total-rental-income").fill("90000");
  await page.locator("#estimated-loan-payout").fill("450000");
  await page.locator("#target-profit").fill("100000");
}

test("all locales use the same AUD arithmetic and expose every calculation", async ({
  page,
}) => {
  for (const [path, lang, showCalculation] of [
    ["/", "en-AU", "Show calculation"],
    ["/zh-Hans", "zh-Hans", "显示计算过程"],
    ["/ko", "ko", "계산 과정 보기"],
  ]) {
    await page.goto(path);
    await waitForClient(page);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await enterCompleteScenario(page);

    const results = page.locator(".results-panel");
    await expect(results.locator(".primary-result")).toContainText("$285,000");
    await expect(results.locator(".secondary-metric")).toContainText("$709,184");
    await expect(results).toContainText("$320,000");
    await expect(results).toContainText("$515,000");
    await expect(results).toContainText("$811,225");

    const toggles = page.getByText(showCalculation, { exact: true });
    await expect(toggles).toHaveCount(6);
    for (let index = 0; index < 6; index += 1) {
      await toggles.nth(index).click();
    }

    await expect(results).toContainText(
      "$1,000,000.00 − $20,000.00 − $10,000.00 − $5,000.00 − $600,000.00 − $30,000.00 − $50,000.00 ≈ $285,000.00",
    );
    await expect(results).toContainText(
      "$285,000.00 + $90,000.00 − $55,000.00 ≈ $320,000.00",
    );
    await expect(results).toContainText(
      "$965,000.00 − $450,000.00 ≈ $515,000.00",
    );
  }
});

test("language switching warns before clearing entered figures", async ({
  page,
}) => {
  await page.goto("/");
  await waitForClient(page);
  await page.locator("#sale-price").fill("1000000");

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toBe(
      "Changing language will clear the figures currently entered. Continue?",
    );
    await dialog.dismiss();
  });
  await page.getByRole("link", { name: "简体中文" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.locator("#sale-price")).toHaveValue("1,000,000");

  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });
  await page.getByRole("link", { name: "简体中文" }).click();
  await expect(page).toHaveURL("/zh-Hans");
  await waitForClient(page);
  await expect(page.locator("#sale-price")).toHaveValue("");

  await page.getByRole("link", { name: "한국어" }).click();
  await expect(page).toHaveURL("/ko");
  await waitForClient(page);

  expect(await page.context().cookies()).toEqual([]);
  expect(
    await page.evaluate(() => ({
      localStorage: { ...window.localStorage },
      sessionStorage: { ...window.sessionStorage },
    })),
  ).toEqual({ localStorage: {}, sessionStorage: {} });
});

test("language links preserve the current legal page", async ({ page }) => {
  await page.goto("/privacy");
  await page.getByRole("link", { name: "简体中文" }).click();
  await expect(page).toHaveURL("/zh-Hans/privacy");
  await expect(
    page.getByRole("heading", { name: "您的数据如何处理" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "한국어" }).click();
  await expect(page).toHaveURL("/ko/privacy");
  await expect(
    page.getByRole("heading", { name: "데이터 처리 방식" }),
  ).toBeVisible();
});

test("localized home and legal pages do not overflow on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });

  for (const path of [
    "/zh-Hans",
    "/zh-Hans/privacy",
    "/zh-Hans/disclaimer",
    "/ko",
    "/ko/privacy",
    "/ko/disclaimer",
  ]) {
    await page.goto(path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      ),
      `${path} should not overflow`,
    ).toBe(false);
  }
});
