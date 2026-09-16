import { readFile } from 'node:fs/promises'
import { readdirSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import matter from 'gray-matter'
import { normalizePath, type Plugin } from 'vite'
import type { ProjectMetadata } from '../src/content/project-metadata.ts'

export function parseProjectArticle(source: string, filename: string): { metadata: ProjectMetadata; content: string } {
  try {
    const { data, content } = matter(source)
    for (const field of ['title', 'role', 'description']) {
      if (typeof data[field] !== 'string' || !data[field].trim()) {
        throw new Error(`frontmatter "${field}" must be a non-empty string`)
      }
    }
    return { metadata: { title: data.title, role: data.role, description: data.description }, content }
  } catch (error) {
    throw new Error(`${filename}: ${error instanceof Error ? error.message : String(error)}`, { cause: error })
  }
}

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;')
}

export function projectEntries(root: string): Record<string, string> {
  return Object.fromEntries(readdirSync(resolve(root, 'src/content/projects'), { withFileTypes: true })
    .filter((file) => file.isFile() && file.name.endsWith('.mdx'))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ name }) => {
      const slug = name.slice(0, -4)
      return [slug, resolve(root, 'projects', slug, 'index.html')]
    }))
}

export function projectMetadata(): Plugin {
  let root: string
  let entries: Set<string>
  let template: string
  const isProjectArticle = (filename: string) => (
    /^src\/content\/projects\/[^/]+\.mdx$/.test(normalizePath(relative(root, filename)))
  )

  return {
    name: 'project-metadata',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
      entries = new Set(Object.values(projectEntries(root)))
      template = resolve(root, 'build/project.html')
    },
    resolveId(id) {
      if (entries.has(id)) return id
    },
    async load(id) {
      if (!entries.has(id)) return
      this.addWatchFile(template)
      return readFile(template, 'utf8')
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = new URL(req.url ?? '/', 'http://localhost').pathname
        const match = /^\/projects\/([^/]+)(?:\/|\/index\.html)?$/.exec(pathname)
        if (!match || !entries.has(resolve(root, 'projects', match[1], 'index.html'))) return next()
        if (req.method !== 'GET' && req.method !== 'HEAD') return next()
        try {
          const html = await server.transformIndexHtml(`/projects/${match[1]}/index.html`, await readFile(template, 'utf8'), req.url)
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(req.method === 'HEAD' ? undefined : html)
        } catch (error) {
          next(error)
        }
      })
    },
    transform(source, id) {
      const filename = id.split('?')[0]
      if (!isProjectArticle(filename)) return
      const { metadata, content } = parseProjectArticle(source, filename)
      return { code: `export const metadata = ${JSON.stringify(metadata)}\n\n${content}`, map: null }
    },
    async transformIndexHtml(html, context) {
      const entry = normalizePath(relative(root, context.filename))
      const match = /^projects\/([^/]+)\/index\.html$/.exec(entry)
      if (!match) return
      const filename = resolve(root, 'src/content/projects', `${match[1]}.mdx`)
      const { metadata } = parseProjectArticle(await readFile(filename, 'utf8'), filename)
      return html.replace('<!-- project-metadata -->', () => (
        `<title>${escapeHtml(metadata.title)} — Igor Rendulic</title>\n    <meta name="description" content="${escapeHtml(metadata.description)}" />`
      ))
    },
    handleHotUpdate({ file, modules, server, timestamp }) {
      if (file !== template && !isProjectArticle(file)) return
      // Refresh HTML metadata as well as the React content, including on the homepage.
      const invalidated = new Set<typeof modules[number]>()
      for (const module of modules) {
        server.moduleGraph.invalidateModule(module, invalidated, timestamp, true)
      }
      server.ws.send({ type: 'full-reload' })
      return []
    },
  }
}
