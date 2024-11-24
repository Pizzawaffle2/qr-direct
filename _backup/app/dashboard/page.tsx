import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { Profile } from '@/components/user/profile';

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto py-10">
      <Profile />
    </div>
  );
}
