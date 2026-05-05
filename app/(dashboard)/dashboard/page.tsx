"use client"

import { useMemo, useState } from "react"
import { format, subDays } from "date-fns"
import { uk } from "date-fns/locale"
import { TopBar } from "@/components/layout/topBar"
import { StatsCard } from "@/components/dashboard/statsCard"
import { useStore } from "@/lib/store-context"
import { getDailyAggregates, getTotals } from "@/lib/store"
import { DailySalesChart } from "@/components/charts/dailySalesChart"
import { CategoryPieChart } from "@/components/charts/categoryPieChart"
import { RecentActivityTable } from "@/components/dashboard/recentActivityTable"
import { Button } from "@/components/ui/button"
import { PageSpinner } from "@/components/ui/spinner"
import { AlertTriangle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Banknote, Receipt, TrendingUp, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const { sales, salesLoading, salesError, refetchSales } = useStore()
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

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
    <div className="flex flex-col">
      <TopBar title="Дашборд" />
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        {/* Date Range Picker */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(dateRange.from, "dd MMM", { locale: uk })} -{" "}
                {format(dateRange.to, "dd MMM yyyy", { locale: uk })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to })
                  } else if (range?.from) {
                    setDateRange({ from: range.from, to: range.from })
                  }
                }}
                numberOfMonths={2}
                locale={uk}
              />
            </PopoverContent>
          </Popover>
          <div className="flex gap-1">
            {[
              { label: "7 днів", days: 7 },
              { label: "14 днів", days: 14 },
              { label: "30 днів", days: 30 },
            ].map((preset) => (
              <Button
                key={preset.days}
                variant="ghost"
                size="sm"
                onClick={() =>
                  setDateRange({
                    from: subDays(new Date(), preset.days),
                    to: new Date(),
                  })
                }
                className="text-xs"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Виручка"
            value={`${totals.revenue.toLocaleString("uk-UA")} грн`}
            subtitle={`Нетто: ${totals.netRevenue.toLocaleString("uk-UA")} грн`}
            icon={Banknote}
            trend="up"
          />
          <StatsCard
            title="Кількість чеків"
            value={totals.receipts.toLocaleString("uk-UA")}
            icon={Receipt}
            trend="neutral"
          />
          <StatsCard
            title="Середній чек"
            value={`${totals.avgCheck.toLocaleString("uk-UA")} грн`}
            icon={TrendingUp}
            trend="up"
          />
          <StatsCard
            title="Повернення"
            value={`${totals.returns.toLocaleString("uk-UA")} грн`}
            icon={RotateCcw}
            trend="down"
          />
        </div>

        {/* Charts */}
        <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <DailySalesChart data={dailyData} />
          </div>
          <div>
            <CategoryPieChart sales={sales} dateFrom={dateFrom} dateTo={dateTo} />
          </div>
        </div>

        {/* Recent Activity Table */}
        <RecentActivityTable sales={sales} />
      </div>
    </div>
  )
}
