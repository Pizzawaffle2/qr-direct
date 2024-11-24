import {getServerSession } from 'next-auth/next';
import {redirect } from 'next/navigation';
import {authOptions } from '@/lib/auth/config';
import {Header } from '@/components/dashboard/header';
import {DashboardNav } from '@/components/dashboard/nav';
import {Footer } from '@/components/dashboard/footer';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <Header user={{ ...session.user, subscriptionTier: session.user.subscriptionTier || 'FREE' as const, subscriptionStatus: session.user.subscriptionStatus === 'CANCELLED' ? 'CANCELED' : session.user.subscriptionStatus, role: session.user.role === 'SUPER_ADMIN' ? 'SUPERADMIN' : session.user.role, lastLogin: new Date() }} />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <DashboardNav />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
