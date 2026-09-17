import { expect, test } from '@playwright/test'

test('About supports the extensionless URL used by Cloudflare', async ({ page }) => {
  await page.route('**/*', async (route) => {
    if (new URL(route.request().url()).origin === 'http://127.0.0.1:4174') {
      await route.continue()
    } else {
      await route.abort()
    }
  })

  for (const path of ['/about', '/about.html']) {
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1, name: 'About', exact: true })).toBeVisible()
    await expect(page).toHaveTitle('About — Igor Rendulic')
    await page.reload()
    await expect(page.getByRole('heading', { level: 1, name: 'About', exact: true })).toBeVisible()
  }
})
