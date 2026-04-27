"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { User } from "lucide-react"

export default function ProfilePage() {
  const { userProfile, setUserProfile } = useStore()
  const [user, setUser] = useState(userProfile)

  const handleSave = () => {
    setUserProfile(user)
    toast.success("Профіль оновлено")
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  const roleLabel = {
    owner: "Власник",
    manager: "Менеджер",
    cashier: "Касир",
  }[user.role]

  return (
    <div className="flex flex-col">
      <TopBar title="Профіль" />
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="mx-auto max-w-lg space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                Особисті дані
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{roleLabel}</p>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <Label htmlFor="user-name">Ім&apos;я</Label>
                <Input
                  id="user-name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Роль</Label>
                <Input value={roleLabel} disabled className="text-muted-foreground" />
              </div>
              <Button onClick={handleSave} className="w-full">
                Зберегти зміни
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
