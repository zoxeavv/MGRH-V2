import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("animate-pulse rounded-lg bg-muted", className)}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export { Skeleton }
