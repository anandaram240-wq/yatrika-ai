import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE_URL = process.env.TEST_TARGET_URL || 'http://127.0.0.1:5173';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_DIR = path.join(process.cwd(), 'docs', 'screenshots', 'v8_1_2_forensic');

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const viewports = [
    { name: '1536x960', width: 1536, height: 960 },
    { name: '1440x900', width: 1440, height: 900 },
    { name: '1024x768', width: 1024, height: 768 },
    { name: '390x844', width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

    // 1. Badami Caves (open drawer with demo itinerary so it shows isAdded = true or false)
    await page.goto(`${BASE_URL}/?view=workspace&detail=poi-badami-caves`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT_DIR, `before_badami_${vp.name}.png`), fullPage: false });

    // Add Badami to trip to see Remove button if not added
    const addBtn = page.locator('.yt-drawer-action-btn.add, button:has-text("Add to Itinerary"), button:has-text("ಪ್ರವಾಸಕ್ಕೆ ಸೇರಿಸಿ")').first();
    if (await addBtn.isVisible()) {
      await addBtn.click({ force: true });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(OUT_DIR, `before_badami_with_remove_${vp.name}.png`), fullPage: false });
    }

    // 2. KSR Bengaluru City Junction (rail-sbc)
    await page.goto(`${BASE_URL}/?view=workspace&detail=rail-sbc`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT_DIR, `before_rail_sbc_${vp.name}.png`), fullPage: false });

    await page.close();
  }

  await browser.close();
  console.log(`Captured before forensic screenshots in ${OUT_DIR}`);
}

main().catch(console.error);
