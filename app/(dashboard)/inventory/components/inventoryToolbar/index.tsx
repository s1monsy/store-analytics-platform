import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Plus, Search } from "lucide-react"

interface InventoryToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  onAddClick: () => void
}

export function InventoryToolbar({ search, onSearchChange, onAddClick }: InventoryToolbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-48">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Пошук товарів..."
          className="pl-9"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button onClick={onAddClick}>
        <Plus className="mr-2 h-4 w-4" />
        Додати товар
      </Button>
    </div>
  )
}
