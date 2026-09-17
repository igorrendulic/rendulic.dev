import { Card } from '@/components/ui/card'
import { posts } from '@/content/site'

export default function BlogIndexPage() {
  return (
    <section aria-labelledby="blog-heading" className="py-12 sm:py-16">
      <header className="mb-10 border-b-2 pb-10 sm:mb-12">
        <p className="mb-5 font-mono text-xs font-bold uppercase tracking-widest">Engineering notes</p>
        <h1 id="blog-heading" className="mb-6 font-head text-6xl tracking-tight sm:text-8xl">Blog<span aria-hidden="true" className="text-muted-foreground">.</span></h1>
        <p className="max-w-xl text-lg leading-relaxed sm:text-xl">Thoughts on building software and working with AI, grounded in implementation and experience.</p>
      </header>

      <div className="mb-6 flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest">
        <h2 className="font-bold">All posts</h2>
        <span>{posts.length} {posts.length === 1 ? 'article' : 'articles'}</span>
      </div>
      <ul className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug} className="group min-w-0 only:md:col-span-2">
            <Card className="h-full gap-0 rounded-none bg-background p-0 text-foreground transition-shadow hover:shadow-lg focus-within:shadow-lg">
              <a href={`/blog/${post.slug}/`} aria-labelledby={`title-${post.slug}`} className="grid h-full min-w-0 grid-rows-[auto_1fr] focus-visible:outline-offset-[-4px] group-only:md:grid-cols-2 group-only:md:grid-rows-1">
                <div className="flex items-center justify-center border-b-2 bg-muted p-6 group-only:md:border-r-2 group-only:md:border-b-0 sm:p-8">
                  <img src={post.image} alt="" width="606" height="894" className="h-64 w-full object-contain group-only:md:h-80" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <div className="flex-1 p-6 sm:p-8 group-only:md:flex group-only:md:flex-col group-only:md:justify-center">
                    <h3 id={`title-${post.slug}`} className="break-words font-head text-2xl leading-tight tracking-tight group-only:lg:text-4xl">{post.title}</h3>
                    {post.description !== post.title && <p className="mt-4 text-base leading-relaxed text-muted-foreground">{post.description}</p>}
                  </div>
                  <div aria-hidden="true" className="flex items-center justify-between gap-4 border-t-2 bg-accent px-6 py-5 font-bold text-accent-foreground sm:px-8">
                    <span>Read article</span>
                    <span className="text-2xl">↗</span>
                  </div>
                </div>
              </a>
            </Card>
          </li>
        ))}
      </ul>
      {posts.length === 0 && <p className="border-2 bg-muted p-8 text-lg">New articles are on the way.</p>}
    </section>
  )
}
