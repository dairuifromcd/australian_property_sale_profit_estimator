import { expect, test, type Page } from "@playwright/test";

type QuickInputs = {
  salePrice: string;
  purchasePrice: string;
  commissionRate: string;
  sellingCosts: string;
};

async function fillQuickInputs(
  page: Page,
  {
    salePrice,
    purchasePrice,
    commissionRate,
    sellingCosts,
  }: QuickInputs,
) {
  await page.locator("#sale-price").fill(salePrice);
  await page.locator("#purchase-price").fill(purchasePrice);
  await page.locator("#commission-rate").fill(commissionRate);
  await page.locator("#other-selling-costs").fill(sellingCosts);
}

async function openTaxScenario(page: Page) {
  await page
    .getByText("Estimate tax on the capital gain", { exact: true })
    .click();
  await page.locator("#estimate-tax").check();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute(
    "data-client-ready",
    "true",
    { timeout: 15_000 },
  );
});

test("requires four quick inputs and accepts explicit zero costs", async ({
  page,
}) => {
  const results = page.locator(".results-panel");

  await expect(
    results.getByRole("heading", { name: "Complete the four quick inputs" }),
  ).toBeVisible();

  await page.locator("#sale-price").fill("1000000");
  await page.locator("#purchase-price").fill("650000");

  await expect(page.locator("#sale-price")).toHaveValue("1,000,000");
  await expect(page.locator("#purchase-price")).toHaveValue("650,000");
  await expect(
    results.getByRole("heading", { name: "Complete the four quick inputs" }),
  ).toBeVisible();

  await page.locator("#commission-rate").fill("0");
  await page.locator("#other-selling-costs").fill("0");

  await expect(results).toContainText("Whole-property pre-tax profit");
  await expect(results.getByText("PROFIT", { exact: true })).toBeVisible();
  await expect(results).toContainText("$350,000");
});

test("rejects zero sale and purchase prices", async ({ page }) => {
  await fillQuickInputs(page, {
    salePrice: "0",
    purchasePrice: "0",
    commissionRate: "0",
    sellingCosts: "0",
  });

  await expect(
    page.getByText("Enter an amount greater than zero."),
  ).toHaveCount(2);
  await expect(
    page.getByRole("heading", { name: "Check the highlighted fields" }),
  ).toBeVisible();
});

test("shows an explicit non-colour loss status", async ({ page }) => {
  const results = page.locator(".results-panel");

  await fillQuickInputs(page, {
    salePrice: "600000",
    purchasePrice: "650000",
    commissionRate: "2",
    sellingCosts: "10000",
  });

  await expect(results).toContainText("Whole-property pre-tax loss");
  await expect(results.getByText("LOSS", { exact: true })).toBeVisible();
  await expect(results).toContainText("-$72,000");
});

test("changes the CGT discount immediately after the 12-month threshold", async ({
  page,
}) => {
  const results = page.locator(".results-panel");

  await fillQuickInputs(page, {
    salePrice: "1000000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "10000",
  });
  await openTaxScenario(page);
  await page.locator("#property-use").selectOption("investment");
  await page.locator("#purchase-date").fill("2024-02-02");
  await page.locator("#sale-date").fill("2025-02-02");
  await page.locator("#marginal-tax-rate").fill("37");

  await expect(results).toContainText(
    "12-month holding threshold not met — no 50% CGT discount applied",
  );
  await expect(results).toContainText("$370,000");

  await page.locator("#sale-date").fill("2025-02-03");

  await expect(results).toContainText(
    "Held beyond the 12-month threshold — 50% CGT discount applied",
  );
  await expect(results).toContainText("$185,000");
  await expect(results).toContainText("$68,450");
  await expect(results).toContainText("$301,550");
});

test("does not assume a main-residence exemption before confirmation", async ({
  page,
}) => {
  const results = page.locator(".results-panel");

  await fillQuickInputs(page, {
    salePrice: "1000000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "10000",
  });
  await openTaxScenario(page);
  await page.locator("#purchase-date").fill("2020-01-01");
  await page.locator("#sale-date").fill("2026-06-01");

  await expect(results).toContainText("Full exemption not confirmed");
  await expect(results).not.toContainText(
    "Indicative tax under this exemption: $0",
  );

  await page.locator("#main-residence-confirmed").check();

  await expect(results).toContainText(
    "Indicative tax under this exemption: $0",
  );
});

test("rejects a sale contract date that is not after purchase", async ({
  page,
}) => {
  await fillQuickInputs(page, {
    salePrice: "1000000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "10000",
  });
  await openTaxScenario(page);
  await page.locator("#purchase-date").fill("2026-01-02");
  await page.locator("#sale-date").fill("2026-01-01");

  await expect(page.locator("#sale-date-error")).toHaveText(
    "The sale contract date must be after the purchase contract date.",
  );
  await expect(page.locator(".results-panel")).toContainText(
    "Tax estimate needs correction",
  );
});

test("resets the calculator and avoids horizontal overflow on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await fillQuickInputs(page, {
    salePrice: "600000",
    purchasePrice: "650000",
    commissionRate: "2",
    sellingCosts: "10000",
  });

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  await page.getByRole("button", { name: "Reset" }).click();

  await expect(page.locator("#sale-price")).toHaveValue("");
  await expect(page.locator("#purchase-price")).toHaveValue("");
  await expect(page.locator("#commission-rate")).toHaveValue("");
  await expect(page.locator("#other-selling-costs")).toHaveValue("");
  await expect(
    page.getByRole("heading", { name: "Complete the four quick inputs" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Print or save as PDF" }),
  ).toBeDisabled();
});
