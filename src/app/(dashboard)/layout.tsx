import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardNav } from "@/components/dashboard/nav";
import { DashboardFooter } from "@/components/dashboard/footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <DashboardHeader user={session.user} />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <DashboardNav />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}