"use client"

import { useState, useMemo } from "react"
import { TopBar } from "@/components/layout/topBar"
import { useStore } from "@/lib/store-context"
import { getDailyAggregates, getTotals } from "@/lib/store"
import { StatsCard } from "@/components/dashboard/statsCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Banknote,
  Receipt,
  TrendingUp,
  RotateCcw,
  FileDown,
  Printer,
  CalendarDays,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { format, subDays, parseISO } from "date-fns"
import { uk } from "date-fns/locale"
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
        {/* Date Range Selector */}
        <Card className="mb-6 print:hidden">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-xs text-muted-foreground">Дата початку</Label>
                <Input
                  type="date"
                  className="w-40"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs text-muted-foreground">Дата кінця</Label>
                <Input
                  type="date"
                  className="w-40"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Експорт CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
              >
                <Printer className="mr-2 h-4 w-4" />
                Друк / PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Print header — visible only when printing */}
        <div className="hidden print:block mb-6">
          <h1 className="text-xl font-bold">Звіт за період</h1>
          <p className="text-sm text-gray-500">{dateFrom} — {dateTo}</p>
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

        {/* Best / Worst Day */}
        {bestDay && worstDay && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <ArrowUp className="h-5 w-5 text-[hsl(var(--success))]" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Найкращий день
                  </p>
                  <p className="text-lg font-bold text-card-foreground">
                    {format(parseISO(bestDay.date), "dd MMMM yyyy", { locale: uk })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {bestDay.revenue.toLocaleString("uk-UA")} грн &middot;{" "}
                    {bestDay.receipts} чеків
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <ArrowDown className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Найгірший день
                  </p>
                  <p className="text-lg font-bold text-card-foreground">
                    {format(parseISO(worstDay.date), "dd MMMM yyyy", { locale: uk })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {worstDay.revenue.toLocaleString("uk-UA")} грн &middot;{" "}
                    {worstDay.receipts} чеків
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Daily Report Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-card-foreground">
              <CalendarDays className="h-4 w-4" />
              Звіт по днях
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {dailyData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-sm text-muted-foreground">
                  Немає даних за вибраний період
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Дата</TableHead>
                    <TableHead className="text-right text-xs">Виручка</TableHead>
                    <TableHead className="text-right text-xs">Чеки</TableHead>
                    <TableHead className="text-right text-xs">Сер. чек</TableHead>
                    <TableHead className="text-right text-xs">Повернення</TableHead>
                    <TableHead className="text-right text-xs">Нетто</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyData.map((day) => (
                    <TableRow key={day.date}>
                      <TableCell className="text-sm font-medium">
                        {format(parseISO(day.date), "dd.MM.yy (EEEEEE)", { locale: uk })}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {day.revenue.toLocaleString("uk-UA")} грн
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {day.receipts}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {day.avgCheck.toLocaleString("uk-UA")} грн
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {day.returns.toLocaleString("uk-UA")} грн
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {(day.revenue - day.returns).toLocaleString("uk-UA")} грн
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
