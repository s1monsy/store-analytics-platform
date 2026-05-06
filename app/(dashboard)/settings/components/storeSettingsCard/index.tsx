import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/shared/components/ui/select"
import { Store } from "lucide-react"
import { TIMEZONES } from "@/shared/constants"
import { useExchangeRates } from "@/shared/hooks/useExchangeRates"
import type { StoreProfile } from "@/shared/types"

interface StoreSettingsCardProps {
  store: StoreProfile
  hasChanges: boolean
  onStoreChange: (store: StoreProfile) => void
  onSave: () => void
}

export function StoreSettingsCard({ store, hasChanges, onStoreChange, onSave }: StoreSettingsCardProps) {
  const { currencies, loading: ratesLoading } = useExchangeRates()
  const selectedCurrency = currencies.find((c) => c.value === store.currency)
  const selectedTimezone = TIMEZONES.find((t) => t.value === store.timezone)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Store className="h-4 w-4" />
          Магазин
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="store-name">Назва магазину</Label>
          <Input
            id="store-name"
            value={store.name}
            onChange={(e) => onStoreChange({ ...store, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="store-address">Адреса</Label>
          <Input
            id="store-address"
            value={store.address}
            onChange={(e) => onStoreChange({ ...store, address: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Валюта</Label>
            <Select
              value={store.currency}
              onValueChange={(val) => onStoreChange({ ...store, currency: val })}
            >
              <SelectTrigger>
                <span className={!selectedCurrency ? "text-muted-foreground" : ""}>
                  {selectedCurrency ? selectedCurrency.value : "Оберіть валюту"}
                </span>
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.value} — {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCurrency && (
              <p className="text-xs text-muted-foreground">
                {selectedCurrency.value === "UAH"
                  ? "Базова валюта"
                  : ratesLoading
                  ? "Завантаження курсу..."
                  : `1 ${selectedCurrency.value} ≈ ${selectedCurrency.uahRate.toFixed(2)} UAH`}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Часовий пояс</Label>
            <Select
              value={store.timezone}
              onValueChange={(val) => onStoreChange({ ...store, timezone: val })}
            >
              <SelectTrigger>
                <span className={!selectedTimezone ? "text-muted-foreground" : ""}>
                  {selectedTimezone ? selectedTimezone.short : "Оберіть пояс"}
                </span>
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={onSave} className="w-full" disabled={!hasChanges}>Зберегти</Button>
      </CardContent>
    </Card>
  )
}
