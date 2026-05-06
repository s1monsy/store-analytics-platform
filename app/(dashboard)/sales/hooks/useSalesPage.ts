"use client"

import { useState, useMemo } from "react"
import { toast } from "sonner"
import { useStore } from "@/shared/lib/store-context"
import type { SaleEntry } from "@/shared/lib/store"

const PAGE_SIZE = 2

export function useSalesPage() {
  const { sales, salesLoading, salesError, refetchSales, addSale, updateSale, deleteSale } = useStore()

  const [formOpen, setFormOpen] = useState(false)
  const [editingSale, setEditingSale] = useState<SaleEntry | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [shiftFilter, setShiftFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")

  const filtered = useMemo(() => {
    return sales
      .filter((s) => {
        if (dateFrom && s.date < dateFrom) return false
        if (dateTo && s.date > dateTo) return false
        if (shiftFilter !== "all" && s.shift !== shiftFilter) return false
        if (paymentFilter !== "all" && s.paymentType !== paymentFilter) return false
        if (search) {
          const q = search.toLowerCase()
          return (
            s.comment.toLowerCase().includes(q) ||
            s.date.includes(q) ||
            s.totalAmount.toString().includes(q)
          )
        }
        return true
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
  }, [sales, dateFrom, dateTo, shiftFilter, paymentFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const openAddForm = () => {
    setEditingSale(null)
    setFormOpen(true)
  }

  const handleEdit = (sale: SaleEntry) => {
    setEditingSale(sale)
    setFormOpen(true)
  }

  const handleFormSubmit = (data: Omit<SaleEntry, "id">) => {
    if (editingSale) {
      updateSale(editingSale.id, data)
    } else {
      addSale(data)
    }
    setEditingSale(null)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteSale(deleteId)
      setDeleteId(null)
      toast.success("Запис видалено")
    }
  }

  return {
    sales,
    salesLoading,
    salesError,
    refetchSales,
    filtered,
    paginated,
    page: safePage,
    totalPages,
    setPage,
    formOpen,
    setFormOpen,
    editingSale,
    setEditingSale,
    deleteId,
    setDeleteId,
    search,
    setSearch,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    shiftFilter,
    setShiftFilter,
    paymentFilter,
    setPaymentFilter,
    openAddForm,
    handleEdit,
    handleFormSubmit,
    handleDelete,
  }
}
