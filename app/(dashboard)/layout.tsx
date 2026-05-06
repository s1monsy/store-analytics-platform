"use client"

import { SidebarProvider, SidebarInset } from "@/shared/components/ui/sidebar"
import { AppSidebar } from "@/shared/components/layout/appSidebar"
import { StoreProvider } from "@/shared/lib/store-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StoreProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </StoreProvider>
  )
}
