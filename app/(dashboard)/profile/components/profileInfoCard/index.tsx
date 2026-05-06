import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import { User } from "lucide-react"
import { AvatarUploader } from "../avatarUploader"

interface ProfileInfoCardProps {
  name: string
  savedName: string
  email: string
  avatarUrl: string
  uploading: boolean
  saving: boolean
  initials: string
  onNameChange: (value: string) => void
  onSave: () => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDeleteAvatar: () => void
}

export function ProfileInfoCard({
  name,
  savedName,
  email,
  avatarUrl,
  uploading,
  saving,
  initials,
  onNameChange,
  onSave,
  onFileChange,
  onDeleteAvatar,
}: ProfileInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <User className="h-4 w-4" />
          Особисті дані
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6 space-y-6">
        <AvatarUploader
          name={name}
          email={email}
          avatarUrl={avatarUrl}
          uploading={uploading}
          initials={initials}
          onFileChange={onFileChange}
          onDelete={onDeleteAvatar}
        />
        <Separator />
        <div className="flex flex-col gap-2">
          <Label htmlFor="user-name">Ім&apos;я</Label>
          <Input id="user-name" value={name} onChange={(e) => onNameChange(e.target.value)} />
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
        <Button onClick={onSave} disabled={saving || name === savedName} className="w-full">
          {saving ? "Збереження..." : "Зберегти зміни"}
        </Button>
      </CardContent>
    </Card>
  )
}
