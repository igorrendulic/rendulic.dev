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
