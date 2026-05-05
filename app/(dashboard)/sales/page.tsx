"use client"

import { useState, useMemo } from "react"
import { TopBar } from "@/components/layout/topBar"
import { useStore } from "@/lib/store-context"
import { SaleFormModal } from "@/components/modals/saleFormModal"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alertDialog"
import { Badge } from "@/components/ui/badge"
import { PageSpinner } from "@/components/ui/spinner"
import { Plus, Pencil, Trash2, Search, PackageOpen, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { format, parseISO } from "date-fns"
import { uk } from "date-fns/locale"
import type { SaleEntry } from "@/lib/store"

export default function SalesPage() {
  const { sales, salesLoading, salesError, refetchSales, addSale, updateSale, deleteSale } = useStore()

  const [formOpen, setFormOpen] = useState(false)
  const [editingSale, setEditingSale] = useState<SaleEntry | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [shiftFilter, setShiftFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")

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
        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Пошук..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Input
            type="date"
            className="w-36"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="Від"
          />
          <Input
            type="date"
            className="w-36"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="До"
          />
          <Select value={shiftFilter} onValueChange={setShiftFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Зміна" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі зміни</SelectItem>
              <SelectItem value="morning">Ранкова</SelectItem>
              <SelectItem value="evening">Вечірня</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Оплата" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі типи</SelectItem>
              <SelectItem value="cash">Готівка</SelectItem>
              <SelectItem value="card">Картка</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              setEditingSale(null)
              setFormOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Додати запис
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <PackageOpen className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Немає записів</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    setEditingSale(null)
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
                    <TableHead className="text-xs">Дата</TableHead>
                    <TableHead className="text-xs">Зміна</TableHead>
                    <TableHead className="text-xs">Оплата</TableHead>
                    <TableHead className="text-right text-xs">Сума</TableHead>
                    <TableHead className="text-right text-xs">Чеки</TableHead>
                    <TableHead className="text-right text-xs">Повернення</TableHead>
                    <TableHead className="text-right text-xs">Сер. чек</TableHead>
                    <TableHead className="hidden text-xs md:table-cell">Коментар</TableHead>
                    <TableHead className="w-20 text-xs">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="text-sm">
                        {format(parseISO(sale.date), "dd.MM.yy", { locale: uk })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs font-normal">
                          {sale.shift === "morning" ? "Ранок" : "Вечір"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-normal">
                          {sale.paymentType === "cash" ? "Готівка" : "Картка"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {sale.totalAmount.toLocaleString("uk-UA")} грн
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {sale.receiptsCount}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {sale.returnsAmount.toLocaleString("uk-UA")} грн
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {sale.receiptsCount > 0
                          ? (sale.totalAmount / sale.receiptsCount)
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                          : "—"}{" "}
                        грн
                      </TableCell>
                      <TableCell className="hidden max-w-32 truncate text-sm text-muted-foreground md:table-cell">
                        {sale.comment || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleEdit(sale)}
                            aria-label="Редагувати"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(sale.id)}
                            aria-label="Видалити"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
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

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Видалити запис?</AlertDialogTitle>
            <AlertDialogDescription>
              Цю дію неможливо скасувати. Запис буде видалено назавжди.
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
