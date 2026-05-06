"use client"

import { useState } from "react"
import { toast } from "sonner"
import { supabase } from "@/shared/lib/supabase"
import { LoginHeader } from "./components/loginHeader"
import { LoginForm } from "./components/loginForm"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (email: string, password: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error("Невірний email або пароль")
      setLoading(false)
      return
    }
    toast.success("Вхід виконано успішно")
    window.location.href = "/dashboard"
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <LoginHeader />
        <LoginForm loading={loading} onSubmit={handleSubmit} />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          TradePoint Data &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
