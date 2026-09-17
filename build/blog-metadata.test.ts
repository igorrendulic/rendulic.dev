import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { test } from 'node:test'
import mdx from '@mdx-js/rollup'
import matter from 'gray-matter'
import { createServer } from 'vite'
import { blogEntries, blogMetadata, parseBlogArticle } from './blog-metadata.ts'

test('blog metadata uses its explicit slug and cover without a role', () => {
  const data = {
    slug: 'email-processing', title: 'How I Process 10,000+ Emails a Day',
    description: 'Email processing', image: '/images/pipeline.png', imageAlt: 'Pipeline',
  }
  const source = `---json\n${JSON.stringify(data)}\n---\nArticle body\n`
  const article = parseBlogArticle(source, 'post-01.mdx')
  assert.deepEqual(article.metadata, data)
  assert.equal(article.content, 'Article body\n')
  assert.throws(() => parseBlogArticle(source.replace('email-processing', '../email'), 'post-01.mdx'), /post-01\.mdx.*slug/)
  assert.throws(() => parseBlogArticle(source.replace('Pipeline', ''), 'post-01.mdx'), /post-01\.mdx.*imageAlt/)
})

test('the first blog post has a generated HTML entry and compiled MDX metadata', async () => {
  const root = resolve('.')
  const { data } = matter(await readFile('src/content/blog/post-01.mdx', 'utf8'))
  const slug = data.slug as string
  assert.equal(blogEntries(root)[slug], resolve(root, 'blog', slug, 'index.html'))
  const server = await createServer({
    configFile: false, root, logLevel: 'silent', plugins: [blogMetadata(), mdx()],
    server: { middlewareMode: true, hmr: false },
  })
  try {
    const article = await server.ssrLoadModule('/src/content/blog/post-01.mdx')
    assert.equal(article.metadata.slug, slug)
    assert.equal('role' in article.metadata, false)
    assert.equal(typeof article.default, 'function')
    const html = await server.transformIndexHtml(`/blog/${slug}/index.html`, await readFile('build/project.html', 'utf8'))
    const escapedTitle = (data.title as string).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]!)
    assert.ok(html.includes(`<title>${escapedTitle} — Igor Rendulic</title>`))
  } finally {
    await server.close()
  }
})
