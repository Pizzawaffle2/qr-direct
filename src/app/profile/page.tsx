"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import confetti from "canvas-confetti"

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
    return false
  }
  return true
}, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { toast } = useToast()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  })

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const result = await response.json()

      // Update session data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: result.user.name,
        },
      })

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })

      // Trigger confetti
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)

      // Reset password fields
      form.reset({
        ...data,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-16">
      <Card className="shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-gray-200 text-gray-900 p-6 rounded-t-lg dark:bg-gray-800 dark:text-gray-100">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="bg-secondary text-white dark:bg-secondary-dark">
                {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl font-semibold dark:bg-primary-dark">Profile Settings</CardTitle>
              <CardDescription>
                Update your profile information and password
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-sm text-gray-700 dark:text-gray-300">Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="border-gray-300 rounded-md focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
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
                    <FormLabel className="font-medium text-sm text-gray-700 dark:text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="border-gray-300 rounded-md bg-gray-100 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground dark:text-gray-400">
                      Email cannot be changed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Change Password</h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Update your password here. Leave new password blank to keep current password.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm text-gray-700 dark:text-gray-300">Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="border-gray-300 rounded-md focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm text-gray-700 dark:text-gray-300">New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="border-gray-300 rounded-md focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-sm text-gray-700 dark:text-gray-300">Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="border-gray-300 rounded-md focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
  type="submit"
  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed"
  disabled={isLoading}
>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
