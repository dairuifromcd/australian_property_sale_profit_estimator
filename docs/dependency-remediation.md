# Dependency audit remediation

## Current update — 20 October 2026 (Australia/Brisbane)

The October release candidate had **17 affected package entries: 1 critical,
15 high and 1 moderate**. The compatible updates below reduce the full audit
to **8 high entries**, all from one unpatched `braces` advisory and its parent
chains. The production-only audit reports **0 findings**. The September zero
result further below is historical, not the current full-audit result.

### Outcome and scope

Preserve calculator behaviour, financial scope, locale content, privacy and
Cloudflare configuration while applying the available compatible fixes. No
direct dependency is added, no framework is downgraded, and no audit finding is
suppressed. Acceptance requires reproducible installation, regression checks
and independent review of the remaining development-tool risk; this document
does not approve its own changes for release.

| Package | Before | October candidate | Reason |
| --- | --- | --- | --- |
| `next` / `eslint-config-next` | 16.2.12 | 16.3.8 | First Next 16 patch covering the current advisory ranges; keep the matching lint package. The audit suggests 16.4.2, but 16.3.8 already clears these Next findings. |
| `@cloudflare/vite-plugin` | 1.54.4 | 1.64.0 | Supported existing toolchain update includes patched Miniflare image/network dependencies. |
| `wrangler` | 4.129.0 | 4.151.0 | Match the plugin's declared peer and exact transitive version. |
| `miniflare` / `workerd` | 5.20260903.0-alpha / 1.20260903.1 | 5.20261012.0-beta / 1.20261012.1 | Transitive Cloudflare versions. |
| `undici` | 7.29.0 | 7.29.1 | Resolves the reported response, cache, WebSocket and connection-option advisories. |
| Existing Next `sharp` override | 0.35.3 | 0.35.5 | Resolves the libheif/librsvg advisory ranges. Miniflare also uses this version, removing its older duplicate. |
| `brace-expansion` | 1.1.18 / 5.0.9 | 1.1.21 / 5.0.12 | Same-major fixes for recursive and quadratic-time expansion. This is a different package from the unresolved `braces`. |
| `fast-uri` | 3.1.7 | 3.1.9 | Compatible URI-normalisation fix. |
| `source-map-js` | 1.2.1 | 1.2.2 | Fixes indexed source-map offset denial of service. |

The lockfile also updates the required Next SWC/environment/helper packages,
Cloudflare platform binaries/unenv preset and esbuild 0.28.1 → 0.28.2. Duplicate
optional sharp platform subtrees are deduplicated by npm. React/React DOM/RSC
19.2.8, vinext 1.0.0-beta.9, Vite 8.1.5, TypeScript and the Node >=22.13.0
requirement remain unchanged. No package was replaced with an unreviewed fork.

### Unpatched development dependency: `braces`

[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
affects `braces` through 3.0.3. The official advisory lists **no patched
version**, and the official npm registry's latest release is still 3.0.3.
One malformed, deeply nested brace pattern can exhaust the Node call stack.
The eight audit entries are `braces`, `micromatch`, `fast-glob`,
`@next/eslint-plugin-next`, `eslint-config-next`, `vite-plugin-dynamic-import`,
`vite-plugin-commonjs` and `vinext`; they do not represent eight separate
underlying flaws.

The inspected call paths are local configuration/build tooling:

- Next's lint root-directory helper calls `fast-glob` on
  `settings.next.rootDir`. This repository's lint configuration does not set
  that option; its default is the trusted working directory.
- Vinext loads its CommonJS config transform, whose dynamic-import helper
  expands glob expressions derived from source modules being built. Those
  expressions come from the repository and its installed dependencies, not
  from calculator fields or HTTP request values.

The application's routes do not accept visitor-provided glob patterns.
The fresh local candidate build contained 237 files and 92 source maps with
349 source entries. Scanning those entries found no `braces`, `micromatch`,
`fast-glob`, CommonJS/dynamic-import plugin or Next lint-package modules in the
deployed output. Vinext's runtime itself remains present; its audit entry is
through the separate build-tool dependency chain. Source-map absence is useful
artifact evidence, not a complete proof that every attack path is impossible.
Independent review of the artifact and external-loading boundary is recorded
by the primary release task.

Continue to build only trusted repository content and the committed lockfile;
review dependency/source changes before running them with deployment access.
Do not expose a development server publicly or add visitor-provided glob
patterns. Existing CI has a 15-minute timeout and read-only repository token.
Recheck the upstream fix during dependency maintenance and remove this residual
risk when a compatible patched release is available. No recurring maintenance
automation is created by this change.

An npm-suggested downgrade to old Next/vinext versions would replace the current
supported stack and could reintroduce other issues. The latest vinext 1.2.1
still has the same CommonJS chain and additionally requires React/RSC 19.3.1,
so upgrading it would not resolve this advisory and is outside the smallest
defensible remediation. No `npm audit fix --force`, audit exclusion, removal of
lint checks or arbitrary package alias was used.

### October commands and actual results

All commands ran against the official npm registry using the writable cache
`/private/tmp/property-profit-npm-cache`. The first sandboxed audit failed with
`ENOTFOUND`; its explicitly network-enabled retry obtained the baseline.

| Command | Actual result |
| --- | --- |
| `npm audit --json --cache /private/tmp/property-profit-npm-cache` (baseline) | Exit 1; 17 entries (1 critical, 15 high, 1 moderate). |
| `npm view ... --json --cache /private/tmp/property-profit-npm-cache` | Confirmed package versions, engines, dependencies and peer compatibility for Next, lint config, Cloudflare plugin, Wrangler, Miniflare, sharp, braces and patched transitives. |
| `npm install --cache /private/tmp/property-profit-npm-cache` | Exit 0; 21 packages changed, 4 removed; 11 findings remained. |
| `npm update brace-expansion fast-uri source-map-js --cache /private/tmp/property-profit-npm-cache` | Exit 0; 5 package entries changed; 8 high findings remained. |
| `npm audit --json --cache /private/tmp/property-profit-npm-cache` (candidate) | Exit 1; exactly 8 high parent/leaf entries from the single unpatched braces advisory; no critical, moderate or low findings. |
| `npm audit --omit=dev --json --cache /private/tmp/property-profit-npm-cache` | Exit 0; zero production-only findings. |
| `npm ls --all` | Exit 0; no invalid or missing required dependencies. |
| `npm run lint` | Exit 0. |
| `npm test` | Exit 0; typecheck, production build and 62/62 calculation, locale, privacy and rendered-HTML tests passed. Existing vinext/RSC sourcemap warnings remain. |
| `git diff --check` | Exit 0. |

Temporary machine-readable audit evidence is in
`/private/tmp/oct-audit-before.json`, `/private/tmp/oct-audit-after.json` and
`/private/tmp/oct-audit-prod-after.json`. These local paths are not committed
artifacts. Clean-install, coverage, mutation, browser, remote Preview and final
independent release checks are owned by the primary task and must be recorded
there with their actual results. No commit, push or deployment was performed
by this implementation subtask.

## Historical remediation — 6 September 2026 (Australia/Brisbane)

## Outcome and acceptance criteria

Keep the calculator's existing behaviour, calculation scope and privacy boundaries
while removing the reported dependency advisories. Acceptance requires a
reproducible lockfile install, zero findings in both full and production-only npm
audits, application regression checks and independent review. A clean audit is
evidence about known advisories at the time queried, not a security certification.

The refreshed baseline was **17 affected packages: 7 high and 10 moderate**.
These are npm's package-level counts, including parent packages affected through
dependencies, rather than 17 independently exploitable application flaws.

## Changes

| Package | Before | After | Reason |
| --- | --- | --- | --- |
| `vinext` | 0.0.50 | 1.0.0-beta.9 | Upstream removes vulnerable `image-size`; no patched `image-size` release existed in the npm registry when checked. |
| `@vitejs/plugin-rsc` | 0.5.28 | 0.5.34 | Meet the updated vinext peer requirement without changing React or Vite. |
| `@cloudflare/vite-plugin` | 1.50.0 | 1.54.4 | Updated supported toolchain resolves vulnerable Undici through Miniflare. |
| `wrangler` | 4.118.0 | 4.129.0 | Match the Cloudflare plugin's required peer version. |
| `miniflare` | 5.20260730.0-alpha | 5.20260903.0-alpha | Transitive Cloudflare update. |
| `workerd` and platform binaries | 1.20260730.1 | 1.20260903.1 | Transitive Cloudflare update. |
| `undici` | 7.28.0 | 7.29.0 | Removes response parsing/cache/cookie/body advisories. |
| `postcss` override | 8.5.20 | 8.5.28 | Removes source-map file access advisory across Next, Vite and Tailwind. |
| `qs` override | 6.15.3 | 6.16.0 | Removes query parsing denial-of-service advisories. |
| `nanoid` | 3.3.16 | 3.3.18 | PostCSS dependency resolves zero-size generator loop advisory. |
| `browserslist` | 4.28.2 | 4.28.9 | Removes memory growth and custom-stats parsing advisories. |
| `fast-uri` | 3.1.5 | 3.1.7 | Removes URI canonicalization/normalization advisories. |
| `fflate` | 0.7.4 | 0.7.5 | Removes malformed ZIP64 infinite-loop advisory. |
| `js-yaml` | 4.3.0 | 4.3.2 | Removes quadratic `!!omap` resolution advisory. |

The lockfile also records compatible transitive browser data updates,
`@speed-highlight/core` 1.2.23 → 1.2.24 and `srvx` 0.11.22 → 0.12.8.
Vinext replaces its old tsconfig-path resolver dependencies with
`@vinext/types` 1.0.0-beta.2. No new direct production dependency was added.
Next 16.2.12, React 19.2.8, Vite 8.1.5 and the project's Node >=22.13.0
requirement remain unchanged.

## Decisions and adversarial considerations

- Reviewed the actual advisory chains before editing. A production-only audit
  would have hidden build/tool dependencies, some of which contribute code to
  the deployed bundle; both audit modes are required.
- `image-size` 2.0.2 was the registry's latest release, and every available
  release was affected. The maintained vinext release removes this dependency.
  An override to the same vulnerable package, audit suppression, or deleting
  image functionality would not solve the underlying issue.
- Vinext's beta upgrade is the largest compatibility risk. Its declared peers
  were checked against the existing React/Vite stack and Node 22; application
  build, routing, rendering and browser regression checks remain necessary.
- Existing PostCSS and qs overrides were advanced to patched same-major
  releases. Other remaining alerts were resolved through compatible transitive
  updates, without adding more overrides or running `npm audit fix --force`.
- Cloudflare package upgrades change local build/emulation dependencies only;
  this work did not alter Worker configuration or deploy anything.

Advisories were retrieved from npm's official audit endpoint. Representative
source records: [image-size ICNS loop](https://github.com/advisories/GHSA-w3rx-r6r6-pgpr),
[PostCSS source-map access](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp),
[Undici cache parsing](https://github.com/advisories/GHSA-4cwx-7wf7-3272),
[qs denial of service](https://github.com/advisories/GHSA-4mjr-xmp4-gh2g).
Package dependency and peer metadata were checked using `npm view` against the
official npm registry, including vinext beta.6 and beta.9, image-size, the
Cloudflare plugin, Wrangler, PostCSS, qs and the RSC plugin.

## Dependency verification

Commands use a temporary cache because the default cache is not writable in
this environment. The initial sandboxed audit failed with `ENOTFOUND`; the
network-enabled retry succeeded and supplied the 17-package baseline.

| Command | Actual result |
| --- | --- |
| `npm audit --json --cache /private/tmp/property-profit-npm-cache` (baseline) | Exit 1; 17 findings (7 high, 10 moderate). |
| `npm install --cache /private/tmp/property-profit-npm-cache` | Updated direct dependencies/overrides and lockfile; subsequent audit had 4 findings (3 high, 1 moderate). |
| `npm update browserslist fast-uri fflate js-yaml --cache /private/tmp/property-profit-npm-cache` | Exit 0; 9 packages changed; zero findings. |
| `npm ci --cache /private/tmp/property-profit-npm-cache` | Exit 0; 595 packages installed; zero findings. |
| `npm audit --json --cache /private/tmp/property-profit-npm-cache` (after clean install) | Exit 0; zero findings at all severities. |
| `npm audit --omit=dev --json --cache /private/tmp/property-profit-npm-cache` | Exit 0; zero findings at all severities. |
| `npm ls --all` | Exit 0; no invalid or missing required dependencies. Optional dependencies for other platforms/features are absent. |
| `npm ls --depth=0` | Exit 0; expected direct versions installed. Six optional WASM packages are marked extraneous immediately after clean `npm ci`. |

The six optional install artifacts are `@emnapi/core`, `@emnapi/runtime`,
`@emnapi/wasi-threads`, `@img/sharp-wasm32`, `@napi-rs/wasm-runtime` and
`@tybys/wasm-util`. They exist in the lockfile's optional dependency graph and
are reproducible after clean installation on this macOS ARM64 environment;
they do not represent unresolved audit findings. Their presence has not been
hidden by deleting local files or changing install flags.

## Rendered metadata compatibility

The primary task's first regression run built successfully but four rendered-HTML
checks failed. Inspection of actual built HTML found serialization changes:
root canonical/Open Graph/language URLs omit the equivalent trailing slash;
`hrefLang` is serialized as lowercase `hreflang`; and unknown pages emit the
framework's `noindex` alongside the application's `noindex, nofollow`.
No wrong destination, indexable 404, missing language alternative or incorrect
production/Preview indexing gate was found, so application SEO code was retained.

`tests/rendered-html.test.mjs` now compares attribute names case-insensitively
and absolute URLs by URL meaning. An adversarial assertion test rejects changed
protocol, host, locale path, query, relative destinations, misleading `data-rel`
attributes and non-root trailing-slash differences. The 404 check requires every
robots tag to contain `noindex` and reject `index`; status, absent canonical and
absent Open Graph URL checks remain. Public canonical uniqueness remains tested.

`node --experimental-strip-types --test tests/rendered-html.test.mjs` passed
all 14 tests (exit 0) against the primary task's fresh build.

Full application regression checks and the independent release review are owned
by the primary task and recorded separately. This subtask does not approve its
own changes for production. No production deployment or Linux CI run occurred
as part of this subtask.
