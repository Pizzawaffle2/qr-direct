"use client"

import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: { [key: string]: string } = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification code has expired or has already been used.",
    Default: "An error occurred during authentication.",
  }

  const message = errorMessages[error || 'Default']

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Card className="w-full max-w-md p-6 space-y-6 bg-slate-900/50 border-slate-800/50">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-red-500">Authentication Error</h1>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth/signin">Try Again</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}