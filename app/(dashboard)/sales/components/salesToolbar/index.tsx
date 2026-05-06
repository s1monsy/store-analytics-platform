import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Plus, Search } from "lucide-react"

interface SalesToolbarProps {
  search: string
  dateFrom: string
  dateTo: string
  shiftFilter: string
  paymentFilter: string
  onSearchChange: (value: string) => void
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  onShiftFilterChange: (value: string) => void
  onPaymentFilterChange: (value: string) => void
  onAddClick: () => void
}

export function SalesToolbar({
  search,
  dateFrom,
  dateTo,
  shiftFilter,
  paymentFilter,
  onSearchChange,
  onDateFromChange,
  onDateToChange,
  onShiftFilterChange,
  onPaymentFilterChange,
  onAddClick,
}: SalesToolbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-48">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Пошук..."
          className="pl-9"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Input
        type="date"
        className="w-36"
        value={dateFrom}
        onChange={(e) => onDateFromChange(e.target.value)}
      />
      <Input
        type="date"
        className="w-36"
        value={dateTo}
        onChange={(e) => onDateToChange(e.target.value)}
      />
      <Select value={shiftFilter} onValueChange={onShiftFilterChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Зміна" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Всі зміни</SelectItem>
          <SelectItem value="morning">Ранкова</SelectItem>
          <SelectItem value="evening">Вечірня</SelectItem>
        </SelectContent>
      </Select>
      <Select value={paymentFilter} onValueChange={onPaymentFilterChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Оплата" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Всі типи</SelectItem>
          <SelectItem value="cash">Готівка</SelectItem>
          <SelectItem value="card">Картка</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={onAddClick}>
        <Plus className="mr-2 h-4 w-4" />
        Додати запис
      </Button>
    </div>
  )
}
