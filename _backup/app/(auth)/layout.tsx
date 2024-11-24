'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  return (
    <div className="animate-fade-in container mx-auto flex max-w-lg items-center justify-center rounded-3xl bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 px-8 py-32 shadow-2xl transition-all duration-700 ease-in-out dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="group relative w-full max-w-md transform rounded-3xl border border-gray-200 bg-white p-8 shadow-md transition-transform duration-700 ease-in-out hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
        {children}
      </div>
    </div>
  );
}
