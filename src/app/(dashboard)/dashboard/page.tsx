// src/app/(dashboard)/dashboard/page.tsx

import {getServerSession } from 'next-auth/next';
import {redirect } from 'next/navigation';
import {BillingStatus } from '@/components/dashboard/billing-status';
import {authOptions } from '@/lib/auth/config';
import {Button } from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {Badge } from '@/components/ui/badge';
import {Activity,
  Settings,
  QrCode,
  Calendar,
  BarChart3,
  Users,
  Download,
  Link2,
} from 'lucide-react';
import Link from 'next/link';

interface StatItem {
  title: string;
  value: number;
  suffix?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface DashboardItem {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const dashboardItems: DashboardItem[] = [
  {
    title: 'QR Codes',
    description: 'Manage your QR codes',
    href: '/dashboard/qr-codes',
    icon: QrCode,
    color: 'text-blue-500',
  },
  {
    title: 'Analytics',
    description: 'View your statistics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    color: 'text-green-500',
  },
  {
    title: 'Settings',
    description: 'Manage your account',
    href: '/settings',
    icon: Settings,
    color: 'text-purple-500',
  },
];

const statsItems: StatItem[] = [
  {
    title: 'Total QR Codes',
    value: 0,
    icon: QrCode,
    color: 'text-blue-500',
  },
  {
    title: 'Total Scans',
    value: 0,
    icon: Activity,
    color: 'text-green-500',
  },
  {
    title: 'Active Links',
    value: 0,
    icon: Link2,
    color: 'text-purple-500',
  },
  {
    title: 'Storage Used',
    value: 0,
    suffix: 'MB',
    icon: Download,
    color: 'text-orange-500',
  },
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="animated-bg relative min-h-screen">
      <div className="relative mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Section */}
          <div className="col-span-full lg:col-span-1">
            <Card className="glass-morphism hover-card">
              <CardHeader>
                <CardTitle className="text-gradient">Profile</CardTitle>
                <CardDescription>Manage your profile information</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                  <AvatarFallback>
                    {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{session.user.name}</h2>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="secondary">{session.user.role}</Badge>
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">
                      {session.user.subscriptionStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Billing Status */}
          <div className="col-span-full lg:col-span-2">
            <Card className="glass-morphism hover-card">
              <BillingStatus />
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="col-span-full">
            <Card className="glass-morphism hover-card">
              <CardHeader>
                <CardTitle className="text-gradient">Overview</CardTitle>
                <CardDescription>Your QR code statistics</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statsItems.map((stat) => (
                  <div key={stat.title} className="stat-card">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">{stat.title}</div>
                      <div className="text-2xl font-bold">
                        {stat.value.toLocaleString()}
                        {stat.suffix && (
                          <span className="text-base font-normal text-muted-foreground">
                            {stat.suffix}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Items */}
          {dashboardItems.map((item) => (
            <Card key={item.title} className="glass-morphism hover-card col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <span className="text-gradient">{item.title}</span>
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="button-glow w-full" asChild>
                  <Link href={item.href}>Go to {item.title}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Quick Actions */}
          <div className="col-span-full">
            <Card className="glass-morphism hover-card">
              <CardHeader>
                <CardTitle className="text-gradient">Quick Actions</CardTitle>
                <CardDescription>Common tasks and operations</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Button className="button-glow w-full" asChild>
                  <Link href="/dashboard/qr-codes/new">
                    <QrCode className="mr-2 h-4 w-4" />
                    Create QR Code
                  </Link>
                </Button>
                <Button className="button-glow w-full" variant="outline" asChild>
                  <Link href="/dashboard/calendars/new">
                    <Calendar className="mr-2 h-4 w-4" />
                    New Calendar
                  </Link>
                </Button>
                <Button className="button-glow w-full" variant="outline" asChild>
                  <Link href="/dashboard/analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Link>
                </Button>
                <Button className="button-glow w-full" variant="outline" asChild>
                  <Link href="/dashboard/team/invite">
                    <Users className="mr-2 h-4 w-4" />
                    Invite Team Member
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="animate-slide-up col-span-full">
            <Card className="glass-morphism hover-card">
              <CardHeader>
                <CardTitle className="text-gradient">Recent Activity</CardTitle>
                <CardDescription>Your latest actions and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">No recent activity to show</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
