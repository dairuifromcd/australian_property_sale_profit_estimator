import { mkdir } from "node:fs/promises";
import sharp from "sharp";
import { shareCards, shareCardPath } from "../app/i18n/share-cards.ts";

// Uses locally installed fonts; no network fetches. Override on another OS with
// suitable installed Latin, Simplified Chinese and Korean font families.
const fonts = {
  "en-AU": process.env.SHARE_FONT_EN || "Arial",
  "zh-Hans": process.env.SHARE_FONT_ZH || "Hiragino Sans GB",
  ko: process.env.SHARE_FONT_KO || "Apple SD Gothic Neo",
};
const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
await mkdir("public/share", { recursive: true });
for (const [locale, content] of Object.entries(shareCards)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#f6f8f3"/>
    <rect x="0" y="0" width="18" height="630" fill="#286650"/>
    <circle cx="1090" cy="92" r="215" fill="#e2ecdf"/>
    <path d="M965 168 l70 -58 70 58 v96 h-140z" fill="none" stroke="#286650" stroke-width="9" stroke-linejoin="round"/>
    <path d="M1018 264 v-58 h35 v58" fill="none" stroke="#286650" stroke-width="9"/>
    <text x="74" y="91" font-family="Arial" font-size="32" font-weight="700" fill="#286650">Property Sale Profit</text>
    <g font-family="${escape(fonts[locale])}" fill="#193b32" font-size="66" font-weight="700">
      ${content.heading.map((line, index) => `<text x="74" y="${241 + index * 91}">${escape(line)}</text>`).join("")}
    </g>
    <text x="74" y="426" font-family="${escape(fonts[locale])}" font-size="29" fill="#456056">${escape(content.scope)}</text>
    <path d="M74 485 H1126" stroke="#ccd9cd" stroke-width="2"/>
    <text x="74" y="551" font-family="Arial" font-size="28" fill="#286650">propertysaleprofit.au</text>
    <text x="1126" y="551" text-anchor="end" font-family="Arial" font-size="22" fill="#456056">AUD</text>
  </svg>`;
  const target = `public${shareCardPath(locale)}`;
  await sharp(Buffer.from(svg)).png().toFile(target);
  console.log(`Generated ${target} (1200 × 630)`);
}
