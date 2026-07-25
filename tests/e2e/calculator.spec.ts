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
    "Enter a commission rate from 0% to 99.9%.",
  );
  await expect(
    page.getByRole("heading", { name: "Check the highlighted fields" }),
  ).toBeVisible();

  await page.locator("#commission-rate").fill("99.91");
  await expect(page.locator("#commission-rate-error")).toHaveText(
    "Enter a commission rate from 0% to 99.9%.",
  );
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
  await page.getByText("Add transaction details", { exact: true }).click();
  await page.locator("#purchase-costs").fill("-1");
  await page.locator("#renovations-and-improvements").fill("-2");

  await expect(page.locator("#purchase-costs-error")).toHaveText(
    "Enter an amount of zero or more.",
  );
  await expect(
    page.locator("#renovations-and-improvements-error"),
  ).toHaveText("Enter an amount of zero or more.");

  await page.locator("#purchase-costs").fill("0");
  await page.locator("#renovations-and-improvements").fill("0");
  await page.getByText("Add holding and loan details", { exact: true }).click();
  await page.locator("#total-holding-costs").fill("-3");
  await page.locator("#total-rental-income").fill("-4");
  await page.locator("#estimated-loan-payout").fill("-5");

  await expect(page.locator("#total-holding-costs-error")).toHaveText(
    "Enter an amount of zero or more.",
  );
  await expect(page.locator("#total-rental-income-error")).toHaveText(
    "Enter an amount of zero or more.",
  );
  await expect(page.locator("#estimated-loan-payout-error")).toHaveText(
    "Enter an amount of zero or more.",
  );
  await expect(page.locator(".primary-result")).toContainText("$370,000");
  await expect(
    page.getByRole("region", { name: "Overall pre-tax property result" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("region", { name: /cash.*loan payout/i }),
  ).toHaveCount(0);
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
  await page.getByText("Add transaction details", { exact: true }).click();
  await page.locator("#sale-preparation-costs").fill("15000");
  await page.locator("#purchase-costs").fill("30000");
  await page.locator("#renovations-and-improvements").fill("20000");

  await expect(results).toContainText("Whole-property transaction profit");
  await expect(results).toContainText("$305,000");
  await expect(results).toContainText("Sale preparation costs");
  await expect(results).toContainText("Buying costs");
  await expect(results).toContainText("Renovations and improvements");
  await expect(results).toContainText("Transaction profit");
  await expect(results).toContainText(
    "Break-even sale price for entered transaction costs",
  );
  await expect(results).toContainText("$688,776");
});

test("shows sale-price sensitivity and recalculates commission", async ({
  page,
}) => {
  const results = page.locator(".results-panel");

  await expect(
    results.getByRole("region", { name: "Sale price sensitivity" }),
  ).toHaveCount(0);

  await fillQuickInputs(page, {
    salePrice: "625000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "10000",
  });

  const sensitivity = results.getByRole("region", {
    name: "Sale price sensitivity",
  });
  await expect(sensitivity).toBeVisible();
  await expect(sensitivity.getByRole("row", { name: /−5%/ })).toContainText(
    "$593,750",
  );
  await expect(sensitivity.getByRole("row", { name: /−5%/ })).toContainText(
    "-$28,125",
  );
  await expect(sensitivity.getByRole("row", { name: /−5%/ })).toContainText(
    "Loss",
  );
  await expect(
    sensitivity.getByRole("row", { name: /Current/ }),
  ).toContainText("$625,000");
  await expect(
    sensitivity.getByRole("row", { name: /Current/ }),
  ).toContainText("$2,500");
  await expect(sensitivity.getByRole("row", { name: /\+5%/ })).toContainText(
    "$656,250",
  );
  await expect(sensitivity.getByRole("row", { name: /\+5%/ })).toContainText(
    "$33,125",
  );
  await expect(sensitivity.getByRole("row", { name: /\+5%/ })).toContainText(
    "Profit",
  );
});

test("calculates the sale price needed for a target transaction profit", async ({
  page,
}) => {
  await expect(page.locator("#target-profit")).toHaveCount(0);

  await fillQuickInputs(page, {
    salePrice: "625000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "10000",
  });

  const targetPlanner = page.getByRole("region", {
    name: "Sale price for a target profit",
  });
  await expect(targetPlanner).toBeVisible();

  await page.locator("#target-profit").fill("100000");
  await expect(page.locator("#target-profit")).toHaveValue("100,000");
  await expect(targetPlanner).toContainText(
    "Sale price needed for this target",
  );
  await expect(targetPlanner).toContainText("$724,490");
  await expect(targetPlanner).toContainText(
    "$99,490 above your expected sale price of $625,000.",
  );

  await page.locator("#target-profit").fill("-1");
  await expect(page.locator("#target-profit-error")).toHaveText(
    "Enter a target profit of zero or more.",
  );
  await expect(targetPlanner).not.toContainText(
    "Sale price needed for this target",
  );
  await expect(page.locator(".primary-result")).toContainText("$2,500");

  await page.locator("#target-profit").fill("1000000000001");
  await expect(page.locator("#target-profit-error")).toHaveText(
    "Enter a target profit no greater than $1 trillion.",
  );
  await expect(targetPlanner).not.toContainText(
    "Sale price needed for this target",
  );

  await page.locator("#target-profit").fill("0");
  await expect(targetPlanner).toContainText("$622,449");
  await expect(targetPlanner).toContainText(
    "$2,551 below your expected sale price of $625,000.",
  );

  await page.getByRole("button", { name: "Reset" }).click();
  await fillQuickInputs(page, {
    salePrice: "625000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "10000",
  });
  await expect(page.locator("#target-profit")).toHaveValue("");
  await expect(targetPlanner).not.toContainText(
    "Sale price needed for this target",
  );
});

test("supports keyboard access to optional details with clear state text", async ({
  page,
}) => {
  const details = page.locator(".transaction-details");
  const summary = details.locator("summary");

  await summary.focus();
  await page.keyboard.press("Enter");

  await expect(details).toHaveAttribute("open", "");
  await expect(
    details.getByText("Hide details", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("#purchase-costs")).toBeVisible();

  await page.keyboard.press("Enter");

  await expect(details).not.toHaveAttribute("open", "");
  await expect(
    details.getByText("Add details", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("#purchase-costs")).not.toBeVisible();
});

test("keeps holding cash flows separate from transaction-profit planning", async ({
  page,
}) => {
  const results = page.locator(".results-panel");

  await fillQuickInputs(page, {
    salePrice: "1000000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "10000",
  });
  await page.getByText("Add holding and loan details", { exact: true }).click();
  await page.locator("#total-holding-costs").fill("55000");
  await page.locator("#total-rental-income").fill("90000");

  const overallResult = page.getByRole("region", {
    name: "Overall pre-tax property result",
  });
  await expect(overallResult).toBeVisible();
  await expect(overallResult).toContainText("$405,000");
  await expect(overallResult).toContainText("Before tax");
  await expect(results.locator(".primary-result")).toContainText("$370,000");
  await expect(results.locator(".secondary-metric")).toContainText("$622,449");
  await expect(
    results.getByRole("row", { name: /Current/ }),
  ).toContainText("$370,000");

  await page.locator("#target-profit").fill("100000");
  await expect(
    page.getByRole("region", { name: "Sale price for a target profit" }),
  ).toContainText("$724,490");

  await page.locator("#total-holding-costs").fill("500000");
  await expect(overallResult).toContainText("-$40,000");
  await expect(
    overallResult.getByText("LOSS", { exact: true }),
  ).toBeVisible();
  await expect(results.locator(".primary-result")).toContainText("$370,000");
});

test("uses loan payout only for simplified settlement cash and labels a shortfall", async ({
  page,
}) => {
  const results = page.locator(".results-panel");

  await fillQuickInputs(page, {
    salePrice: "1000000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "10000",
  });
  await page.getByText("Add holding and loan details", { exact: true }).click();
  await page.locator("#estimated-loan-payout").fill("450000");

  let settlementResult = page.getByRole("region", {
    name: "Estimated cash after loan payout",
  });
  await expect(settlementResult).toBeVisible();
  await expect(settlementResult).toContainText("$520,000");
  await expect(results.locator(".primary-result")).toContainText("$370,000");
  await expect(results.locator(".secondary-metric")).toContainText("$622,449");

  await page.locator("#estimated-loan-payout").fill("1100000");
  settlementResult = page.getByRole("region", {
    name: "Estimated cash shortfall after loan payout",
  });
  await expect(settlementResult).toContainText("-$130,000");
  await expect(
    settlementResult.getByText("SHORTFALL", { exact: true }),
  ).toBeVisible();
  await expect(results.locator(".primary-result")).toContainText("$370,000");
});

test("accepts explicit zero holding, rental and loan amounts", async ({
  page,
}) => {
  await fillQuickInputs(page, {
    salePrice: "1000000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "10000",
  });
  await page.getByText("Add holding and loan details", { exact: true }).click();
  await page.locator("#total-holding-costs").fill("0");
  await page.locator("#total-rental-income").fill("0");
  await page.locator("#estimated-loan-payout").fill("0");

  await expect(
    page.getByRole("region", { name: "Overall pre-tax property result" }),
  ).toContainText("$370,000");
  await expect(
    page.getByRole("region", { name: "Estimated cash after loan payout" }),
  ).toContainText("$970,000");
});

test("shows substituted calculations for every derived result group", async ({
  page,
}) => {
  await fillQuickInputs(page, {
    salePrice: "1000000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "10000",
  });
  await page.getByText("Add holding and loan details", { exact: true }).click();
  await page.locator("#total-holding-costs").fill("55000");
  await page.locator("#total-rental-income").fill("90000");
  await page.locator("#estimated-loan-payout").fill("450000");
  await page.locator("#target-profit").fill("100000");

  const calculationToggles = page.getByText("Show calculation", {
    exact: true,
  });
  await expect(calculationToggles).toHaveCount(6);

  for (let index = 0; index < 6; index += 1) {
    await calculationToggles.nth(index).click();
  }

  await expect(page.locator(".results-panel")).toContainText(
    "$1,000,000 − $20,000 − $10,000",
  );
  await expect(page.locator(".results-panel")).toContainText(
    "$370,000 + $90,000 − $55,000 = $405,000",
  );
  await expect(page.locator(".results-panel")).toContainText(
    "$970,000 − $450,000 = $520,000",
  );
});

test("includes planning scenarios in the printable result", async ({
  page,
}) => {
  await fillQuickInputs(page, {
    salePrice: "1000000",
    purchasePrice: "600000",
    commissionRate: "2",
    sellingCosts: "10000",
  });

  const sensitivity = page.getByRole("region", {
    name: "Sale price sensitivity",
  });
  await expect(sensitivity).toBeVisible();
  await page.locator("#target-profit").fill("100000");
  const targetPlanner = page.getByRole("region", {
    name: "Sale price for a target profit",
  });
  await expect(targetPlanner).toContainText("$724,490");
  await page.getByText("Add holding and loan details", { exact: true }).click();
  await page.locator("#total-holding-costs").fill("55000");
  await page.locator("#total-rental-income").fill("90000");
  await page.locator("#estimated-loan-payout").fill("450000");

  await page.emulateMedia({ media: "print" });

  await expect(sensitivity).toBeVisible();
  await expect(targetPlanner).toContainText("$724,490");
  await expect(
    page.getByRole("region", { name: "Overall pre-tax property result" }),
  ).toContainText("$405,000");
  await expect(
    page.getByRole("region", { name: "Estimated cash after loan payout" }),
  ).toContainText("$520,000");
  await expect(page.locator("#target-profit")).not.toBeVisible();
  await expect(page.locator(".form-panel")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Print or save as PDF" }),
  ).not.toBeVisible();
});

test("does not expose a tax calculation path", async ({ page }) => {
  await expect(page.getByText(/estimate tax/i)).toHaveCount(0);
  await expect(page.getByText(/tax scenario/i)).toHaveCount(0);
  await expect(page.locator('input[type="date"]')).toHaveCount(0);
  await expect(page.locator("#estimate-tax")).toHaveCount(0);
  await expect(
    page.getByText(/does not calculate capital gains tax, income tax/i),
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

  await page.getByText("Add transaction details", { exact: true }).click();
  await expect(
    page.locator(".transaction-details").getByText("Hide details", {
      exact: true,
    }),
  ).toBeVisible();
  await page.locator("#purchase-costs").fill("30000");
  await page.getByText("Add holding and loan details", { exact: true }).click();
  await page.locator("#estimated-loan-payout").fill("250000");

  await page.getByRole("button", { name: "Reset" }).click();

  await expect(page.locator("#sale-price")).toHaveValue("");
  await expect(page.locator("#purchase-price")).toHaveValue("");
  await expect(page.locator("#commission-rate")).toHaveValue("");
  await expect(page.locator("#other-selling-costs")).toHaveValue("");
  await expect(page.locator("#purchase-costs")).not.toBeVisible();
  await expect(page.locator("#estimated-loan-payout")).not.toBeVisible();
  await expect(
    page.locator(".transaction-details").getByText("Add details", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.locator(".holding-details").getByText("Add details", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Sale price sensitivity" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Complete the four quick inputs" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Print or save as PDF" }),
  ).toBeDisabled();
});
