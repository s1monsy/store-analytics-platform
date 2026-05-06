"use client"

import { TopBar } from "@/shared/components/layout/topBar"
import { SaleFormModal } from "@/shared/components/modals/saleFormModal"
import { PageSpinner } from "@/shared/components/ui/spinner"
import { Button } from "@/shared/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { SalesToolbar } from "./components/salesToolbar"
import { SalesTable } from "./components/salesTable"
import { DeleteConfirmDialog } from "./components/deleteConfirmDialog"
import { useSalesPage } from "./hooks/useSalesPage"

export default function SalesPage() {
  const {
    salesLoading,
    salesError,
    refetchSales,
    filtered,
    paginated,
    page,
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
  } = useSalesPage()

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
          page={page}
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
