import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
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

test("server-renders the property sale calculator", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Property Sale Profit \| Australian Property Sale Profit Estimator<\/title>/i,
  );
  assert.match(html, /Estimate your sale proceeds and transaction result\./);
  assert.doesNotMatch(html, /Important information\s+Important information/);
  assert.doesNotMatch(html, /Know what you could really make/i);
  assert.match(html, /Indicative estimate/);
  assert.match(
    html,
    /Based only on the costs you enter\. Excludes holding costs, debt and tax\./,
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
  assert.match(html, /does not calculate settlement cash/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("removes disposable starter preview code and metadata", async () => {
  const [page, calculator, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/calculator.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.match(page, /Whole-property transaction loss/);
  assert.match(page, /Before holding costs, debt and tax/);
  assert.match(page, /Sale price sensitivity/);
  assert.match(page, /"LOSS"/);
  assert.doesNotMatch(
    `${page}\n${calculator}\n${layout}`,
    /estimateTax|estimatedCgt|taxableCapitalGain|TaxResult|PropertyUse/,
  );
  assert.doesNotMatch(layout, /Starter Project|codex-preview/);
  assert.doesNotMatch(layout, /capital gains tax estimate/i);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(
    access(new URL("../app/_sites-preview/SkeletonPreview.tsx", templateRoot)),
  );
});
