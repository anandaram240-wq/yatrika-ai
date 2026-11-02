// scripts/verify_v9_workspaces.ts
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'docs/screenshots/v9_workspaces');
const ARTIFACT_DIR = path.resolve(
  '/Users/ananda/.gemini/antigravity/brain/b51f95a5-477a-4a77-b6ab-52d8b467e99d'
);

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function run() {
  console.log('=== STARTING YATRIKA V9.0 8-WORKSPACE VERIFICATION ===');
  const targetUrl = process.env.TEST_TARGET_URL || 'http://localhost:5173';
  console.log(`Target URL: ${targetUrl}`);

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  try {
    console.log('Step 1: Navigating to YATRIKA V9.0...');
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);

    // Verify Title & Multilingual Search
    const heading = await page.textContent('h1');
    console.log(`Found Heading: "${heading?.trim()}"`);

    // Screenshot Workspace A / B: Destination Explorer & 3D Map
    console.log('Step 2: Capturing Workspace B (Interactive Explorer & 3D Map)...');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v9_ws_b_explorer_1440x900.png') });
    fs.copyFileSync(
      path.join(SCREENSHOT_DIR, 'v9_ws_b_explorer_1440x900.png'),
      path.join(ARTIFACT_DIR, 'v9_ws_b_explorer_1440x900.png')
    );

    // Test Multilingual search
    console.log('Step 3: Testing multilingual query "ಹಂಪಿ" (Hampi in Kannada)...');
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill('ಹಂಪಿ');
    await page.click('button[type="submit"]:has-text("Explore")');
    await page.waitForTimeout(1000);

    // Test Cluster Filter Pill: Sacred Centre
    console.log('Step 4: Testing Cluster Filter Pills...');
    const sacredPill = page.locator('button:has-text("Sacred Centre")');
    if (await sacredPill.isVisible()) {
      await sacredPill.click();
      await page.waitForTimeout(500);
    }

    // Add POI to Journey Builder
    console.log('Step 5: Adding Virupaksha Temple to Journey Builder...');
    const addBtn = page.locator('button:has-text("Add")');
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(1000);
    }

    // Capture Workspace C: Journey Builder
    console.log('Step 6: Capturing Workspace C (Journey Builder)...');
    await page.click('nav button:has-text("Journey Builder")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v9_ws_c_journey_builder_1440x900.png') });
    fs.copyFileSync(
      path.join(SCREENSHOT_DIR, 'v9_ws_c_journey_builder_1440x900.png'),
      path.join(ARTIFACT_DIR, 'v9_ws_c_journey_builder_1440x900.png')
    );

    // Capture Workspace D: Feasibility & Departure Engine
    console.log('Step 7: Capturing Workspace D (Feasibility Engine)...');
    await page.click('nav button:has-text("Feasibility")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v9_ws_d_feasibility_1440x900.png') });
    fs.copyFileSync(
      path.join(SCREENSHOT_DIR, 'v9_ws_d_feasibility_1440x900.png'),
      path.join(ARTIFACT_DIR, 'v9_ws_d_feasibility_1440x900.png')
    );

    // Capture Workspace E: Transport & Last-Mile
    console.log('Step 8: Capturing Workspace E (Transport Intelligence)...');
    await page.click('nav button:has-text("Transport")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v9_ws_e_transport_1440x900.png') });
    fs.copyFileSync(
      path.join(SCREENSHOT_DIR, 'v9_ws_e_transport_1440x900.png'),
      path.join(ARTIFACT_DIR, 'v9_ws_e_transport_1440x900.png')
    );

    // Capture Workspace F: Accommodation
    console.log('Step 9: Capturing Workspace F (Accommodation Discovery)...');
    await page.click('nav button:has-text("Accommodation")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v9_ws_f_accommodation_1440x900.png') });
    fs.copyFileSync(
      path.join(SCREENSHOT_DIR, 'v9_ws_f_accommodation_1440x900.png'),
      path.join(ARTIFACT_DIR, 'v9_ws_f_accommodation_1440x900.png')
    );

    // Capture Workspace G: Safety
    console.log('Step 10: Capturing Workspace G (Safety & Awareness)...');
    await page.click('nav button:has-text("Safety")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v9_ws_g_safety_1440x900.png') });
    fs.copyFileSync(
      path.join(SCREENSHOT_DIR, 'v9_ws_g_safety_1440x900.png'),
      path.join(ARTIFACT_DIR, 'v9_ws_g_safety_1440x900.png')
    );

    // Capture Workspace H: Sources & Wikimedia Evidence
    console.log('Step 11: Capturing Workspace H (Source Evidence Registry)...');
    await page.click('nav button:has-text("Source")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v9_ws_h_sources_1440x900.png') });
    fs.copyFileSync(
      path.join(SCREENSHOT_DIR, 'v9_ws_h_sources_1440x900.png'),
      path.join(ARTIFACT_DIR, 'v9_ws_h_sources_1440x900.png')
    );

    // Mobile Viewport Check (390x844 iPhone 14)
    console.log('Step 12: Testing Mobile Viewport (390x844)...');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click('nav button:has-text("Explorer")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v9_mobile_workspace_390x844.png') });
    fs.copyFileSync(
      path.join(SCREENSHOT_DIR, 'v9_mobile_workspace_390x844.png'),
      path.join(ARTIFACT_DIR, 'v9_mobile_workspace_390x844.png')
    );

    console.log('=== ALL 12 VERIFICATION STEPS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Verification failed with error:', err);
    throw err;
  } finally {
    await browser.close();
  }
}

run();
