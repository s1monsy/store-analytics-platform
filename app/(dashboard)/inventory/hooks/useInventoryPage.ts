"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useStore } from "@/shared/lib/store-context"
import type { InventoryItem } from "@/shared/lib/store"

const PAGE_SIZE = 2

export function useInventoryPage() {
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

  const openAddForm = () => {
    setEditingItem(null)
    setFormOpen(true)
  }

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

  return {
    inventory,
    inventoryLoading,
    inventoryError,
    refetchInventory,
    adjustQty,
    filtered,
    paginated,
    page: safePage,
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
  }
}
