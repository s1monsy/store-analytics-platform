import { format, subDays, startOfDay } from "date-fns"
import type { SaleEntry, InventoryItem } from "@/shared/types"
import { DEFAULT_STORE_PROFILE, DEFAULT_USER_PROFILE } from "@/shared/constants"

export type { SaleEntry, InventoryItem }
export type { StoreProfile, UserProfile } from "@/shared/types"
export { getDailyAggregates, getTotals } from "@/shared/utils/salesUtils"
export { DEFAULT_STORE_PROFILE as defaultStoreProfile, DEFAULT_USER_PROFILE as defaultUserProfile }

const today = startOfDay(new Date())

function generateId() {
  return Math.random().toString(36).substring(2, 11)
}

function randomAmount(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

function generateSalesData(): SaleEntry[] {
  const entries: SaleEntry[] = []
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(today, i), "yyyy-MM-dd")
    entries.push({
      id: generateId(),
      date,
      shift: "morning",
      paymentType: Math.random() > 0.4 ? "cash" : "card",
      totalAmount: randomAmount(8000, 25000),
      receiptsCount: Math.floor(Math.random() * 60) + 20,
      returnsAmount: randomAmount(0, 800),
      comment: "",
    })
    entries.push({
      id: generateId(),
      date,
      shift: "evening",
      paymentType: Math.random() > 0.5 ? "card" : "cash",
      totalAmount: randomAmount(10000, 35000),
      receiptsCount: Math.floor(Math.random() * 80) + 30,
      returnsAmount: randomAmount(0, 1200),
      comment: "",
    })
  }
  return entries
}

function generateInventoryData(): InventoryItem[] {
  const products = [
    { name: "Хліб білий",          sku: "BRD-001", qty: 45, minQty: 20 },
    { name: "Молоко 2.5%",         sku: "MLK-001", qty: 30, minQty: 15 },
    { name: "Масло вершкове",      sku: "BTR-001", qty: 8,  minQty: 10 },
    { name: "Цукор 1кг",           sku: "SGR-001", qty: 60, minQty: 25 },
    { name: "Сир кисломолочний",   sku: "CHZ-001", qty: 5,  minQty: 10 },
    { name: "Кава мелена",         sku: "COF-001", qty: 22, minQty: 10 },
    { name: "Чай чорний",          sku: "TEA-001", qty: 35, minQty: 15 },
    { name: "Макарони",            sku: "PST-001", qty: 50, minQty: 20 },
    { name: "Олія соняшникова",    sku: "OIL-001", qty: 18, minQty: 12 },
    { name: "Борошно пшеничне",    sku: "FLR-001", qty: 3,  minQty: 15 },
    { name: "Сметана 20%",         sku: "SMT-001", qty: 12, minQty: 8  },
    { name: "Яйця (десяток)",      sku: "EGG-001", qty: 40, minQty: 20 },
  ]

  return products.map((p) => ({
    id: generateId(),
    ...p,
    updatedAt: format(subDays(today, Math.floor(Math.random() * 5)), "yyyy-MM-dd HH:mm"),
  }))
}

let salesData: SaleEntry[] | null = null
let inventoryData: InventoryItem[] | null = null

export function getSalesData(): SaleEntry[] {
  if (!salesData) salesData = generateSalesData()
  return salesData
}

export function setSalesData(data: SaleEntry[]) {
  salesData = data
}

export function getInventoryData(): InventoryItem[] {
  if (!inventoryData) inventoryData = generateInventoryData()
  return inventoryData
}

export function setInventoryData(data: InventoryItem[]) {
  inventoryData = data
}
