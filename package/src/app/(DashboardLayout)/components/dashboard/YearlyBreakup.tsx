import * as React from "react"
import dynamic from "next/dynamic"
import type { ApexOptions } from "apexcharts"
import { IconArrowUpLeft } from "@tabler/icons-react"
import { useTheme } from "next-themes"

import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard"
import { Badge } from "@/components/ui/badge"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

const YearlyBreakup = () => {
  const { resolvedTheme } = useTheme()
  const [seriesColors, setSeriesColors] = React.useState<string[]>([
    "hsl(221.2 83.2% 53.3%)",
    "hsl(221.2 83.2% 89%)",
    "hsl(222.2 47.4% 96%)",
  ])

  React.useEffect(() => {
    const root = document.documentElement
    const computed = getComputedStyle(root)
    const primary = computed.getPropertyValue("--primary").trim()
    const muted = computed.getPropertyValue("--muted").trim()

    if (primary && muted) {
      setSeriesColors([
        `hsl(${primary})`,
        `hsl(${primary} / 0.35)`,
        `hsl(${muted})`,
      ])
    }
  }, [resolvedTheme])

  const chartOptions = React.useMemo<ApexOptions>(
    () => ({
      chart: {
        type: "donut" as const,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        foreColor: "hsl(var(--muted-foreground))",
        toolbar: { show: false },
        height: 200,
      },
      colors: seriesColors,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: false,
      },
      legend: {
        show: false,
      },
      tooltip: {
        theme: resolvedTheme === "dark" ? "dark" : "light",
      },
      plotOptions: {
        pie: {
          donut: {
            size: "78%",
            labels: {
              show: true,
              value: {
                fontSize: "24px",
                fontWeight: 600,
                color: "hsl(var(--foreground))",
                formatter: (val: string) => `${val}%`,
              },
              total: {
                show: true,
                label: "Growth",
                fontSize: "14px",
                color: "hsl(var(--muted-foreground))",
                formatter: () => "64%",
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: { height: 160 },
          },
        },
      ],
    }),
    [resolvedTheme, seriesColors]
  )

  const chartSeries = React.useMemo(() => [38, 40, 22], [])

  return (
    <DashboardCard title="Yearly Revenue">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-3xl font-semibold tracking-tight">$36,358</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
                <IconArrowUpLeft className="h-4 w-4" stroke={1.75} aria-hidden="true" />
              </span>
              <span className="font-semibold text-emerald-600">+9%</span>
              <span>vs last year</span>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-brand" aria-hidden="true" />
                <dt className="text-muted-foreground">FY 2024</dt>
              </div>
              <dd className="text-lg font-semibold text-foreground">$18,420</dd>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full bg-brand/30"
                  aria-hidden="true"
                />
                <dt className="text-muted-foreground">FY 2025</dt>
              </div>
              <dd className="text-lg font-semibold text-foreground">$17,938</dd>
            </div>
          </dl>
          <Badge variant="success" className="inline-flex items-center gap-1">
            Healthy margin
          </Badge>
        </div>
        <div className="flex items-center justify-center">
          <Chart options={chartOptions} series={chartSeries} type="donut" height={220} width="100%" />
        </div>
      </div>
    </DashboardCard>
  )
}

export default YearlyBreakup

