"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { toast } from "sonner"
import type { SaleEntry } from "@/shared/lib/store"
import { format } from "date-fns"

interface SaleFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale?: SaleEntry | null
  onSubmit: (data: Omit<SaleEntry, "id">) => void
}

export function SaleFormModal({ open, onOpenChange, sale, onSubmit }: SaleFormModalProps) {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [shift, setShift] = useState<"morning" | "evening">("morning")
  const [paymentType, setPaymentType] = useState<"cash" | "card">("cash")
  const [totalAmount, setTotalAmount] = useState("")
  const [receiptsCount, setReceiptsCount] = useState("")
  const [returnsAmount, setReturnsAmount] = useState("")
  const [comment, setComment] = useState("")

  useEffect(() => {
    if (sale) {
      setDate(sale.date)
      setShift(sale.shift)
      setPaymentType(sale.paymentType)
      setTotalAmount(sale.totalAmount.toString())
      setReceiptsCount(sale.receiptsCount.toString())
      setReturnsAmount(sale.returnsAmount.toString())
      setComment(sale.comment)
    } else {
      setDate(format(new Date(), "yyyy-MM-dd"))
      setShift("morning")
      setPaymentType("cash")
      setTotalAmount("")
      setReceiptsCount("")
      setReturnsAmount("")
      setComment("")
    }
  }, [sale, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(totalAmount)
    const receipts = parseInt(receiptsCount)
    const returns = parseFloat(returnsAmount || "0")

    if (!date) {
      toast.error("Вкажіть дату")
      return
    }
    if (isNaN(amount) || amount < 0) {
      toast.error("Сума має бути >= 0")
      return
    }
    if (isNaN(receipts) || receipts < 1 || !Number.isInteger(receipts)) {
      toast.error("Кількість чеків має бути цілим числом > 0")
      return
    }
    if (isNaN(returns) || returns < 0) {
      toast.error("Повернення має бути >= 0")
      return
    }

    onSubmit({
      date,
      shift,
      paymentType,
      totalAmount: amount,
      receiptsCount: receipts,
      returnsAmount: returns,
      comment,
    })
    onOpenChange(false)
    toast.success(sale ? "Запис оновлено" : "Запис додано")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{sale ? "Редагувати запис" : "Новий запис продажу"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="sale-date">Дата</Label>
              <Input
                id="sale-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Зміна</Label>
              <Select value={shift} onValueChange={(v) => setShift(v as "morning" | "evening")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Ранкова</SelectItem>
                  <SelectItem value="evening">Вечірня</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Тип оплати</Label>
              <Select
                value={paymentType}
                onValueChange={(v) => setPaymentType(v as "cash" | "card")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Готівка</SelectItem>
                  <SelectItem value="card">Картка</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="total-amount">Сума (грн)</Label>
              <Input
                id="total-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="receipts-count">Кількість чеків</Label>
              <Input
                id="receipts-count"
                type="number"
                min="1"
                step="1"
                placeholder="0"
                value={receiptsCount}
                onChange={(e) => setReceiptsCount(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="returns-amount">Повернення (грн)</Label>
              <Input
                id="returns-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={returnsAmount}
                onChange={(e) => setReturnsAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="comment">Коментар</Label>
            <Textarea
              id="comment"
              placeholder="Необов'язково..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Скасувати
            </Button>
            <Button type="submit">{sale ? "Зберегти" : "Додати"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
