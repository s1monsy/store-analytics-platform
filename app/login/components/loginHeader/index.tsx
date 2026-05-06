import { Store } from "lucide-react"

export function LoginHeader() {
  return (
    <div className="mb-8 flex flex-col items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
        <Store className="h-6 w-6 text-primary-foreground" />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold text-foreground">TradePoint Data</h1>
        <p className="text-sm text-muted-foreground">Увійдіть у свій обліковий запис</p>
      </div>
    </div>
  )
}
