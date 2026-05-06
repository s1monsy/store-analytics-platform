"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import type { SaleEntry, InventoryItem, StoreProfile, UserProfile } from "./store";
import { defaultStoreProfile, defaultUserProfile } from "./store";
import {
  fetchSales,
  insertSale,
  updateSale,
  deleteSale,
  fetchInventory,
  insertInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "./db";

interface StoreContextType {
  sales: SaleEntry[];
  salesLoading: boolean;
  salesError: string | null;
  addSale: (sale: Omit<SaleEntry, "id">) => Promise<void>;
  updateSale: (id: string, sale: Partial<SaleEntry>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  inventory: InventoryItem[];
  inventoryLoading: boolean;
  inventoryError: string | null;
  addInventoryItem: (item: Omit<InventoryItem, "id" | "updatedAt">) => Promise<void>;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  adjustQty: (id: string, delta: number) => Promise<void>;
  storeProfile: StoreProfile;
  setStoreProfile: (profile: StoreProfile) => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  refetchSales: () => void;
  refetchInventory: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [sales, setSales] = useState<SaleEntry[]>([]);
  const [salesLoading, setSalesLoading] = useState(true);
  const [salesError, setSalesError] = useState<string | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [storeProfile, setStoreProfile] = useState<StoreProfile>(defaultStoreProfile);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);

  const refetchSales = useCallback(() => {
    setSalesLoading(true);
    setSalesError(null);
    fetchSales()
      .then(setSales)
      .catch(() => setSalesError("Не вдалося завантажити продажі. Перевірте з'єднання."))
      .finally(() => setSalesLoading(false));
  }, []);

  const refetchInventory = useCallback(() => {
    setInventoryLoading(true);
    setInventoryError(null);
    fetchInventory()
      .then(setInventory)
      .catch(() => setInventoryError("Не вдалося завантажити склад. Перевірте з'єднання."))
      .finally(() => setInventoryLoading(false));
  }, []);

  useEffect(() => { refetchSales(); }, [refetchSales]);
  useEffect(() => { refetchInventory(); }, [refetchInventory]);

  const addSale = useCallback(async (sale: Omit<SaleEntry, "id">) => {
    try {
      const newSale = await insertSale(sale);
      setSales((prev) => [newSale, ...prev]);
    } catch {
      toast.error("Не вдалося додати запис");
    }
  }, []);

  const updateSaleItem = useCallback(async (id: string, updates: Partial<SaleEntry>) => {
    try {
      await updateSale(id, updates);
      setSales((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    } catch {
      toast.error("Не вдалося оновити запис");
    }
  }, []);

  const deleteSaleItem = useCallback(async (id: string) => {
    try {
      await deleteSale(id);
      setSales((prev) => prev.filter((s) => s.id !== id));
    } catch {
      toast.error("Не вдалося видалити запис");
    }
  }, []);

  const addInventoryItem = useCallback(async (item: Omit<InventoryItem, "id" | "updatedAt">) => {
    try {
      const newItem = await insertInventoryItem(item);
      setInventory((prev) => [newItem, ...prev]);
    } catch {
      toast.error("Не вдалося додати товар");
    }
  }, []);

  const updateInventoryItemFn = useCallback(async (id: string, updates: Partial<InventoryItem>) => {
    try {
      await updateInventoryItem(id, updates);
      setInventory((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i,
        ),
      );
    } catch {
      toast.error("Не вдалося оновити товар");
    }
  }, []);

  const deleteInventoryItemFn = useCallback(async (id: string) => {
    try {
      await deleteInventoryItem(id);
      setInventory((prev) => prev.filter((i) => i.id !== id));
    } catch {
      toast.error("Не вдалося видалити товар");
    }
  }, []);

  const adjustQty = useCallback(
    async (id: string, delta: number) => {
      const item = inventory.find((i) => i.id === id);
      if (!item) return;
      const newQty = Math.max(0, item.qty + delta);
      await updateInventoryItem(id, { qty: newQty });
      setInventory((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, qty: newQty, updatedAt: new Date().toISOString() } : i,
        ),
      );
    },
    [inventory],
  );

  return (
    <StoreContext.Provider
      value={{
        sales,
        salesLoading,
        salesError,
        addSale,
        updateSale: updateSaleItem,
        deleteSale: deleteSaleItem,
        inventory,
        inventoryLoading,
        inventoryError,
        addInventoryItem,
        updateInventoryItem: updateInventoryItemFn,
        deleteInventoryItem: deleteInventoryItemFn,
        adjustQty,
        storeProfile,
        setStoreProfile,
        userProfile,
        setUserProfile,
        refetchSales,
        refetchInventory,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
