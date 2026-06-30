import { test } from '@playwright/test';
import { runAxeScan } from './utils/axe-scanner';
import { logViolationsAsWarning } from './utils/log-helper';
import { runLighthouseScan } from './utils/lighthouse-scanner';

const urlsToTest = process.env.URL_LIST;

if (!urlsToTest) {
  console.log('Skipping accessibility tests: No URL_LIST environment variable provided.');
} else {
  const urlArray = urlsToTest.split(',').map(url => url.trim()).filter(url => url.startsWith('http'));

  if (urlArray.length === 0) {
    console.log('Skipping accessibility tests: No valid URLs found in URL_LIST.');
  } else {
    test.describe('Dynamic Accessibility Scans', () => {
      test.beforeAll(() => {
        console.log('Accessibility suite will scan the following URLs:', urlArray);
      });

      for (const url of urlArray) {
        test(`Scan page: ${url}`, async ({ page }) => {
          const violations = await runAxeScan(page, url);
          logViolationsAsWarning(url, violations);
          
          console.log(`Starting Lighthouse Mobile scan for ${url}...`);
          await runLighthouseScan(url, true);
          
          console.log(`Starting Lighthouse Desktop scan for ${url}...`);
          await runLighthouseScan(url, false);
        });
      }
    });
  }
}
