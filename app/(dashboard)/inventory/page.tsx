"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { useStore } from "@/lib/store-context"
import { InventoryFormModal } from "@/components/inventory-form-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Minus,
  PackageOpen,
  AlertTriangle,
} from "lucide-react"
import { toast } from "sonner"
import type { InventoryItem } from "@/lib/store"
import { cn } from "@/lib/utils"

export default function InventoryPage() {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, adjustQty } =
    useStore()

  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const filtered = inventory.filter((item) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      item.name.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q)
    )
  })

  const lowStockCount = inventory.filter((i) => i.qty < i.minQty).length

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

  return (
    <div className="flex flex-col">
      <TopBar title="Склад" />
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        {/* Stats Row */}
        {lowStockCount > 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/10 px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))]" />
            <p className="text-sm text-foreground">
              <strong>{lowStockCount}</strong>{" "}
              {lowStockCount === 1 ? "товар" : "товарів"} нижче мінімального порогу
            </p>
          </div>
        )}

        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Пошук товарів..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setEditingItem(null)
              setFormOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Додати товар
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <PackageOpen className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Немає товарів на складі</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    setEditingItem(null)
                    setFormOpen(true)
                  }}
                >
                  Додати запис
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Товар</TableHead>
                    <TableHead className="text-xs">Артикул</TableHead>
                    <TableHead className="text-center text-xs">Кількість</TableHead>
                    <TableHead className="text-center text-xs">Мін. поріг</TableHead>
                    <TableHead className="text-xs">Статус</TableHead>
                    <TableHead className="hidden text-xs md:table-cell">Оновлено</TableHead>
                    <TableHead className="w-36 text-xs">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => {
                    const isLow = item.qty < item.minQty
                    return (
                      <TableRow
                        key={item.id}
                        className={cn(isLow && "bg-destructive/5")}
                      >
                        <TableCell className="text-sm font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.sku || "—"}
                        </TableCell>
                        <TableCell className="text-center text-sm font-medium">
                          {item.qty}
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {item.minQty}
                        </TableCell>
                        <TableCell>
                          {isLow ? (
                            <Badge variant="destructive" className="text-xs font-normal">
                              Мало
                            </Badge>
                          ) : (
                            <Badge
                              className="text-xs font-normal bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]"
                            >
                              Норма
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                          {item.updatedAt}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => adjustQty(item.id, -1)}
                              disabled={item.qty <= 0}
                              aria-label="Зменшити"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => adjustQty(item.id, 1)}
                              aria-label="Збільшити"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleEdit(item)}
                              aria-label="Редагувати"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(item.id)}
                              aria-label="Видалити"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
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

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Видалити товар?</AlertDialogTitle>
            <AlertDialogDescription>
              Цю дію неможливо скасувати. Товар буде видалено зі складу.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Видалити
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
