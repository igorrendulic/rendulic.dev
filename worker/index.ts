// Run before static assets so HTTP cannot bypass the HTTPS redirect.
export default {
  async fetch(request: Request, env: { ASSETS: { fetch(request: Request): Promise<Response> } }) {
    const url = new URL(request.url)
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    if (url.protocol === 'http:' && !local) {
      url.protocol = 'https:'
      return Response.redirect(url.toString(), 308)
    }
    return env.ASSETS.fetch(request)
  },
}
