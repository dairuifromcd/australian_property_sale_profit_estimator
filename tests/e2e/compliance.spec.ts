import { expect, test } from "@playwright/test";

test("labels the site as a beta and avoids certainty claims", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByLabel("Public beta notice").getByText("Public beta", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Estimate what you might make when you sell.",
    }),
  ).toBeVisible();
  await expect(page.getByText(/Know what you could really make/i)).toHaveCount(
    0,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex.*nofollow|nofollow.*noindex/,
  );
});

test("publishes material limitations and government non-affiliation", async ({
  page,
}) => {
  await page.goto("/disclaimer");

  await expect(
    page.getByRole("heading", {
      name: "Use this estimate as a starting point only",
    }),
  ).toBeVisible();
  await expect(page.getByText("Not professional advice")).toBeVisible();
  await expect(page.getByText("Material limitations")).toBeVisible();
  await expect(page.getByText("No government affiliation")).toBeVisible();
  await expect(page.getByText(/does not prepare or lodge a tax return/i)).toBeVisible();
  await expect(page.getByText(/Nothing here excludes rights or remedies/i)).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex.*nofollow|nofollow.*noindex/,
  );
});

test("explains on-device inputs separately from hosting metadata", async ({
  page,
}) => {
  await page.goto("/privacy");

  await expect(
    page.getByRole("heading", { name: "How your data is handled" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Calculator entries" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Technical request data" }),
  ).toBeVisible();
  await expect(
    page.getByText(/does not transmit or store those entries/i),
  ).toBeVisible();
  await expect(
    page.getByText(/Do not include personal, property or financial information/i),
  ).toBeVisible();
});

test("does not make network requests when calculator values change", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute(
    "data-client-ready",
    "true",
    { timeout: 15_000 },
  );

  const inputValues = ["987654", "543210", "2.2", "7654"];
  const suspiciousRequests: string[] = [];
  page.on("request", (request) => {
    const requestContent = decodeURIComponent(
      `${request.url()} ${request.postData() ?? ""}`,
    ).replaceAll(",", "");
    if (
      request.method() !== "GET" ||
      inputValues.some((value) => requestContent.includes(value))
    ) {
      suspiciousRequests.push(
        `${request.method()} ${request.resourceType()} ${request.url()}`,
      );
    }
  });

  await page.locator("#sale-price").fill("987654");
  await page.locator("#purchase-price").fill("543210");
  await page.locator("#commission-rate").fill("2.2");
  await page.locator("#other-selling-costs").fill("7654");
  await expect(page.locator(".results-panel")).toContainText("$987,654");

  expect(suspiciousRequests).toEqual([]);
  expect(await page.context().cookies()).toEqual([]);
  expect(
    await page.evaluate(() => ({
      localStorage: { ...window.localStorage },
      sessionStorage: { ...window.sessionStorage },
    })),
  ).toEqual({ localStorage: {}, sessionStorage: {} });

  await page.reload();
  await expect(page.locator("#sale-price")).toHaveValue("");
  await expect(page.locator("#purchase-price")).toHaveValue("");
});

test("legal pages remain readable without horizontal overflow on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });

  for (const path of ["/privacy", "/disclaimer"]) {
    await page.goto(path);
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow, `${path} should not overflow`).toBe(false);
  }
});
