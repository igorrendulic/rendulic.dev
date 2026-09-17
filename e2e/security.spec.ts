import { expect, test } from '@playwright/test'

test('deployed assets include security headers and preserve old article links', async ({ request }) => {
  const response = await request.get('/')
  expect(response.status()).toBe(200)
  expect(response.headers()['strict-transport-security']).toBe('max-age=31536000')
  expect(response.headers()['x-content-type-options']).toBe('nosniff')
  expect(response.headers()['x-frame-options']).toBe('DENY')
  expect(response.headers()['cache-control']).toContain('no-transform')
  expect(response.headers()['content-security-policy']).toContain("frame-ancestors 'none'")
  expect(response.headers()['content-security-policy']).not.toContain("script-src 'self' 'unsafe-inline'")
  expect(await response.text()).not.toContain('googletagmanager.com/gtag/js')
  for (const slug of ['how-i-process-over-5-million-emails-a-day', 'how-i-process-10000-emails-a-day']) {
    for (const suffix of ['', '/', '/index.html']) {
      const redirect = await request.get(`/blog/${slug}${suffix}?ref=old-link`, { maxRedirects: 0 })
      expect(redirect.status()).toBe(301)
      expect(redirect.headers().location).toContain('/blog/how-i-process-over-5-million-emails-a-year/')
      const article = await request.get(redirect.headers().location)
      expect(article.status()).toBe(200)
      expect(await article.text()).toContain('An Email Pipeline Processing 5+ Million Emails a Year')
    }
  }
})
