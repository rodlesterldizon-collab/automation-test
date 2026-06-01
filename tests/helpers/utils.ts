import { Locator } from '@playwright/test';

/**
 * Captures screenshots of two elements for visual comparison
 * Returns a tuple containing the image buffers
 */
export async function captureScreenshots(locator1: Locator, locator2: Locator): Promise<[Buffer, Buffer]> {
  return Promise.all([
    locator1.screenshot(),
    locator2.screenshot()
  ]);
}

/**
 * Performs a visual and file-size comparison between two elements
 * Returns comparison metrics for assertions
 */
export async function compareVisuals(locator1: Locator, locator2: Locator) {
  const [img1, img2] = await captureScreenshots(locator1, locator2);
  const [src1, src2] = await Promise.all([
    locator1.getAttribute('src'),
    locator2.getAttribute('src')
  ]);

  return {
    isMatch: img1.equals(img2),
    isSrcMatch: src1 === src2 && src1 !== null
  };
}

export function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
