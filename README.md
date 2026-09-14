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
npm run check     # Lint, strict TypeScript checks, and production build
npm run typecheck # TypeScript only
npm run preview   # Serve the existing production build locally
```

The production build is written to `dist/` and can be hosted as static files.
The initial site uses native section links, so no SPA rewrite configuration
is necessary. No backend or environment variables are required.

## Content

- `src/content/site.ts`: identity, navigation, and contact email. Set `email` to
  a verified address to display the email link.
- `src/content/intro.mdx`: introduction.
- `src/content/projects.mdx`: selected work and future case studies.
- `src/content/blog.mdx`: engineering notes.
- `src/content/about.mdx`: biography and experience.

These MDX files compile to React at build time; there is no browser Markdown
parser. Only compile trusted, repository-owned MDX. Add verified project
descriptions, impact, career history, and contact details before publishing.
The initial copy explicitly marks unfinished sections and makes no claims
about employers, years of experience, or project metrics.

For now, all content is on one page. Add individual article or project routes
when there is enough content to need them.

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
