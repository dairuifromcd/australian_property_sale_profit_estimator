import { isProductionHost } from "../../site-config";
import { handleUsageEventRequest } from "../../usage-events";

const localNoopAnalytics: Pick<AnalyticsEngineDataset, "writeDataPoint"> = {
  writeDataPoint() {},
};

async function usageAnalytics(): Promise<
  Pick<AnalyticsEngineDataset, "writeDataPoint">
> {
  try {
    const { env } = await import("cloudflare:workers");
    return env.USAGE_ANALYTICS;
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ERR_UNSUPPORTED_ESM_URL_SCHEME"
    ) {
      return localNoopAnalytics;
    }

    throw error;
  }
}

export async function POST(request: Request): Promise<Response> {
  return handleUsageEventRequest(
    request,
    await usageAnalytics(),
    isProductionHost(new URL(request.url).host)
      ? "production"
      : "preview",
  );
}
