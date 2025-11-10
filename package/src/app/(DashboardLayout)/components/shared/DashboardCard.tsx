import type { ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type DashboardCardProps = {
  title?: string
  subtitle?: string
  description?: string
  action?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  className?: string
  contentClassName?: string
}

const DashboardCard = ({
  title,
  subtitle,
  description,
  action,
  footer,
  children,
  className,
  contentClassName,
}: DashboardCardProps) => {
  return (
    <Card className={cn("h-full rounded-2xl border border-border/80 bg-card/80 shadow-card", className)}>
      {(title || subtitle || description || action) && (
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-4">
          <div className="space-y-1">
            {title ? <CardTitle className="text-xl">{title}</CardTitle> : null}
            {subtitle ? (
              <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>
            ) : null}
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {action ? <div className="flex items-center gap-2">{action}</div> : null}
        </CardHeader>
      )}
      <CardContent className={cn("space-y-4", contentClassName)}>{children}</CardContent>
      {footer ? <CardFooter className="border-t border-border/60 bg-muted/40">{footer}</CardFooter> : null}
    </Card>
  )
}

export default DashboardCard
