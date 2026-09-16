import type { ReactNode } from 'react'
import { Collapsible } from 'radix-ui'

// Adapted from https://neobrutalism.com/docs/components/collapsible.
export default function ProjectDetailSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <Collapsible.Root className="my-4 border-2 shadow-sm">
      <h2 className="m-0! text-xl! sm:text-2xl!">
        <Collapsible.Trigger className="group flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 p-4 text-left hover:bg-accent focus-visible:bg-accent focus-visible:outline-offset-2">
          <span>{title}</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="size-6 shrink-0 group-data-[state=open]:rotate-180"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Collapsible.Trigger>
      </h2>
      <Collapsible.Content className="border-t-2 px-4">
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
