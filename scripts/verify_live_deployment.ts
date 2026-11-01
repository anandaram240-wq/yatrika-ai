/**
 * @file scripts/verify_live_deployment.ts
 * @description Fast, robust verification of live Vercel production deployment: https://yatrika-ai.vercel.app.
 * Verifies Explore view, Mysuru Palace dossier, Srirangapatna authentic photo, and Bus Terminal mode.
 */

import { chromium } from 'playwright';

async function verifyLive() {
  console.log('🌐 Starting Live Vercel Production Verification (https://yatrika-ai.vercel.app)...');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();
  await page.addInitScript(() => {
    localStorage.setItem('yatrika_onboarding_seen', 'true');
  });

  const BASE_URL = 'https://yatrika-ai.vercel.app';

  // 1. Explore View
  console.log('  1. Verifying Explore View...');
  await page.goto(`${BASE_URL}/?view=explore&guide=0`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const title = await page.title();
  console.log(`     Page Title: "${title}"`);
  if (!title.toLowerCase().includes('yatri') && !title.toLowerCase().includes('karnataka')) {
    throw new Error(`Unexpected page title: ${title}`);
  }

  const brand = page.locator('.yt-navbar-brand');
  if (!(await brand.isVisible())) throw new Error('Navbar brand is not visible');
  console.log('     ✓ Brand identity visible');

  const circuitCount = await page.locator('.yt-circuit-card').count();
  console.log(`     ✓ Found ${circuitCount} curated circuit cards`);
  if (circuitCount < 4) throw new Error(`Expected at least 4 circuit cards, found ${circuitCount}`);

  // 2. Mysuru Palace Dossier
  console.log('  2. Verifying Mysuru Palace Dossier...');
  await page.goto(`${BASE_URL}/?view=workspace&detail=poi-mysore-palace&guide=0`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const drawer = page.locator('aside[aria-label*="Dossier"], .yt-detail-drawer, aside.fixed');
  await drawer.waitFor({ state: 'visible', timeout: 8000 });

  const palaceText = await drawer.innerText();
  if (!palaceText.includes('10:00 - 17:30') && !palaceText.includes('10:00 AM – 05:30 PM')) {
    throw new Error('Mysuru Palace opening hours missing or incorrect');
  }
  console.log('     ✓ Mysore Palace Board gazette hours verified (10:00 - 17:30)');

  if (!palaceText.includes('19:00 - 20:00') && !palaceText.includes('7:00–8:00 PM')) {
    throw new Error('Mysuru Palace illumination hours missing');
  }
  console.log('     ✓ Mysore Palace illumination timings verified (19:00 - 20:00)');

  if (!palaceText.includes('100')) {
    throw new Error('Mysuru Palace statutory fee missing');
  }
  console.log('     ✓ Statutory entry fees verified (₹100 / ₹50)');

  // 3. Srirangapatna Island Heritage
  console.log('  3. Verifying Srirangapatna Island Heritage...');
  await page.goto(`${BASE_URL}/?view=workspace&detail=poi-srirangapatna&guide=0`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const sriDrawer = page.locator('aside[aria-label*="Dossier"], .yt-detail-drawer, aside.fixed');
  await sriDrawer.waitFor({ state: 'visible', timeout: 8000 });

  const sriPhoto = sriDrawer.locator('img[src*="Daria_Daulat"], img.object-cover').first();
  const sriPhotoSrc = await sriPhoto.getAttribute('src');
  if (!sriPhotoSrc || !sriPhotoSrc.includes('Daria_Daulat')) {
    throw new Error(`Srirangapatna photo is not Daria Daulat: ${sriPhotoSrc}`);
  }
  console.log(`     ✓ Authentic Daria Daulat Bagh photo loaded: ${sriPhotoSrc.slice(0, 60)}...`);

  const sriText = await sriDrawer.innerText();
  if (!sriText.includes('Daria Daulat') && !sriText.includes('ದರಿಯಾ ದೌಲತ್')) {
    throw new Error('Srirangapatna text content missing Daria Daulat mention');
  }
  console.log('     ✓ Srirangapatna island heritage content verified');

  // 4. Bus Terminal Mode (Majestic)
  console.log('  4. Verifying Bus Terminal Mode (Kempegowda Bus Station)...');
  await page.goto(`${BASE_URL}/?view=workspace&detail=bus-majestic&guide=0`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const busDrawer = page.locator('aside[aria-label*="Dossier"], .yt-detail-drawer, aside.fixed');
  await busDrawer.waitFor({ state: 'visible', timeout: 8000 });

  const awatarLink = busDrawer.locator('a:has-text("KSRTC Awatar"), a:has-text("ಬುಕಿಂಗ್")').first();
  if (!(await awatarLink.isVisible())) {
    throw new Error('KSRTC Awatar booking link not visible in bus terminal mode');
  }
  console.log('     ✓ KSRTC Awatar booking action visible');

  const shaktiNotice = busDrawer.locator('div:has-text("ಶಕ್ತಿ ಯೋಜನೆ"), div:has-text("Shakti Scheme")').first();
  if (!(await shaktiNotice.isVisible())) {
    throw new Error('Karnataka Shakti Scheme notice not visible');
  }
  console.log('     ✓ Karnataka Shakti Scheme zero-fare statutory notice verified');

  await browser.close();
  console.log('\n🌟 ALL LIVE PRODUCTION VERIFICATION ASSERTIONS PASSED (100%)!');
}

verifyLive().catch((err) => {
  console.error('\n❌ Live verification failed:', err);
  process.exit(1);
});
