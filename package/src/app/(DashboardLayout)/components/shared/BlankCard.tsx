import { cn } from "@/lib/utils"

type BlankCardProps = {
  className?: string
  children: React.ReactNode
}

const BlankCard = ({ children, className }: BlankCardProps) => {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card/80 shadow-card backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  )
}

export default BlankCard
