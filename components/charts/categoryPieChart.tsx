"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import type { SaleEntry } from "@/lib/store"

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
]

export function CategoryPieChart({
  sales,
  dateFrom,
  dateTo,
}: {
  sales: SaleEntry[]
  dateFrom: string
  dateTo: string
}) {
  const data = useMemo(() => {
    const filtered = sales.filter((s) => s.date >= dateFrom && s.date <= dateTo)
    const cashMorning = filtered
      .filter((s) => s.paymentType === "cash" && s.shift === "morning")
      .reduce((sum, s) => sum + s.totalAmount, 0)
    const cashEvening = filtered
      .filter((s) => s.paymentType === "cash" && s.shift === "evening")
      .reduce((sum, s) => sum + s.totalAmount, 0)
    const cardMorning = filtered
      .filter((s) => s.paymentType === "card" && s.shift === "morning")
      .reduce((sum, s) => sum + s.totalAmount, 0)
    const cardEvening = filtered
      .filter((s) => s.paymentType === "card" && s.shift === "evening")
      .reduce((sum, s) => sum + s.totalAmount, 0)

    return [
      { name: "Готівка (ранок)", value: Math.round(cashMorning) },
      { name: "Готівка (вечір)", value: Math.round(cashEvening) },
      { name: "Картка (ранок)", value: Math.round(cardMorning) },
      { name: "Картка (вечір)", value: Math.round(cardEvening) },
    ].filter((d) => d.value > 0)
  }, [sales, dateFrom, dateTo])

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-card-foreground">
          Розподіл продажів
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                strokeWidth={2}
                stroke="hsl(var(--card))"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "hsl(var(--card-foreground))",
                }}
                formatter={(value: number) => [
                  `${value.toLocaleString("uk-UA")} грн`,
                  "Сума",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          {data.map((item, i) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-xs text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
