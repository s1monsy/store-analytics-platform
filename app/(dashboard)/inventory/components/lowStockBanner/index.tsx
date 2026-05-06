import { AlertTriangle } from "lucide-react"

interface LowStockBannerProps {
  count: number
}

export function LowStockBanner({ count }: LowStockBannerProps) {
  if (count === 0) return null

  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg border border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/10 px-4 py-3">
      <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))]" />
      <p className="text-sm text-foreground">
        <strong>{count}</strong> {count === 1 ? "товар" : "товарів"} нижче мінімального порогу
      </p>
    </div>
  )
}
