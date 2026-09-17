import matter from 'gray-matter'
import type { BlogMetadata } from '../src/content/blog-metadata.ts'
import { articleEntries, articleMetadata } from './project-metadata.ts'

export function parseBlogArticle(source: string, filename: string): { metadata: BlogMetadata; content: string } {
  try {
    const { data, content } = matter(source)
    for (const field of ['title', 'description', 'slug', 'image', 'imageAlt']) {
      if (typeof data[field] !== 'string' || !data[field].trim()) {
        throw new Error(`frontmatter "${field}" must be a non-empty string`)
      }
    }
    if (data.slug !== data.slug.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      throw new Error('frontmatter "slug" must contain lowercase alphanumeric words separated by hyphens')
    }
    return { metadata: {
      slug: data.slug, title: data.title, description: data.description,
      image: data.image, imageAlt: data.imageAlt,
    }, content }
  } catch (error) {
    throw new Error(`${filename}: ${error instanceof Error ? error.message : String(error)}`, { cause: error })
  }
}

export const blogEntries = (root: string) => articleEntries(root, 'blog', parseBlogArticle)
export const blogMetadata = () => articleMetadata('blog', parseBlogArticle)
