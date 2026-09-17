import { getCalApi } from '@calcom/embed-react'
import { useEffect, useLayoutEffect, type ReactNode } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import ProjectPage from '@/components/ProjectPage'
import BlogPage from '@/components/BlogPage'
import BlogIndexPage from '@/components/BlogIndexPage'
import About from '@/content/about.mdx'
import Expertise from '@/content/expertise.mdx'
import Intro from '@/content/intro.mdx'
import Projects from '@/content/projects.mdx'
import { posts, projects, site } from '@/content/site'
import { cn } from '@/lib/utils'

function Section({ id, number, title, children }: {
  id: string
  number: string
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="grid gap-6 border-t-2 py-12 md:grid-cols-[1fr_2fr] md:gap-12 md:py-16">
      <div>
        <span className="mb-3 block font-mono text-sm text-muted-foreground">/{number}</span>
        <h2 id={`${id}-heading`} className="font-head text-3xl tracking-tight">{title}</h2>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

export default function App() {
  const pathname = window.location.pathname
  const isAbout = pathname === '/about' || pathname === '/about.html'
  const isBlog = pathname === '/blog' || pathname === '/blog/' || pathname === '/blog/index.html'
  const isHome = pathname === '/' || pathname === '/index.html'
  const project = projects.find(({ slug }) => (
    pathname === `/projects/${slug}` ||
    pathname === `/projects/${slug}/` ||
    pathname === `/projects/${slug}/index.html`
  ))
  const post = posts.find(({ slug }) => (
    pathname === `/blog/${slug}` ||
    pathname === `/blog/${slug}/` ||
    pathname === `/blog/${slug}/index.html`
  ))

  useEffect(() => {
    void getCalApi({ namespace: 'rendulic.dev' }).then((cal) => {
      cal('ui', {
        theme: 'light',
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
    })
  }, [])

  useLayoutEffect(() => {
    // Cross-page fragments may be resolved before React has rendered the target.
    const target = document.getElementById(window.location.hash.slice(1))
    if (target) {
      target.tabIndex = -1
      target.focus({ preventScroll: true })
      target.scrollIntoView()
    }
  }, [])

  return (
    <>
      <a href="#main" className="fixed top-4 left-4 z-50 -translate-y-32 border-2 bg-primary text-primary-foreground px-4 py-3 font-bold focus:translate-y-0">Skip to content</a>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b-2 py-6">
          <a href="/#home" aria-label={`${site.name}, home`} className="flex min-h-11 items-center gap-3 font-bold">
            <span aria-hidden="true" className="flex size-11 items-center justify-center border-2 bg-primary text-primary-foreground font-head text-lg shadow-sm">IR</span>
            <span>{site.domain}</span>
          </a>
          <nav aria-label="Main navigation" className="flex w-full flex-wrap gap-x-5 sm:w-auto sm:gap-x-6">
            {site.navigation.map(({ label, href }) => (
              <a key={href} href={href} aria-current={href === '/blog/' && isBlog ? 'page' : undefined} className="flex min-h-11 items-center text-sm font-bold underline-offset-8 hover:underline focus-visible:underline aria-[current=page]:underline">{label}</a>
            ))}
          </nav>
        </header>

        <main id="main" tabIndex={-1}>
          {project ? <ProjectPage project={project} /> : post ? <BlogPage post={post} /> : isBlog ? <BlogIndexPage /> : isAbout ? (
            <section aria-labelledby="about-heading" className="py-16 sm:py-20">
              <h1 id="about-heading" className="mb-8 font-head text-5xl tracking-tight sm:text-7xl">About</h1>
              <div className="prose"><About /></div>
            </section>
          ) : isHome ? (
            <>
          <section id="home" aria-labelledby="home-heading" className="relative py-16 sm:py-20 lg:py-24">
            <p className="mb-7 font-mono text-xs font-bold uppercase tracking-widest sm:text-sm">{site.discipline}</p>
            <h1 id="home-heading" className="max-w-4xl font-head text-5xl leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
              Igor<br /><span className="bg-primary text-primary-foreground px-2 -ml-2">Rendulic</span>
            </h1>
            <div className="mt-8 max-w-xl text-lg leading-relaxed sm:text-xl"><Intro /></div>
            <div className="mt-9 flex flex-wrap gap-5">
              <a href="#projects" className={buttonVariants({ size: 'lg' })}>Explore my work <span aria-hidden="true">↘</span></a>
              <a href="/about.html" className={buttonVariants({ variant: 'outline', size: 'lg' })}>About me <span aria-hidden="true">→</span></a>
            </div>
            <p className="mt-12 flex items-center gap-2 font-mono text-xs text-muted-foreground"><span aria-hidden="true" className="size-2 bg-foreground" />Personal website</p>
          </section>

          <Section id="projects" number="01" title="Projects">
            {projects.length > 0 ? (
              <ul className="grid gap-5 sm:grid-cols-2">
                {projects.map((project) => (
                  <li key={project.slug} className="min-w-0">
                    <a href={`/projects/${project.slug}/`} className={cn(buttonVariants(), 'flex h-full min-h-28 w-full justify-between gap-5 whitespace-normal p-6 text-left text-xl')}>
                      <span className="flex min-w-0 flex-col gap-1 break-words">
                        <span>{project.name}</span>
                        <span className="font-sans text-sm font-normal leading-5">{project.role}</span>
                      </span>
                      <span aria-hidden="true" className="shrink-0">→</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : <div className="prose"><Projects /></div>}
          </Section>

          <Section id="expertise" number="02" title="Technical expertise">
            <div className="prose [&_h3]:border-t-2 [&_h3]:pt-6 [&_h3]:text-xl [&_h3:first-child]:mt-0 [&_h3:first-child]:border-t-0 [&_h3:first-child]:pt-0 [&_p]:text-base [&_p:last-child]:mb-0">
              <Expertise />
            </div>
          </Section>

          {posts.length > 0 && (
            <Section id="blog" number="03" title="Blog">
              <ul className="divide-y-2 border-y-2">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <a href={`/blog/${post.slug}/`} className="flex min-h-16 flex-wrap items-center justify-between gap-5 px-3 py-5 text-lg font-bold hover:bg-primary hover:text-primary-foreground focus-visible:bg-primary focus-visible:text-primary-foreground">
                      <img src={post.image} alt="" width="606" height="894" loading="lazy" className="h-20 w-14 shrink-0 border-2 bg-white object-contain p-1" />
                      <span className="min-w-0 flex-1 break-words">{post.title}</span>
                      <span aria-hidden="true" className="shrink-0">→</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          )}
            </>
          ) : (
            <section aria-labelledby="not-found-heading" className="py-16 sm:py-20">
              <h1 id="not-found-heading" className="mb-6 font-head text-4xl tracking-tight sm:text-6xl">Page not found</h1>
              <p className="mb-8 text-lg">This page does not exist.</p>
              <a href="/#projects" className={buttonVariants({ variant: 'outline', className: 'min-h-11 whitespace-normal' })}>Back to projects</a>
            </section>
          )}

          <section id="contact" aria-labelledby="contact-heading" className="mb-14 border-2 bg-accent text-accent-foreground p-6 shadow-lg sm:p-10">
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-widest">Get in touch</p>
            <h2 id="contact-heading" className="font-head text-3xl tracking-tight sm:text-4xl">Let’s talk engineering.</h2>
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <Button
                type="button"
                size="lg"
                className="min-h-11"
                data-cal-namespace="rendulic.dev"
                data-cal-link="igor-rendulic/rendulic.dev"
                data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"light"}'
              >
                Book a call <span aria-hidden="true">↗</span>
              </Button>
              {site.email && (
                <a className="inline-flex min-h-11 items-center break-all font-bold underline decoration-2 underline-offset-4" href={`mailto:${site.email}`}>{site.email} <span aria-hidden="true" className="ml-2">↗</span></a>
              )}
            </div>
          </section>
        </main>

        <footer className="flex flex-wrap justify-between gap-4 border-t-2 py-7 font-mono text-xs">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <a href="#main" className="underline underline-offset-4">Back to top ↑</a>
        </footer>
      </div>
    </>
  )
}
