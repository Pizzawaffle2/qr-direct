"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("No verification token provided")
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        if (!response.ok) {
          throw new Error(await response.text())
        }

        setStatus("success")
        setMessage("Your email has been verified successfully!")
      } catch (error) {
        setStatus("error")
        setMessage(error instanceof Error ? error.message : "Failed to verify email")
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            Verifying your email address...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {status === "loading" && (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          )}
          {status === "success" && (
            <CheckCircle className="h-8 w-8 text-green-500" />
          )}
          {status === "error" && (
            <XCircle className="h-8 w-8 text-red-500" />
          )}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {message}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href={status === "success" ? "/login" : "/"}>
              {status === "success" ? "Go to Login" : "Go Home"}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}