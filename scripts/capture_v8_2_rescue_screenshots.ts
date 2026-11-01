/**
 * @file scripts/capture_v8_2_rescue_screenshots.ts
 * @description Captures high-fidelity desktop and mobile screenshots for Stage 8 Core Experiences:
 * 1. Mysuru Palace Dossier (1440x900 & 390x844)
 * 2. Homepage Search Workflow (1440x900 & 390x844)
 * 3. Srirangapatna Island Heritage (1440x900 & 390x844)
 * Saves to docs/screenshots/v8_2_rescue/ and copies to conversation artifacts directory.
 */

import { chromium, Browser } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.TEST_TARGET_URL || 'http://127.0.0.1:5173';
const OUT_DIR = path.join(process.cwd(), 'docs', 'screenshots', 'v8_2_rescue');
const ARTIFACTS_DIR = '/Users/ananda/.gemini/antigravity/brain/b51f95a5-477a-4a77-b6ab-52d8b467e99d';

const viewports = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '390x844', width: 390, height: 844, isMobile: true, hasTouch: true },
];

async function capture() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser: Browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  console.log('📸 Capturing V8.2 Stage 8 Core Experiences Screenshots...');

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile || false,
      hasTouch: vp.hasTouch || false,
      deviceScaleFactor: 2,
    });

    const page = await context.newPage();

    // Prevent onboarding modal from obscuring
    await page.addInitScript(() => {
      localStorage.setItem('yatrika_onboarding_seen', 'true');
    });

    // =======================================================================
    // 1. SCENARIO 1: MYSURU PALACE DOSSIER
    // =======================================================================
    console.log(`  -> Mysuru Palace Dossier [${vp.name}]`);
    await page.goto(`${BASE_URL}/?view=workspace&detail=poi-mysore-palace&guide=0`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForTimeout(800);

    const drawer = page.locator('aside[aria-label*="Dossier"], .yt-detail-drawer, aside.fixed');
    await drawer.waitFor({ state: 'visible', timeout: 5000 });

    const mysuruPath = path.join(OUT_DIR, `mysuru_palace_dossier_${vp.name}.png`);
    await page.screenshot({ path: mysuruPath, fullPage: false });

    // =======================================================================
    // 2. SCENARIO 2: HOMEPAGE SEARCH WORKFLOW
    // =======================================================================
    console.log(`  -> Homepage Search Workflow [${vp.name}]`);
    await page.goto(`${BASE_URL}/?view=explore&guide=0`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForTimeout(800);

    const searchInput = page.locator('.yt-search-field-main input');
    if (await searchInput.isVisible()) {
      await searchInput.fill('Hampi');
      await page.waitForTimeout(400);
    }

    const homePath = path.join(OUT_DIR, `homepage_search_workflow_${vp.name}.png`);
    await page.screenshot({ path: homePath, fullPage: false });

    // =======================================================================
    // 3. SCENARIO 3: SRIRANGAPATNA ISLAND HERITAGE
    // =======================================================================
    console.log(`  -> Srirangapatna Island Heritage [${vp.name}]`);
    await page.goto(`${BASE_URL}/?view=workspace&detail=poi-srirangapatna&guide=0`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForTimeout(800);

    const sriDrawer = page.locator('aside[aria-label*="Dossier"], .yt-detail-drawer, aside.fixed');
    await sriDrawer.waitFor({ state: 'visible', timeout: 5000 });

    const sriPath = path.join(OUT_DIR, `srirangapatna_dossier_${vp.name}.png`);
    await page.screenshot({ path: sriPath, fullPage: false });

    await context.close();
  }

  await browser.close();

  // Copy captured screenshots to conversation artifacts directory
  const files = fs.readdirSync(OUT_DIR);
  for (const f of files) {
    if (f.endsWith('.png')) {
      const src = path.join(OUT_DIR, f);
      const dst = path.join(ARTIFACTS_DIR, f);
      fs.copyFileSync(src, dst);
      console.log(`  ✓ Copied ${f} to artifacts directory`);
    }
  }

  console.log('\n✨ All Stage 8 Core Experience screenshots captured and archived!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
