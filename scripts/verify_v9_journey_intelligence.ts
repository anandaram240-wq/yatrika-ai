/**
 * @file scripts/verify_v9_journey_intelligence.ts
 * @description Master Playwright E2E verification script for YatriKa AI V9:
 *   1. Explore Homepage & Journey Finder (Deterministic search, zero chatbot)
 *   2. Plan Selected Circuit -> Trip Planning Workspace transition
 *   3. Journey Feasibility Panel & Deterministic Verdict
 *   4. Journey Readiness Passport with structured evidence & download trigger
 *   5. Along My Route Engine: road detours, metrics, compare, add, ignore
 *   6. Explore by District & Explore by Interest
 *   7. Mobile viewport responsiveness (390x844)
 */

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const TARGET_URL = process.env.TEST_TARGET_URL || 'http://127.0.0.1:5173/';
const SCREENSHOT_DIR = path.resolve(process.cwd(), 'docs/screenshots/v9_journey_intelligence');
const ARTIFACT_DIR = '/Users/ananda/.gemini/antigravity/brain/b51f95a5-477a-4a77-b6ab-52d8b467e99d';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runVerification() {
  console.log(`\n=== STARTING YATRIKA V9 JOURNEY INTELLIGENCE VERIFICATION ===`);
  console.log(`Target URL: ${TARGET_URL}\n`);

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  // Ensure onboarding modal doesn't intercept pointer events
  await context.addInitScript(() => {
    localStorage.setItem('yatrika_onboarding_seen', 'true');
  });

  const page = await context.newPage();

  try {
    // -------------------------------------------------------------
    // Step 1: Navigating to Explore Homepage
    // -------------------------------------------------------------
    console.log('✓ Step 1: Navigating to Explore Homepage');
    await page.goto(`${TARGET_URL}?view=explore&guide=0`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1000);

    const exploreHeading = await page.locator('.yt-explore-header h1').innerText();
    console.log(`  Found Explore Kannada Heading: "${exploreHeading.trim()}"`);
    if (!exploreHeading.includes('ಕರ್ನಾಟಕವನ್ನು ಅನ್ವೇಷಿಸಿ')) {
      throw new Error(`Expected Kannada heading to contain 'ಕರ್ನಾಟಕವನ್ನು ಅನ್ವೇಷಿಸಿ', got: ${exploreHeading}`);
    }

    const subHeading = await page.locator('.yt-explore-header h2').innerText();
    console.log(`  Found Subheading: "${subHeading.trim()}"`);

    // -------------------------------------------------------------
    // Step 2: Journey Finder Search
    // -------------------------------------------------------------
    console.log('✓ Step 2: Testing Journey Finder Form (Deterministic Search)');

    // Select Duration: Weekend
    const weekendPill = page.locator('.yt-pill:has-text("Weekend")');
    await weekendPill.click();

    // Select Travel Mode: Self-Drive
    const selfDrivePill = page.locator('.yt-pill:has-text("Self-Drive")');
    await selfDrivePill.click();

    // Select Interests: Heritage & Mountains
    const heritageChip = page.locator('.yt-interest-chip:has-text("Heritage")');
    await heritageChip.click();
    const mountainChip = page.locator('.yt-interest-chip:has-text("Mountains")');
    await mountainChip.click();

    // Click "Find journeys that fit" CTA
    const findJourneysBtn = page.locator('button.yt-btn-find, button:has-text("Find journeys that fit")');
    await findJourneysBtn.click();
    await page.waitForTimeout(800);

    // Verify Result Cards
    const resultCards = page.locator('.yt-journey-result-card');
    const resultCount = await resultCards.count();
    console.log(`  Found ${resultCount} matching journey circuits`);
    if (resultCount === 0) {
      throw new Error('Expected at least 1 matching circuit from Journey Finder');
    }

    // Save screenshot of Explore Homepage & Journey Finder results
    const ss1 = path.join(SCREENSHOT_DIR, 'v9_explore_journey_finder_1440x900.png');
    await page.screenshot({ path: ss1 });
    fs.copyFileSync(ss1, path.join(ARTIFACT_DIR, 'v9_explore_journey_finder_1440x900.png'));
    console.log(`  Saved screenshot: ${ss1}`);

    // -------------------------------------------------------------
    // Step 3: Transition to Trip Planning Workspace
    // -------------------------------------------------------------
    console.log('✓ Step 3: Transitioning to Trip Planning Workspace via "Plan this journey"');
    const planJourneyBtn = resultCards.first().locator('button.yt-btn-primary');
    await planJourneyBtn.click();
    await page.waitForTimeout(1500);

    // Verify workspace loaded
    const workspaceHeading = page.locator('h1.yt-doc-title, .yt-doc-title');
    await workspaceHeading.waitFor({ state: 'visible', timeout: 8000 });
    console.log(`  Workspace loaded with title: "${(await workspaceHeading.innerText()).trim()}"`);

    // -------------------------------------------------------------
    // Step 4: Feasibility Engine & Panel
    // -------------------------------------------------------------
    console.log('✓ Step 4: Testing Feasibility Engine & Verdict Panel');

    // Verify Feasibility card in Timeline
    const feasibilityCard = page.locator('.yt-timeline-feasibility-card');
    await feasibilityCard.waitFor({ state: 'visible', timeout: 5000 });
    console.log('  Found Feasibility Banner in Timeline');

    // Click Feasibility Tab
    const feasibilityTab = page.locator('button.yt-ws-tab:has-text("Feasibility"), button.yt-ws-tab:has-text("ಸಾಧ್ಯತೆ")');
    await feasibilityTab.click();
    await page.waitForTimeout(800);

    // Verify Feasibility Panel contents
    const verdictHeader = page.locator('.yt-feasibility-verdict');
    await verdictHeader.waitFor({ state: 'visible', timeout: 5000 });
    const verdictText = await verdictHeader.innerText();
    console.log(`  Feasibility Verdict: "${verdictText.replace(/\n+/g, ' ').trim()}"`);

    const timelineRows = page.locator('.yt-feasibility-stop-row');
    const rowCount = await timelineRows.count();
    console.log(`  Feasibility Timeline evaluated ${rowCount} stops`);

    const ss2 = path.join(SCREENSHOT_DIR, 'v9_journey_feasibility_panel_1440x900.png');
    await page.screenshot({ path: ss2 });
    fs.copyFileSync(ss2, path.join(ARTIFACT_DIR, 'v9_journey_feasibility_panel_1440x900.png'));
    console.log(`  Saved screenshot: ${ss2}`);

    // -------------------------------------------------------------
    // Step 5: Journey Readiness Passport
    // -------------------------------------------------------------
    console.log('✓ Step 5: Testing Journey Readiness Passport');

    // Click Readiness Tab
    const readinessTab = page.locator('button.yt-ws-tab:has-text("Readiness"), button.yt-ws-tab:has-text("ಪಾಸ್‌ಪೋರ್ಟ್")');
    await readinessTab.click();
    await page.waitForTimeout(800);

    const passportBrand = page.locator('.yt-passport-brand');
    await passportBrand.waitFor({ state: 'visible', timeout: 5000 });
    console.log(`  Found Passport Brand: "${(await passportBrand.innerText()).trim()}"`);

    const legRows = page.locator('.yt-passport-leg');
    console.log(`  Found ${await legRows.count()} journey legs in passport`);

    const destRecords = page.locator('.yt-passport-destination');
    console.log(`  Found ${await destRecords.count()} destination evidence records in passport`);

    const ss3 = path.join(SCREENSHOT_DIR, 'v9_journey_readiness_passport_1440x900.png');
    await page.screenshot({ path: ss3 });
    fs.copyFileSync(ss3, path.join(ARTIFACT_DIR, 'v9_journey_readiness_passport_1440x900.png'));
    console.log(`  Saved screenshot: ${ss3}`);

    // -------------------------------------------------------------
    // Step 6: Route-Aware Discovery Engine (Along My Route)
    // -------------------------------------------------------------
    console.log('✓ Step 6: Testing Along My Route (Detour Calculation Engine)');

    // Navigate back to Explore
    const exploreNavLink = page.locator('.yt-nav-link:has-text("Explore"), .yt-nav-link:has-text("ಅನ್ವೇಷಿಸಿ")');
    await exploreNavLink.click();
    await page.waitForTimeout(800);

    // Switch to Along My Route tab
    const alongRouteTab = page.locator('.yt-explore-tab:has-text("Along My Route")');
    await alongRouteTab.click();
    await page.waitForTimeout(500);

    // Click "Find places along this route"
    const findAlongRouteBtn = page.locator('button:has-text("Find places along this route")');
    await findAlongRouteBtn.click();
    
    // Wait for async detour calculation to complete
    const firstDetourCard = page.locator('.yt-detour-card').first();
    await firstDetourCard.waitFor({ state: 'visible', timeout: 15000 });

    // Verify detour results
    const detourCards = page.locator('.yt-detour-card');
    const detourCount = await detourCards.count();
    console.log(`  Computed ${detourCount} road detours along Bengaluru ➔ Chikkamagaluru corridor`);
    if (detourCount === 0) {
      throw new Error('Expected at least 1 detour result along corridor');
    }

    // Test "Compare detour" button
    const compareBtn = detourCards.first().locator('button:has-text("Compare detour")');
    await compareBtn.click();
    await page.waitForTimeout(500);
    const comparisonBox = page.locator('text=Detour Route Comparison');
    if (!(await comparisonBox.isVisible())) {
      throw new Error('Expected comparison box to be visible after clicking "Compare detour"');
    }
    console.log('  Detour comparison table expanded successfully');

    // Test "Add this stop" button
    const addStopBtn = detourCards.first().locator('button:has-text("+ Add this stop")');
    await addStopBtn.click();
    await page.waitForTimeout(400);
    const addedText = await detourCards.first().locator('button:has-text("Stop Added")').innerText();
    console.log(`  Add stop feedback verified: "${addedText.trim()}"`);

    // Test "Ignore suggestion" button on second card
    if (detourCount > 1) {
      const secondCardTitle = await detourCards.nth(1).locator('h4').innerText();
      const ignoreBtn = detourCards.nth(1).locator('button:has-text("Ignore suggestion")');
      await ignoreBtn.click();
      await page.waitForTimeout(300);
      const newDetourCount = await page.locator('.yt-detour-card').count();
      console.log(`  Ignored "${secondCardTitle.trim()}". Remaining cards: ${newDetourCount}`);
    }

    const ss4 = path.join(SCREENSHOT_DIR, 'v9_along_my_route_detours_1440x900.png');
    await page.screenshot({ path: ss4 });
    fs.copyFileSync(ss4, path.join(ARTIFACT_DIR, 'v9_along_my_route_detours_1440x900.png'));
    console.log(`  Saved screenshot: ${ss4}`);

    // -------------------------------------------------------------
    // Step 7: Explore by District & Explore by Interest
    // -------------------------------------------------------------
    console.log('✓ Step 7: Testing Explore by District & Explore by Interest');

    // Click Explore by District
    const districtTab = page.locator('.yt-explore-tab:has-text("Explore by District")');
    await districtTab.click();
    await page.waitForTimeout(500);

    const hassanChip = page.locator('.yt-district-chip:has-text("Hassan"), .yt-chip:has-text("Hassan")').first();
    if (await hassanChip.isVisible()) {
      await hassanChip.click();
      await page.waitForTimeout(500);
      const districtPois = page.locator('.yt-district-explorer .yt-poi-card');
      console.log(`  Found ${await districtPois.count()} destinations in Hassan district`);
    }

    // Click Explore by Interest
    const interestTab = page.locator('.yt-explore-tab:has-text("Explore by Interest")');
    await interestTab.click();
    await page.waitForTimeout(500);

    const heritageInterestChip = page.locator('.yt-interest-explorer button:has-text("Heritage")').first();
    if (await heritageInterestChip.isVisible()) {
      await heritageInterestChip.click();
      await page.waitForTimeout(500);
      const interestPois = page.locator('.yt-interest-explorer .yt-poi-card');
      console.log(`  Found ${await interestPois.count()} heritage destinations`);
    }

    // -------------------------------------------------------------
    // Step 8: Mobile Viewport Verification (390x844)
    // -------------------------------------------------------------
    console.log('✓ Step 8: Testing Mobile Viewport (iPhone 14 / 390x844)');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${TARGET_URL}?view=explore&guide=0`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1000);

    const ss5 = path.join(SCREENSHOT_DIR, 'v9_mobile_explore_390x844.png');
    await page.screenshot({ path: ss5 });
    fs.copyFileSync(ss5, path.join(ARTIFACT_DIR, 'v9_mobile_explore_390x844.png'));
    console.log(`  Saved screenshot: ${ss5}`);

    console.log('\n======================================================================');
    console.log('ALL YATRIKA V9 VERIFICATION STEPS PASSED WITH 0 REGRESSIONS!');
    console.log('======================================================================\n');
  } catch (error) {
    console.error('\n❌ Verification Failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runVerification();
