/// <reference types="vite/client" />
/// <reference types="mdx" />

declare module './projects/*.mdx' {
  export const metadata: import('./content/project-metadata').ProjectMetadata
  const Content: import('mdx/types').MDXContent
  export default Content
}
