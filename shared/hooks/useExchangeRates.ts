"use client"

import { useState, useEffect } from "react"
import { CURRENCIES } from "@/shared/constants"

type Currency = (typeof CURRENCIES)[number]
type MonobankRate = { currencyCodeA: number; currencyCodeB: number; rateSell: number }

const MONOBANK_URL = "https://api.monobank.ua/bank/currency"

const ISO_MAP: Record<string, number> = {
  USD: 840,
  EUR: 978,
}

function applyRates(data: MonobankRate[]): Currency[] {
  return CURRENCIES.map((c) => {
    if (c.value === "UAH") return c
    const isoCode = ISO_MAP[c.value]
    if (!isoCode) return c
    const rate = data.find((r) => r.currencyCodeA === isoCode && r.currencyCodeB === 980)
    return rate ? { ...c, uahRate: rate.rateSell } : c
  })
}

async function fetchMonobankRates(): Promise<MonobankRate[]> {
  const res = await fetch(MONOBANK_URL)
  if (!res.ok) throw new Error("Monobank API error")
  return res.json()
}

export function useExchangeRates() {
  const [currencies, setCurrencies] = useState<Currency[]>(CURRENCIES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchRates() {
      try {
        const data = await fetchMonobankRates()
        setCurrencies(applyRates(data))
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
  }, [])

  return { currencies, loading, error }
}
