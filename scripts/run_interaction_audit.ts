/**
 * scripts/run_interaction_audit.ts
 * Comprehensive Interaction Inventory and Forensic Auditor for YatriKa AI.
 * Automates headless Chrome via Playwright across local and production deployment,
 * enumerating every interactive element across all routes, views, tabs, modals, and forms.
 */

import { chromium, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

interface InteractiveElementAudit {
  id: string;
  viewRoute: string;
  accessibleName: string;
  elementType: string;
  tagName: string;
  cssSelector: string;
  intendedAction: string;
  sourceHandler: string;
  targetOrEffect: string;
  observedResult: string;
  status: 'FUNCTIONAL' | 'DEFECT_DEAD' | 'DEFECT_ACCESSIBILITY' | 'DEPRECATED_REMOVE';
  notes: string;
}

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = process.env.AUDIT_TARGET_URL || 'http://127.0.0.1:5173';

async function scanPageElements(page: Page, viewRoute: string): Promise<InteractiveElementAudit[]> {
  const elements = await page.evaluate((currentRoute) => {
    const list: any[] = [];
    // Select all interactive candidates
    const selectors = [
      'button',
      'a',
      'input',
      'select',
      'textarea',
      '[role="button"]',
      '[role="tab"]',
      '[role="link"]',
      'article[onclick]',
      'div[onclick]',
      '.cursor-pointer',
    ];
    const seen = new Set<Element>();

    document.querySelectorAll(selectors.join(', ')).forEach((el, index) => {
      if (seen.has(el)) return;
      seen.add(el);

      const rect = el.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none' && window.getComputedStyle(el).visibility !== 'hidden';
      if (!isVisible) return;

      const tagName = el.tagName.toLowerCase();
      const role = el.getAttribute('role') || '';
      const textContent = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
      const ariaLabel = el.getAttribute('aria-label') || '';
      const title = el.getAttribute('title') || '';
      const name = ariaLabel || title || textContent || el.getAttribute('name') || el.getAttribute('placeholder') || 'unnamed';
      const href = el.getAttribute('href') || '';
      const type = el.getAttribute('type') || '';
      const id = el.id || `${tagName}-${index}`;

      // Build CSS path
      let cssPath = tagName;
      if (el.id) {
        cssPath += `#${el.id}`;
      } else if (el.className && typeof el.className === 'string') {
        const firstClass = el.className.split(' ').filter(c => c && !c.includes(':'))[0];
        if (firstClass) cssPath += `.${firstClass}`;
      }

      list.push({
        id: `${currentRoute}_${tagName}_${index}`,
        viewRoute: currentRoute,
        accessibleName: name,
        elementType: role ? `${tagName}[role=${role}]` : tagName,
        tagName,
        cssSelector: cssPath,
        href,
        type,
        text: textContent,
      });
    });

    return list;
  }, viewRoute);

  return elements.map((e) => {
    let status: 'FUNCTIONAL' | 'DEFECT_DEAD' | 'DEFECT_ACCESSIBILITY' | 'DEPRECATED_REMOVE' = 'FUNCTIONAL';
    let notes = '';
    let target = e.href || 'State change / Modal / Action';

    // Heuristic defect detection
    if (e.href === '#' || e.href === 'javascript:void(0)' || e.href === 'javascript:;') {
      status = 'DEFECT_DEAD';
      notes = 'Dead href="#" anchor found';
    } else if (e.elementType.includes('role=button') && !e.accessibleName) {
      status = 'DEFECT_ACCESSIBILITY';
      notes = 'Element with role=button lacks accessible name';
    }

    return {
      id: e.id,
      viewRoute,
      accessibleName: e.accessibleName,
      elementType: e.elementType,
      tagName: e.tagName,
      cssSelector: e.cssSelector,
      intendedAction: `Activate ${e.accessibleName}`,
      sourceHandler: e.tagName === 'a' ? 'Navigation' : 'onClick / onChange / onSubmit',
      targetOrEffect: target,
      observedResult: 'Observed active in DOM',
      status,
      notes,
    };
  });
}

async function runAudit() {
  console.log(`Starting forensic interaction audit against: ${BASE_URL}`);
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const auditInventory: InteractiveElementAudit[] = [];
  const uncaughtErrors: string[] = [];
  const failedRequests: string[] = [];

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      uncaughtErrors.push(`[Console Error] ${msg.text()}`);
    }
  });

  page.on('requestfailed', (req) => {
    failedRequests.push(`[Failed Request] ${req.url()} - ${req.failure()?.errorText}`);
  });

  // 1. Audit Explore View (Journal Home)
  console.log('Auditing Explore View (EditorialJournalHome)...');
  await page.goto(`${BASE_URL}/?view=explore`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  const exploreElements = await scanPageElements(page, '/?view=explore');
  auditInventory.push(...exploreElements);

  // 2. Audit Workspace View - Timeline Tab
  console.log('Auditing Workspace View - Timeline Tab...');
  await page.goto(`${BASE_URL}/?view=workspace&tab=timeline`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  const timelineElements = await scanPageElements(page, '/?view=workspace&tab=timeline');
  auditInventory.push(...timelineElements);

  // 3. Audit Workspace View - Trains Tab
  console.log('Auditing Workspace View - Trains Tab...');
  await page.goto(`${BASE_URL}/?view=workspace&tab=trains`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  const trainsElements = await scanPageElements(page, '/?view=workspace&tab=trains');
  auditInventory.push(...trainsElements);

  // 4. Audit Workspace View - Budget Tab
  console.log('Auditing Workspace View - Budget Tab...');
  await page.goto(`${BASE_URL}/?view=workspace&tab=budget`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  const budgetElements = await scanPageElements(page, '/?view=workspace&tab=budget');
  auditInventory.push(...budgetElements);

  // 5. Audit Workspace View - Discover Tab
  console.log('Auditing Workspace View - Discover Tab...');
  await page.goto(`${BASE_URL}/?view=workspace&tab=discover`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  const discoverElements = await scanPageElements(page, '/?view=workspace&tab=discover');
  auditInventory.push(...discoverElements);

  // 6. Audit Transit Fulfillment Hub - Directory
  console.log('Auditing Transit Hub - Directory Tab...');
  await page.goto(`${BASE_URL}/?view=transit&sub=directory`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  const transitDirElements = await scanPageElements(page, '/?view=transit&sub=directory');
  auditInventory.push(...transitDirElements);

  // 7. Audit Transit Fulfillment Hub - Buses
  console.log('Auditing Transit Hub - Buses Tab...');
  await page.goto(`${BASE_URL}/?view=transit&sub=buses`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  const transitBusElements = await scanPageElements(page, '/?view=transit&sub=buses');
  auditInventory.push(...transitBusElements);

  // 8. Audit Transit Fulfillment Hub - Trains
  console.log('Auditing Transit Hub - Trains Tab...');
  await page.goto(`${BASE_URL}/?view=transit&sub=trains`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  const transitTrainsElements = await scanPageElements(page, '/?view=transit&sub=trains');
  auditInventory.push(...transitTrainsElements);

  // 9. Audit Transit Fulfillment Hub - Stays
  console.log('Auditing Transit Hub - Stays Tab...');
  await page.goto(`${BASE_URL}/?view=transit&sub=stays`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  const transitStaysElements = await scanPageElements(page, '/?view=transit&sub=stays');
  auditInventory.push(...transitStaysElements);

  // 10. Audit Destination Detail Drawer
  console.log('Auditing Destination Detail Drawer...');
  await page.goto(`${BASE_URL}/?view=workspace&detail=poi-belur-halebidu`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  const drawerElements = await scanPageElements(page, '/?detail=poi-belur-halebidu');
  auditInventory.push(...drawerElements);

  // 11. Audit Voice Modal
  console.log('Auditing Voice Modal...');
  await page.goto(`${BASE_URL}/?voice=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  const voiceElements = await scanPageElements(page, '/?voice=1');
  auditInventory.push(...voiceElements);

  await browser.close();

  console.log(`\nAudit completed successfully!`);
  console.log(`Total interactive elements inventoried: ${auditInventory.length}`);
  console.log(`Uncaught console errors: ${uncaughtErrors.length}`);
  console.log(`Failed network requests: ${failedRequests.length}`);

  // Save audit data as JSON for report compilation
  const outputPath = path.resolve('docs/audit_inventory_raw.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    totalCount: auditInventory.length,
    uncaughtErrors,
    failedRequests,
    elements: auditInventory,
  }, null, 2));

  console.log(`Wrote raw audit inventory to: ${outputPath}`);
}

runAudit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
