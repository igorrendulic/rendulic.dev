import { expect, test } from '@playwright/test'

test('Blog navigation opens a dedicated index with keyboard-accessible post cards', async ({ page }) => {
  await page.route('**/*', (route) => new URL(route.request().url()).origin === 'http://127.0.0.1:4174'
    ? route.continue() : route.abort())
  await page.goto('/')
  await page.getByRole('navigation').getByRole('link', { name: 'Blog', exact: true }).click()
  await expect(page).toHaveURL('/blog/')
  for (const path of ['/blog/', '/blog', '/blog/index.html']) {
    await page.goto(path)
    await expect(page).toHaveTitle('Blog — Igor Rendulic')
    await expect(page.getByRole('heading', { level: 1, name: 'Blog', exact: true })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Blog', exact: true })).toHaveAttribute('aria-current', 'page')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
  await page.reload()
  const card = page.getByRole('link', { name: 'How I Process 10,000+ Emails a Day', exact: true })
  await expect(card.locator('img')).toBeVisible()
  await card.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL('/blog/how-i-process-10000-emails-a-day/')
  await page.getByRole('link', { name: 'Back to blog' }).click()
  await expect(page).toHaveURL('/blog/')
})

test('the first blog post opens from its cover, survives direct loads, and returns to Blog', async ({ page }) => {
  await page.route('**/*', (route) => new URL(route.request().url()).origin === 'http://127.0.0.1:4174'
    ? route.continue() : route.abort())
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  const title = 'How I Process 10,000+ Emails a Day'
  const path = '/blog/how-i-process-10000-emails-a-day'
  await page.goto('/#blog')
  const link = page.getByRole('link', { name: title, exact: true })
  await expect(link.locator('img')).toHaveAttribute('src', '/images/blog/mailio-email-processing-pipeline.png')
  await link.click()
  for (const suffix of ['/', '', '/index.html']) {
    await page.goto(path + suffix)
    await expect(page).toHaveTitle(`${title} — Igor Rendulic`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
    await expect(page.locator('main img')).toHaveCount(2)
    for (const img of await page.locator('main img').all()) {
      await img.scrollIntoViewIfNeeded()
      await expect(img).toBeVisible()
      await expect.poll(() => img.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    await expect(page.getByText(/Role to be added/)).toHaveCount(0)
  }
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
  await page.getByRole('link', { name: 'Back to blog' }).click()
  await expect(page).toHaveURL('/blog/')
  await expect(page.getByRole('heading', { level: 1, name: 'Blog', exact: true })).toBeVisible()
  expect(errors).toEqual([])
})
