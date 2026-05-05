import { StatsCard } from "@/components/dashboard/statsCard"
import { Banknote, Receipt, TrendingUp, RotateCcw } from "lucide-react"

interface SummaryCardsProps {
  revenue: number
  netRevenue: number
  receipts: number
  avgCheck: number
  returns: number
}

export function SummaryCards({ revenue, netRevenue, receipts, avgCheck, returns }: SummaryCardsProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Виручка"
        value={`${revenue.toLocaleString("uk-UA")} грн`}
        subtitle={`Нетто: ${netRevenue.toLocaleString("uk-UA")} грн`}
        icon={Banknote}
        trend="up"
      />
      <StatsCard
        title="Кількість чеків"
        value={receipts.toLocaleString("uk-UA")}
        icon={Receipt}
        trend="neutral"
      />
      <StatsCard
        title="Середній чек"
        value={`${avgCheck.toLocaleString("uk-UA")} грн`}
        icon={TrendingUp}
        trend="up"
      />
      <StatsCard
        title="Повернення"
        value={`${returns.toLocaleString("uk-UA")} грн`}
        icon={RotateCcw}
        trend="down"
      />
    </div>
  )
}
