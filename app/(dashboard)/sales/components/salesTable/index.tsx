import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination"
import { Pencil, Trash2, PackageOpen } from "lucide-react"
import { format, parseISO } from "date-fns"
import { uk } from "date-fns/locale"
import type { SaleEntry } from "@/shared/lib/store"

interface SalesTableProps {
  paginated: SaleEntry[]
  filtered: SaleEntry[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onEdit: (sale: SaleEntry) => void
  onDelete: (id: string) => void
  onAddClick: () => void
}

export function SalesTable({
  paginated,
  filtered,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onAddClick,
}: SalesTableProps) {
  return (
    <>
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <PackageOpen className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Немає записів</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={onAddClick}>
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
                {paginated.map((sale) => (
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
                    <TableCell className="text-right text-sm">{sale.receiptsCount}</TableCell>
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
                          onClick={() => onEdit(sale)}
                          aria-label="Редагувати"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => onDelete(sale.id)}
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

      {totalPages > 1 && (
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <span className="shrink-0 w-1/3">
            {filtered.length} записів, сторінка {page} з {totalPages}
          </span>
          <Pagination className="mx-0 w-1/3">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, page - 1))}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("ellipsis")
                  acc.push(p)
                  return acc
                }, [])
                .map((p, idx) =>
                  p === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === page}
                        onClick={() => onPageChange(p)}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                  aria-disabled={page === totalPages}
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  )
}
