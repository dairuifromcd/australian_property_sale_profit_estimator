"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Locale } from "./i18n/routing";
import type { UsageEvent } from "./usage-events";

function sendUsageEvent(event: UsageEvent, locale: Locale): void {
  void fetch("/api/usage-events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ event, locale }),
    cache: "no-store",
    credentials: "omit",
    keepalive: true,
    referrerPolicy: "no-referrer",
  }).catch(() => undefined);
}

export function useAnonymousUsageEvents({
  locale,
  hasAnyInput,
  canShowEstimate,
  canShowTargetSalePrice,
}: {
  locale: Locale;
  hasAnyInput: boolean;
  canShowEstimate: boolean;
  canShowTargetSalePrice: boolean;
}) {
  const sentEvents = useRef(new Set<UsageEvent>());

  const trackUsageEvent = useCallback(
    (event: UsageEvent) => {
      if (sentEvents.current.has(event)) {
        return;
      }

      sentEvents.current.add(event);
      sendUsageEvent(event, locale);
    },
    [locale],
  );

  useEffect(() => {
    trackUsageEvent("calculator_viewed");
  }, [trackUsageEvent]);

  useEffect(() => {
    if (hasAnyInput) {
      trackUsageEvent("calculator_started");
    }
  }, [hasAnyInput, trackUsageEvent]);

  useEffect(() => {
    if (canShowEstimate) {
      trackUsageEvent("estimate_completed");
    }
  }, [canShowEstimate, trackUsageEvent]);

  useEffect(() => {
    if (canShowTargetSalePrice) {
      trackUsageEvent("target_profit_completed");
    }
  }, [canShowTargetSalePrice, trackUsageEvent]);

  return trackUsageEvent;
}
