"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { InventoryItem } from "@/lib/store"

interface InventoryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: InventoryItem | null
  onSubmit: (data: Omit<InventoryItem, "id" | "updatedAt">) => void
}

export function InventoryFormModal({
  open,
  onOpenChange,
  item,
  onSubmit,
}: InventoryFormModalProps) {
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [qty, setQty] = useState("")
  const [minQty, setMinQty] = useState("")

  useEffect(() => {
    if (item) {
      setName(item.name)
      setSku(item.sku)
      setQty(item.qty.toString())
      setMinQty(item.minQty.toString())
    } else {
      setName("")
      setSku("")
      setQty("")
      setMinQty("")
    }
  }, [item, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Вкажіть назву товару")
      return
    }
    const quantity = parseInt(qty)
    const minQuantity = parseInt(minQty)
    if (isNaN(quantity) || quantity < 0) {
      toast.error("Кількість має бути >= 0")
      return
    }
    if (isNaN(minQuantity) || minQuantity < 0) {
      toast.error("Мін. поріг має бути >= 0")
      return
    }

    onSubmit({ name: name.trim(), sku: sku.trim(), qty: quantity, minQty: minQuantity })
    onOpenChange(false)
    toast.success(item ? "Товар оновлено" : "Товар додано")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? "Редагувати товар" : "Новий товар"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="item-name">Назва товару</Label>
            <Input
              id="item-name"
              placeholder="Наприклад: Хліб білий"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="item-sku">{"Артикул (SKU)"}</Label>
            <Input
              id="item-sku"
              placeholder="Необов'язково"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="item-qty">Кількість</Label>
              <Input
                id="item-qty"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="item-min">Мін. поріг</Label>
              <Input
                id="item-min"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={minQty}
                onChange={(e) => setMinQty(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Скасувати
            </Button>
            <Button type="submit">{item ? "Зберегти" : "Додати"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
