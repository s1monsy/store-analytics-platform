"use client"

import { useState } from "react"
import { TopBar } from "@/shared/components/layout/topBar"
import { useStore } from "@/shared/lib/store-context"
import { toast } from "sonner"
import { StoreSettingsCard } from "./components/storeSettingsCard"

export default function SettingsPage() {
  const { storeProfile, setStoreProfile } = useStore()
  const [store, setStore] = useState(storeProfile)

  const handleSave = () => {
    setStoreProfile(store)
    toast.success("Налаштування збережено")
  }

  const hasChanges = JSON.stringify(store) !== JSON.stringify(storeProfile)

  return (
    <div className="flex flex-col">
      <TopBar title="Налаштування" />
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="mx-auto max-w-lg space-y-6">
          <StoreSettingsCard
            store={store}
            hasChanges={hasChanges}
            onStoreChange={setStore}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  )
}
