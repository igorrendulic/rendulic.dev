# rendulic.dev

Personal developer website for Igor Rendulic. Built with React, TypeScript,
Vite, Tailwind CSS, and build-time MDX. The design follows [NeoBrutalism](https://neobrutalism.com/docs).

## Development

Use Node.js 22.12+ (Node 22 LTS is pinned in `.nvmrc`) and npm.

```sh
nvm use
npm ci
npm run dev
```

Open the local URL printed by Vite.

```sh
npm run check     # Lint, metadata tests, strict TypeScript checks, and production build
npm test          # Metadata validation and integration tests
npm run typecheck # TypeScript only
npm run preview   # Serve the existing production build locally
```

The production build is written to `dist/` and can be hosted as static files.
The homepage uses native section links. About is emitted as `about.html`, and
each project as `projects/<slug>/index.html`, following
[Vite's multipage setup](https://vite.dev/guide/build.html#multi-page-app).
No SPA rewrites, backend, or environment variables are required. Serve the
whole `dist/` directory with directory-index support (normally enabled by default).
Project HTML entries are generated in memory from `build/project.html`, using
the MDX filenames in `src/content/projects/` to discover routes. Only the build
output contains per-project HTML files; development serves the same template.

## Browser tests

Install the test browser once after `npm ci` (and again after Playwright upgrades):

```sh
npx playwright install chromium
npm run test:e2e          # Local desktop and mobile Chromium tests
npm run test:e2e:ui       # Interactive test runner
npm run test:e2e:report   # Open the latest HTML report
npm run check:all         # Existing checks, then local browser tests
```

Playwright starts and stops a dedicated Vite server at `http://127.0.0.1:4174`.
Keep that port free; an existing server is intentionally not reused. These tests
exercise development routes, not the production static host. The default suite
blocks external requests and checks navigation, project refreshes, expandable
details, keyboard focus, and horizontal overflow at desktop and mobile sizes.
Mobile runs emulate Pixel 7 in Chromium; they do not test Safari or a physical phone.

The live Cal.com popup has its own opt-in smoke test:

```sh
npm run test:e2e:live
npm run test:e2e:live -- --headed --project=desktop-chromium
```

This test requires internet access and a working Cal.com event. It opens the real
booking popup, waits for the embed to report loaded, saves a screenshot, closes
it, and checks reopening and Escape. It does not select a time or submit a booking.
Cal.com availability can cause this test to fail independently of site changes.
The local suite does not verify the popup. Popup focus trapping and focus return
still need an accessibility review of the live third-party embed.

Homepage and live-popup screenshots are attached to the HTML report for visual
review. Failed tests also retain a screenshot and trace. Screenshots are evidence
for review, not approved visual regression baselines. Generated reports and
artifacts are gitignored. To debug one test, use for example:

```sh
npm run test:e2e -- --project=desktop-chromium --grep 'project details' --debug
```

Tests live in `e2e/`, configuration in `playwright.config.ts`, and their TypeScript
checks are included in `npm run typecheck` and `npm run check`. The setup follows
the [Playwright configuration](https://playwright.dev/docs/test-configuration)
and [web server](https://playwright.dev/docs/test-webserver) documentation.
Playwright tests run independently of Codex MCP tools; restarting Codex is only
needed to load the newly configured Chrome DevTools MCP integration.

## Content

- `src/content/site.ts`: identity, navigation, contact email, published `posts`
  (`title`, `href`), and project registration (order, `slug`, `Content`).
  Project names, roles, and descriptions are imported from their MDX metadata.
  Set `email` to a verified address to display the email link. List posts newest
  first; placeholder posts use `href: null` and display “Coming soon”. Project
  links are derived from their slugs and open their associated MDX components.
- `src/content/intro.mdx`: introduction.
- `src/content/projects.mdx`: placeholder shown until project links are added.
- `src/content/projects/project-01.mdx` through `project-10.mdx`: editable
  project detail pages at `/projects/project-01/` through `/projects/project-10/`.
- `src/content/blog.mdx`: draft introduction, not displayed on the homepage.
- `src/content/about.mdx`: biography and experience on `/about.html`.

These MDX files compile to React at build time; there is no browser Markdown
parser. Only compile trusted, repository-owned MDX. Add verified project
descriptions, impact, career history, and contact details before publishing.
The initial copy explicitly marks unfinished sections and makes no claims
about employers, years of experience, or project metrics.

The homepage shows a responsive grid of project names linking to their detail
pages, followed by blog posts when entries exist. The Blog section and
navigation link stay hidden when there are no posts. About has its own page.
Keep longer articles and case studies in Markdown or MDX as they are added.

### Add a project

Edit each project's title, role, and description **only in its MDX frontmatter**:

```mdx
---
title: Food Lens AI
role: Role to be added
description: Placeholder overview, engineering approach, and outcomes.
---

## Overview
```

The title updates the homepage label, page heading, and browser title (with an
“— Igor Rendulic” suffix). The role appears beneath the title on the homepage project
button. The description updates the page introduction and HTML
description. Vite parses frontmatter with `gray-matter` before MDX compilation and
fills each project HTML entry during development and production builds, so head
metadata is present before JavaScript runs. All three fields must be non-empty strings;
invalid frontmatter reports the source filename. Quote YAML values containing
special syntax, for example `title: 'Food: "Lens" & <AI>'`. Project article edits
reload development pages to refresh both content and HTML metadata.

Changing a displayed title does not change its filename or URL.

1. Create `src/content/projects/<slug>.mdx` with the required frontmatter and
   verified content. The shared
   layout supplies the page's `h1`; start article sections with `##` headings.
   Lists, images (include meaningful alt text), blockquotes, inline code, and
   fenced code blocks are styled. Code blocks scroll horizontally and accept
   keyboard focus. Store public images in `public/` and use root-relative URLs.
2. Import the MDX component and its `metadata` export in `src/content/site.ts`.
   Register a unique URL-safe `slug`, the `Content` component,
   `name: metadata.title`, `role: metadata.role`, and `description: metadata.description`.
3. Keep the MDX filename and registry slug identical. HTML entries are discovered
   automatically; no HTML copy or Vite config change is needed. Restart the dev
   server after adding or removing a project. Edit `build/project.html` to change
   the shared HTML shell, retaining its `<!-- project-metadata -->` marker.
4. Run `npm run check`, then verify the homepage link, a direct visit, and a
   refresh. To test the build with no SPA fallback, run
   `python3 -m http.server 4173 --directory dist` and open
   `http://localhost:4173/projects/<slug>/`.

Project URLs also resolve explicitly with `/index.html` or without the trailing
slash. Unrecognized paths show a not-found message if the React app is served
(for example, Vite's development fallback); ordinary static hosting returns its
own HTTP 404. No unknown path is treated as the homepage or another project.

## Design system

`src/index.css` defines the cream, black, and yellow theme, square corners,
hard shadows, focus states, and reduced-motion support. Archivo Black and
Space Grotesk are self-hosted through Fontsource.

The button is installed from the official NeoBrutalism registry, using its
[documented shadcn workflow](https://neobrutalism.com/docs/installation):

```sh
npx shadcn@latest add https://neobrutalism.com/r/radix/button.json
```

`components.json` configures component paths and Tailwind integration. Check
NeoBrutalism's components and blocks before adding equivalent UI. Installed
component source lives in `src/components/ui/`; small site-specific adaptations
are allowed. The button's variants style native anchor links so navigation
retains link semantics.

The layout uses semantic landmarks, a keyboard skip link, visible focus states,
and wrapping mobile navigation. Verify the page at 320, 768, 1024, and 1440px
after changing layouts.

## Colors

The theme in `src/index.css` uses a cream page background (`#fff7e8`), black main
highlights (`#000000`) with white text, and a yellow contact section (`#ffdc58`)
with black text.
