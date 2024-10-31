// File: src/app/profile/notification-settings.tsx
"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Bell } from "lucide-react"

interface NotificationSetting {
 id: string
 title: string
 description: string
 enabled: boolean
 category: "account" | "qr" | "security" | "marketing"
}

export function NotificationSettings() {
 const [isLoading, setIsLoading] = useState(false)
 const { toast } = useToast()
 const [settings, setSettings] = useState<NotificationSetting[]>([
   {
     id: "account-updates",
     title: "Account Updates",
     description: "Get notified about important changes to your account",
     enabled: true,
     category: "account"
   },
   {
     id: "qr-scans",
     title: "QR Code Scans",
     description: "Receive notifications when your QR codes are scanned",
     enabled: true,
     category: "qr"
   },
   {
     id: "security-alerts",
     title: "Security Alerts",
     description: "Get alerts about security events and suspicious activities",
     enabled: true,
     category: "security"
   },
   {
     id: "new-features",
     title: "New Features",
     description: "Stay updated with new features and improvements",
     enabled: false,
     category: "marketing"
   },
 ])

 const updateSetting = async (id: string, enabled: boolean) => {
   try {
     setIsLoading(true)
     await fetch("/api/user/notifications", {
       method: "PUT",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ id, enabled }),
     })

     setSettings(prev => 
       prev.map(setting => 
         setting.id === id ? { ...setting, enabled } : setting
       )
     )

     toast({
       title: "Preferences updated",
       description: "Your notification preferences have been saved.",
     })
   } catch (error) {
     toast({
       title: "Error",
       description: "Failed to update notification preferences",
       variant: "destructive",
     })
   } finally {
     setIsLoading(false)
   }
 }

 const categories = {
   account: "Account Notifications",
   qr: "QR Code Notifications",
   security: "Security Notifications",
   marketing: "Marketing Notifications",
 }

 return (
   <Card>
     <CardHeader>
       <CardTitle>Notification Preferences</CardTitle>
       <CardDescription>Choose what notifications you want to receive</CardDescription>
     </CardHeader>
     <CardContent className="space-y-6">
       {(Object.keys(categories) as Array<keyof typeof categories>).map((category) => (
         <div key={category}>
           <h3 className="text-lg font-semibold mb-4">{categories[category]}</h3>
           <div className="space-y-4">
             {settings
               .filter(setting => setting.category === category)
               .map(setting => (
                 <div
                   key={setting.id}
                   className="flex items-center justify-between space-x-4 rounded-lg border p-4"
                 >
                   <div className="flex-1 space-y-1">
                     <p className="font-medium leading-none">{setting.title}</p>
                     <p className="text-sm text-muted-foreground">
                       {setting.description}
                     </p>
                   </div>
                   <Switch
                     checked={setting.enabled}
                     onCheckedChange={(checked) => updateSetting(setting.id, checked)}
                     disabled={isLoading}
                   />
                 </div>
               ))}
           </div>
         </div>
       ))}

       <div className="flex justify-end pt-4">
         <Button disabled={isLoading}>
           {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
           <Bell className="mr-2 h-4 w-4" />
           Save Preferences
         </Button>
       </div>
     </CardContent>
   </Card>
 )
}