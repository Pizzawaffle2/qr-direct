"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Configure your notification preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
            <span>Email notifications</span>
            <span className="text-sm text-muted-foreground">
              Receive email notifications for important updates
            </span>
          </Label>
          <Switch id="email-notifications" />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="scan-alerts" className="flex flex-col space-y-1">
            <span>QR code scan alerts</span>
            <span className="text-sm text-muted-foreground">
              Get notified when your QR codes are scanned
            </span>
          </Label>
          <Switch id="scan-alerts" />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="marketing" className="flex flex-col space-y-1">
            <span>Marketing emails</span>
            <span className="text-sm text-muted-foreground">
              Receive emails about new features and updates
            </span>
          </Label>
          <Switch id="marketing" />
        </div>
      </CardContent>
    </Card>
  );
}