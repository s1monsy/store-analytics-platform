"use client"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Eye, EyeOff } from "lucide-react"

interface LoginFormProps {
  loading: boolean
  onSubmit: (email: string, password: string) => void
  onForgotPassword: (email: string) => void
}

export function LoginForm({ loading, onSubmit, onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Заповніть всі поля")
      return
    }
    onSubmit(email, password)
  }

  return (
    <Card>
      <CardHeader className="pb-0" />
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Електронна пошта</Label>
            <Input
              id="email"
              type="email"
              placeholder="olena@tradepoint.ua"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Введіть пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Приховати пароль" : "Показати пароль"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(v) => setRemember(v === true)}
              />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
                {"Запам'ятати мене"}
              </Label>
            </div>
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => onForgotPassword(email)}
            >
              Забули пароль?
            </button>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Входимо..." : "Увійти"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
