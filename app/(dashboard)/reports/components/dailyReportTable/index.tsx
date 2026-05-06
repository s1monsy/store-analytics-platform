import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { CalendarDays } from "lucide-react"
import { format, parseISO } from "date-fns"
import { uk } from "date-fns/locale"
import { getDailyAggregates } from "@/shared/lib/store"

type DailyAggregate = ReturnType<typeof getDailyAggregates>[number]

interface DailyReportTableProps {
  data: DailyAggregate[]
}

export function DailyReportTable({ data }: DailyReportTableProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-card-foreground">
          <CalendarDays className="h-4 w-4" />
          Звіт по днях
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-muted-foreground">Немає даних за вибраний період</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Дата</TableHead>
                <TableHead className="text-right text-xs">Виручка</TableHead>
                <TableHead className="text-right text-xs">Чеки</TableHead>
                <TableHead className="text-right text-xs">Сер. чек</TableHead>
                <TableHead className="text-right text-xs">Повернення</TableHead>
                <TableHead className="text-right text-xs">Нетто</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((day) => (
                <TableRow key={day.date}>
                  <TableCell className="text-sm font-medium">
                    {format(parseISO(day.date), "dd.MM.yy (EEEEEE)", { locale: uk })}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {day.revenue.toLocaleString("uk-UA")} грн
                  </TableCell>
                  <TableCell className="text-right text-sm">{day.receipts}</TableCell>
                  <TableCell className="text-right text-sm">
                    {day.avgCheck.toLocaleString("uk-UA")} грн
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {day.returns.toLocaleString("uk-UA")} грн
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {(day.revenue - day.returns).toLocaleString("uk-UA")} грн
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
