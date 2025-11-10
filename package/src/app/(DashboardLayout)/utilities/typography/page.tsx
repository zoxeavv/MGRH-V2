import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import BlankCard from '@/app/(DashboardLayout)/components/shared/BlankCard';

const headingSamples = [
  { label: "Display 1", className: "text-4xl font-semibold tracking-tight", spec: "font size: 36 | line-height: 44 | font weight: 600" },
  { label: "Display 2", className: "text-3xl font-semibold tracking-tight", spec: "font size: 30 | line-height: 40 | font weight: 600" },
  { label: "Heading 3", className: "text-2xl font-semibold tracking-tight", spec: "font size: 24 | line-height: 32 | font weight: 600" },
  { label: "Heading 4", className: "text-xl font-semibold tracking-tight", spec: "font size: 20 | line-height: 28 | font weight: 600" },
  { label: "Heading 5", className: "text-lg font-semibold tracking-tight", spec: "font size: 18 | line-height: 26 | font weight: 600" },
  { label: "Heading 6", className: "text-base font-semibold tracking-tight", spec: "font size: 16 | line-height: 24 | font weight: 600" },
] as const

const textSamples = [
  { label: "Subtitle 1", className: "text-base font-medium", spec: "font size: 16 | line-height: 24 | font weight: 500" },
  { label: "Subtitle 2", className: "text-sm font-medium", spec: "font size: 14 | line-height: 21 | font weight: 500" },
  { label: "Body 1", className: "text-base", spec: "font size: 16 | line-height: 24 | font weight: 400" },
  { label: "Body 2", className: "text-sm", spec: "font size: 14 | line-height: 20 | font weight: 400" },
  { label: "Caption", className: "text-xs uppercase tracking-wide", spec: "font size: 12 | line-height: 18 | font weight: 600" },
  { label: "Overline", className: "text-xs font-medium tracking-[0.2em] uppercase", spec: "font size: 12 | line-height: 20 | letter spacing: 0.2em" },
] as const

const toneSamples = [
  { label: "Text Primary", className: "text-foreground" },
  { label: "Text Muted", className: "text-muted-foreground" },
  { label: "Text Brand", className: "text-brand" },
  { label: "Text Accent", className: "text-accent" },
  { label: "Text Warning", className: "text-amber-600" },
  { label: "Text Error", className: "text-red-600" },
  { label: "Text Success", className: "text-emerald-600" },
] as const

const TypographyPage = () => {
  return (
    <PageContainer
      title="Typography"
      description="Reference the unified typography scale and semantic text styles used throughout the dashboard."
    >
      <DashboardCard title="Heading Scale" contentClassName="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {headingSamples.map((sample) => (
            <BlankCard key={sample.label} className="p-6">
              <div className="space-y-2">
                <p className={`${sample.className} text-foreground`}>{sample.label}</p>
                <p className="text-sm text-muted-foreground">{sample.spec}</p>
              </div>
            </BlankCard>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Body Text" contentClassName="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {textSamples.map((sample) => (
            <BlankCard key={sample.label} className="p-6">
              <div className="space-y-2">
                <p className={`${sample.className} text-foreground`}>
                  {sample.label}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <p className="text-sm text-muted-foreground">{sample.spec}</p>
              </div>
            </BlankCard>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Color Tokens" contentClassName="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toneSamples.map((sample) => (
            <BlankCard key={sample.label} className="p-6">
              <p className={`text-sm font-semibold ${sample.className}`}>{sample.label}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Utility class: <code className="rounded bg-muted px-1 py-0.5">{sample.className}</code>
              </p>
              <p className={`mt-4 text-sm ${sample.className}`}>
                Sample text demonstrating the tone for accessible emphasis.
              </p>
            </BlankCard>
          ))}
        </div>
      </DashboardCard>
    </PageContainer>
  )
}

export default TypographyPage
