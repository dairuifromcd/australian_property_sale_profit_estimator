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

  await page.locator("#commission-rate").fill("0");
  await page.locator("#other-selling-costs").fill("0");

  await expect(results).toContainText("Whole-property transaction profit");
  await expect(results.getByText("PROFIT", { exact: true })).toBeVisible();
  await expect(results).toContainText("$350,000");
  await expect(
    page.getByRole("button", { name: "Print or save as PDF" }),
  ).toBeEnabled();
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

test("rejects impossible commission rates", async ({ page }) => {
  await fillQuickInputs(page, {
    salePrice: "1000000",
    purchasePrice: "600000",
    commissionRate: "100",
    sellingCosts: "0",
  });

  await expect(page.locator("#commission-rate-error")).toHaveText(
    "Enter a commission rate from 0% to less than 100%.",
  );
  await expect(
    page.getByRole("heading", { name: "Check the highlighted fields" }),
  ).toBeVisible();
});

test("rejects negative quick and detailed costs", async ({ page }) => {
  await fillQuickInputs(page, {
    salePrice: "1000000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "-1",
  });

  await expect(page.locator("#other-selling-costs-error")).toHaveText(
    "Enter an amount of zero or more.",
  );

  await page.locator("#other-selling-costs").fill("10000");
  await page.getByText("Improve this estimate", { exact: true }).click();
  await page.locator("#purchase-costs").fill("-1");
  await page.locator("#renovations-and-improvements").fill("-2");

  await expect(page.locator("#purchase-costs-error")).toHaveText(
    "Enter an amount of zero or more.",
  );
  await expect(
    page.locator("#renovations-and-improvements-error"),
  ).toHaveText("Enter an amount of zero or more.");
});

test("shows an explicit non-colour transaction loss status", async ({
  page,
}) => {
  const results = page.locator(".results-panel");

  await fillQuickInputs(page, {
    salePrice: "600000",
    purchasePrice: "650000",
    commissionRate: "2",
    sellingCosts: "10000",
  });

  await expect(results).toContainText("Whole-property transaction loss");
  await expect(results.getByText("LOSS", { exact: true })).toBeVisible();
  await expect(results).toContainText("-$72,000");
});

test("applies optional costs to transaction profit and entered-cost break-even", async ({
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
  await page.locator("#renovations-and-improvements").fill("20000");

  await expect(results).toContainText("Whole-property transaction profit");
  await expect(results).toContainText("$305,000");
  await expect(results).toContainText("Sale preparation costs");
  await expect(results).toContainText("Purchase costs & improvements");
  await expect(results).toContainText(
    "Break-even sale price for entered transaction costs",
  );
  await expect(results).toContainText("$688,776");
});

test("does not expose a tax calculation path", async ({ page }) => {
  await expect(page.getByText(/estimate tax/i)).toHaveCount(0);
  await expect(page.getByText(/tax scenario/i)).toHaveCount(0);
  await expect(page.locator('input[type="date"]')).toHaveCount(0);
  await expect(page.locator("#estimate-tax")).toHaveCount(0);
  await expect(
    page.getByText(/does not calculate settlement cash, holding-period returns/i),
  ).toBeVisible();
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

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
  ).toBe(false);

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
