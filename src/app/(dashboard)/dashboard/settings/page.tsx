// src/app/(dashboard)/dashboard/settings/page.tsx

"use client";

import { useSession } from "next-auth/react";
import { User } from "@/types/user"; // Import the User type
import { Header } from "@/components/dashboard/header";
import { Footer } from "@/components/dashboard/footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { SecuritySettings } from "@/components/settings/security-settings";
import { BillingManagement } from "@/components/settings/billing-management"; // Import BillingManagement

export default function SettingsPage() {
  const { data: session } = useSession();

  if (!session) {
    return <p>Loading...</p>;
  }

  const user: User = session.user as unknown as User;

  return (
    <>
      <Header user={user} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="flex space-x-4 border-b">
            <TabsTrigger value="profile" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200">
              Profile
            </TabsTrigger>
            <TabsTrigger value="appearance" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200">
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200">
              Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200">
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSettings user={user} />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="billing">
            <BillingManagement subscription={user.subscription} usage={user.usage} />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  );
}