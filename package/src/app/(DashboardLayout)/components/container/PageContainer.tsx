import type { ReactNode } from "react"

type PageContainerProps = {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export const PageContainer = ({
  title,
  description,
  actions,
  children,
}: PageContainerProps) => {
  const headingId = title ? `${title.toLowerCase().replace(/\s+/g, "-")}-heading` : undefined

  return (
    <section
      className="flex flex-col gap-6"
      aria-labelledby={headingId}
      aria-describedby={description ? `${headingId}-description` : undefined}
    >
      {(title || description || actions) && (
        <header className="flex flex-col gap-4 rounded-2xl border border-border bg-card/60 p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            {title && (
              <h1 id={headingId} className="text-2xl font-semibold tracking-tight">
                {title}
              </h1>
            )}
            {description && (
              <p id={`${headingId}-description`} className="max-w-2xl text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </header>
      )}
      <div className="grid gap-6">{children}</div>
    </section>
  )
}

export default PageContainer
