# Accessibility Testing Framework

This directory contains a centralized, isolated accessibility scanner built using Playwright and Axe-Core.

## Running the Tests

To run the accessibility tests locally against one or more URLs, use the following NPM script from the project root:

```bash
npm run test:a11y <url1> [url2] ...
```

Example:
```bash
npm run test:a11y https://www.google.com https://www.bing.com
```

## Interpreting the Results

- **Console Logs**: Violations are logged as prominent warnings in the console during the test execution. These use `chalk` for color-coding to make it easy to spot issues.
- **Non-Blocking**: Finding accessibility violations will *not* fail the test execution (exit code 0). This is intentional to ensure CI/CD pipelines are not blocked by accessibility warnings, while still surfacing them for review.

## Open-Source vs Commercial Limitations

This framework uses the free, open-source `@axe-core/playwright` package which runs the baseline `axe-core` engine. 

**Important Note:** The open-source `axe-core` engine is limited to statically verifiable rules. It **does not** include Deque's proprietary enterprise features such as:
- Intelligent Guided Testing (IGT)
- Complex interaction heuristics (e.g., tracking "elements in the focus order have appropriate interactive roles")
- Automated prompts for manual review

To unlock those advanced rules, you would need to purchase a commercial Axe DevTools Pro license.

## Reports

For every URL scanned, detailed reports are generated in the `tests/accessibility/reports/` directory:

- **Axe JSON Report**: A raw JSON file containing all structural violation data from Axe-Core.
- **Axe HTML Dashboard**: A styled, premium HTML dashboard visualizing all violations, complete with descriptions, affected nodes, and links to rule definitions.
- **Lighthouse HTML Reports**: Comprehensive Google Lighthouse audits (one for Mobile and one for Desktop) providing an overall accessibility score out of 100 alongside lab data.

These tests are integrated into the GitHub Actions workflow (`.github/workflows/playwright.yml`). They run as a separate job (`accessibility-tests`) in parallel with other tests. The generated reports are uploaded as build artifacts for easy download and review.
