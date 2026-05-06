"use client"

import { TopBar } from "@/shared/components/layout/topBar"
import { DailySalesChart } from "@/shared/components/charts/dailySalesChart"
import { CategoryPieChart } from "@/shared/components/charts/categoryPieChart"
import { RecentActivityTable } from "@/shared/components/dashboard/recentActivityTable"
import { SaleFormModal } from "@/shared/components/modals/saleFormModal"
import { InventoryFormModal } from "@/shared/components/modals/inventoryFormModal"
import { PageSpinner } from "@/shared/components/ui/spinner"
import { Button } from "@/shared/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { DashboardToolbar } from "./components/dashboardToolbar"
import { DashboardSummaryCards } from "./components/dashboardSummaryCards"
import { useDashboardPage } from "./hooks/useDashboardPage"

export default function DashboardPage() {
  const {
    sales,
    salesLoading,
    salesError,
    refetchSales,
    dateRange,
    setDateRange,
    dateFrom,
    dateTo,
    totals,
    dailyData,
    saleModalOpen,
    setSaleModalOpen,
    inventoryModalOpen,
    setInventoryModalOpen,
    handleAddSale,
    handleAddInventory,
  } = useDashboardPage()

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
        onSubmit={handleAddSale}
      />
      <InventoryFormModal
        open={inventoryModalOpen}
        onOpenChange={setInventoryModalOpen}
        onSubmit={handleAddInventory}
      />
    </>
  )
}
