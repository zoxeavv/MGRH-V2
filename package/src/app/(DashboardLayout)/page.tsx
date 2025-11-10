import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer"
import Blog from "@/app/(DashboardLayout)/components/dashboard/Blog"
import MonthlyEarnings from "@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings"
import ProductPerformance from "@/app/(DashboardLayout)/components/dashboard/ProductPerformance"
import RecentTransactions from "@/app/(DashboardLayout)/components/dashboard/RecentTransactions"
import SalesOverview from "@/app/(DashboardLayout)/components/dashboard/SalesOverview"
import YearlyBreakup from "@/app/(DashboardLayout)/components/dashboard/YearlyBreakup"

const Dashboard = () => {
  return (
    <PageContainer
      title="Performance Overview"
      description="Monitor revenue, transactions, and catalog health across your workspace."
    >
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <SalesOverview />
        <div className="grid gap-6">
          <YearlyBreakup />
          <MonthlyEarnings />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,2fr]">
        <RecentTransactions />
        <ProductPerformance />
      </div>

      <Blog />
    </PageContainer>
  )
}

export default Dashboard
