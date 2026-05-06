import type { StoreProfile, UserProfile } from "@/shared/types"

export const CURRENCIES = [
  { value: "UAH", label: "Гривня",    uahRate: 1 },
  { value: "USD", label: "Долар США", uahRate: 41.5 },
  { value: "EUR", label: "Євро",      uahRate: 45.2 },
]

export const TIMEZONES = [
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

export const DEFAULT_STORE_PROFILE: StoreProfile = {
  name: "Магазин \"Продукти\"",
  address: "вул. Хрещатик 10, Київ",
  currency: "UAH",
  timezone: "Europe/Kyiv",
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: "Олена Коваленко",
  email: "olena@tradepoint.ua",
  role: "owner",
}
