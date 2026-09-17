import assert from 'node:assert/strict'
import { test } from 'node:test'
import worker from '../worker/index.ts'

test('HTTP redirects to HTTPS before serving assets, preserving path and query', async () => {
  const response = await worker.fetch(new Request('http://rendulic.dev/blog/?ref=test'), {
    ASSETS: { fetch: async () => { throw new Error('HTTP must not serve an asset') } },
  })
  assert.equal(response.status, 308)
  assert.equal(response.headers.get('location'), 'https://rendulic.dev/blog/?ref=test')
})

test('HTTPS and loopback development requests preserve asset behavior', async () => {
  for (const url of ['https://rendulic.dev/missing', 'http://localhost:4174/missing', 'http://127.0.0.1:4174/missing', 'http://[::1]:4174/missing']) {
    const request = new Request(url)
    const response = await worker.fetch(request, {
      ASSETS: { fetch: async (received) => {
        assert.equal(received, request)
        return new Response('Not found', { status: 404 })
      } },
    })
    assert.equal(response.status, 404)
    assert.equal(await response.text(), 'Not found')
  }
})

test('HTML responses prevent analytics injection while preserving caching, status, and body', async () => {
  for (const status of [200, 404]) {
    const response = await worker.fetch(new Request('https://rendulic.dev/blog/'), {
      ASSETS: { fetch: async () => new Response('<!doctype html><h1>Page</h1>', {
        status,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'ETag': '"test"',
          'Content-Security-Policy': "default-src 'self'",
        },
      }) },
    })
    assert.equal(response.status, status)
    assert.equal(response.headers.get('cache-control'), 'public, max-age=0, must-revalidate, no-transform')
    assert.equal(response.headers.get('etag'), '"test"')
    assert.equal(response.headers.get('content-security-policy'), "default-src 'self'")
    assert.equal(await response.text(), '<!doctype html><h1>Page</h1>')
  }
})

test('non-HTML assets retain their original response and cache policy', async () => {
  const asset = new Response('body {}', { headers: {
    'Content-Type': 'text/css', 'Cache-Control': 'public, max-age=31536000, immutable',
  } })
  const response = await worker.fetch(new Request('https://rendulic.dev/assets/main.css'), {
    ASSETS: { fetch: async () => asset },
  })
  assert.equal(response, asset)
  assert.equal(response.headers.get('cache-control'), 'public, max-age=31536000, immutable')
})
