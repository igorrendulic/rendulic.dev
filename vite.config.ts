import { fileURLToPath, URL } from 'node:url'
import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { projectEntries, projectMetadata } from './build/project-metadata.ts'

export default defineConfig({
  plugins: [projectMetadata(), mdx(), react(), tailwindcss()],
  build: {
    rolldownOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        about: fileURLToPath(new URL('./about.html', import.meta.url)),
        ...projectEntries(fileURLToPath(new URL('.', import.meta.url))),
      },
    },
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
