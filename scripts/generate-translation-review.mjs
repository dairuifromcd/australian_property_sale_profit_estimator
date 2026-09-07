// Run with Node >=22.13: node --experimental-strip-types scripts/generate-translation-review.mjs
// Local review artifact only. This neither contacts reviewers nor grants approval.
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { enAU } from "../app/i18n/messages/en-AU.ts";
import { zhHans } from "../app/i18n/messages/zh-Hans.ts";
import { ko } from "../app/i18n/messages/ko.ts";
import { guideMessages } from "../app/i18n/guide-messages.ts";
import { guideSummary } from "../app/i18n/guide-summary.ts";
import { shareCards } from "../app/i18n/share-cards.ts";

const output = new URL("../outputs/translation-review/", import.meta.url);
const locales = ["en-AU", "zh-Hans", "ko"];
const dictionaries = { "en-AU": enAU, "zh-Hans": zhHans, ko };
const groups = [
  ...Object.keys(enAU).map(key => ({
    title: `Calculator / ${key}`,
    values: locales.map(locale => dictionaries[locale][key]),
  })),
  { title: "Share cards and image alt text", values: locales.map(locale => shareCards[locale]) },
  { title: "Guide body", values: locales.map(locale => guideMessages[locale]) },
  { title: "Guide metadata and link", values: locales.map(locale => guideSummary[locale]) },
];
const escape = value => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);
function flatten(value, prefix = "") {
  if (typeof value === "string") return [[prefix, value]];
  return Object.entries(value).flatMap(([key, item]) =>
    flatten(item, prefix ? `${prefix}.${key}` : key),
  );
}
const sourceFiles = [
  "app/i18n/messages/en-AU.ts", "app/i18n/messages/zh-Hans.ts",
  "app/i18n/messages/ko.ts", "app/i18n/guide-messages.ts", "app/i18n/guide-summary.ts", "app/i18n/share-cards.ts",
];
const hashes = [];
for (const path of sourceFiles) {
  hashes.push([path, createHash("sha256").update(await readFile(new URL(`../${path}`, import.meta.url))).digest("hex")]);
}
const sections = groups.map((group, index) => {
  const maps = group.values.map(value => new Map(flatten(value)));
  return `<section id="section-${index}"><h2>${escape(group.title)}</h2><div class="table-wrap"><table>
    <thead><tr><th scope="col">Source key</th><th scope="col">English source</th><th scope="col">简体中文</th><th scope="col">한국어</th></tr></thead>
    <tbody>${[...maps[0].keys()].map(key => `<tr><th scope="row">${escape(key)}</th>${maps.map((map, i) => `<td lang="${locales[i]}">${escape(map.get(key) ?? "MISSING")}</td>`).join("")}</tr>`).join("\n")}</tbody>
    </table></div></section>`;
}).join("\n");
const screenshots = ["zh-Hans", "ko"].map(locale => `<li>${locale}: ${["calculator", "guide", "privacy", "disclaimer"].map(page => `<a href="${locale}-${page}-mobile.png">${page} mobile</a>`).join(" · ")}</li>`).join("");
await mkdir(output, { recursive: true });
await writeFile(new URL("review.html", output), `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Translation review packet — human approval pending</title><style>
body{font:16px/1.55 system-ui,sans-serif;margin:0;padding:2rem;color:#18313b;background:#faf9f5}main{max-width:1500px;margin:auto}a{color:#155d57}a:focus-visible{outline:3px solid #155d57;outline-offset:3px}.notice{padding:1rem;background:#fff0d2;border:1px solid #cba95c}section{margin:2rem 0}.table-wrap{overflow:auto}table{border-collapse:collapse;width:100%;min-width:860px}td,th{vertical-align:top;text-align:left;border:1px solid #ccd4d2;padding:.75rem;overflow-wrap:anywhere}th{background:#ecf1ef}td{width:29%}thead{position:sticky;top:0}code{overflow-wrap:anywhere}h2{scroll-margin-top:1rem}@media print{body{padding:0}thead{position:static}table{min-width:0}tr{break-inside:avoid}}
</style></head><body><main><h1>Translation review packet</h1><p class="notice"><strong>AI-prepared. Human approval is pending for both languages.</strong> This packet records source strings and proposed translations, not a professional or fluent-human sign-off. Generated ${escape(new Date().toISOString())}.</p>
<p>Review the calculator, guide, privacy and disclaimer in context. Verify transaction profit, overall pre-tax result and simplified cash remain distinct; gross rent is before expenses; loan principal is excluded; each cost is entered once; exact whole-dollar results are not increased by rounding. Do not approve if scope or privacy is unclear.</p>
<p>For each language record reviewer, date, source hashes below, terminology/privacy/scope checks, mobile screenshots checked and requested corrections completed in <code>docs/translation-review.md</code>. A real reviewer supplies the decision; automation must not fill it in.</p>
<h2>Mobile evidence</h2><p>Images are generated with <code>CAPTURE_TRANSLATION_REVIEW=1 npm run test:e2e</code> using fictional amounts on the local server. They are visual evidence for review, not automatic language approval.</p><ul>${screenshots}</ul>
<nav aria-label="Review sections"><ul>${groups.map((group, index) => `<li><a href="#section-${index}">${escape(group.title)}</a></li>`).join("")}</ul></nav>
${sections}<section><h2>Reviewed-source fingerprints</h2><ul>${hashes.map(([path, hash]) => `<li>${escape(path)}<br><code>${hash}</code></li>`).join("")}</ul></section></main></body></html>`);
console.log(new URL("review.html", output).pathname);
