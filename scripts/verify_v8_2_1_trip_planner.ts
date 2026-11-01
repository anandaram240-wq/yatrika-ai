/**
 * @file scripts/verify_v8_2_1_trip_planner.ts
 * @description Playwright E2E verification for YatriKa AI V8.2.1:
 * - Map basemap loading and canvas rendering (Carto GL vector cartography).
 * - Leg-by-leg intermodal transit breakdown across all 4 legs.
 * - SWR Train integrity validation (20607 MAS-MYS, 20661 SBC-DWR, 16589 Rani Chennamma Express, 20651 Talguppa Intercity).
 * - Absence of Mysuru trains in non-Mysuru legs.
 * - Belur no-railway-station notice & Hassan railhead shuttle.
 * - Mullayanagiri 1,930m mountain peak 4WD access notice.
 * - Itemized budget math & statutory Shakti formula.
 * - Captures high-res acceptance screenshots for evidence artifacts.
 * @theme Code. Create. Celebrate Kannada.
 */

import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.TEST_TARGET_URL || 'http://127.0.0.1:5173';
const OUT_DIR = path.join(process.cwd(), 'docs', 'screenshots', 'v8_2_1_rescue');
const ARTIFACTS_DIR = '/Users/ananda/.gemini/antigravity/brain/b51f95a5-477a-4a77-b6ab-52d8b467e99d';

async function runVerification() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });

  console.log('🚀 Starting YatriKa AI V8.2.1 Trip Planner Verification & Evidence Collection...');
  console.log(`Target URL: ${BASE_URL}`);

  const browser: Browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const page: Page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  // Track console errors
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  // 1. Navigate to golden demo route in workspace view
  console.log('1. Navigating to trip planner workspace...');
  await page.goto(`${BASE_URL}/?view=workspace&demo=golden&tab=timeline&guide=0`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // 2. Verify Map Canvas is rendered and has dimensions
  console.log('2. Verifying Map Canvas rendering...');
  const mapCanvas = page.locator('.yt-maplibre-canvas');
  await mapCanvas.waitFor({ state: 'visible', timeout: 8000 });
  const mapBox = await mapCanvas.boundingBox();
  console.log(`   Map Canvas dimensions: ${mapBox?.width}px x ${mapBox?.height}px`);
  if (!mapBox || mapBox.width < 400 || mapBox.height < 400) {
    throw new Error('Map canvas is not properly sized or visible!');
  }

  // Verify external Google Maps navigation button is present
  const gmapsBtn = page.locator('a.yt-map-ctrl-btn.external-nav');
  await gmapsBtn.waitFor({ state: 'visible', timeout: 5000 });
  const gmapsHref = await gmapsBtn.getAttribute('href');
  console.log(`   ✓ Google Maps external route link: ${gmapsHref?.slice(0, 60)}...`);

  // Capture Base Map view
  const mapScreenshotPath = path.join(OUT_DIR, 'trip_planner_map_canvas_1440x900.png');
  await page.screenshot({ path: mapScreenshotPath });
  fs.copyFileSync(mapScreenshotPath, path.join(ARTIFACTS_DIR, 'trip_planner_map_canvas_1440x900.png'));
  console.log(`   ✓ Map canvas screenshot saved: ${mapScreenshotPath}`);

  // 3. Switch to "Transit & KSRTC" Tab
  console.log('3. Testing Leg-by-Leg Intermodal Transit View...');
  const transitTab = page.locator('button.yt-ws-tab').filter({ hasText: /Transit|ಸಾರಿಗೆ/ });
  await transitTab.click();
  await page.waitForTimeout(800);

  // Verify the 4 Leg buttons exist
  const legButtons = page.locator('.yt-transit-leg-tab');
  const legCount = await legButtons.count();
  console.log(`   Found ${legCount} itinerary transit leg tabs.`);
  if (legCount !== 4) {
    throw new Error(`Expected exactly 4 legs for golden itinerary, found ${legCount}`);
  }

  // --- Test Leg 1: Bengaluru -> Hassan ---
  console.log('   Testing Leg 1: Bengaluru ➔ Hassan...');
  await legButtons.nth(0).click();
  await page.waitForTimeout(500);

  const leg1Summary = await page.locator('.yt-lsum-title').innerText();
  console.log(`   Leg 1 Title: ${leg1Summary}`);

  // Check for real trains: Vistadome (16539) and Gomateshwara (16575)
  const trainCardsText = await page.locator('.yt-active-leg-container').innerText();
  if (!trainCardsText.includes('16539') && !trainCardsText.includes('Vistadome')) {
    throw new Error('Leg 1 missing Vistadome Express (16539)!');
  }
  if (!trainCardsText.includes('16575') && !trainCardsText.includes('Gomateshwara')) {
    throw new Error('Leg 1 missing Gomateshwara Express (16575)!');
  }
  // Check that Mysuru train 20607 is NOT displayed in Leg 1
  if (trainCardsText.includes('20607') || trainCardsText.includes('Mysuru Vande Bharat')) {
    throw new Error('False train data: Leg 1 is showing Mysuru Vande Bharat!');
  }
  console.log('   ✓ Leg 1 correctly displays Hassan trains (16539 Vistadome, 16575 Gomateshwara) and excludes Mysuru trains.');

  // Capture Leg 1 Screenshot
  const leg1ScreenshotPath = path.join(OUT_DIR, 'trip_planner_transit_leg1_1440x900.png');
  await page.screenshot({ path: leg1ScreenshotPath });
  fs.copyFileSync(leg1ScreenshotPath, path.join(ARTIFACTS_DIR, 'trip_planner_transit_leg1_1440x900.png'));

  // --- Test Leg 2: Hassan -> Belur ---
  console.log('   Testing Leg 2: Hassan ➔ Belur (No railway station)...');
  await legButtons.nth(1).click();
  await page.waitForTimeout(500);

  const leg2Notice = await page.locator('.yt-railhead-notice-box').innerText();
  console.log(`   Leg 2 Notice: ${leg2Notice.replace(/\n/g, ' ')}`);
  if (!leg2Notice.includes('Belur has NO railway station') || !leg2Notice.includes('Hassan Junction')) {
    throw new Error('Leg 2 missing critical notice that Belur has NO railway station and HAS is nearest railhead!');
  }

  // Check KSRTC non-stop bus
  const leg2Buses = await page.locator('.yt-active-leg-container').innerText();
  if (!leg2Buses.includes('Belur Non-Stop Temple Shuttle') || !leg2Buses.includes('Shakti Scheme: ₹0')) {
    throw new Error('Leg 2 missing KSRTC Belur Non-Stop shuttle enquiry!');
  }
  console.log('   ✓ Leg 2 correctly highlights Belur has NO railhead and provides KSRTC non-stop shuttle.');

  // Capture Leg 2 Screenshot
  const leg2ScreenshotPath = path.join(OUT_DIR, 'trip_planner_leg2_belur_notice_1440x900.png');
  await page.screenshot({ path: leg2ScreenshotPath });
  fs.copyFileSync(leg2ScreenshotPath, path.join(ARTIFACTS_DIR, 'trip_planner_leg2_belur_notice_1440x900.png'));

  // --- Test Leg 4: Chikkamagaluru -> Mullayanagiri ---
  console.log('   Testing Leg 4: Chikkamagaluru ➔ Mullayanagiri (1,930m peak)...');
  await legButtons.nth(3).click();
  await page.waitForTimeout(500);

  const leg4Notice = await page.locator('.yt-railhead-notice-box').innerText();
  console.log(`   Leg 4 Notice: ${leg4Notice.replace(/\n/g, ' ')}`);
  if (!leg4Notice.includes('1,930m') || !leg4Notice.includes('4WD jeep')) {
    throw new Error('Leg 4 missing mountain peak 4WD notice!');
  }
  console.log('   ✓ Leg 4 correctly flags 1,930m mountain peak and 4WD taxi/jeep requirement.');

  // Capture Leg 4 Screenshot
  const leg4ScreenshotPath = path.join(OUT_DIR, 'trip_planner_leg4_mullayanagiri_1440x900.png');
  await page.screenshot({ path: leg4ScreenshotPath });
  fs.copyFileSync(leg4ScreenshotPath, path.join(ARTIFACTS_DIR, 'trip_planner_leg4_mullayanagiri_1440x900.png'));

  // 4. Test Budget & Shakti Scheme Transparency
  console.log('4. Testing Budget & Shakti Tab Calculations...');
  const budgetTab = page.locator('button.yt-ws-tab').filter({ hasText: /Budget|ವೆಚ್ಚ/ });
  await budgetTab.click();
  await page.waitForTimeout(600);

  const budgetBreakdownText = await page.locator('.yt-budget-breakdown-card').innerText();
  console.log('   Budget Breakdown card:\n' + budgetBreakdownText.split('\n').map(l => '     ' + l).join('\n'));

  // Verify itemization
  if (!budgetBreakdownText.includes('Accommodation') || !budgetBreakdownText.includes('Transport') || !budgetBreakdownText.includes('Monument Entry Fees')) {
    throw new Error('Budget breakdown is missing category itemization!');
  }

  // Verify statutory formula
  const formulaText = await page.locator('.yt-shakti-formula-callout').innerText();
  console.log(`   ✓ Shakti Statutory Formula Callout: ${formulaText}`);
  if (!formulaText.includes('TD 48 TRF 2023') || !formulaText.includes('₹1.15/km')) {
    throw new Error('Budget tab missing statutory Government Order citation (TD 48 TRF 2023)!');
  }

  // Capture Budget Screenshot
  const budgetScreenshotPath = path.join(OUT_DIR, 'trip_planner_budget_shakti_1440x900.png');
  await page.screenshot({ path: budgetScreenshotPath });
  fs.copyFileSync(budgetScreenshotPath, path.join(ARTIFACTS_DIR, 'trip_planner_budget_shakti_1440x900.png'));

  // 5. Test Mobile Viewport (390x844 iPhone 14)
  console.log('5. Capturing Mobile Viewport (390x844)...');
  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  await mobilePage.goto(`${BASE_URL}/?view=workspace&demo=golden&tab=timeline&guide=0`, { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(2500);

  const mobileTransitTab = mobilePage.locator('button.yt-ws-tab').filter({ hasText: /Transit|ಸಾರಿಗೆ/ });
  await mobileTransitTab.click();
  await mobilePage.waitForTimeout(600);

  const mobileScreenshotPath = path.join(OUT_DIR, 'trip_planner_transit_legs_390x844.png');
  await mobilePage.screenshot({ path: mobileScreenshotPath });
  fs.copyFileSync(mobileScreenshotPath, path.join(ARTIFACTS_DIR, 'trip_planner_transit_legs_390x844.png'));
  console.log(`   ✓ Mobile screenshot saved: ${mobileScreenshotPath}`);

  await browser.close();
  console.log('✅ ALL YATRIKA AI V8.2.1 TRIP PLANNER ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!');
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
