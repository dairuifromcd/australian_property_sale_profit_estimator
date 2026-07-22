# Contributing

Thanks for helping improve Property Sale Profit. Changes should keep the calculator
easy to understand, privacy-preserving, and explicit about uncertainty.

## Workflow

1. Start from the latest `main`.
2. Create one short-lived branch per change, for example
   `feat/settlement-cash` or `fix/cgt-rounding`.
3. Keep calculation changes separate from unrelated visual changes.
4. Add or update tests for every calculation rule.
5. Run the local checks before opening a pull request.

```bash
npm ci
npm run lint
npm test
```

## Pull requests

A pull request should explain:

- the user problem it solves
- the calculation or interface behaviour that changed
- assumptions and exclusions
- the tests used to verify the change
- screenshots for visible interface changes

Changes to tax or property-cost assumptions should link to an authoritative
Australian source and state the date on which the rule was checked.

## Product principles

- Ask only for information that changes the estimate materially.
- Prefer progressive disclosure over a long form.
- Distinguish economic profit, settlement cash, capital gain, and tax.
- Never imply that an indicative estimate is professional advice.
- Do not add tracking or external data transmission without documenting it.

## Reporting security issues

Please follow [SECURITY.md](SECURITY.md) and avoid placing credentials, personal
data, or exploit details in a public issue.
