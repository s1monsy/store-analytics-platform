"use client"

import { TopBar } from "@/shared/components/layout/topBar"
import { InventoryFormModal } from "@/shared/components/modals/inventoryFormModal"
import { PageSpinner } from "@/shared/components/ui/spinner"
import { Button } from "@/shared/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { LowStockBanner } from "./components/lowStockBanner"
import { InventoryToolbar } from "./components/inventoryToolbar"
import { InventoryTable } from "./components/inventoryTable"
import { DeleteConfirmDialog } from "../sales/components/deleteConfirmDialog"
import { useInventoryPage } from "./hooks/useInventoryPage"

export default function InventoryPage() {
  const {
    inventoryLoading,
    inventoryError,
    refetchInventory,
    adjustQty,
    filtered,
    paginated,
    page,
    totalPages,
    setPage,
    lowStockCount,
    formOpen,
    setFormOpen,
    editingItem,
    setEditingItem,
    deleteId,
    setDeleteId,
    search,
    setSearch,
    openAddForm,
    handleEdit,
    handleFormSubmit,
    handleDelete,
  } = useInventoryPage()

  if (inventoryLoading) {
    return (
      <div className="flex flex-col h-full">
        <TopBar title="Склад" />
        <PageSpinner />
      </div>
    )
  }

  if (inventoryError) {
    return (
      <div className="flex flex-col h-full">
        <TopBar title="Склад" />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <p className="text-sm">{inventoryError}</p>
          <Button variant="outline" size="sm" onClick={refetchInventory}>Спробувати знову</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <TopBar title="Склад" />
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <LowStockBanner count={lowStockCount} />
        <InventoryToolbar
          search={search}
          onSearchChange={setSearch}
          onAddClick={openAddForm}
        />
        <InventoryTable
          paginated={paginated}
          filtered={filtered}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={setDeleteId}
          onAdjustQty={adjustQty}
          onAddClick={openAddForm}
        />
      </div>

      <InventoryFormModal
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v)
          if (!v) setEditingItem(null)
        }}
        item={editingItem}
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
