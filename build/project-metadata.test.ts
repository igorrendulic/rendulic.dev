import assert from 'node:assert/strict'
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { createServer as createHttpServer } from 'node:http'
import { once } from 'node:events'
import { resolve } from 'node:path'
import { test } from 'node:test'
import mdx from '@mdx-js/rollup'
import { build, createServer } from 'vite'
import { parseProjectArticle, projectEntries, projectMetadata } from './project-metadata.ts'

test('parses metadata without changing punctuation or article content', () => {
  const title = 'Food "Lens" & <AI>'
  const role = 'Founder & Engineer'
  const description = "It's <useful> & \"quoted\"."
  const article = parseProjectArticle(`---\ntitle: ${JSON.stringify(title)}\nrole: ${JSON.stringify(role)}\ndescription: ${JSON.stringify(description)}\n---\n## Overview\n`, 'project-01.mdx')
  assert.deepEqual(article.metadata, { title, role, description })
  assert.equal(article.content, '## Overview\n')
})

test('missing, blank, and non-string fields identify the source and field', () => {
  for (const field of ['title', 'role', 'description']) {
    for (const value of [undefined, null, '', '  ', 12, false, ['text'], { text: 'text' }]) {
      const data = { title: 'Title', role: 'Engineer', description: 'Description', [field]: value }
      assert.throws(
        () => parseProjectArticle(`---json\n${JSON.stringify(data)}\n---\n`, 'project-02.mdx'),
        (error: Error) => error.message.includes('project-02.mdx') && error.message.includes(field),
      )
    }
  }
  assert.throws(() => parseProjectArticle('## No metadata', 'project-03.mdx'), /project-03\.mdx.*title/)
})

test('malformed frontmatter identifies the source file', () => {
  assert.throws(() => parseProjectArticle('---\ntitle: [\n---\n', 'project-04.mdx'), /project-04\.mdx/)
})

test('MDX exports and development/production HTML share metadata and escape markup', async () => {
  const root = await mkdtemp(resolve('.metadata-test-'))
  const filename = resolve(root, 'src/content/projects/example.mdx')
  const entry = resolve(root, 'projects/example/index.html')
  const html = '<html><head><!-- project-metadata --></head><body><script type="module" src="/src/main.js"></script></body></html>'
  const metadata = {
    title: 'Food "Lens" & <AI> $&',
    role: 'Lead Engineer & Architect',
    description: "It's </title><script>bad()</script> & \"quoted\".",
  }
  const expected = '<title>Food &quot;Lens&quot; &amp; &lt;AI&gt; $&amp; — Igor Rendulic</title>\n    <meta name="description" content="It&#39;s &lt;/title&gt;&lt;script&gt;bad()&lt;/script&gt; &amp; &quot;quoted&quot;." />'
  try {
    await mkdir(resolve(root, 'src/content/projects'), { recursive: true })
    await mkdir(resolve(root, 'build'), { recursive: true })
    await writeFile(filename, `---json\n${JSON.stringify(metadata)}\n---\n## Overview\n`)
    await writeFile(resolve(root, 'build/project.html'), html)
    await writeFile(resolve(root, 'index.html'), '<html><head><title>Home</title></head><body>Home</body></html>')
    await writeFile(resolve(root, 'src/main.js'), 'import "./style.css"; console.log("project loaded")')
    await writeFile(resolve(root, 'src/style.css'), 'body { color: red; }')
    const server = await createServer({
      configFile: false, root, cacheDir: resolve(root, 'node_modules/.vite'), logLevel: 'silent',
      plugins: [projectMetadata(), mdx()],
      server: { middlewareMode: true, hmr: false },
    })
    try {
      const module = await server.ssrLoadModule('/src/content/projects/example.mdx')
      assert.deepEqual(module.metadata, metadata)
      assert.equal(typeof module.default, 'function')
      const result = await server.transformIndexHtml('/projects/example/index.html', html)
      assert.ok(result.includes(expected), result)
      const unknown = await server.transformIndexHtml('/index.html', html, '/projects/unknown')
      assert.ok(unknown.includes('<!-- project-metadata -->'))
      const about = await server.transformIndexHtml('/about.html', '<head><title>About</title></head>')
      assert.ok(about.includes('<title>About</title>'))
      assert.ok(!about.includes('name="description"'))
      const http = createHttpServer(server.middlewares)
      try {
        http.listen(0, '127.0.0.1')
        await once(http, 'listening')
        const address = http.address()
        assert.ok(address && typeof address !== 'string')
        const origin = `http://127.0.0.1:${address.port}`
        for (const path of ['/projects/example', '/projects/example/', '/projects/example/index.html?ref=test']) {
          const response = await fetch(origin + path)
          assert.equal(response.status, 200)
          const page = await response.text()
          assert.ok(page.includes(expected), page)
          assert.equal(page.match(/<title>/g)?.length, 1)
          assert.equal(page.match(/name="description"/g)?.length, 1)
          assert.ok(page.includes('/@vite/client'))
          assert.ok(page.includes('/src/main.js'))
        }
        const home = await (await fetch(origin + '/')).text()
        assert.ok(home.includes('<title>Home</title>'))
        const unknownPage = await (await fetch(origin + '/projects/unknown/')).text()
        assert.ok(!unknownPage.includes(expected))
      } finally {
        if (http.listening) await new Promise<void>((resolve, reject) => http.close((error) => error ? reject(error) : resolve()))
      }
    } finally {
      await server.close()
    }
    await build({
      configFile: false, root, logLevel: 'silent', plugins: [projectMetadata()],
      build: { rolldownOptions: { input: projectEntries(root) } },
    })
    const built = await readFile(resolve(root, 'dist/projects/example/index.html'), 'utf8')
    assert.ok(built.includes(expected))
    assert.ok(!built.includes('/src/main.js'))
    const assets = [...built.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1])
    assert.ok(assets.some((asset) => asset.endsWith('.js')))
    assert.ok(assets.some((asset) => asset.endsWith('.css')))
    for (const asset of assets) await access(resolve(root, 'dist', asset.slice(1)))
    await assert.rejects(access(entry), { code: 'ENOENT' })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
