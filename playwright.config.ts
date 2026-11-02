import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45000,
  use: {
    baseURL: process.env.TEST_TARGET_URL || 'https://yatrika-ai.vercel.app',
    channel: 'chrome',
    headless: true,
    viewport: { width: 1440, height: 900 },
  },
});
