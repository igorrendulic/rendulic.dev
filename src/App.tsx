import type { ReactNode } from 'react'
import { buttonVariants } from '@/components/ui/button'
import About from '@/content/about.mdx'
import Blog from '@/content/blog.mdx'
import Intro from '@/content/intro.mdx'
import Projects from '@/content/projects.mdx'
import { site } from '@/content/site'

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
      <div className="prose">{children}</div>
    </section>
  )
}

export default function App() {
  return (
    <>
      <a href="#main" className="fixed top-4 left-4 z-50 -translate-y-32 border-2 bg-primary px-4 py-3 font-bold focus:translate-y-0">Skip to content</a>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b-2 py-6">
          <a href="#home" aria-label={`${site.name}, home`} className="flex min-h-11 items-center gap-3 font-bold">
            <span aria-hidden="true" className="flex size-11 items-center justify-center border-2 bg-primary font-head text-lg shadow-sm">IR</span>
            <span>{site.domain}</span>
          </a>
          <nav aria-label="Main navigation" className="flex w-full flex-wrap gap-x-5 sm:w-auto sm:gap-x-6">
            {site.navigation.map(({ label, href }) => (
              <a key={href} href={href} className="flex min-h-11 items-center text-sm font-bold underline-offset-8 hover:underline focus-visible:underline">{label}</a>
            ))}
          </nav>
        </header>

        <main id="main" tabIndex={-1}>
          <section id="home" aria-labelledby="home-heading" className="relative py-16 sm:py-20 lg:py-24">
            <p className="mb-7 font-mono text-xs font-bold uppercase tracking-widest sm:text-sm">{site.discipline}</p>
            <h1 id="home-heading" className="max-w-4xl font-head text-5xl leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
              Igor<br /><span className="bg-primary px-2 -ml-2">Rendulic.</span>
            </h1>
            <div className="mt-8 max-w-xl text-lg leading-relaxed sm:text-xl"><Intro /></div>
            <div className="mt-9 flex flex-wrap gap-5">
              <a href="#projects" className={buttonVariants({ size: 'lg' })}>Explore my work <span aria-hidden="true">↘</span></a>
              <a href="#about" className={buttonVariants({ variant: 'outline', size: 'lg' })}>About me <span aria-hidden="true">→</span></a>
            </div>
            <p className="mt-12 flex items-center gap-2 font-mono text-xs text-muted-foreground"><span aria-hidden="true" className="size-2 bg-foreground" />Personal website / Work in progress</p>
          </section>

          <Section id="projects" number="01" title="Selected work"><Projects /></Section>
          <Section id="blog" number="02" title="Engineering notes"><Blog /></Section>
          <Section id="about" number="03" title="About me"><About /></Section>

          <section id="contact" aria-labelledby="contact-heading" className="mb-14 border-2 bg-primary p-6 shadow-lg sm:p-10">
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-widest">Get in touch</p>
            <h2 id="contact-heading" className="font-head text-3xl tracking-tight sm:text-4xl">Let’s talk engineering.</h2>
            {site.email ? (
              <a className="mt-5 inline-flex min-h-11 items-center break-all font-bold underline decoration-2 underline-offset-4" href={`mailto:${site.email}`}>{site.email} <span aria-hidden="true" className="ml-2">↗</span></a>
            ) : (
              <p className="mt-4 max-w-xl leading-relaxed">Contact details will be available soon.</p>
            )}
          </section>
        </main>

        <footer className="flex flex-wrap justify-between gap-4 border-t-2 py-7 font-mono text-xs">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <a href="#home" className="underline underline-offset-4">Back to top ↑</a>
        </footer>
      </div>
    </>
  )
}
