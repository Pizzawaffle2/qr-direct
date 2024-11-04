"use client"

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, router])

  return (
    <div className="container max-w-lg mx-auto py-32 px-8 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-3xl shadow-2xl transition-all duration-700 ease-in-out animate-fade-in flex items-center justify-center">
      <div className="w-full max-w-md group relative p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105 duration-700 ease-in-out">
        {children}
      </div>
    </div>
  )
}
