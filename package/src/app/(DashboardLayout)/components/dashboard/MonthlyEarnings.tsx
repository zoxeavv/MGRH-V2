import * as React from "react"
import dynamic from "next/dynamic"
import type { ApexOptions } from "apexcharts"
import { IconArrowDownRight, IconCurrencyDollar } from "@tabler/icons-react"
import { useTheme } from "next-themes"

import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

const MonthlyEarnings = () => {
  const { resolvedTheme } = useTheme()
  const [seriesColor, setSeriesColor] = React.useState<string>("hsl(221.2 83.2% 53.3%)")

  React.useEffect(() => {
    const root = document.documentElement
    const computed = getComputedStyle(root)
    const primary = computed.getPropertyValue("--primary").trim()

    if (primary) {
      const base = `hsl(${primary})`
      setSeriesColor(base)
    }
  }, [resolvedTheme])

  const chartOptions = React.useMemo<ApexOptions>(
    () => ({
      chart: {
        type: "area" as const,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        foreColor: "hsl(var(--muted-foreground))",
        toolbar: { show: false },
        height: 140,
        sparkline: { enabled: true },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0,
          stops: [15, 100],
          colorStops: [
            { offset: 0, color: seriesColor, opacity: 0.2 },
            { offset: 100, color: seriesColor, opacity: 0 },
          ],
        },
      },
      markers: { size: 0 },
      tooltip: {
        theme: resolvedTheme === "dark" ? "dark" : "light",
        y: {
          formatter: (value: number) => `$${value.toLocaleString()}`,
        },
      },
      colors: [seriesColor],
    }),
    [resolvedTheme, seriesColor]
  )

  const chartSeries = React.useMemo(
    () => [
      {
        name: "Revenue",
        data: [25, 66, 20, 40, 12, 58, 20],
      },
    ],
    []
  )

  return (
    <DashboardCard
      title="Monthly Earnings"
      subtitle="Summary of recurring revenue"
      action={
        <Button
          variant="default"
          size="sm"
          className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
        >
          <IconCurrencyDollar className="mr-2 h-4 w-4" aria-hidden="true" />
          Payouts
        </Button>
      }
      footer={
        <div className="px-6 pb-6">
          <Chart options={chartOptions} series={chartSeries} type="area" height={140} width="100%" />
        </div>
      }
      contentClassName="pt-2"
    >
      <div className="flex flex-col gap-3">
        <p className="text-3xl font-semibold tracking-tight">$6,820</p>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 ring-1 ring-red-100">
            <IconArrowDownRight className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-semibold text-emerald-600">+9.1%</span>
          <span>vs last year</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="info">Recurring billing</Badge>
          <Badge variant="success">Invoices paid</Badge>
        </div>
      </div>
    </DashboardCard>
  )
}

export default MonthlyEarnings

