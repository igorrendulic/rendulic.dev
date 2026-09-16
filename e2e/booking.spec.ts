import { expect, test } from '@playwright/test'

test('Cal.com booking popup loads and closes @live', async ({ page }, testInfo) => {
  test.setTimeout(90_000)
  await page.goto('/')
  // The third-party script installs the click listener asynchronously.
  await page.waitForFunction(() => !!customElements.get('cal-modal-box'))
  const book = page.getByRole('button', { name: 'Book a call' })
  await book.click()
  const modal = page.locator('cal-modal-box')
  const frame = modal.locator('iframe')
  const close = modal.getByRole('button', { name: 'Close', exact: true })
  // The custom-element host has no box; visibility belongs to its contents.
  await expect(modal).toHaveAttribute('state', 'loaded', { timeout: 60_000 })
  await expect(frame).toHaveAttribute('src', /\/igor-rendulic\/rendulic\.dev/)
  await expect(frame).toBeVisible()
  await expect(frame.contentFrame().getByRole('heading', { name: 'Rendulic.dev', exact: true })).toBeVisible()
  // The embed reports loaded before the calendar's skeleton is replaced.
  await expect(frame.contentFrame().getByRole('button').filter({ hasText: /^\d{1,2}$/ }).first())
    .toBeVisible({ timeout: 30_000 })
  await testInfo.attach('booking-popup', {
    body: await page.screenshot(),
    contentType: 'image/png',
  })
  await close.click()
  await expect(frame).toBeHidden()
  await expect(close).toBeHidden()
  await book.click()
  // Cal.com may retain the hidden first embed and create another on reopening.
  const visibleFrames = page.locator('cal-modal-box iframe:visible')
  const activeModal = page.locator('cal-modal-box').filter({
    has: page.getByRole('button', { name: 'Close', exact: true }),
  })
  // Escape is ignored by Cal.com while a fresh embed is still loading.
  await expect(activeModal).toHaveAttribute('state', /^(loaded|reopened)$/, { timeout: 60_000 })
  await expect(visibleFrames).toHaveCount(1)
  await page.getByRole('button', { name: 'Close', exact: true }).press('Escape')
  await expect(visibleFrames).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Close', exact: true })).toBeHidden()
})
