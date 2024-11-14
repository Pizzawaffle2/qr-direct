import type { Metadata } from 'next';
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Profile } from "@/components/dashboard/user/profile";
import { BillingStatus } from "@/components/dashboard/billing-status";
import { authOptions } from "@/lib/auth/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Calendar, BarChart3, Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Dashboard - QR Direct',
  description: 'Manage your QR codes and calendars',
};

interface DashboardItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

const dashboardItems: DashboardItem[] = [
  {
    title: "QR Codes",
    description: "Create and manage your QR codes",
    icon: QrCode,
    href: "/dashboard/qr-codes",
    color: "text-blue-500",
  },
  {
    title: "Calendars",
    description: "Generate custom calendars",
    icon: Calendar,
    href: "/dashboard/calendars",
    color: "text-green-500",
  },
  {
    title: "Analytics",
    description: "Track QR code performance",
    icon: BarChart3,
    href: "/dashboard/analytics",
    color: "text-purple-500",
  },
  {
    title: "Team",
    description: "Manage team members",
    icon: Users,
    href: "/dashboard/team",
    color: "text-orange-500",
  },
];

interface StatsItem {
  title: string;
  value: number;
  suffix?: string;
}

const statsItems: StatsItem[] = [
  { title: "Total Scans", value: 1234 },
  { title: "Active QR Codes", value: 23 },
  { title: "Calendars", value: 5 },
  { title: "Team Members", value: 3 },
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Section */}
        <div className="col-span-full lg:col-span-1">
          <Profile user={session.user} />
        </div>

        {/* Billing Status */}
        <div className="col-span-full lg:col-span-2">
          <BillingStatus />
        </div>

        {/* Quick Stats */}
        <div className="col-span-full">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Your QR code statistics</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statsItems.map((stat) => (
                <div key={stat.title} className="rounded-lg border p-3">
                  <div className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </div>
                  <div className="text-2xl font-bold">
                    {stat.value.toLocaleString()}
                    {stat.suffix && (
                      <span className="text-base font-normal text-muted-foreground">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Items */}
        {dashboardItems.map((item) => (
          <Card key={item.title} className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <item.icon className={`h-5 w-5 ${item.color}`} />
                {item.title}
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href={item.href}>
                  Go to {item.title}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button className="w-full" asChild>
              <Link href="/dashboard/qr-codes/new">
                <QrCode className="mr-2 h-4 w-4" />
                Create QR Code
              </Link>
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/dashboard/calendars/new">
                <Calendar className="mr-2 h-4 w-4" />
                New Calendar
              </Link>
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/dashboard/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/dashboard/team/invite">
                <Users className="mr-2 h-4 w-4" />
                Invite Team Member
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              No recent activity to show
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}