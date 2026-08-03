import type { Locale } from "./i18n/routing";

export const USAGE_EVENTS = [
  "calculator_viewed",
  "calculator_started",
  "estimate_completed",
  "transaction_details_opened",
  "holding_details_opened",
  "target_profit_completed",
  "print_selected",
] as const;

export type UsageEvent = (typeof USAGE_EVENTS)[number];

export const USAGE_EVENT_LOCALES = [
  "en-AU",
  "zh-Hans",
  "ko",
] as const satisfies readonly Locale[];

export type UsageEventPayload = {
  event: UsageEvent;
  locale: Locale;
};

export type UsageEnvironment = "production" | "preview";

const MAX_BODY_BYTES = 128;

class BodyTooLargeError extends Error {}

export function isUsageEvent(value: unknown): value is UsageEvent {
  return (
    typeof value === "string" &&
    USAGE_EVENTS.some((event) => event === value)
  );
}

function isUsageEventLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    USAGE_EVENT_LOCALES.some((locale) => locale === value)
  );
}

export function parseUsageEventPayload(
  value: unknown,
): UsageEventPayload | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);

  if (
    keys.length !== 2 ||
    !keys.includes("event") ||
    !keys.includes("locale") ||
    !isUsageEvent(record.event) ||
    !isUsageEventLocale(record.locale)
  ) {
    return null;
  }

  return {
    event: record.event,
    locale: record.locale,
  };
}

function noStoreResponse(status: number): Response {
  return new Response(null, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

async function readBoundedBody(
  body: ReadableStream<Uint8Array> | null,
): Promise<string> {
  if (!body) {
    return "";
  }

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new BodyTooLargeError();
    }

    chunks.push(value);
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(bytes);
}

export async function handleUsageEventRequest(
  request: Request,
  analytics: Pick<AnalyticsEngineDataset, "writeDataPoint">,
  environment: UsageEnvironment,
): Promise<Response> {
  const url = new URL(request.url);
  const origin = request.headers.get("origin");

  if (!origin || origin !== url.origin) {
    return noStoreResponse(403);
  }

  const mediaType = request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (mediaType !== "application/json") {
    return noStoreResponse(415);
  }

  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader !== null) {
    const contentLength = Number(contentLengthHeader);
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return noStoreResponse(413);
    }
  }

  let rawBody: string;
  try {
    rawBody = await readBoundedBody(request.body);
  } catch (error) {
    return noStoreResponse(error instanceof BodyTooLargeError ? 413 : 400);
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return noStoreResponse(400);
  }

  const payload = parseUsageEventPayload(parsedBody);
  if (!payload) {
    return noStoreResponse(400);
  }

  analytics.writeDataPoint({
    indexes: [environment],
    blobs: [payload.event, payload.locale],
  });

  return noStoreResponse(204);
}
