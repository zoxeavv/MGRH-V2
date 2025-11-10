import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const products = [
  {
    id: "1",
    owner: "Sunil Joshi",
    role: "Web Designer",
    product: "Elite Admin",
    priority: "Low",
    budget: 3.9,
  },
  {
    id: "2",
    owner: "Andrew McDownland",
    role: "Project Manager",
    product: "Real Homes WP Theme",
    priority: "Medium",
    budget: 24.5,
  },
  {
    id: "3",
    owner: "Christopher Jamil",
    role: "Project Manager",
    product: "MedicalPro WP Theme",
    priority: "High",
    budget: 12.8,
  },
  {
    id: "4",
    owner: "Nirav Joshi",
    role: "Frontend Engineer",
    product: "Hosting Press HTML",
    priority: "Critical",
    budget: 2.4,
  },
] as const

const priorityVariantMap: Record<
  (typeof products)[number]["priority"],
  { variant: "success" | "warning" | "destructive" | "info" | "default"; label: string }
> = {
  Low: { variant: "info", label: "Low" },
  Medium: { variant: "warning", label: "Medium" },
  High: { variant: "destructive", label: "High" },
  Critical: { variant: "success", label: "Critical" },
}

const ProductPerformance = () => {
  return (
    <DashboardCard
      title="Product Performance"
      subtitle="Status by owner and budget allocation"
      contentClassName="p-0"
    >
      <div className="overflow-x-auto">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="text-right">Budget</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const priority = priorityVariantMap[product.priority]
              return (
                <TableRow key={product.id} className="last:border-b-0">
                  <TableCell className="text-sm font-semibold text-foreground">{product.id}</TableCell>
                  <TableCell className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{product.owner}</p>
                    <p className="text-xs text-muted-foreground">{product.role}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{product.product}</TableCell>
                  <TableCell>
                    <Badge variant={priority.variant} className="px-2 py-0.5 text-xs font-semibold uppercase">
                      {priority.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm font-semibold text-foreground">
                    ${product.budget}k
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          <TableCaption className="px-4 pb-4 text-xs text-muted-foreground">
            Budgets are represented in thousands. Updated 30 minutes ago.
          </TableCaption>
        </Table>
      </div>
    </DashboardCard>
  )
}

export default ProductPerformance
