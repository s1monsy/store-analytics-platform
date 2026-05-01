"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Store } from "lucide-react"

const CURRENCIES = [
  { value: "UAH", label: "Гривня",    uahRate: 1 },
  { value: "USD", label: "Долар США", uahRate: 41.5 },
  { value: "EUR", label: "Євро",      uahRate: 45.2 },
]

const TIMEZONES = [
  { value: "Europe/Kyiv",         short: "UTC+3 (EEST)",   label: "UTC+3 — Europe/Kyiv (EEST)" },
  { value: "Europe/London",       short: "UTC+1 (BST)",    label: "UTC+1 — Europe/London (BST)" },
  { value: "Europe/Paris",        short: "UTC+2 (CEST)",   label: "UTC+2 — Europe/Paris (CEST)" },
  { value: "Europe/Moscow",       short: "UTC+3 (MSK)",    label: "UTC+3 — Europe/Moscow (MSK)" },
  { value: "Asia/Dubai",          short: "UTC+4 (GST)",    label: "UTC+4 — Asia/Dubai (GST)" },
  { value: "Asia/Kolkata",        short: "UTC+5:30 (IST)", label: "UTC+5:30 — Asia/Kolkata (IST)" },
  { value: "Asia/Shanghai",       short: "UTC+8 (CST)",    label: "UTC+8 — Asia/Shanghai (CST)" },
  { value: "Asia/Tokyo",          short: "UTC+9 (JST)",    label: "UTC+9 — Asia/Tokyo (JST)" },
  { value: "Australia/Sydney",    short: "UTC+10 (AEST)",  label: "UTC+10 — Australia/Sydney (AEST)" },
  { value: "America/New_York",    short: "UTC-4 (EDT)",    label: "UTC-4 — America/New_York (EDT)" },
  { value: "America/Chicago",     short: "UTC-5 (CDT)",    label: "UTC-5 — America/Chicago (CDT)" },
  { value: "America/Denver",      short: "UTC-6 (MDT)",    label: "UTC-6 — America/Denver (MDT)" },
  { value: "America/Los_Angeles", short: "UTC-7 (PDT)",    label: "UTC-7 — America/Los_Angeles (PDT)" },
  { value: "America/Sao_Paulo",   short: "UTC-3 (BRT)",    label: "UTC-3 — America/Sao_Paulo (BRT)" },
  { value: "UTC",                 short: "UTC+0 (UTC)",    label: "UTC+0 — Coordinated Universal Time" },
]

export default function SettingsPage() {
  const { storeProfile, setStoreProfile } = useStore()
  const [store, setStore] = useState(storeProfile)

  const handleSave = () => {
    setStoreProfile(store)
    toast.success("Налаштування збережено")
  }

  const hasChanges = JSON.stringify(store) !== JSON.stringify(storeProfile)

  const selectedCurrency = CURRENCIES.find((c) => c.value === store.currency)
  const selectedTimezone = TIMEZONES.find((t) => t.value === store.timezone)

  return (
    <div className="flex flex-col">
      <TopBar title="Налаштування" />
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="mx-auto max-w-lg space-y-6">
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
                  onChange={(e) => setStore({ ...store, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="store-address">Адреса</Label>
                <Input
                  id="store-address"
                  value={store.address}
                  onChange={(e) => setStore({ ...store, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Валюта</Label>
                  <Select
                    value={store.currency}
                    onValueChange={(val) => setStore({ ...store, currency: val })}
                  >
                    <SelectTrigger>
                      <span className={!selectedCurrency ? "text-muted-foreground" : ""}>
                        {selectedCurrency ? selectedCurrency.value : "Оберіть валюту"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
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
                        : `1 ${selectedCurrency.value} ≈ ${selectedCurrency.uahRate.toFixed(2)} UAH`}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Часовий пояс</Label>
                  <Select
                    value={store.timezone}
                    onValueChange={(val) => setStore({ ...store, timezone: val })}
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
              <Button onClick={handleSave} className="w-full" disabled={!hasChanges}>Зберегти</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
