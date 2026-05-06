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
