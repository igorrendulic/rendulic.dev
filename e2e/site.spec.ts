import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Local regressions should not depend on Cal.com or embedded media services.
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (url.origin === 'http://127.0.0.1:4174') {
      await route.continue()
    } else {
      await route.abort()
    }
  })
})

test('home navigation reaches About and returns to the projects section', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('IgorRendulic')
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'About', exact: true }).click()
  await expect(page).toHaveURL('/about.html')
  await expect(page.getByRole('heading', { level: 1, name: 'About' })).toBeVisible()
  await page.getByRole('navigation').getByRole('link', { name: 'Projects', exact: true }).click()
  await expect(page).toHaveURL('/#projects')
  await expect(page.getByRole('region', { name: 'Projects', exact: true })).toBeInViewport()
  await expect(page.getByRole('region', { name: 'Projects', exact: true })).toBeFocused()
})

test('a project opens from the homepage and survives refresh', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /^Food Lens AI/ }).click()
  await expect(page).toHaveURL('/projects/project-01/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Food Lens AI')
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Food Lens AI')
  await expect(page).toHaveTitle('Food Lens AI — Igor Rendulic')
  await page.getByRole('link', { name: 'Back to projects' }).click()
  await expect(page).toHaveURL('/#projects')
})

test('project details expand and collapse with the keyboard', async ({ page }) => {
  await page.goto('/projects/project-01/')
  const trigger = page.getByRole('button', { name: 'Low-Latency Vector Retrieval' })
  const detail = page.getByText(/Frequently queried products were kept in a/)
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(detail).toBeHidden()
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect(detail).toBeVisible()
  await page.keyboard.press('Space')
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(detail).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('skip link moves keyboard focus to main content', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
})

test('home fits the viewport and exposes the booking button', async ({ page }, testInfo) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Book a call' })).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBeLessThanOrEqual(page.viewportSize()!.width)
  await testInfo.attach('homepage', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  })
})
