import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function fetchBuiltRoute(url, accept) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const requestUrl = new URL(url);

  return worker.fetch(
    new Request(requestUrl, {
      headers: {
        accept,
        host: requestUrl.host,
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function render(url = "http://localhost/") {
  return fetchBuiltRoute(url, "text/html");
}

function tagsWithAttributes(html, tagName, expectedAttributes) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
  return tags.filter((tag) =>
    Object.entries(expectedAttributes).every(([name, value]) =>
      tag.includes(`${name}="${value}"`),
    ),
  );
}

function assertTagAttributes(html, tagName, expectedAttributes) {
  const matchingTags = tagsWithAttributes(
    html,
    tagName,
    expectedAttributes,
  );

  assert.ok(
    matchingTags.length > 0,
    `Expected a <${tagName}> tag with ${JSON.stringify(expectedAttributes)}`,
  );
}

test("server-renders the property sale calculator", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Property Sale Profit \| Australian Property Sale Profit Estimator<\/title>/i,
  );
  assert.match(
    html,
    /Estimate your property sale result and cash position\./,
  );
  assert.doesNotMatch(html, /Important information\s+Important information/);
  assert.doesNotMatch(html, /Know what you could really make/i);
  assert.match(html, /Indicative estimate/);
  assert.match(
    html,
    /Uses only the amounts you enter\. Tax and unentered settlement adjustments are excluded\./,
  );
  assert.doesNotMatch(html, /Public beta|under active development/i);
  assert.match(
    html,
    /<meta[^>]+name="robots"[^>]+content="noindex, nofollow"/i,
  );
  assert.match(html, /Start with four numbers/);
  assert.match(html, /Expected sale price/);
  assert.match(html, /Other selling costs/);
  assert.match(html, /Sale preparation costs/);
  assert.match(html, /Renovations and improvements/);
  assert.match(html, /Estimated loan payout at settlement/);
  assert.match(html, /Total holding costs paid/);
  assert.match(html, /Total rental income received/);
  assert.match(html, /Break-even and target sale price/);
  assert.match(html, /reach a target transaction profit/i);
  assert.doesNotMatch(html, /Estimate tax on the capital gain/);
  assert.doesNotMatch(html, /Include an indicative CGT estimate/);
  assert.match(html, /Complete the four quick inputs/);
  assert.match(
    html,
    /Enter 0 if commission or other selling costs do not apply\./,
  );
  assert.match(html, /id="commission-rate"[^>]*required/);
  assert.match(html, /id="other-selling-costs"[^>]*required/);
  assert.match(html, /id="sale-price"[^>]*type="text"/);
  assert.match(html, /Calculations stay on this device/);
  assert.match(html, /href="\/privacy"/);
  assert.match(html, /href="\/disclaimer"/);
  assert.match(html, /does not calculate capital gains tax/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("indexes only the production host and always uses production canonicals", async () => {
  const productionResponse = await render("https://propertysaleprofit.au/");
  const productionHtml = await productionResponse.text();

  assertTagAttributes(productionHtml, "meta", {
    name: "robots",
    content: "index, follow",
  });
  assertTagAttributes(productionHtml, "link", {
    rel: "canonical",
    href: "https://propertysaleprofit.au/",
  });
  assertTagAttributes(productionHtml, "meta", {
    property: "og:url",
    content: "https://propertysaleprofit.au/",
  });
  assertTagAttributes(productionHtml, "meta", {
    name: "twitter:card",
    content: "summary",
  });
  assert.equal(
    tagsWithAttributes(productionHtml, "meta", { name: "robots" }).length,
    1,
  );
  assert.equal(
    tagsWithAttributes(productionHtml, "link", { rel: "canonical" }).length,
    1,
  );

  for (const url of [
    "https://property-profit-au.dairuifromcd.workers.dev/",
    "https://example-property-profit-au.dairuifromcd.workers.dev/",
    "https://www.propertysaleprofit.au/",
    "https://propertysaleprofit.au.example/",
    "http://localhost/",
  ]) {
    const response = await render(url);
    const html = await response.text();

    assertTagAttributes(html, "meta", {
      name: "robots",
      content: "noindex, nofollow",
    });
    assertTagAttributes(html, "link", {
      rel: "canonical",
      href: "https://propertysaleprofit.au/",
    });
    assert.doesNotMatch(html, /rel="canonical"[^>]+workers\.dev/i);
    assert.doesNotMatch(html, /property="og:url"[^>]+workers\.dev/i);
    assert.equal(
      tagsWithAttributes(html, "meta", { name: "robots" }).length,
      1,
    );
    assert.equal(
      tagsWithAttributes(html, "link", { rel: "canonical" }).length,
      1,
    );
  }
});

test("publishes a distinct production canonical for each public page", async () => {
  for (const [path, canonical] of [
    ["/privacy", "https://propertysaleprofit.au/privacy"],
    ["/disclaimer", "https://propertysaleprofit.au/disclaimer"],
  ]) {
    const response = await render(`https://propertysaleprofit.au${path}`);
    const html = await response.text();

    assertTagAttributes(html, "meta", {
      name: "robots",
      content: "index, follow",
    });
    assertTagAttributes(html, "link", {
      rel: "canonical",
      href: canonical,
    });
    assertTagAttributes(html, "meta", {
      property: "og:url",
      content: canonical,
    });
    assertTagAttributes(html, "meta", {
      property: "og:site_name",
      content: "Property Sale Profit",
    });
    assert.equal(
      tagsWithAttributes(html, "meta", { name: "robots" }).length,
      1,
    );
    assert.equal(
      tagsWithAttributes(html, "link", { rel: "canonical" }).length,
      1,
    );
  }

  const previewResponse = await render(
    "https://example-property-profit-au.dairuifromcd.workers.dev/privacy",
  );
  const previewHtml = await previewResponse.text();
  assertTagAttributes(previewHtml, "meta", {
    name: "robots",
    content: "noindex, nofollow",
  });
  assertTagAttributes(previewHtml, "link", {
    rel: "canonical",
    href: "https://propertysaleprofit.au/privacy",
  });
});

test("serves crawlable robots rules that reference only the production sitemap", async () => {
  const response = await fetchBuiltRoute(
    "https://example-property-profit-au.dairuifromcd.workers.dev/robots.txt",
    "text/plain",
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/plain\b/i);

  const body = await response.text();
  assert.match(body, /^User-Agent: \*\nAllow: \/$/m);
  assert.match(
    body,
    /^Sitemap: https:\/\/propertysaleprofit\.au\/sitemap\.xml$/m,
  );
  assert.doesNotMatch(body, /workers\.dev|localhost/i);
  assert.doesNotMatch(body, /Disallow:\s*\/$/im);
});

test("serves a sitemap containing only canonical public URLs", async () => {
  const response = await fetchBuiltRoute(
    "https://propertysaleprofit.au/sitemap.xml",
    "application/xml",
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^application\/xml\b/i,
  );

  const body = await response.text();
  const locations = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );

  assert.deepEqual(locations, [
    "https://propertysaleprofit.au/",
    "https://propertysaleprofit.au/privacy",
    "https://propertysaleprofit.au/disclaimer",
  ]);
  assert.doesNotMatch(body, /workers\.dev|localhost/i);
  assert.doesNotMatch(body, /<lastmod>/i);
});

test("keeps unknown production URLs out of the index", async () => {
  const response = await render(
    "https://propertysaleprofit.au/this-page-does-not-exist",
  );

  assert.equal(response.status, 404);

  const html = await response.text();
  assertTagAttributes(html, "meta", {
    name: "robots",
    content: "noindex",
  });
  assert.equal(
    tagsWithAttributes(html, "meta", { name: "robots" }).length,
    1,
  );
  assert.equal(
    tagsWithAttributes(html, "link", { rel: "canonical" }).length,
    0,
  );
  assert.equal(
    tagsWithAttributes(html, "meta", { property: "og:url" }).length,
    0,
  );
  assert.match(html, /Page not found/);
});

test("removes disposable starter preview code and metadata", async () => {
  const [
    page,
    calculatorPage,
    calculatorForm,
    resultsPanel,
    transactionResults,
    planningResults,
    resultPrimitives,
    calculator,
    layout,
    packageJson,
  ] =
    await Promise.all([
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/calculator-page.tsx", import.meta.url), "utf8"),
      readFile(
        new URL(
          "../app/calculator-ui/calculator-form.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL("../app/calculator-ui/results-panel.tsx", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL(
          "../app/calculator-ui/transaction-results.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL(
          "../app/calculator-ui/planning-results.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(
        new URL(
          "../app/calculator-ui/result-primitives.tsx",
          import.meta.url,
        ),
        "utf8",
      ),
      readFile(new URL("../app/calculator.ts", import.meta.url), "utf8"),
      readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
      readFile(new URL("../package.json", import.meta.url), "utf8"),
    ]);
  const renderedPageSource = [
    page,
    calculatorPage,
    calculatorForm,
    resultsPanel,
    transactionResults,
    planningResults,
    resultPrimitives,
  ].join("\n");

  assert.doesNotMatch(renderedPageSource, /SkeletonPreview|codex-preview/);
  assert.match(renderedPageSource, /Whole-property transaction loss/);
  assert.match(
    renderedPageSource,
    /Before holding costs, rental income, loan payout and tax/,
  );
  assert.match(renderedPageSource, /Overall pre-tax property result/);
  assert.match(renderedPageSource, /Estimated cash after loan payout/);
  assert.match(renderedPageSource, /Sale price sensitivity/);
  assert.match(renderedPageSource, /"LOSS"/);
  assert.doesNotMatch(
    `${renderedPageSource}\n${calculator}\n${layout}`,
    /estimateTax|estimatedCgt|taxableCapitalGain|TaxResult|PropertyUse/,
  );
  assert.doesNotMatch(layout, /Starter Project|codex-preview/);
  assert.doesNotMatch(layout, /capital gains tax estimate/i);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(
    access(new URL("../app/_sites-preview/SkeletonPreview.tsx", templateRoot)),
  );
  await assert.rejects(
    access(new URL("../app/chatgpt-auth.ts", templateRoot)),
  );
});
