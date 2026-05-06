"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileBarChart,
  Settings,
  Store,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarFooter,
  SidebarSeparator,
} from "@/shared/components/ui/sidebar"
import { useStore } from "@/shared/lib/store-context"

const navItems = [
  { title: "Дашборд", href: "/dashboard", icon: LayoutDashboard },
  { title: "Продажі", href: "/sales", icon: ShoppingCart },
  { title: "Склад", href: "/inventory", icon: Package },
  { title: "Звіти", href: "/reports", icon: FileBarChart },
  { title: "Налаштування", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { storeProfile, inventory } = useStore()

  const lowStockCount = inventory.filter((i) => i.qty < i.minQty).length

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-5 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Store className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">
            TradePoint Data
          </span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isInventory = item.href === "/inventory"
                const tooltipText = isInventory && lowStockCount > 0
                  ? `${item.title} — ${lowStockCount} товар${lowStockCount === 1 ? "" : lowStockCount < 5 ? "и" : "ів"} з низьким залишком`
                  : item.title

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={tooltipText}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {isInventory && lowStockCount > 0 && (
                      <SidebarMenuBadge className="bg-destructive text-destructive-foreground">
                        {lowStockCount}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <p className="text-xs text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden truncate">
          {storeProfile.name}
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}
