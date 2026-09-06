import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { Page } from "@playwright/test";

// Opt-in visual evidence for an actual human reviewer, never a language sign-off.
export async function captureTranslationReview(page: Page, locale: string, name: string) {
  if (process.env.CAPTURE_TRANSLATION_REVIEW !== "1" || !["zh-Hans", "ko"].includes(locale)) return;
  if (!["127.0.0.1", "localhost"].includes(new URL(page.url()).hostname)) {
    throw new Error("Translation review screenshots must use the local test server.");
  }
  const directory = new URL("../../outputs/translation-review/", import.meta.url);
  await mkdir(directory, { recursive: true });
  const viewport = page.viewportSize();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: fileURLToPath(new URL(`${locale}-${name}-mobile.png`, directory)), fullPage: true });
  if (viewport) await page.setViewportSize(viewport);
}
