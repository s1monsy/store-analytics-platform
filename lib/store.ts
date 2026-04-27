// Mock data store for TradePoint Data
import { format, subDays, startOfDay } from "date-fns"

export interface SaleEntry {
  id: string
  date: string
  shift: "morning" | "evening"
  paymentType: "cash" | "card"
  totalAmount: number
  receiptsCount: number
  returnsAmount: number
  comment: string
}

export interface InventoryItem {
  id: string
  name: string
  sku: string
  qty: number
  minQty: number
  updatedAt: string
}

export interface StoreProfile {
  name: string
  address: string
  currency: string
  timezone: string
}

export interface UserProfile {
  name: string
  email: string
  role: "owner" | "manager" | "cashier"
}

const today = startOfDay(new Date())

function generateId() {
  return Math.random().toString(36).substring(2, 11)
}

function randomAmount(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

// Generate 30 days of sample sales data
function generateSalesData(): SaleEntry[] {
  const entries: SaleEntry[] = []
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(today, i), "yyyy-MM-dd")
    // Morning shift
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
    // Evening shift
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
    { name: "Хліб білий", sku: "BRD-001", qty: 45, minQty: 20 },
    { name: "Молоко 2.5%", sku: "MLK-001", qty: 30, minQty: 15 },
    { name: "Масло вершкове", sku: "BTR-001", qty: 8, minQty: 10 },
    { name: "Цукор 1кг", sku: "SGR-001", qty: 60, minQty: 25 },
    { name: "Сир кисломолочний", sku: "CHZ-001", qty: 5, minQty: 10 },
    { name: "Кава мелена", sku: "COF-001", qty: 22, minQty: 10 },
    { name: "Чай чорний", sku: "TEA-001", qty: 35, minQty: 15 },
    { name: "Макарони", sku: "PST-001", qty: 50, minQty: 20 },
    { name: "Олія соняшникова", sku: "OIL-001", qty: 18, minQty: 12 },
    { name: "Борошно пшеничне", sku: "FLR-001", qty: 3, minQty: 15 },
    { name: "Сметана 20%", sku: "SMT-001", qty: 12, minQty: 8 },
    { name: "Яйця (десяток)", sku: "EGG-001", qty: 40, minQty: 20 },
  ]

  return products.map((p) => ({
    id: generateId(),
    ...p,
    updatedAt: format(subDays(today, Math.floor(Math.random() * 5)), "yyyy-MM-dd HH:mm"),
  }))
}

// Singleton store that persists across client navigation
let salesData: SaleEntry[] | null = null
let inventoryData: InventoryItem[] | null = null

export function getSalesData(): SaleEntry[] {
  if (!salesData) {
    salesData = generateSalesData()
  }
  return salesData
}

export function setSalesData(data: SaleEntry[]) {
  salesData = data
}

export function getInventoryData(): InventoryItem[] {
  if (!inventoryData) {
    inventoryData = generateInventoryData()
  }
  return inventoryData
}

export function setInventoryData(data: InventoryItem[]) {
  inventoryData = data
}

export const defaultStoreProfile: StoreProfile = {
  name: "Магазин \"Продукти\"",
  address: "вул. Хрещатик 10, Київ",
  currency: "UAH",
  timezone: "Europe/Kyiv",
}

export const defaultUserProfile: UserProfile = {
  name: "Олена Коваленко",
  email: "olena@tradepoint.ua",
  role: "owner",
}

// Derive daily aggregates from sales entries
export function getDailyAggregates(
  sales: SaleEntry[],
  dateFrom?: string,
  dateTo?: string
) {
  const filtered = sales.filter((s) => {
    if (dateFrom && s.date < dateFrom) return false
    if (dateTo && s.date > dateTo) return false
    return true
  })

  const byDay: Record<
    string,
    { revenue: number; receipts: number; returns: number }
  > = {}

  filtered.forEach((s) => {
    if (!byDay[s.date]) {
      byDay[s.date] = { revenue: 0, receipts: 0, returns: 0 }
    }
    byDay[s.date].revenue += s.totalAmount
    byDay[s.date].receipts += s.receiptsCount
    byDay[s.date].returns += s.returnsAmount
  })

  return Object.entries(byDay)
    .map(([date, data]) => ({
      date,
      revenue: Math.round(data.revenue * 100) / 100,
      receipts: data.receipts,
      returns: Math.round(data.returns * 100) / 100,
      avgCheck:
        data.receipts > 0
          ? Math.round((data.revenue / data.receipts) * 100) / 100
          : 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function getTotals(sales: SaleEntry[], dateFrom?: string, dateTo?: string) {
  const filtered = sales.filter((s) => {
    if (dateFrom && s.date < dateFrom) return false
    if (dateTo && s.date > dateTo) return false
    return true
  })

  const totalRevenue = filtered.reduce((sum, s) => sum + s.totalAmount, 0)
  const totalReceipts = filtered.reduce((sum, s) => sum + s.receiptsCount, 0)
  const totalReturns = filtered.reduce((sum, s) => sum + s.returnsAmount, 0)
  const avgCheck = totalReceipts > 0 ? totalRevenue / totalReceipts : 0

  return {
    revenue: Math.round(totalRevenue * 100) / 100,
    receipts: totalReceipts,
    returns: Math.round(totalReturns * 100) / 100,
    avgCheck: Math.round(avgCheck * 100) / 100,
    netRevenue: Math.round((totalRevenue - totalReturns) * 100) / 100,
  }
}
