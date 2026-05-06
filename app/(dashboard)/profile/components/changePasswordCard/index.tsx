"use client"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { KeyRound, ChevronDown, Eye, EyeOff } from "lucide-react"

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pr-9"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        tabIndex={-1}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

interface ChangePasswordCardProps {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  saving: boolean
  onCurrentPasswordChange: (value: string) => void
  onNewPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onSubmit: () => void
}

export function ChangePasswordCard({
  currentPassword,
  newPassword,
  confirmPassword,
  saving,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: ChangePasswordCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <Card>
      <button
        type="button"
        className="flex w-full items-center justify-between px-6 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <KeyRound className="h-4 w-4" />
          Зміна пароля
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <>
          <Separator />
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="current-password">Поточний пароль</Label>
              <PasswordInput
                id="current-password"
                value={currentPassword}
                onChange={(e) => onCurrentPasswordChange(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-password">Новий пароль</Label>
              <PasswordInput
                id="new-password"
                value={newPassword}
                onChange={(e) => onNewPasswordChange(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm-password">Підтвердження пароля</Label>
              <PasswordInput
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button
              onClick={onSubmit}
              disabled={saving || !currentPassword || !newPassword || !confirmPassword}
              variant="outline"
              className="w-full"
            >
              {saving ? "Збереження..." : "Змінити пароль"}
            </Button>
          </CardContent>
        </>
      )}
    </Card>
  )
}
