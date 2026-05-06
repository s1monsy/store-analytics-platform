"use client"

import { useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdownMenu"
import { Camera, Upload, Trash2 } from "lucide-react"

interface AvatarUploaderProps {
  name: string
  email: string
  avatarUrl: string
  uploading: boolean
  initials: string
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDelete: () => void
}

export function AvatarUploader({
  name,
  email,
  avatarUrl,
  uploading,
  initials,
  onFileChange,
  onDelete,
}: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={uploading}>
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
              {uploading ? (
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
              onClick={onDelete}
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
        onChange={onFileChange}
      />
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  )
}
