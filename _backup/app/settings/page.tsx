// File: src/app/settings/page.tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SettingsForm from './settings-form';
import { prisma } from '@/lib/prisma';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/settings');
  }

  // Fetch user settings
  const settings = await prisma.settings.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  return <SettingsForm initialSettings={settings} />;
}
