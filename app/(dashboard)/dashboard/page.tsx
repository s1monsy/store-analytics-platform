"use client"

import { useMemo, useState } from "react"
import { format, subDays } from "date-fns"
import { TopBar } from "@/shared/components/layout/topBar"
import { useStore } from "@/shared/lib/store-context"
import { getDailyAggregates, getTotals } from "@/shared/lib/store"
import { DailySalesChart } from "@/shared/components/charts/dailySalesChart"
import { CategoryPieChart } from "@/shared/components/charts/categoryPieChart"
import { RecentActivityTable } from "@/shared/components/dashboard/recentActivityTable"
import { SaleFormModal } from "@/shared/components/modals/saleFormModal"
import { InventoryFormModal } from "@/shared/components/modals/inventoryFormModal"
import { Button } from "@/shared/components/ui/button"
import { PageSpinner } from "@/shared/components/ui/spinner"
import { AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { DashboardToolbar } from "./components/dashboardToolbar"
import { DashboardSummaryCards } from "./components/dashboardSummaryCards"

export default function DashboardPage() {
  const { sales, salesLoading, salesError, refetchSales, addSale, addInventoryItem } = useStore()
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const [saleModalOpen, setSaleModalOpen] = useState(false)
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false)

  const dateFrom = format(dateRange.from, "yyyy-MM-dd")
  const dateTo = format(dateRange.to, "yyyy-MM-dd")

  const totals = useMemo(() => getTotals(sales, dateFrom, dateTo), [sales, dateFrom, dateTo])
  const dailyData = useMemo(
    () => getDailyAggregates(sales, dateFrom, dateTo),
    [sales, dateFrom, dateTo]
  )

  if (salesLoading) {
    return (
      <div className="flex flex-col h-full">
        <TopBar title="Дашборд" />
        <PageSpinner />
      </div>
    )
  }

  if (salesError) {
    return (
      <div className="flex flex-col h-full">
        <TopBar title="Дашборд" />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <p className="text-sm">{salesError}</p>
          <Button variant="outline" size="sm" onClick={refetchSales}>Спробувати знову</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col">
        <TopBar title="Дашборд" />
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          <DashboardToolbar
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onAddSale={() => setSaleModalOpen(true)}
            onAddInventory={() => setInventoryModalOpen(true)}
          />
          <DashboardSummaryCards
            revenue={totals.revenue}
            netRevenue={totals.netRevenue}
            receipts={totals.receipts}
            avgCheck={totals.avgCheck}
            returns={totals.returns}
          />
          <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <DailySalesChart data={dailyData} />
            </div>
            <div>
              <CategoryPieChart sales={sales} dateFrom={dateFrom} dateTo={dateTo} />
            </div>
          </div>
          <RecentActivityTable sales={sales} />
        </div>
      </div>

      <SaleFormModal
        open={saleModalOpen}
        onOpenChange={setSaleModalOpen}
        onSubmit={async (data) => {
          await addSale(data)
          setSaleModalOpen(false)
          toast.success("Продаж додано")
        }}
      />
      <InventoryFormModal
        open={inventoryModalOpen}
        onOpenChange={setInventoryModalOpen}
        onSubmit={async (data) => {
          await addInventoryItem(data)
          setInventoryModalOpen(false)
          toast.success("Товар додано")
        }}
      />
    </>
  )
}
