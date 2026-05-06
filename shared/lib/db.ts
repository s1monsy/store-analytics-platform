import { supabase } from "./supabase"
import type { SaleEntry, InventoryItem } from "./store"

export async function fetchSales(): Promise<SaleEntry[]> {
  const { data, error } = await supabase
    .from("sales")
    .select("*")
    .order("date", { ascending: false })

  if (error) throw error

  return data.map((row) => ({
    id: row.id,
    date: row.date,
    shift: row.shift,
    paymentType: row.payment_type,
    totalAmount: row.total_amount,
    receiptsCount: row.receipts_count,
    returnsAmount: row.returns_amount,
    comment: row.comment ?? "",
  }))
}

export async function insertSale(sale: Omit<SaleEntry, "id">): Promise<SaleEntry> {
  const { data, error } = await supabase
    .from("sales")
    .insert({
      date: sale.date,
      shift: sale.shift,
      payment_type: sale.paymentType,
      total_amount: sale.totalAmount,
      receipts_count: sale.receiptsCount,
      returns_amount: sale.returnsAmount,
      comment: sale.comment,
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    date: data.date,
    shift: data.shift,
    paymentType: data.payment_type,
    totalAmount: data.total_amount,
    receiptsCount: data.receipts_count,
    returnsAmount: data.returns_amount,
    comment: data.comment ?? "",
  }
}

export async function updateSale(id: string, updates: Partial<SaleEntry>): Promise<void> {
  const dbUpdates: Record<string, unknown> = {}
  if (updates.date !== undefined) dbUpdates.date = updates.date
  if (updates.shift !== undefined) dbUpdates.shift = updates.shift
  if (updates.paymentType !== undefined) dbUpdates.payment_type = updates.paymentType
  if (updates.totalAmount !== undefined) dbUpdates.total_amount = updates.totalAmount
  if (updates.receiptsCount !== undefined) dbUpdates.receipts_count = updates.receiptsCount
  if (updates.returnsAmount !== undefined) dbUpdates.returns_amount = updates.returnsAmount
  if (updates.comment !== undefined) dbUpdates.comment = updates.comment

  const { error } = await supabase.from("sales").update(dbUpdates).eq("id", id)
  if (error) throw error
}

export async function deleteSale(id: string): Promise<void> {
  const { error } = await supabase.from("sales").delete().eq("id", id)
  if (error) throw error
}

export async function fetchInventory(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .order("name", { ascending: true })

  if (error) throw error

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    sku: row.sku,
    qty: row.qty,
    minQty: row.min_qty,
    updatedAt: row.updated_at,
  }))
}

export async function insertInventoryItem(
  item: Omit<InventoryItem, "id" | "updatedAt">
): Promise<InventoryItem> {
  const { data, error } = await supabase
    .from("inventory")
    .insert({
      name: item.name,
      sku: item.sku,
      qty: item.qty,
      min_qty: item.minQty,
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    name: data.name,
    sku: data.sku,
    qty: data.qty,
    minQty: data.min_qty,
    updatedAt: data.updated_at,
  }
}

export async function updateInventoryItem(
  id: string,
  updates: Partial<InventoryItem>
): Promise<void> {
  const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (updates.name !== undefined) dbUpdates.name = updates.name
  if (updates.sku !== undefined) dbUpdates.sku = updates.sku
  if (updates.qty !== undefined) dbUpdates.qty = updates.qty
  if (updates.minQty !== undefined) dbUpdates.min_qty = updates.minQty

  const { error } = await supabase.from("inventory").update(dbUpdates).eq("id", id)
  if (error) throw error
}

export async function deleteInventoryItem(id: string): Promise<void> {
  const { error } = await supabase.from("inventory").delete().eq("id", id)
  if (error) throw error
}
