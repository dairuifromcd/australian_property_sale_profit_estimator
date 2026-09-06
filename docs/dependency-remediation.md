# Dependency audit remediation

Reviewed on 6 September 2026 (Australia/Brisbane).

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
