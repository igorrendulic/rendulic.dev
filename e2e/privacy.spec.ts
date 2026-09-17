import { expect, test } from '@playwright/test'

test('compact notice can be dismissed without choosing and stays hidden while browsing', async ({ page }) => {
  const googleRequests: string[] = []
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url())
    if (url.hostname.includes('google')) googleRequests.push(url.href)
    return url.hostname === '127.0.0.1' ? route.continue() : route.abort()
  })
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto('/')
  const banner = page.getByRole('region', { name: 'Analytics cookies' })
  await expect(banner).toBeVisible()
  const bounds = await banner.boundingBox()
  expect(bounds!.height).toBeLessThan(220)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await banner.getByRole('button', { name: 'Dismiss analytics notice' }).click()
  await expect(banner).toHaveCount(0)
  await page.goto('/blog/')
  await expect(banner).toHaveCount(0)
  await page.reload()
  await expect(banner).toHaveCount(0)
  expect(await page.evaluate(() => localStorage.getItem('rendulic.analytics-consent.v1'))).toBeNull()
  expect(googleRequests).toEqual([])
  await page.getByRole('button', { name: 'Cookie settings' }).click()
  await expect(banner).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(banner).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Cookie settings' })).toBeFocused()
})

test('analytics requires opt-in, remembers the choice, and stops after withdrawal', async ({ page, context }) => {
  const googleRequests: string[] = []
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (url.hostname === '127.0.0.1') return route.continue()
    if (url.hostname === 'www.googletagmanager.com') {
      googleRequests.push(url.href)
      return route.fulfill({ contentType: 'application/javascript', body: 'document.cookie = "_ga=test-client; Path=/"' })
    }
    return route.abort()
  })
  await page.goto('/')
  const banner = page.getByRole('region', { name: 'Analytics cookies' })
  await expect(banner).toBeVisible()
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0)
  expect(googleRequests).toEqual([])
  await banner.getByRole('button', { name: 'Reject analytics' }).click()
  await page.reload()
  await expect(banner).toHaveCount(0)
  expect(googleRequests).toEqual([])
  await page.getByRole('button', { name: 'Cookie settings' }).click()
  await expect(banner).toBeVisible()
  await banner.getByRole('button', { name: 'Accept analytics' }).click()
  await expect.poll(() => googleRequests.length).toBe(1)
  await expect.poll(async () => (await context.cookies()).some((cookie) => cookie.name === '_ga')).toBe(true)
  await page.reload()
  await expect.poll(() => googleRequests.length).toBe(2)
  await expect(banner).toHaveCount(0)
  await page.getByRole('button', { name: 'Cookie settings' }).click()
  await banner.getByRole('button', { name: 'Reject analytics' }).click()
  await expect(page.getByRole('button', { name: 'Cookie settings' })).toBeVisible()
  await page.reload()
  expect(googleRequests).toHaveLength(2)
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0)
  expect((await context.cookies()).filter((cookie) => cookie.name.startsWith('_ga'))).toEqual([])
})

test('privacy page and cookie controls work with keyboard at narrow widths', async ({ page }) => {
  await page.route('**/*', (route) => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort())
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto('/privacy/')
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeVisible()
  await expect(page).toHaveTitle('Privacy — Igor Rendulic')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByRole('button', { name: 'Reject analytics' }).focus()
  await page.keyboard.press('Enter')
  const settings = page.getByRole('button', { name: 'Cookie settings' })
  await settings.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: 'Reject analytics' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(settings).toBeFocused()
})

test('unavailable browser storage defaults to no analytics and keeps controls usable', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage blocked') }
    Storage.prototype.setItem = () => { throw new Error('Storage blocked') }
  })
  await page.route('**/*', (route) => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort())
  await page.goto('/')
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0)
  await page.getByRole('button', { name: 'Reject analytics' }).click()
  await expect(page.getByRole('region', { name: 'Analytics cookies' })).toHaveCount(0)
  await page.reload()
  await expect(page.getByRole('region', { name: 'Analytics cookies' })).toBeVisible()
})

test('expired or malformed consent cannot enable analytics', async ({ page }) => {
  await page.route('**/*', (route) => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort())
  for (const saved of ['not-json', JSON.stringify({ choice: 'accepted', savedAt: 0 })]) {
    await page.addInitScript((value) => localStorage.setItem('rendulic.analytics-consent.v1', value), saved)
    await page.goto('/')
    await expect(page.getByRole('region', { name: 'Analytics cookies' })).toBeVisible()
    await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0)
  }
})

test('real Google tag sends no analytics before opt-in @live', async ({ page }) => {
  const events: string[] = []
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (url.hostname === '127.0.0.1') return route.continue()
    if (url.hostname === 'www.googletagmanager.com' && url.pathname === '/gtag/js') return route.continue()
    // Observe collection attempts without sending test events to the property.
    if (url.hostname.endsWith('.google-analytics.com')) events.push(url.href)
    return route.abort()
  })
  await page.goto('/')
  await expect(page.getByRole('region', { name: 'Analytics cookies' })).toBeVisible()
  expect(events).toEqual([])
  await page.getByRole('button', { name: 'Accept analytics' }).click()
  await expect.poll(() => events.length, { timeout: 20_000 }).toBeGreaterThan(0)
})
