import type { MDXContent } from 'mdx/types'
import Project01, { metadata as project01 } from './projects/project-01.mdx'
import Project02, { metadata as project02 } from './projects/project-02.mdx'
import Project03, { metadata as project03 } from './projects/project-03.mdx'
import Project04, { metadata as project04 } from './projects/project-04.mdx'
import Project05, { metadata as project05 } from './projects/project-05.mdx'
import Project06, { metadata as project06 } from './projects/project-06.mdx'
import Project07, { metadata as project07 } from './projects/project-07.mdx'
import Project08, { metadata as project08 } from './projects/project-08.mdx'
import Project09, { metadata as project09 } from './projects/project-09.mdx'
import Project10, { metadata as project10 } from './projects/project-10.mdx'

// Replace placeholders with published posts, newest first. Null URLs show Coming soon.
export const posts: { title: string; href: string | null }[] = [
  { title: 'Blog post 01', href: null },
  { title: 'Blog post 02', href: null },
  { title: 'Blog post 03', href: null },
]

export type Project = {
  name: string
  role: string
  slug: string
  description: string
  Content: MDXContent
}

// Titles, roles, and descriptions come from each article.
// Keep registration order and slugs stable.
export const projects: Project[] = [
  { name: project01.title, role: project01.role, slug: 'project-01', description: project01.description, Content: Project01 },
  { name: project02.title, role: project02.role, slug: 'project-02', description: project02.description, Content: Project02 },
  { name: project03.title, role: project03.role, slug: 'project-03', description: project03.description, Content: Project03 },
  { name: project04.title, role: project04.role, slug: 'project-04', description: project04.description, Content: Project04 },
  { name: project05.title, role: project05.role, slug: 'project-05', description: project05.description, Content: Project05 },
  { name: project09.title, role: project09.role, slug: 'project-09', description: project09.description, Content: Project09 },
  { name: project06.title, role: project06.role, slug: 'project-06', description: project06.description, Content: Project06 },
  { name: project07.title, role: project07.role, slug: 'project-07', description: project07.description, Content: Project07 },
  { name: project08.title, role: project08.role, slug: 'project-08', description: project08.description, Content: Project08 },
  { name: project10.title, role: project10.role, slug: 'project-10', description: project10.description, Content: Project10 },
]

// Replace or extend these values with verified professional details.
export const site = {
  name: 'Igor Rendulic',
  domain: 'rendulic.dev',
  discipline: 'Software & AI engineering',
  email: null as string | null,
  navigation: [
    { label: 'Home', href: '/#home' },
    ...(posts.length ? [{ label: 'Blog', href: '/#blog' }] : []),
    { label: 'Projects', href: '/#projects' },
    { label: 'About', href: '/about.html' },
  ],
}
