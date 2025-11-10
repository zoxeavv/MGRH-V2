import * as React from "react"
import dynamic from "next/dynamic"
import type { ApexOptions } from "apexcharts"
import { useTheme } from "next-themes"

import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

const MONTH_OPTIONS = [
  { label: "March 2025", value: "march-2025" },
  { label: "April 2025", value: "april-2025" },
  { label: "May 2025", value: "may-2025" },
] as const

const SalesOverview = () => {
  const { resolvedTheme } = useTheme()
  const [month, setMonth] = React.useState<string>(MONTH_OPTIONS[0].value)
  const [chartColors, setChartColors] = React.useState<string[]>([
    "hsl(221.2 83.2% 53.3%)",
    "hsl(15 100% 63%)",
  ])

  React.useEffect(() => {
    const root = document.documentElement
    const computed = getComputedStyle(root)
    const primary = computed.getPropertyValue("--primary").trim()
    const accent = computed.getPropertyValue("--accent").trim()

    if (primary && accent) {
      setChartColors([`hsl(${primary})`, `hsl(${accent})`])
    }
  }, [resolvedTheme])

  const optionscolumnchart = React.useMemo<ApexOptions>(
    () => ({
      chart: {
        type: "bar" as const,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        foreColor: "hsl(var(--muted-foreground))",
        toolbar: { show: false },
        height: 360,
      },
      colors: chartColors,
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "44%",
          borderRadiusApplication: "end" as const,
          borderRadiusWhenStacked: "all" as const,
          borderRadius: 8,
        },
      },
      stroke: {
        show: true,
        width: 6,
        colors: ["transparent"],
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        borderColor: "rgba(148, 163, 184, 0.25)",
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        padding: { left: 10, right: 10 },
      },
      yaxis: {
        tickAmount: 4,
        labels: {
          style: {
            colors: "hsl(var(--muted-foreground))",
            fontSize: "12px",
          },
        },
      },
      xaxis: {
        categories: ["16/08", "17/08", "18/08", "19/08", "20/08", "21/08", "22/08", "23/08"],
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "hsl(var(--muted-foreground))",
            fontSize: "12px",
          },
        },
      },
      tooltip: {
        theme: resolvedTheme === "dark" ? "dark" : "light",
        fillSeriesColor: false,
        y: {
          formatter: (value: number) => `$${value.toLocaleString()}`,
        },
      },
    }),
    [chartColors, resolvedTheme]
  )

  const seriescolumnchart = React.useMemo(
    () => [
      {
        name: "Earnings",
        data: [355, 390, 300, 350, 390, 180, 355, 390],
      },
      {
        name: "Expenses",
        data: [280, 250, 325, 215, 250, 310, 280, 250],
      },
    ],
    []
  )

  return (
    <DashboardCard
      title="Sales Overview"
      subtitle="Earnings vs Expenses"
      action={
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {MONTH_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
      contentClassName="pt-2"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-brand" aria-hidden="true" />
            <span className="font-medium text-muted-foreground">Earnings</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              +12.4%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-accent" aria-hidden="true" />
            <span className="font-medium text-muted-foreground">Expenses</span>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
              -3.1%
            </span>
          </div>
        </div>

        <div role="img" aria-label="Bar chart comparing monthly earnings and expenses">
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="bar"
            height={360}
            width="100%"
          />
        </div>
      </div>
    </DashboardCard>
  )
}

export default SalesOverview
