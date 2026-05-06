import { format, subDays } from "date-fns";
import { uk } from "date-fns/locale";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { CalendarIcon, Plus, PackagePlus } from "lucide-react";
import { cn } from "@/shared/utils/utils";

const PRESETS = [
  { label: "7 днів", days: 7 },
  { label: "14 днів", days: 14 },
  { label: "30 днів", days: 30 },
];

interface DateRange {
  from: Date;
  to: Date;
}

interface DashboardToolbarProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onAddSale: () => void;
  onAddInventory: () => void;
}

export function DashboardToolbar({
  dateRange,
  onDateRangeChange,
  onAddSale,
  onAddInventory,
}: DashboardToolbarProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !dateRange.from && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(dateRange.from, "dd MMM", { locale: uk })} —{" "}
              {format(dateRange.to, "dd MMM yyyy", { locale: uk })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  onDateRangeChange({ from: range.from, to: range.to });
                } else if (range?.from) {
                  onDateRangeChange({ from: range.from, to: range.from });
                }
              }}
              numberOfMonths={2}
              locale={uk}
            />
          </PopoverContent>
        </Popover>
        <div className="flex gap-1">
          {PRESETS.map((preset) => (
            <Button
              key={preset.days}
              variant="ghost"
              size="sm"
              onClick={() =>
                onDateRangeChange({ from: subDays(new Date(), preset.days), to: new Date() })
              }
              className="text-xs"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onAddInventory}>
          <PackagePlus className="mr-2 h-4 w-4" />
          Прихід товару
        </Button>
        <Button size="sm" onClick={onAddSale}>
          <Plus className="mr-2 h-4 w-4" />
          Додати продаж
        </Button>
      </div>
    </div>
  );
}
