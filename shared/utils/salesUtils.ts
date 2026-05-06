import type { SaleEntry } from "@/shared/types"

export function getDailyAggregates(sales: SaleEntry[], dateFrom?: string, dateTo?: string) {
  const filtered = sales.filter((s) => {
    if (dateFrom && s.date < dateFrom) return false
    if (dateTo && s.date > dateTo) return false
    return true
  })

  const byDay: Record<string, { revenue: number; receipts: number; returns: number }> = {}

  filtered.forEach((s) => {
    if (!byDay[s.date]) {
      byDay[s.date] = { revenue: 0, receipts: 0, returns: 0 }
    }
    byDay[s.date].revenue += s.totalAmount
    byDay[s.date].receipts += s.receiptsCount
    byDay[s.date].returns += s.returnsAmount
  })

  return Object.entries(byDay)
    .map(([date, data]) => ({
      date,
      revenue: Math.round(data.revenue * 100) / 100,
      receipts: data.receipts,
      returns: Math.round(data.returns * 100) / 100,
      avgCheck:
        data.receipts > 0 ? Math.round((data.revenue / data.receipts) * 100) / 100 : 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function getTotals(sales: SaleEntry[], dateFrom?: string, dateTo?: string) {
  const filtered = sales.filter((s) => {
    if (dateFrom && s.date < dateFrom) return false
    if (dateTo && s.date > dateTo) return false
    return true
  })

  const totalRevenue = filtered.reduce((sum, s) => sum + s.totalAmount, 0)
  const totalReceipts = filtered.reduce((sum, s) => sum + s.receiptsCount, 0)
  const totalReturns = filtered.reduce((sum, s) => sum + s.returnsAmount, 0)
  const avgCheck = totalReceipts > 0 ? totalRevenue / totalReceipts : 0

  return {
    revenue: Math.round(totalRevenue * 100) / 100,
    receipts: totalReceipts,
    returns: Math.round(totalReturns * 100) / 100,
    avgCheck: Math.round(avgCheck * 100) / 100,
    netRevenue: Math.round((totalRevenue - totalReturns) * 100) / 100,
  }
}
