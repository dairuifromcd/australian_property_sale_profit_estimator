# Anonymous usage analytics

Property Sale Profit uses Cloudflare Analytics Engine to answer a narrow
product question: are visitors starting and completing the calculator, and are
they using its optional planning features?

## Event schema

The dataset is `property_sale_profit_usage`.

| Analytics Engine field | Value |
| --- | --- |
| `index1` | `production` or `preview` |
| `blob1` | allow-listed event name |
| `blob2` | `en-AU`, `zh-Hans` or `ko` |
| `timestamp` | timestamp added by Cloudflare |

The allow-listed events are:

- `calculator_viewed`: the calculator client first loads in a page visit
- `calculator_started`: the first non-empty calculator or target-profit input
  in a page visit
- `estimate_completed`: the first valid four-input transaction estimate in a
  page visit
- `transaction_details_opened`: the transaction-details section is first
  opened in a page visit
- `holding_details_opened`: the holding-and-loan section is first opened in a
  page visit
- `target_profit_completed`: a valid target sale price is first calculated in
  a page visit
- `print_selected`: print or save as PDF is first selected in a page visit

Each event type is sent at most once per page visit. The application does not
create or store a user or session identifier, so these counts are not unique
people or unique sessions. Reloads, automated browsers and bots can add events.
Use the results as directional aggregate evidence rather than exact conversion
analytics.

Calculator entries, calculated results, page contents, URLs beyond the fixed
event endpoint, IP addresses, user agents and cookies are not written into this
dataset. Cloudflare may separately process ordinary request metadata to host
and protect the Worker, as described in the privacy notice.

## Example aggregate query

Query only `production` when evaluating the public tool so development and
Preview activity is excluded:

```sql
SELECT
  blob1 AS event,
  blob2 AS locale,
  sum(_sample_interval) AS event_count
FROM property_sale_profit_usage
WHERE index1 = 'production'
  AND timestamp >= NOW() - INTERVAL '30' DAY
GROUP BY event, locale
ORDER BY event_count DESC
```

Compare `calculator_viewed`, `calculator_started` and `estimate_completed` to
see whether visitors engage and reach a valid result. The optional-section,
target-profit and print events show which deeper actions are used. Avoid
describing ratios as user conversion rates because no user identifier exists.

Analytics Engine SQL queries require a Cloudflare API token with Account
Analytics Read access. Keep that token outside the repository. Cloudflare
currently retains Analytics Engine data for three months, so export only
aggregate results if a longer trend is needed.
