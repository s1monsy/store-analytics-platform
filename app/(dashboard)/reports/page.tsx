"use client"

import { TopBar } from "@/shared/components/layout/topBar"
import { DateRangePicker } from "./components/dateRangePicker"
import { SummaryCards } from "./components/summaryCards"
import { BestWorstDay } from "./components/bestWorstDay"
import { DailyReportTable } from "./components/dailyReportTable"
import { useReportsPage } from "./hooks/useReportsPage"

export default function ReportsPage() {
  const {
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    totals,
    dailyData,
    bestDay,
    worstDay,
    handleExportCSV,
  } = useReportsPage()

  return (
    <div className="flex flex-col">
      <TopBar title="Звіти" />
      <div className="flex-1 overflow-auto p-4 lg:p-6 print:p-0 print:overflow-visible">
        <DateRangePicker
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onExportCSV={handleExportCSV}
        />
        <SummaryCards
          revenue={totals.revenue}
          netRevenue={totals.netRevenue}
          receipts={totals.receipts}
          avgCheck={totals.avgCheck}
          returns={totals.returns}
        />
        {bestDay && worstDay && (
          <BestWorstDay bestDay={bestDay} worstDay={worstDay} />
        )}
        <DailyReportTable data={dailyData} />
      </div>
    </div>
  )
}
