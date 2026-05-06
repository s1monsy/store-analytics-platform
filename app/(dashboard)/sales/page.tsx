"use client"

import { useState, useMemo } from "react"
import { TopBar } from "@/shared/components/layout/topBar"
import { useStore } from "@/shared/lib/store-context"
import { SaleFormModal } from "@/shared/components/modals/saleFormModal"
import { PageSpinner } from "@/shared/components/ui/spinner"
import { Button } from "@/shared/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import type { SaleEntry } from "@/shared/lib/store"
import { SalesToolbar } from "./components/salesToolbar"
import { SalesTable } from "./components/salesTable"
import { DeleteConfirmDialog } from "./components/deleteConfirmDialog"

const PAGE_SIZE = 2

export default function SalesPage() {
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

  const openAddForm = () => {
    setEditingSale(null)
    setFormOpen(true)
  }

  if (salesLoading) {
    return (
      <div className="flex flex-col h-full">
        <TopBar title="Продажі" />
        <PageSpinner />
      </div>
    )
  }

  if (salesError) {
    return (
      <div className="flex flex-col h-full">
        <TopBar title="Продажі" />
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
      <TopBar title="Продажі" />
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <SalesToolbar
          search={search}
          dateFrom={dateFrom}
          dateTo={dateTo}
          shiftFilter={shiftFilter}
          paymentFilter={paymentFilter}
          onSearchChange={setSearch}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onShiftFilterChange={setShiftFilter}
          onPaymentFilterChange={setPaymentFilter}
          onAddClick={openAddForm}
        />
        <SalesTable
          paginated={paginated}
          filtered={filtered}
          page={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={setDeleteId}
          onAddClick={openAddForm}
        />
      </div>

      <SaleFormModal
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v)
          if (!v) setEditingSale(null)
        }}
        sale={editingSale}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
