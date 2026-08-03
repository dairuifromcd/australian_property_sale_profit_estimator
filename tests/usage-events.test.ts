import assert from "node:assert/strict";
import test from "node:test";
import {
  handleUsageEventRequest,
  parseUsageEventPayload,
  USAGE_EVENT_LOCALES,
  USAGE_EVENTS,
} from "../app/usage-events.ts";
import { locales } from "../app/i18n/routing.ts";

test("accepts every allow-listed anonymous event and locale", () => {
  assert.deepEqual(USAGE_EVENT_LOCALES, locales);

  for (const event of USAGE_EVENTS) {
    for (const locale of locales) {
      assert.deepEqual(parseUsageEventPayload({ event, locale }), {
        event,
        locale,
      });
    }
  }
});

test("rejects malformed, expanded or unsupported event payloads", () => {
  for (const payload of [
    null,
    [],
    "calculator_started",
    {},
    { event: "calculator_started" },
    { locale: "en-AU" },
    { event: "unknown", locale: "en-AU" },
    { event: "calculator_started", locale: "en-US" },
    { event: "calculator_started", locale: 1 },
    { event: "calculator_started", locale: "en-AU", amount: 1_000_000 },
  ]) {
    assert.equal(parseUsageEventPayload(payload), null);
  }
});

test("records only allow-listed, same-origin anonymous usage events", async () => {
  const dataPoints: AnalyticsEngineDataPoint[] = [];
  const usageAnalytics = {
    writeDataPoint(dataPoint?: AnalyticsEngineDataPoint) {
      if (dataPoint) dataPoints.push(dataPoint);
    },
  };
  const url = "https://propertysaleprofit.au/api/usage-events";
  const sendEvent = (
    payload: unknown,
    {
      origin = new URL(url).origin,
      contentType = "application/json",
      body,
    }: { origin?: string; contentType?: string; body?: string } = {},
  ) =>
    handleUsageEventRequest(
      new Request(url, {
        method: "POST",
        headers: { origin, "content-type": contentType },
        body: body ?? JSON.stringify(payload),
      }),
      usageAnalytics,
      "production",
    );

  const validResponse = await sendEvent({
    event: "estimate_completed",
    locale: "zh-Hans",
  });
  assert.equal(validResponse.status, 204);
  assert.equal(validResponse.headers.get("cache-control"), "no-store");
  assert.deepEqual(dataPoints, [
    {
      indexes: ["production"],
      blobs: ["estimate_completed", "zh-Hans"],
    },
  ]);

  const previewResponse = await handleUsageEventRequest(
    new Request(url, {
      method: "POST",
      headers: {
        origin: new URL(url).origin,
        "content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ event: "print_selected", locale: "ko" }),
    }),
    usageAnalytics,
    "preview",
  );
  assert.equal(previewResponse.status, 204);
  assert.deepEqual(dataPoints.at(-1), {
    indexes: ["preview"],
    blobs: ["print_selected", "ko"],
  });

  for (const [name, response, expectedStatus] of [
    [
      "cross-origin request",
      await sendEvent(
        { event: "calculator_started", locale: "en-AU" },
        { origin: "https://attacker.example" },
      ),
      403,
    ],
    [
      "unsupported media type",
      await sendEvent(
        { event: "calculator_started", locale: "en-AU" },
        { contentType: "text/plain" },
      ),
      415,
    ],
    [
      "JSON-prefix media type",
      await sendEvent(
        { event: "calculator_started", locale: "en-AU" },
        { contentType: "application/jsonp" },
      ),
      415,
    ],
    [
      "expanded payload",
      await sendEvent({
        event: "calculator_started",
        locale: "en-AU",
        salePrice: 987_654,
      }),
      400,
    ],
    [
      "unsupported event",
      await sendEvent({ event: "page_view", locale: "en-AU" }),
      400,
    ],
    [
      "malformed JSON",
      await sendEvent(null, { body: "{" }),
      400,
    ],
    [
      "oversized payload",
      await sendEvent(null, { body: "x".repeat(129) }),
      413,
    ],
  ] as const) {
    assert.equal(response.status, expectedStatus, name);
    assert.equal(response.headers.get("cache-control"), "no-store", name);
  }
  assert.equal(dataPoints.length, 2);
});
