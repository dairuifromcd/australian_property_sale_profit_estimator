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
    /<title>SaleProfit AU \| Australian Property Sale Profit Estimator<\/title>/i,
  );
  assert.match(html, /Know what you could really make when you sell\./);
  assert.match(html, /Start with four numbers/);
  assert.match(html, /Expected sale price/);
  assert.match(html, /Eligible selling costs/);
  assert.match(html, /Sale preparation costs/);
  assert.match(html, /Estimate tax on the capital gain/);
  assert.match(html, /Complete the four quick inputs/);
  assert.match(
    html,
    /Enter 0 if commission or eligible selling costs do not apply\./,
  );
  assert.match(html, /id="commission-rate"[^>]*required/);
  assert.match(html, /id="other-selling-costs"[^>]*required/);
  assert.match(html, /id="sale-price"[^>]*type="text"/);
  assert.match(html, /Calculations stay on this device/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("removes disposable starter preview code and metadata", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.match(page, /Held beyond the 12-month threshold/);
  assert.match(page, /Whole-property pre-tax loss/);
  assert.match(page, /Your estimated after-tax loss/);
  assert.match(page, /"LOSS"/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(
    access(new URL("../app/_sites-preview/SkeletonPreview.tsx", templateRoot)),
  );
});
