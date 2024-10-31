// File: src/app/profile/page.tsx
"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { ProfileForm } from "./profile-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SecurityForm } from "./security-form"
import { NotificationSettings } from "./notification-settings"
import { APIKeys } from "./api-keys"
import { motion } from "framer-motion"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("profile")

  if (!session) return null

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
          </TabsList>
          <div className="mt-8">
            <TabsContent value="profile">
              <ProfileForm user={session.user} />
            </TabsContent>
            <TabsContent value="security">
              <SecurityForm />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>
            <TabsContent value="api">
              <APIKeys />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  )
}