# Home tool discovery and readability — 29 October 2026

The owner subsequently authorised the combined homepage and calculation batch
for publication and acceptance on 29 October. The local-only records below
remain historical verification evidence; current release evidence and the
eventual production result are kept in `outputs/release-2026-10-29/`, including
`final-acceptance.md`. This authorisation does not include outreach email.

## User-visible outcome

A visitor can find the existing standalone agent commission calculator before
starting the full calculator. The three-language homepage keeps the full
calculator as its primary task and retains the selling-costs guide shortcut.
Supporting text has stronger contrast, and Chinese/Korean headings have more
comfortable line spacing without redesigning the site.

## Evidence and hypothesis

- **Before-change snapshot:** the commission shortcut appeared below the full
  calculator; the hero contained the guide shortcut. Both used ordinary links that
  open separate tabs without including calculator entries in the URL.
- **Before-change snapshot:** the independent read-only UX review measured the muted
  colour (`#6d7d83`) at approximately 3.91–4.24:1 against the relevant light
  backgrounds, below the 4.5:1 target for normal supporting text.
- **Hypothesis, not measured demand:** a compact commission shortcut alongside
  the existing guide shortcut will help visitors who only need commission find
  the appropriate tool sooner. Better contrast and spacing may make the
  calculator easier to read. Growth and task-success effects are **Unknown**.
- **Real-user feedback / aggregate behaviour:** no new evidence was collected
  for this change. This is preparation for a possible later outreach pilot;
  no email or other outreach is part of this implementation.

## Smallest implementation

Reuse `CommissionLink` and its existing translated label and new-tab warning in
the hero help area, before the calculator. Keep the lower related-tool section
as another entry point. Darken the shared muted text colour, slightly enlarge
field help, and adjust Chinese/Korean heading line spacing. Do not change
calculation text, formulas, inputs, parsing, validation, result labels, financial
scope, analytics, URLs, persistence, routes, dependencies or privacy behaviour.
Keep the existing comparison table: the independent reviewer inspected the
Chinese and Korean 375px screenshots and found it dense but readable without
clipping, so no table redesign is needed. Let Korean page titles wrap at word
boundaries, with a fallback for an unusually long word. Reduce only homepage
desktop hero whitespace to make room for the shortcut without shrinking text.
Mobile hero spacing keeps its existing values.
Korean header links also wrap at word boundaries, and reset buttons retain a
single readable line rather than shrinking into a narrow vertical column.

## Acceptance criteria

1. All three homepages contain a clearly visible localized commission link
   before the full calculator, with the existing new-tab notice. The guide
   remains available in the same help area and the lower shortcut remains.
2. Keyboard activation opens the same-language standalone tool in a separate
   tab with `noopener noreferrer`; the original calculator's entered figures
   and results remain available. No amounts enter the destination URL.
3. At 1280×720 the full calculator's first 52px money-control border remains
   entirely in the opening viewport in every language after fonts are ready.
   At 320px and 375px the home, commission tool and
   guide do not overflow horizontally or clip the shortcuts or supporting text.
4. The muted supporting-text colour reaches at least 4.5:1 on its relevant
   light backgrounds; field help remains associated with its existing inputs.
   Chinese/Korean headings and the narrow guide table receive independent
   original-size screenshot review, with no claim of real-device testing.
5. Existing calculation, privacy, metadata and language-switching behaviour
   stays intact. Meaningful SSR/E2E assertions protect link discovery, keyboard
   navigation, retained input and viewport behaviour.
6. The primary thread runs lint, application/SSR tests and Chromium E2E after
   edits finish. Independent semantic/rendered review is recorded only after
   it actually occurs. Publication requires the separately authorised release
   process; this branch does not send outreach or deploy itself.

## Verification record

The primary thread's first verification passed lint and completed typechecking
and the production build. Application/SSR tests passed 67/68: the new link-text
assertion did not account for React's server HTML text-node comments. It now
matches the precise pre-calculator anchor and compares its readable label and
new-tab notice while retaining destination, count and security assertions.

The first Chromium run passed 46/47 tests. The English text input's bottom was
729.40625px in a 720px viewport, compared with 715.4px before this batch; the
help links were already on the same line. Removing 16px of desktop hero whitespace
made that text-only assertion pass. Independent visual review then caught the
stronger requirement: the surrounding 52px money-control border still extended
below the viewport. The final correction saves another 12px, with homepage
desktop padding now `8px 4px`. The test waits for `document.fonts.ready` and
measures the entire `.money-input` control, not only its inner text input.
Font sizes, full new-tab notices and mobile hero spacing are preserved.

Original-size Korean screenshots also exposed word-internal navigation breaks
and a vertically squeezed reset label. The final CSS allows Korean navigation
items to wrap at word boundaries and prevents section-heading reset buttons
from shrinking. The localized E2E checks the actual reset text has one rendered
line at 320px, retains keyboard focus and remains entirely visible.

### Final local acceptance — 29 October 2026

The primary thread ran these checks against the final frozen source:

| Command / observation | Actual result |
| --- | --- |
| `npm run lint` | Exit 0 |
| `npm test` | Exit 0; typecheck, production build and 68/68 application/SSR tests passed; application test runner 4.657 seconds |
| `CAPTURE_TRANSLATION_REVIEW=1 npm run test:e2e` | Exit 0; 47/47 Chromium tests passed in 20.4 seconds; 12 translation-review screenshots refreshed |
| Local CLI screenshot/reflow capture | 21 after screenshots plus nine 640px reflow checks; all 30 observations had no horizontal overflow |
| Whole first money control at 1280×720 | Bottom 715.40625px in English; 643.484375px in Chinese and Korean; all three commission shortcuts visible |

The final muted colour is `#52656d`. A WCAG relative-luminance calculation gives
5.59:1 on paper `#f6f5ef`, 6.05:1 on surface `#fffefa`, 5.11:1 on eucalyptus-soft
`#e0eee9`, 5.64:1 on commission-result `#f3f7f2` and 6.10:1 on white. These palette
checks exceed 4.5:1; they are not a full accessibility certification.

The independent readability reviewer gave **GO for local semantic/layout
acceptance**, after viewing six refreshed original-size screenshots: Korean
home at 320px, English home at 1280px and 375px, Chinese home at 375px, Korean
guide at 375px and Chinese commission tool at 320px. It accepted the full
English input border, top shortcuts, Korean navigation/reset/title wrapping and
Chinese commission scope. The apparent repeated yellow banner in an earlier
capture disappeared after stable screenshot capture; each final page had one
static scope banner. No banner runtime change was needed.

The independent `release_reviewer` also viewed the final Korean 320px and
English 1280px images and gave **GO for this local branch**, with no blocking
finding. Both are AI source/Chromium screenshot reviews, not fluent-human,
professional, real-device or screen-reader approval. Reused three-language copy
retains the existing GST, commission-only, transaction-profit and cash scopes.

Logs and before/after images are retained locally under
`outputs/home-discovery-review/`: `lint-final.log`, `unit-final.log`,
`e2e-final.log`, `capture-after.log` and the PNG files. The 12 opt-in mobile
images are under `outputs/translation-review/`. These evidence directories are
ignored by Git and contain fictional calculator scenarios only.

The implementation owner ran `git diff --check` successfully and did not run
parallel builds, tests or dependency installation. This batch did not run a
fresh `npm ci`, coverage/mutation reruns, remote Preview or Linux CI acceptance,
Safari/Firefox, physical-device or screen-reader tests. No commit, push,
deployment or outreach email has been performed for this change. Local GO is
not publication authorisation, and growth/task-success effects remain
**Unknown**.
