import type { ComponentProps } from 'react'
import { buttonVariants } from '@/components/ui/button'
import type { Project } from '@/content/site'

// Make long code examples scrollable using the keyboard as well as touch.
function CodeBlock(props: ComponentProps<'pre'>) {
  return <pre {...props} tabIndex={0} aria-label="Code example" />
}

export default function ProjectPage({ project }: { project: Project }) {
  const { name, description, Content } = project

  return (
    <section aria-labelledby="project-heading" className="min-w-0 py-16 sm:py-20">
      <a href="/#projects" className={buttonVariants({ variant: 'outline', className: 'mb-10 min-h-11 whitespace-normal' })}>
        <span aria-hidden="true">←</span> Back to projects
      </a>
      <h1 id="project-heading" className="mb-6 break-words font-head text-4xl tracking-tight sm:text-6xl lg:text-7xl">{name}</h1>
      <p className="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">{description}</p>
      <article aria-labelledby="project-heading" className="prose">
        <Content components={{ pre: CodeBlock }} />
      </article>
    </section>
  )
}
