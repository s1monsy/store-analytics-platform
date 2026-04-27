"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import {
  type SaleEntry,
  type InventoryItem,
  type StoreProfile,
  type UserProfile,
  getSalesData,
  setSalesData,
  getInventoryData,
  setInventoryData,
  defaultStoreProfile,
  defaultUserProfile,
} from "./store"

interface StoreContextType {
  sales: SaleEntry[]
  addSale: (sale: Omit<SaleEntry, "id">) => void
  updateSale: (id: string, sale: Partial<SaleEntry>) => void
  deleteSale: (id: string) => void
  inventory: InventoryItem[]
  addInventoryItem: (item: Omit<InventoryItem, "id" | "updatedAt">) => void
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void
  deleteInventoryItem: (id: string) => void
  adjustQty: (id: string, delta: number) => void
  storeProfile: StoreProfile
  setStoreProfile: (profile: StoreProfile) => void
  userProfile: UserProfile
  setUserProfile: (profile: UserProfile) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [sales, _setSales] = useState<SaleEntry[]>(() => getSalesData())
  const [inventory, _setInventory] = useState<InventoryItem[]>(() => getInventoryData())
  const [storeProfile, setStoreProfile] = useState<StoreProfile>(defaultStoreProfile)
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile)

  const updateSales = useCallback((newSales: SaleEntry[]) => {
    _setSales(newSales)
    setSalesData(newSales)
  }, [])

  const updateInventory = useCallback((newInv: InventoryItem[]) => {
    _setInventory(newInv)
    setInventoryData(newInv)
  }, [])

  const addSale = useCallback(
    (sale: Omit<SaleEntry, "id">) => {
      const newSale: SaleEntry = { ...sale, id: Math.random().toString(36).substring(2, 11) }
      updateSales([newSale, ...sales])
    },
    [sales, updateSales]
  )

  const updateSale = useCallback(
    (id: string, updates: Partial<SaleEntry>) => {
      updateSales(sales.map((s) => (s.id === id ? { ...s, ...updates } : s)))
    },
    [sales, updateSales]
  )

  const deleteSale = useCallback(
    (id: string) => {
      updateSales(sales.filter((s) => s.id !== id))
    },
    [sales, updateSales]
  )

  const addInventoryItem = useCallback(
    (item: Omit<InventoryItem, "id" | "updatedAt">) => {
      const newItem: InventoryItem = {
        ...item,
        id: Math.random().toString(36).substring(2, 11),
        updatedAt: new Date().toISOString(),
      }
      updateInventory([newItem, ...inventory])
    },
    [inventory, updateInventory]
  )

  const updateInventoryItem = useCallback(
    (id: string, updates: Partial<InventoryItem>) => {
      updateInventory(
        inventory.map((i) =>
          i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i
        )
      )
    },
    [inventory, updateInventory]
  )

  const deleteInventoryItem = useCallback(
    (id: string) => {
      updateInventory(inventory.filter((i) => i.id !== id))
    },
    [inventory, updateInventory]
  )

  const adjustQty = useCallback(
    (id: string, delta: number) => {
      updateInventory(
        inventory.map((i) =>
          i.id === id
            ? { ...i, qty: Math.max(0, i.qty + delta), updatedAt: new Date().toISOString() }
            : i
        )
      )
    },
    [inventory, updateInventory]
  )

  return (
    <StoreContext.Provider
      value={{
        sales,
        addSale,
        updateSale,
        deleteSale,
        inventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        adjustQty,
        storeProfile,
        setStoreProfile,
        userProfile,
        setUserProfile,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
