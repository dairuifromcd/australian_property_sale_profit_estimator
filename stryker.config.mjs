/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  mutate: ["app/calculator.ts", "app/input-format.ts"],
  testRunner: "command",
  commandRunner: {
    command:
      "node --experimental-strip-types --test tests/calculator.test.ts",
  },
  coverageAnalysis: "off",
  concurrency: 2,
  timeoutMS: 10_000,
  cleanTempDir: "always",
  reporters: ["clear-text", "progress", "html", "json"],
  htmlReporter: {
    fileName: "reports/mutation/index.html",
  },
  jsonReporter: {
    fileName: "reports/mutation/mutation.json",
  },
  thresholds: {
    high: 100,
    low: 100,
    break: 100,
  },
};

export default config;
