import { expect, test } from "@playwright/test";

test("labels the estimate scope and avoids certainty claims", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("link", { name: "Property Sale Profit home" }),
  ).toBeVisible();
  await expect(page).toHaveTitle(
    "Property Sale Profit | Australian Property Sale Profit Estimator",
  );
  await expect(
    page.getByLabel("Estimate scope notice").getByText("Indicative estimate", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByLabel("Estimate scope notice").getByText(
      "Uses only the amounts you enter. Tax and unentered settlement adjustments are excluded.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Estimate your property sale result and cash position.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Important information", exact: true }),
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
  await expect(
    page.getByText(/does not predict a sale price, calculate a tax liability/i),
  ).toBeVisible();
  await expect(page.getByText(/Nothing here excludes rights or remedies/i)).toBeVisible();
  await expect(
    page.getByText(/amount remaining after selling costs is before any mortgage payout/i),
  ).toBeVisible();
  await expect(
    page.getByText(/optional settlement cash estimate subtracts only the loan payout entered/i),
  ).toBeVisible();
  await expect(
    page.getByText(/optional overall pre-tax result adds only the rental income entered/i),
  ).toBeVisible();
  await expect(
    page.getByText(/Loan principal repayments are not treated as holding costs/i),
  ).toBeVisible();
  await expect(
    page.getByText(/break-even sale price covers only the transaction costs entered/i),
  ).toBeVisible();
  await expect(
    page.getByText(/Sale-price sensitivity rows mechanically apply 5% below/i),
  ).toBeVisible();
  await expect(
    page.getByText(/not forecasts, valuations or predictions/i),
  ).toBeVisible();
  await expect(
    page.getByText(/does not calculate capital gains tax, income tax/i),
  ).toBeVisible();
  await expect(
    page.getByText(/does not decide their accounting or tax treatment/i),
  ).toBeVisible();
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
    page.getByRole("heading", { name: "Anonymous usage analytics" }),
  ).toBeVisible();
  await expect(
    page.getByText(/does not transmit or store those entries/i),
  ).toBeVisible();
  await expect(
    page.getByText(/does not include calculator entries, page contents/i),
  ).toBeVisible();
  await expect(
    page.getByText(/user or session identifier, or cookies/i),
  ).toBeVisible();
  await expect(
    page.getByText(/retained by Cloudflare for up to three months/i),
  ).toBeVisible();
  await expect(
    page.getByText(/Do not include calculator figures or sensitive personal, property or financial information/i),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "support@propertysaleprofit.au" }),
  ).toHaveAttribute("href", "mailto:support@propertysaleprofit.au");
  await expect(page.getByText(/routed through Cloudflare Email Routing/i)).toBeVisible();
});

test("publishes one support address without exposing the routing inbox", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("link", { name: "support@propertysaleprofit.au" }),
  ).toHaveAttribute("href", "mailto:support@propertysaleprofit.au");
  await expect(page.locator("body")).not.toContainText("info@propertysaleprofit.au");
  await expect(page.locator("body")).not.toContainText("drfromcd.business@gmail.com");
});

test("serves favicon metadata and the ICO fallback for every locale", async ({
  page,
  request,
}) => {
  const faviconResponse = await request.get("/favicon.ico");
  expect(faviconResponse.ok()).toBe(true);
  expect(faviconResponse.headers()["content-type"]).toMatch(
    /^image\/(?:x-icon|vnd\.microsoft\.icon)\b/i,
  );
  expect((await faviconResponse.body()).length).toBeGreaterThan(100);

  for (const path of ["/", "/zh-Hans", "/ko"]) {
    await page.goto(path);
    await expect(
      page.locator(
        'link[rel="icon"][href="/favicon.ico"][type="image/x-icon"]',
      ),
    ).toHaveAttribute("sizes", "16x16 32x32 48x48");
    await expect(
      page.locator(
        'link[rel="icon"][href="/favicon.svg"][type="image/svg+xml"]',
      ),
    ).toHaveAttribute("sizes", "any");
  }
});

test("sends only allow-listed anonymous events without calculator values", async ({
  page,
}) => {
  const usageEvents: Array<Record<string, unknown>> = [];
  await page.route("**/api/usage-events", async (route) => {
    usageEvents.push(route.request().postDataJSON());
    await route.fulfill({
      status: 204,
      headers: { "cache-control": "no-store" },
    });
  });

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
    if (inputValues.some((value) => requestContent.includes(value))) {
      suspiciousRequests.push(
        `${request.method()} ${request.resourceType()} ${request.url()}`,
      );
    }
    if (
      request.method() !== "GET" &&
      new URL(request.url()).pathname !== "/api/usage-events"
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

  await page.locator(".transaction-details summary").click();
  await page.locator(".transaction-details summary").click();
  await page.locator(".transaction-details summary").click();
  await page.locator(".holding-details summary").click();
  await page.locator("#target-profit").fill("100000");
  await page.evaluate(() => {
    window.print = () => undefined;
  });
  await page.getByRole("button", { name: "Print or save as PDF" }).click();

  await expect
    .poll(() => usageEvents.map(({ event }) => event).sort())
    .toEqual(
      [
        "calculator_viewed",
        "calculator_started",
        "estimate_completed",
        "holding_details_opened",
        "print_selected",
        "target_profit_completed",
        "transaction_details_opened",
      ].sort(),
    );

  for (const payload of usageEvents) {
    expect(Object.keys(payload).sort()).toEqual(["event", "locale"]);
    expect(payload.locale).toBe("en-AU");
  }
  expect(new Set(usageEvents.map(({ event }) => event)).size).toBe(
    usageEvents.length,
  );

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
    await expect(
      page.getByRole("link", { name: "Property Sale Profit home" }),
    ).toBeVisible();
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow, `${path} should not overflow`).toBe(false);
  }
});
