"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Store } from "lucide-react"

export default function SettingsPage() {
  const { storeProfile, setStoreProfile } = useStore()
  const [store, setStore] = useState(storeProfile)

  const handleSave = () => {
    setStoreProfile(store)
    toast.success("Налаштування збережено")
  }

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
                  <Label htmlFor="store-currency">Валюта</Label>
                  <Input
                    id="store-currency"
                    value={store.currency}
                    onChange={(e) => setStore({ ...store, currency: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="store-timezone">Часовий пояс</Label>
                  <Input
                    id="store-timezone"
                    value={store.timezone}
                    onChange={(e) => setStore({ ...store, timezone: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">Зберегти</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
