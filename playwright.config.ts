import { defineConfig, devices } from '@playwright/test'

const production = !!process.env.E2E_PRODUCTION

export default defineConfig({
  testDir: './e2e',
  testMatch: production ? ['**/privacy.spec.ts', '**/security.spec.ts'] : undefined,
  testIgnore: production ? [] : ['**/privacy.spec.ts', '**/security.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  // External booking-service checks are opt-in, separate from local regressions.
  grepInvert: process.env.E2E_LIVE ? undefined : /@live/,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4174',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    serviceWorkers: 'block',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: production
      ? 'CLOUDFLARE_SEND_METRICS=false WRANGLER_LOG_PATH=/tmp/rendulic-e2e-wrangler.log wrangler dev --local --ip 127.0.0.1 --port 4174'
      : 'npm run dev -- --host 127.0.0.1 --port 4174 --strictPort',
    url: 'http://127.0.0.1:4174',
    // Never silently test a stale server or a different checkout.
    reuseExistingServer: false,
  },
})
