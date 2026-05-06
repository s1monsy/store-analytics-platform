"use client"

import { useState, useMemo } from "react"
import { format, subDays } from "date-fns"
import { toast } from "sonner"
import { useStore } from "@/shared/lib/store-context"
import { getDailyAggregates, getTotals } from "@/shared/lib/store"

export function useDashboardPage() {
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

  const handleAddSale = async (data: Parameters<typeof addSale>[0]) => {
    await addSale(data)
    setSaleModalOpen(false)
    toast.success("Продаж додано")
  }

  const handleAddInventory = async (data: Parameters<typeof addInventoryItem>[0]) => {
    await addInventoryItem(data)
    setInventoryModalOpen(false)
    toast.success("Товар додано")
  }

  return {
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
  }
}
