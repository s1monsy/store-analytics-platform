"use client";

import { useState, useEffect, useRef } from "react";
import { TopBar } from "@/components/layout/topBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, KeyRound, Eye, EyeOff, Camera, ChevronDown, Trash2, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { supabase } from "@/lib/supabase";

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
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
  );
}

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        setEmail(data.user.email ?? "");
        const rawName = data.user.user_metadata?.name ?? data.user.email ?? "";
        const derived = rawName.includes("@")
          ? rawName
              .split("@")[0]
              .replace(/\d/g, "")
              .replace(/[._-]/g, " ")
              .trim()
              .replace(/\s+/g, " ")
              .replace(/\b\w/g, (c: string) => c.toUpperCase())
          : rawName;
        setName(derived);
        setSavedName(derived);
        setAvatarUrl(data.user.user_metadata?.avatar_url ?? "");
      }
    });
  }, []);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Файл завеликий. Максимум 2 МБ");
      return;
    }

    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const path = `${userId}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setUploadingAvatar(false);
      console.error("Storage upload error:", uploadError);
      toast.error("Не вдалося завантажити фото");
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });

    setUploadingAvatar(false);
    if (updateError) {
      toast.error("Не вдалося оновити аватар");
    } else {
      setAvatarUrl(publicUrl);
      toast.success("Фото оновлено");
    }
  };

  const handleDeleteAvatar = async () => {
    if (!userId || !avatarUrl) return;
    setUploadingAvatar(true);

    const ext = avatarUrl.split("?")[0].split(".").pop();
    await supabase.storage.from("avatars").remove([`${userId}.${ext}`]);

    const { error } = await supabase.auth.updateUser({ data: { avatar_url: "" } });
    setUploadingAvatar(false);
    if (error) {
      toast.error("Не вдалося видалити фото");
    } else {
      setAvatarUrl("");
      toast.success("Фото видалено");
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const { error } = await supabase.auth.updateUser({ data: { name } });
    setSavingProfile(false);
    if (error) {
      toast.error("Не вдалося зберегти профіль");
    } else {
      setSavedName(name);
      toast.success("Профіль оновлено");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Паролі не збігаються");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Пароль має бути не менше 6 символів");
      return;
    }

    setSavingPassword(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });
    if (signInError) {
      setSavingPassword(false);
      toast.error("Невірний поточний пароль");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) {
      toast.error("Не вдалося змінити пароль");
    } else {
      toast.success("Пароль змінено");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="flex flex-col">
      <TopBar title="Профіль" />
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="mx-auto max-w-lg space-y-6">
          {/* Profile info */}
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
                {/* Avatar with dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild disabled={uploadingAvatar}>
                    <button
                      type="button"
                      className="group relative h-16 w-16 shrink-0 rounded-full outline-none"
                    >
                      <Avatar className="h-16 w-16">
                        {avatarUrl && (
                          <AvatarImage
                            src={avatarUrl}
                            alt={name}
                            className="h-full w-full object-cover object-[50%_30%]"
                          />
                        )}
                        <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                          {initials || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        {uploadingAvatar ? (
                          <div className="spinner h-5 w-5" />
                        ) : (
                          <Camera className="h-5 w-5 text-white" />
                        )}
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      {avatarUrl ? "Оновити фото" : "Завантажити фото"}
                    </DropdownMenuItem>
                    {avatarUrl && (
                      <DropdownMenuItem
                        onClick={handleDeleteAvatar}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Видалити фото
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <Label htmlFor="user-name">Ім&apos;я</Label>
                <Input id="user-name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={email}
                  disabled
                  className="text-muted-foreground"
                />
              </div>
              <Button onClick={handleSaveProfile} disabled={savingProfile || name === savedName} className="w-full">
                {savingProfile ? "Збереження..." : "Зберегти зміни"}
              </Button>
            </CardContent>
          </Card>

          {/* Change password */}
          <Card>
            <button
              type="button"
              className="flex w-full items-center justify-between px-6 py-4 text-left"
              onClick={() => setPasswordOpen((v) => !v)}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <KeyRound className="h-4 w-4" />
                Зміна пароля
              </span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${passwordOpen ? "rotate-180" : ""}`}
              />
            </button>
            {passwordOpen && (
              <>
                <Separator />
                <CardContent className="pt-6 space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="current-password">Поточний пароль</Label>
                    <PasswordInput
                      id="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="new-password">Новий пароль</Label>
                    <PasswordInput
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="confirm-password">Підтвердження пароля</Label>
                    <PasswordInput
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <Button
                    onClick={handleChangePassword}
                    disabled={
                      savingPassword || !currentPassword || !newPassword || !confirmPassword
                    }
                    variant="outline"
                    className="w-full"
                  >
                    {savingPassword ? "Збереження..." : "Змінити пароль"}
                  </Button>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
