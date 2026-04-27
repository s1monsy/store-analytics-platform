"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { SaleEntry } from "@/lib/store"
import { format, parseISO } from "date-fns"
import { uk } from "date-fns/locale"

export function RecentActivityTable({ sales }: { sales: SaleEntry[] }) {
  const recent = sales
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-card-foreground">
          Останні записи
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Дата</TableHead>
              <TableHead className="text-xs">Зміна</TableHead>
              <TableHead className="text-xs">Оплата</TableHead>
              <TableHead className="text-right text-xs">Сума</TableHead>
              <TableHead className="text-right text-xs">Чеки</TableHead>
              <TableHead className="hidden text-xs md:table-cell">Коментар</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map((sale) => (
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
                  <Badge
                    variant="outline"
                    className="text-xs font-normal"
                  >
                    {sale.paymentType === "cash" ? "Готівка" : "Картка"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm font-medium">
                  {sale.totalAmount.toLocaleString("uk-UA")} грн
                </TableCell>
                <TableCell className="text-right text-sm">
                  {sale.receiptsCount}
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  {sale.comment || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
