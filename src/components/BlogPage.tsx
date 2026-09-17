import type { ComponentProps } from 'react'
import { buttonVariants } from '@/components/ui/button'
import type { BlogPost } from '@/content/site'

function CodeBlock(props: ComponentProps<'pre'>) {
  return <pre {...props} tabIndex={0} aria-label="Code example" />
}

export default function BlogPage({ post }: { post: BlogPost }) {
  const { title, image, imageAlt, Content } = post

  return (
    <section aria-labelledby="post-heading" className="min-w-0 py-16 sm:py-20">
      <a href="/blog/" className={buttonVariants({ variant: 'outline', className: 'mb-10 min-h-11 whitespace-normal' })}>
        <span aria-hidden="true">←</span> Back to blog
      </a>
      <h1 id="post-heading" className="mb-10 break-words font-head text-4xl tracking-tight sm:text-6xl lg:text-7xl">{title}</h1>
      <img src={image} alt={imageAlt} width="606" height="894" className="mb-10 block h-auto w-full max-w-lg border-2 bg-white p-4" />
      <article aria-labelledby="post-heading" className="prose">
        <Content components={{ pre: CodeBlock }} />
      </article>
    </section>
  )
}
