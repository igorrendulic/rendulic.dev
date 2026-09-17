import { fileURLToPath, URL } from 'node:url'
import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { projectEntries, projectMetadata } from './build/project-metadata.ts'
import { blogEntries, blogMetadata } from './build/blog-metadata.ts'

export default defineConfig({
  plugins: [
    {
      name: 'blog-index-route',
      configureServer(server) {
        // Match static hosts' directory redirect before Vite's SPA fallback.
        server.middlewares.use((req, res, next) => {
          const url = new URL(req.url ?? '/', 'http://localhost')
          if (url.pathname !== '/blog' || (req.method !== 'GET' && req.method !== 'HEAD')) return next()
          res.writeHead(308, { Location: `/blog/${url.search}` })
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
