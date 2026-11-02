// scripts/capture_v9_5_showcase.ts
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'docs/screenshots/v9_5_consumer');
const ARTIFACT_DIR = path.resolve('/Users/ananda/.gemini/antigravity/brain/b51f95a5-477a-4a77-b6ab-52d8b467e99d');

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function capture() {
  console.log('Capturing V9.5 Consumer Interface Showcase...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const url = 'https://yatrika-ai.vercel.app';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2500);

  // 1. Interactive Explorer (Default Landing)
  console.log('1. Capturing Explorer View...');
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_explorer_3d_studio.png') });
  fs.copyFileSync(path.join(SCREENSHOT_DIR, '01_explorer_3d_studio.png'), path.join(ARTIFACT_DIR, '01_explorer_3d_studio.png'));

  // 2. Bento Overview
  console.log('2. Capturing Bento Overview...');
  await page.getByRole('button', { name: /Bento Overview/i }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_bento_showcase.png') });
  fs.copyFileSync(path.join(SCREENSHOT_DIR, '02_bento_showcase.png'), path.join(ARTIFACT_DIR, '02_bento_showcase.png'));

  // 3. Journey Builder & Budget Slider
  console.log('3. Capturing Journey Builder & Budget Slider...');
  await page.locator('nav').getByRole('button', { name: /Journey Builder/i }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_journey_builder_budget_slider.png') });
  fs.copyFileSync(path.join(SCREENSHOT_DIR, '03_journey_builder_budget_slider.png'), path.join(ARTIFACT_DIR, '03_journey_builder_budget_slider.png'));

  // 4. Namma Kannada Audio Phrasebook
  console.log('4. Capturing Namma Kannada Audio Phrasebook...');
  await page.locator('nav').getByRole('button', { name: /Namma Kannada Audio/i }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_kannada_audio_phrasebook.png') });
  fs.copyFileSync(path.join(SCREENSHOT_DIR, '04_kannada_audio_phrasebook.png'), path.join(ARTIFACT_DIR, '04_kannada_audio_phrasebook.png'));

  // 5. Mobile view (iPhone 14 Pro: 390x844)
  console.log('5. Capturing Mobile Responsive View...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('nav').getByRole('button', { name: /Interactive Explorer/i }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_mobile_consumer_studio.png') });
  fs.copyFileSync(path.join(SCREENSHOT_DIR, '05_mobile_consumer_studio.png'), path.join(ARTIFACT_DIR, '05_mobile_consumer_studio.png'));

  await browser.close();
  console.log('All V9.5 screenshots captured successfully!');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
