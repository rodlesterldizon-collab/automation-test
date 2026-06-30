import { chromium } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import path from 'node:path';

export async function runLighthouseScan(url: string, isMobile: boolean) {
  // Use a random high port to avoid parallel execution collisions
  const port = Math.floor(Math.random() * (9999 - 9000 + 1)) + 9000;
  
  // Lighthouse requires remote-debugging-port
  const browser = await chromium.launch({
    args: [`--remote-debugging-port=${port}`],
  });
  
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle' });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const urlSlug = url.replace(/^https?:\/\//, '').replace(/[^a-z0-9.-]/gi, '_');
    const deviceType = isMobile ? 'mobile' : 'desktop';
    const reportName = `${urlSlug}_lighthouse_${deviceType}_${timestamp}`;
    const reportDir = path.join(process.cwd(), 'tests/accessibility/reports');

    // Default configuration is mobile. For desktop, we override the formFactor and screenEmulation.
    const config = isMobile ? undefined : {
      extends: 'lighthouse:default',
      settings: {
        formFactor: 'desktop',
        screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }
      }
    };

    await playAudit({
      page: page,
      port: port,
      thresholds: {
        accessibility: 0 // Non-blocking: We don't fail the test, just generate the report
      },
      reports: {
        formats: { html: true },
        name: reportName,
        directory: reportDir
      },
      config: config
    });
    
    console.log(`✅ Lighthouse ${deviceType} report saved to: ${path.join(reportDir, reportName + '.html')}`);
  } catch (error) {
    console.error(`❌ Failed to run Lighthouse ${isMobile ? 'mobile' : 'desktop'} scan for ${url}:`, error);
  } finally {
    await browser.close();
  }
}
