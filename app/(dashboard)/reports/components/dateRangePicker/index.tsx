"use client"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Card, CardContent } from "@/shared/components/ui/card"
import { FileDown, Printer } from "lucide-react"

interface DateRangePickerProps {
  dateFrom: string
  dateTo: string
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  onExportCSV: () => void
}

export function DateRangePicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onExportCSV,
}: DateRangePickerProps) {
  return (
    <>
      <Card className="mb-6 print:hidden">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Дата початку</Label>
              <Input
                type="date"
                className="w-40"
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Дата кінця</Label>
              <Input
                type="date"
                className="w-40"
                value={dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={onExportCSV}>
              <FileDown className="mr-2 h-4 w-4" />
              Експорт CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Друк / PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="hidden print:block mb-6">
        <h1 className="text-xl font-bold">Звіт за період</h1>
        <p className="text-sm text-gray-500">{dateFrom} — {dateTo}</p>
      </div>
    </>
  )
}
