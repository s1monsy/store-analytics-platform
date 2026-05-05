"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useStore } from "@/lib/store-context"

const UserMenu = dynamic(() => import("@/components/layout/userMenu"), { ssr: false })

export function TopBar({ title }: { title: string }) {
  const { storeProfile } = useStore()

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div>
          <h1 className="text-sm font-semibold text-card-foreground">{title}</h1>
          <p className="text-xs text-muted-foreground">{storeProfile.name}</p>
        </div>
      </div>
      <UserMenu />
    </header>
  )
}
