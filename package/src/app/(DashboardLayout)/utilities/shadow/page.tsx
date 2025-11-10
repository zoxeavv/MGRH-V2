import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const shadowTokens = [
  { label: "Shadow xs", className: "shadow-xs" },
  { label: "Shadow sm", className: "shadow-sm" },
  { label: "Shadow base", className: "shadow" },
  { label: "Shadow md", className: "shadow-md" },
  { label: "Shadow lg", className: "shadow-lg" },
  { label: "Shadow xl", className: "shadow-xl" },
  { label: "Shadow 2xl", className: "shadow-2xl" },
  { label: "Shadow card", className: "shadow-card" },
] as const

const modeTokens = [
  { mode: "Light mode preview", className: "bg-slate-50 text-slate-700" },
  { mode: "Dark mode preview", className: "bg-slate-900 text-slate-100" },
] as const

const Shadow = () => {
  return (
    <PageContainer
      title="Shadow Tokens"
      description="Elevations applied across the interface. Each token is calibrated for accessible contrast in both light and dark themes."
    >
      <DashboardCard title="Elevation Scale" contentClassName="grid gap-6">
        {modeTokens.map((mode) => (
          <section
            key={mode.mode}
            aria-label={mode.mode}
            className={`rounded-3xl border border-border/40 p-6 ${mode.className}`}
          >
            <p className="text-sm font-semibold uppercase tracking-wide opacity-70">{mode.mode}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {shadowTokens.map((token) => (
                <div
                  key={`${mode.mode}-${token.label}`}
                  className={`flex h-24 flex-col justify-center rounded-2xl border border-white/10 px-6 ${token.className}`}
                >
                  <span className="text-sm font-semibold">{token.label}</span>
                  <span className="text-xs opacity-70">{token.className}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </DashboardCard>
    </PageContainer>
  )
}

export default Shadow
