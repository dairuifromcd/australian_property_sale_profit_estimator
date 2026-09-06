# Cloudflare branch Preview — 2026-09-06

The owner explicitly authorised deployment to a Cloudflare branch Preview.
The tested working tree was uploaded directly using Wrangler; no production
promotion, Git commit or remote branch push was performed.

- Local branch: `codex/growth-accuracy-preview`
- Worker: `property-profit-au`
- Version: `3b710e4f-72e4-4dd8-9082-49730fb40767`
- Fixed version URL: https://3b710e4f-property-profit-au.dairuifromcd.workers.dev
- Preview alias: https://growth-accuracy-preview-property-profit-au.dairuifromcd.workers.dev

`npm run deploy:preview -- --dry-run` completed successfully, followed by
`npm run deploy:preview -- --preview-alias growth-accuracy-preview --tag
growth-accuracy-preview --message 'Growth and calculation clarity, reviewed
translations, dependency remediation'` (exit 0). Wrangler reported 25 uploaded
asset files and six already present. Commands used the local Wrangler log path.

Against the remote Preview, three Chromium smoke tests passed: localized guide
keyboard navigation, original calculator input retention when opening the guide,
and complete AUD arithmetic with all calculation details in all three locales.
They used `PLAYWRIGHT_BASE_URL` pointing to the alias and the existing project
tests. These synthetic Preview operations are not production behaviour evidence.

An HTTP fetch and assertions verified the Preview homepage returns
`noindex, nofollow` and a single canonical pointing to the production origin.
The sandboxed fetch could not resolve the host; the authorised network retry
succeeded. Pre-upload full regression results remain in the growth/accuracy
plan and dependency-remediation report.

This is a review Preview. Chinese/Korean fluent-human production signoff remains
pending in `translation-review.md`. The upload did not run `versions deploy`,
change production routes, or publish the new version to production traffic.
