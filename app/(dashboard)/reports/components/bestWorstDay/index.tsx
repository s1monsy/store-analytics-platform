import { Card, CardContent } from "@/shared/components/ui/card"
import { ArrowUp, ArrowDown } from "lucide-react"
import { format, parseISO } from "date-fns"
import { uk } from "date-fns/locale"
import { getDailyAggregates } from "@/shared/lib/store"

type DailyAggregate = ReturnType<typeof getDailyAggregates>[number]

interface BestWorstDayProps {
  bestDay: DailyAggregate
  worstDay: DailyAggregate
}

export function BestWorstDay({ bestDay, worstDay }: BestWorstDayProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
            <ArrowUp className="h-5 w-5 text-[hsl(var(--success))]" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Найкращий день
            </p>
            <p className="text-lg font-bold text-card-foreground">
              {format(parseISO(bestDay.date), "dd MMMM yyyy", { locale: uk })}
            </p>
            <p className="text-sm text-muted-foreground">
              {bestDay.revenue.toLocaleString("uk-UA")} грн &middot; {bestDay.receipts} чеків
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
            <ArrowDown className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Найгірший день
            </p>
            <p className="text-lg font-bold text-card-foreground">
              {format(parseISO(worstDay.date), "dd MMMM yyyy", { locale: uk })}
            </p>
            <p className="text-sm text-muted-foreground">
              {worstDay.revenue.toLocaleString("uk-UA")} грн &middot; {worstDay.receipts} чеків
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
