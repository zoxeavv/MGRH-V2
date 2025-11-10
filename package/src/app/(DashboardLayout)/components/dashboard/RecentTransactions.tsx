import Link from "next/link"

import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const TIMELINE = [
  {
    time: "09:30 AM",
    label: "Payment received from John Doe of $385.90",
    tone: "brand",
  },
  {
    time: "10:00 AM",
    label: (
      <>
        <span className="font-semibold text-foreground">New sale recorded</span>{" "}
        <Link href="/" className="text-primary underline-offset-2 hover:underline">
          #ML-3467
        </Link>
      </>
    ),
    tone: "accent",
  },
  {
    time: "12:00 PM",
    label: "Payment was made of $64.95 to Michael",
    tone: "success",
  },
  {
    time: "03:45 PM",
    label: (
      <>
        <span className="font-semibold text-foreground">Refund issued</span>{" "}
        <Link href="/" className="text-primary underline-offset-2 hover:underline">
          #INV-9471
        </Link>
      </>
    ),
    tone: "warning",
  },
  {
    time: "06:15 PM",
    label: "New arrival recorded",
    tone: "error",
  },
  {
    time: "08:42 PM",
    label: "Payment received via Stripe",
    tone: "success",
  },
] as const

const toneClassMap: Record<
  (typeof TIMELINE)[number]["tone"],
  { dot: string; badge: "success" | "warning" | "destructive" | "info" | "default" }
> = {
  brand: { dot: "bg-brand", badge: "default" },
  accent: { dot: "bg-accent", badge: "info" },
  success: { dot: "bg-emerald-500", badge: "success" },
  warning: { dot: "bg-amber-500", badge: "warning" },
  error: { dot: "bg-red-500", badge: "destructive" },
}

const badgeLabelMap: Record<(typeof TIMELINE)[number]["tone"], string> = {
  brand: "Settled",
  accent: "Order",
  success: "Completed",
  warning: "Action needed",
  error: "Alert",
}

const RecentTransactions = () => {
  return (
    <DashboardCard title="Recent Activity" subtitle="Log of payouts and invoices">
      <ol className="relative space-y-6 border-l border-border pl-6">
        {TIMELINE.map((event, index) => {
          const isLast = index === TIMELINE.length - 1
          const tone = toneClassMap[event.tone]

          return (
            <li key={`${event.time}-${index}`} className="relative grid gap-1 sm:grid-cols-[auto,1fr] sm:gap-x-6">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {event.time}
              </div>
              <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "absolute left-[-9px] mt-0.5 inline-flex h-2.5 w-2.5 -translate-x-1/2 rounded-full ring-4 ring-background",
                      tone.dot
                    )}
                    aria-hidden="true"
                  />
                  <span>{event.label}</span>
                </div>
                <Badge variant={tone.badge} className="shadow-sm">
                  {badgeLabelMap[event.tone]}
                </Badge>
              </div>
              {!isLast ? (
                <span
                  className="absolute left-[-1px] top-6 h-[calc(100%_-_1.75rem)] w-px bg-border"
                  aria-hidden="true"
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </DashboardCard>
  )
}

export default RecentTransactions

