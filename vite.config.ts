import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { projectEntries, projectMetadata } from './build/project-metadata.ts'
import { blogEntries, blogMetadata } from './build/blog-metadata.ts'

export default defineConfig({
  plugins: [
    {
      name: 'static-redirects',
      configureServer(server) {
        const redirects = new Map(readFileSync(new URL('./public/_redirects', import.meta.url), 'utf8')
          .trim().split('\n').map((line) => {
            const [source, destination] = line.split(/\s+/)
            return [source, destination]
          }))
        // Match static hosts' directory redirect before Vite's SPA fallback.
        server.middlewares.use((req, res, next) => {
          const url = new URL(req.url ?? '/', 'http://localhost')
          if (req.method !== 'GET' && req.method !== 'HEAD') return next()
          const destination = redirects.get(url.pathname) ?? (['/blog', '/privacy'].includes(url.pathname) ? `${url.pathname}/` : null)
          if (!destination) return next()
          res.writeHead(301, { Location: `${destination}${url.search}` })
          res.end()
        })
      },
    },
    projectMetadata(), blogMetadata(), mdx(), react(), tailwindcss(),
  ],
  build: {
    rolldownOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        about: fileURLToPath(new URL('./about.html', import.meta.url)),
        blog: fileURLToPath(new URL('./blog/index.html', import.meta.url)),
        privacy: fileURLToPath(new URL('./privacy/index.html', import.meta.url)),
        ...projectEntries(fileURLToPath(new URL('.', import.meta.url))),
        ...Object.fromEntries(Object.entries(blogEntries(fileURLToPath(new URL('.', import.meta.url))))
          .map(([slug, entry]) => [`blog-${slug}`, entry])),
      },
    },
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
