"use client"

import { useState } from "react"
import { TopBar } from "@/shared/components/layout/topBar"
import { useStore } from "@/shared/lib/store-context"
import { InventoryFormModal } from "@/shared/components/modals/inventoryFormModal"
import { Button } from "@/shared/components/ui/button"
import { PageSpinner } from "@/shared/components/ui/spinner"
import { AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import type { InventoryItem } from "@/shared/lib/store"
import { LowStockBanner } from "./components/lowStockBanner"
import { InventoryToolbar } from "./components/inventoryToolbar"
import { InventoryTable } from "./components/inventoryTable"
import { DeleteConfirmDialog } from "../sales/components/deleteConfirmDialog"

const PAGE_SIZE = 2

export default function InventoryPage() {
  const {
    inventory,
    inventoryLoading,
    inventoryError,
    refetchInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustQty,
  } = useStore()

  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = inventory.filter((item) => {
    if (!search) return true
    const q = search.toLowerCase()
    return item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q)
  })

  const lowStockCount = inventory.filter((i) => i.qty < i.minQty).length
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item)
    setFormOpen(true)
  }

  const handleFormSubmit = (data: Omit<InventoryItem, "id" | "updatedAt">) => {
    if (editingItem) {
      updateInventoryItem(editingItem.id, data)
    } else {
      addInventoryItem(data)
    }
    setEditingItem(null)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteInventoryItem(deleteId)
      setDeleteId(null)
      toast.success("Товар видалено")
    }
  }

  const openAddForm = () => {
    setEditingItem(null)
    setFormOpen(true)
  }

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
          page={safePage}
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
