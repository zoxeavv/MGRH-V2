import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
}

function Skeleton({ className, label = "Loading...", ...props }: SkeletonProps) {
  return (
    <div role="status" aria-label={label} className={cn("animate-pulse rounded-lg bg-muted", className)} {...props}>
      <span className="sr-only">{label}</span>
    </div>
  )
}

export { Skeleton }
