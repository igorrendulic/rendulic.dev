import { readFile } from 'node:fs/promises'
import { readFileSync, readdirSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import matter from 'gray-matter'
import { normalizePath, type Plugin } from 'vite'
import type { ProjectMetadata } from '../src/content/project-metadata.ts'

export function parseProjectArticle(source: string, filename: string): { metadata: ProjectMetadata; content: string } {
  try {
    const { data, content } = matter(source)
    for (const field of ['title', 'role', 'description', 'slug']) {
      if (typeof data[field] !== 'string' || !data[field].trim()) {
        throw new Error(`frontmatter "${field}" must be a non-empty string`)
      }
    }
    if (data.slug !== data.slug.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      throw new Error('frontmatter "slug" must contain lowercase alphanumeric words separated by hyphens')
    }
    return { metadata: { slug: data.slug, title: data.title, role: data.role, description: data.description }, content }
  } catch (error) {
    throw new Error(`${filename}: ${error instanceof Error ? error.message : String(error)}`, { cause: error })
  }
}

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;')
}

type ArticleParser = (source: string, filename: string) => {
  metadata: { slug: string; title: string; description: string }
  content: string
}

function articleSources(root: string, collection: string, parseArticle: ArticleParser): Map<string, string> {
  const sources = new Map<string, string>()
  const files = readdirSync(resolve(root, 'src/content', collection), { withFileTypes: true })
    .filter((file) => file.isFile() && file.name.endsWith('.mdx'))
    .sort((a, b) => a.name.localeCompare(b.name))
  for (const { name } of files) {
    const filename = resolve(root, 'src/content', collection, name)
    const { metadata: { slug } } = parseArticle(readFileSync(filename, 'utf8'), filename)
    if (sources.has(slug)) {
      throw new Error(`${filename}: duplicate ${collection} slug "${slug}" also defined in ${sources.get(slug)}`)
    }
    sources.set(slug, filename)
  }
  return sources
}

export function projectEntries(root: string): Record<string, string> {
  return articleEntries(root, 'projects', parseProjectArticle)
}

export function projectMetadata(): Plugin {
  return articleMetadata('projects', parseProjectArticle)
}

export function articleEntries(root: string, collection: string, parseArticle: ArticleParser): Record<string, string> {
  return Object.fromEntries([...articleSources(root, collection, parseArticle).keys()]
    .map((slug) => [slug, resolve(root, collection, slug, 'index.html')]))
}

export function articleMetadata(collection: string, parseArticle: ArticleParser): Plugin {
  let root: string
  let entries: Map<string, string>
  let template: string
  const isArticle = (filename: string) => (
    new RegExp(`^src/content/${collection}/[^/]+\\.mdx$`).test(normalizePath(relative(root, filename)))
  )

  return {
    name: `${collection}-metadata`,
    enforce: 'pre',
    configResolved(config) {
      root = config.root
      entries = new Map([...articleSources(root, collection, parseArticle)]
        .map(([slug, filename]) => [resolve(root, collection, slug, 'index.html'), filename]))
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
        const match = new RegExp(`^/${collection}/([^/]+)(?:/|/index\\.html)?$`).exec(pathname)
        if (!match || !entries.has(resolve(root, collection, match[1], 'index.html'))) return next()
        if (req.method !== 'GET' && req.method !== 'HEAD') return next()
        try {
          const html = await server.transformIndexHtml(`/${collection}/${match[1]}/index.html`, await readFile(template, 'utf8'), req.url)
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(req.method === 'HEAD' ? undefined : html)
        } catch (error) {
          next(error)
        }
      })
    },
    transform(source, id) {
      const filename = id.split('?')[0]
      if (!isArticle(filename)) return
      const { metadata, content } = parseArticle(source, filename)
      return { code: `export const metadata = ${JSON.stringify(metadata)}\n\n${content}`, map: null }
    },
    async transformIndexHtml(html, context) {
      const filename = entries.get(context.filename)
      if (!filename) return
      const { metadata } = parseArticle(await readFile(filename, 'utf8'), filename)
      return html.replace('<!-- project-metadata -->', () => (
        `<title>${escapeHtml(metadata.title)} — Igor Rendulic</title>\n    <meta name="description" content="${escapeHtml(metadata.description)}" />`
      ))
    },
    handleHotUpdate({ file, modules, server, timestamp }) {
      if (file !== template && !isArticle(file)) return
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
