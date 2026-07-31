import assert from "node:assert/strict";
import test from "node:test";

import { validationErrorCodes } from "../app/calculator.ts";
import { enAU } from "../app/i18n/messages/en-AU.ts";
import { ko } from "../app/i18n/messages/ko.ts";
import { zhHans } from "../app/i18n/messages/zh-Hans.ts";
import {
  locales,
  pathFor,
} from "../app/i18n/routing.ts";

function entries(value: unknown, prefix = ""): [string, string][] {
  if (typeof value === "string") {
    return [[prefix, value]];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      entries(item, `${prefix}[${index}]`),
    );
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      entries(item, prefix ? `${prefix}.${key}` : key),
    );
  }

  return [];
}

function placeholders(value: string): string[] {
  return [...value.matchAll(/\{([^}]+)\}/g)]
    .map((match) => match[1])
    .sort();
}

test("all locale dictionaries have the complete English source shape", () => {
  const englishEntries = entries(enAU);
  const englishKeys = englishEntries.map(([key]) => key);

  for (const dictionary of [zhHans, ko]) {
    const translatedEntries = entries(dictionary);

    assert.deepEqual(
      translatedEntries.map(([key]) => key),
      englishKeys,
    );
    assert.ok(
      translatedEntries.every(([, value]) => value.trim().length > 0),
    );

    for (let index = 0; index < englishEntries.length; index += 1) {
      assert.deepEqual(
        placeholders(translatedEntries[index][1]),
        placeholders(englishEntries[index][1]),
        `Placeholder mismatch at ${englishEntries[index][0]}`,
      );
    }
  }
});

test("every calculator validation code has a message in every locale", () => {
  for (const dictionary of [enAU, zhHans, ko]) {
    assert.deepEqual(
      Object.keys(dictionary.validation).sort(),
      [...validationErrorCodes].sort(),
    );
  }
});

test("locale routes preserve the English URLs and localize every page", () => {
  assert.deepEqual(locales, ["en-AU", "zh-Hans", "ko"]);
  assert.equal(pathFor("en-AU", "home"), "/");
  assert.equal(pathFor("en-AU", "privacy"), "/privacy");
  assert.equal(pathFor("en-AU", "disclaimer"), "/disclaimer");
  assert.equal(pathFor("zh-Hans", "home"), "/zh-Hans");
  assert.equal(pathFor("zh-Hans", "privacy"), "/zh-Hans/privacy");
  assert.equal(pathFor("ko", "disclaimer"), "/ko/disclaimer");
});

test("localized source text preserves key scope and privacy boundaries", () => {
  assert.match(zhHans.home.limitationsBody, /不计算资本利得税/);
  assert.match(
    ko.home.limitationsBody,
    /자본이득세\(CGT\).*계산하지 않습니다/,
  );
  assert.match(zhHans.privacy.entriesBody, /不会.*传输.*服务器|不会.*服务器/);
  assert.match(ko.privacy.entriesBody, /서버로 전송하거나 서버에 저장하지 않습니다/);
  assert.match(zhHans.disclaimer.adviceBody, /不提供税务/);
  assert.match(ko.disclaimer.adviceBody, /세무.*조언을 제공하지 않습니다/);
  assert.doesNotMatch(entries(ko).map(([, value]) => value).join(" "), /결제/);
});

test("localized fragments form complete sentences around links", () => {
  assert.equal(enAU.form.salePriceHelpAfter, ".");
  assert.equal(zhHans.form.salePriceHelpAfter, "。");
  assert.equal(ko.form.salePriceHelpAfter, "에서 확인하세요.");
  assert.equal(enAU.privacy.cloudflareAfter, ".");
  assert.equal(zhHans.privacy.cloudflareAfter, "。");
  assert.equal(ko.privacy.cloudflareAfter, ".");

  const email = "support@propertysaleprofit.au";
  const chineseQuestions = `${zhHans.privacy.questionsBefore} ${email}${zhHans.privacy.questionsAfter}`;
  const koreanQuestions = `${ko.privacy.questionsBefore} ${email}${ko.privacy.questionsAfter}`;

  assert.match(chineseQuestions, /support@propertysaleprofit\.au。邮件会通过/);
  assert.doesNotMatch(chineseQuestions, /\.邮件/);
  assert.match(koreanQuestions, /support@propertysaleprofit\.au로 보내 주세요/);
  assert.doesNotMatch(koreanQuestions, /\.au\.\s*로/);
});
