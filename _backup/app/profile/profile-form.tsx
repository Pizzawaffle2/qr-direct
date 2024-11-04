// File: src/app/profile/profile-form.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Camera } from "lucide-react"
import { useState } from "react"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
  avatar: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm({ user }: { user: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      avatar: user?.image || "",
    },
  })

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true)

      if (avatarFile) {
        // Handle avatar upload first
        const formData = new FormData()
        formData.append("file", avatarFile)
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        if (uploadRes.ok) {
          const { url } = await uploadRes.json()
          data.avatar = url
        }
      }

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        form.setValue("avatar", reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center gap-x-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={form.watch("avatar")} />
              <AvatarFallback>
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-2 -right-2 rounded-full bg-primary p-2 text-white cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <Camera className="h-4 w-4" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Profile Picture</h2>
            <p className="text-sm text-muted-foreground">
              Click the camera icon to update your profile picture
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Tell us a little about yourself"
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  )
}