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

async function fillInvestmentTaxScenario(page: Page) {
  await openTaxScenario(page);
  await page.locator("#property-use").selectOption("investment");
  await page.locator("#purchase-date").fill("2020-01-01");
  await page.locator("#sale-date").fill("2026-06-01");
  await page.locator("#marginal-tax-rate").fill("37");
}

async function openAdvancedTaxDetails(page: Page) {
  await page.getByText("Advanced tax details", { exact: true }).click();
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

test("rejects negative cash costs in quick and detailed inputs", async ({
  page,
}) => {
  await fillQuickInputs(page, {
    salePrice: "1000000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "-1",
  });

  await expect(page.locator("#other-selling-costs-error")).toHaveText(
    "Enter an amount of zero or more.",
  );
  await expect(
    page.getByRole("heading", { name: "Check the highlighted fields" }),
  ).toBeVisible();

  await page.locator("#other-selling-costs").fill("10000");
  await page.getByText("Improve this estimate", { exact: true }).click();
  await page.locator("#purchase-costs").fill("-1");

  await expect(page.locator("#purchase-costs-error")).toHaveText(
    "Enter an amount of zero or more.",
  );
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

test("applies optional cash costs to detailed profit and break-even", async ({
  page,
}) => {
  const results = page.locator(".results-panel");

  await fillQuickInputs(page, {
    salePrice: "1000000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "10000",
  });
  await page.getByText("Improve this estimate", { exact: true }).click();
  await page.locator("#sale-preparation-costs").fill("15000");
  await page.locator("#purchase-costs").fill("30000");
  await page.locator("#capital-improvements").fill("20000");

  await expect(results).toContainText("Whole-property pre-tax profit");
  await expect(results).toContainText("$305,000");
  await expect(results).toContainText("Sale preparation costs");
  await expect(results).toContainText("Purchase costs & improvements");
  await expect(results).toContainText("$688,776");

  await fillInvestmentTaxScenario(page);
  await openAdvancedTaxDetails(page);
  await expect(page.locator("#ato-cost-base")).toHaveAttribute(
    "placeholder",
    "680000",
  );
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

test("applies ownership share and mixed-use percentage in the browser", async ({
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
  await page.locator("#property-use").selectOption("mixed");
  await page.locator("#purchase-date").fill("2020-01-01");
  await page.locator("#sale-date").fill("2026-06-01");
  await page.locator("#ownership-share").fill("50");
  await page.locator("#mixed-taxable-percentage").fill("40");
  await page.locator("#marginal-tax-rate").fill("37");

  await expect(results).toContainText("$185,000");
  await expect(results).toContainText("$37,000");
  await expect(results).toContainText("$13,690");
  await expect(results).toContainText("$171,310");
});

test("uses a reviewed ATO cost-base override in the browser", async ({ page }) => {
  const results = page.locator(".results-panel");

  await fillQuickInputs(page, {
    salePrice: "1000000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "10000",
  });
  await fillInvestmentTaxScenario(page);

  await expect(results).toContainText("$185,000");
  await expect(results).toContainText("$68,450");

  await openAdvancedTaxDetails(page);
  await page.locator("#ato-cost-base").fill("750000");

  await expect(page.locator("#ato-cost-base")).toHaveValue("750,000");
  await expect(results).toContainText("$125,000");
  await expect(results).toContainText("$46,250");
  await expect(results).toContainText("$323,750");
});

test("reports a capital loss without implying that it was applied elsewhere", async ({
  page,
}) => {
  const results = page.locator(".results-panel");

  await fillQuickInputs(page, {
    salePrice: "1000000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "10000",
  });
  await fillInvestmentTaxScenario(page);
  await openAdvancedTaxDetails(page);
  await page.locator("#ato-cost-base").fill("1100000");

  await expect(results).toContainText("No positive capital gain estimated");
  await expect(results).toContainText(
    "does not apply the loss against other capital gains or carry it forward",
  );
  await expect(results).toContainText("Your estimated after-tax profit");
  await expect(results).toContainText("$370,000");
  await expect(results).not.toContainText("Estimated taxable capital gain");
});

test("keeps economic profit unchanged when capital works alter tax", async ({
  page,
}) => {
  const results = page.locator(".results-panel");

  await fillQuickInputs(page, {
    salePrice: "1000000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "10000",
  });
  await fillInvestmentTaxScenario(page);

  await expect(results).toContainText("$68,450");
  await openAdvancedTaxDetails(page);
  await page.locator("#capital-works").fill("10000");

  await expect(results).toContainText("Whole-property pre-tax profit");
  await expect(results).toContainText("$370,000");
  await expect(results).toContainText("$190,000");
  await expect(results).toContainText("$70,300");
  await expect(results).toContainText("$299,700");
});

test("pauses tax results on the reform boundary but keeps pre-tax results", async ({
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
  await page.locator("#purchase-date").fill("2020-01-01");
  await page.locator("#sale-date").fill("2027-07-01");
  await page.locator("#marginal-tax-rate").fill("37");

  await expect(results).toContainText("Whole-property pre-tax profit");
  await expect(results).toContainText("$370,000");
  await expect(results).toContainText("Tax estimate paused for this sale date");
  await expect(results).toContainText(
    "The pre-tax estimate above remains available",
  );
  await expect(results).not.toContainText("Indicative tax on the capital gain");
});

test("distinguishes incomplete tax inputs from invalid tax fields", async ({
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

  await expect(results).toContainText("Complete the tax scenario");
  await expect(results).toContainText("$370,000");

  await page.locator("#purchase-date").fill("2020-01-01");
  await page.locator("#sale-date").fill("2026-06-01");
  await page.locator("#marginal-tax-rate").fill("-1");

  await expect(page.locator("#marginal-tax-rate-error")).toHaveText(
    "Enter a tax rate from 0% to 100%.",
  );
  await expect(results).toContainText("Tax estimate needs correction");

  await page.locator("#marginal-tax-rate").fill("0");
  await expect(page.locator("#marginal-tax-rate-error")).toHaveCount(0);
  await expect(results).toContainText("Complete the tax scenario");
});

test("rejects impossible ownership and mixed-use percentages", async ({
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
  await page.locator("#property-use").selectOption("mixed");
  await page.locator("#purchase-date").fill("2020-01-01");
  await page.locator("#sale-date").fill("2026-06-01");
  await page.locator("#marginal-tax-rate").fill("37");
  await page.locator("#ownership-share").fill("0");
  await page.locator("#mixed-taxable-percentage").fill("100");

  await expect(page.locator("#ownership-share-error")).toHaveText(
    "Enter an ownership share greater than 0% and no more than 100%.",
  );
  await expect(page.locator("#mixed-taxable-percentage-error")).toHaveText(
    "For mixed use, enter a taxable portion greater than 0% and less than 100%.",
  );
  await expect(results).toContainText("Tax estimate needs correction");
});

test("rejects negative advanced tax amounts in the browser", async ({ page }) => {
  const results = page.locator(".results-panel");

  await fillQuickInputs(page, {
    salePrice: "1000000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "10000",
  });
  await fillInvestmentTaxScenario(page);
  await openAdvancedTaxDetails(page);

  await page.locator("#capital-works").fill("-1");
  await page.locator("#ato-cost-base").fill("-1");

  await expect(page.locator("#capital-works-error")).toHaveText(
    "Enter an amount of zero or more.",
  );
  await expect(page.locator("#ato-cost-base-error")).toHaveText(
    "Enter an amount of zero or more.",
  );
  await expect(results).toContainText("Tax estimate needs correction");
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
