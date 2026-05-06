"use client"

import { useState, useEffect } from "react"
import { TopBar } from "@/shared/components/layout/topBar"
import { toast } from "sonner"
import { supabase } from "@/shared/lib/supabase"
import { ProfileInfoCard } from "./components/profileInfoCard"
import { ChangePasswordCard } from "./components/changePasswordCard"

export default function ProfilePage() {
  const [name, setName] = useState("")
  const [savedName, setSavedName] = useState("")
  const [email, setEmail] = useState("")
  const [userId, setUserId] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id)
        setEmail(data.user.email ?? "")
        const rawName = data.user.user_metadata?.name ?? data.user.email ?? ""
        const derived = rawName.includes("@")
          ? rawName
              .split("@")[0]
              .replace(/\d/g, "")
              .replace(/[._-]/g, " ")
              .trim()
              .replace(/\s+/g, " ")
              .replace(/\b\w/g, (c: string) => c.toUpperCase())
          : rawName
        setName(derived)
        setSavedName(derived)
        setAvatarUrl(data.user.user_metadata?.avatar_url ?? "")
      }
    })
  }, [])

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Файл завеликий. Максимум 2 МБ")
      return
    }

    setUploadingAvatar(true)
    const ext = file.name.split(".").pop()
    const path = `${userId}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setUploadingAvatar(false)
      console.error("Storage upload error:", uploadError)
      toast.error("Не вдалося завантажити фото")
      return
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path)
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    })

    setUploadingAvatar(false)
    if (updateError) {
      toast.error("Не вдалося оновити аватар")
    } else {
      setAvatarUrl(publicUrl)
      toast.success("Фото оновлено")
    }
  }

  const handleDeleteAvatar = async () => {
    if (!userId || !avatarUrl) return
    setUploadingAvatar(true)

    const ext = avatarUrl.split("?")[0].split(".").pop()
    await supabase.storage.from("avatars").remove([`${userId}.${ext}`])

    const { error } = await supabase.auth.updateUser({ data: { avatar_url: "" } })
    setUploadingAvatar(false)
    if (error) {
      toast.error("Не вдалося видалити фото")
    } else {
      setAvatarUrl("")
      toast.success("Фото видалено")
    }
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    const { error } = await supabase.auth.updateUser({ data: { name } })
    setSavingProfile(false)
    if (error) {
      toast.error("Не вдалося зберегти профіль")
    } else {
      setSavedName(name)
      toast.success("Профіль оновлено")
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Паролі не збігаються")
      return
    }
    if (newPassword.length < 6) {
      toast.error("Пароль має бути не менше 6 символів")
      return
    }

    setSavingPassword(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    })
    if (signInError) {
      setSavingPassword(false)
      toast.error("Невірний поточний пароль")
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSavingPassword(false)
    if (error) {
      toast.error("Не вдалося змінити пароль")
    } else {
      toast.success("Пароль змінено")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
  }

  return (
    <div className="flex flex-col">
      <TopBar title="Профіль" />
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="mx-auto max-w-lg space-y-6">
          <ProfileInfoCard
            name={name}
            savedName={savedName}
            email={email}
            avatarUrl={avatarUrl}
            uploading={uploadingAvatar}
            saving={savingProfile}
            initials={initials}
            onNameChange={setName}
            onSave={handleSaveProfile}
            onFileChange={handleAvatarChange}
            onDeleteAvatar={handleDeleteAvatar}
          />
          <ChangePasswordCard
            currentPassword={currentPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            saving={savingPassword}
            onCurrentPasswordChange={setCurrentPassword}
            onNewPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onSubmit={handleChangePassword}
          />
        </div>
      </div>
    </div>
  )
}
