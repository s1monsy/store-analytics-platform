"use client"

import { useState, useMemo } from "react"
import { TopBar } from "@/components/layout/topBar"
import { useStore } from "@/lib/store-context"
import { getDailyAggregates, getTotals } from "@/lib/store"
import { DateRangePicker } from "./components/dateRangePicker"
import { SummaryCards } from "./components/summaryCards"
import { BestWorstDay } from "./components/bestWorstDay"
import { DailyReportTable } from "./components/dailyReportTable"
import { format, subDays } from "date-fns"
import { toast } from "sonner"

export default function ReportsPage() {
  const { sales } = useStore()
  const [dateFrom, setDateFrom] = useState(format(subDays(new Date(), 30), "yyyy-MM-dd"))
  const [dateTo, setDateTo] = useState(format(new Date(), "yyyy-MM-dd"))

  const totals = useMemo(() => getTotals(sales, dateFrom, dateTo), [sales, dateFrom, dateTo])
  const dailyData = useMemo(
    () => getDailyAggregates(sales, dateFrom, dateTo),
    [sales, dateFrom, dateTo]
  )

  const bestDay = useMemo(() => {
    if (dailyData.length === 0) return null
    return dailyData.reduce((max, d) => (d.revenue > max.revenue ? d : max), dailyData[0])
  }, [dailyData])

  const worstDay = useMemo(() => {
    if (dailyData.length === 0) return null
    return dailyData.reduce((min, d) => (d.revenue < min.revenue ? d : min), dailyData[0])
  }, [dailyData])

  const handleExportCSV = () => {
    const headers = ["Дата", "Виручка (грн)", "Чеки", "Сер. чек (грн)", "Повернення (грн)", "Нетто (грн)"]
    const rows = dailyData.map((d) => [
      d.date,
      d.revenue,
      d.receipts,
      d.avgCheck,
      d.returns,
      (d.revenue - d.returns).toFixed(2),
    ])
    const csv = [headers, ...rows].map((r) => r.join(";")).join("\n")
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `звіт_${dateFrom}_${dateTo}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("CSV файл завантажено")
  }

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
