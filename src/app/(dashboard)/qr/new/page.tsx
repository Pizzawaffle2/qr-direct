// src/app/(dashboard)/qr/new/page.tsx
"use client"

import { useSession } from "next-auth/react"
import { QRCreator } from "@/components/qr/creator"
import { Card } from "@/components/ui/card"
import { SubscriptionRequired } from "@/components/auth/subscription-required"

export default function NewQRPage() {
  const { data: session } = useSession()

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create QR Code</h1>
        <p className="text-muted-foreground mt-2">
          Generate a new QR code with custom styling
        </p>
      </div>

      <SubscriptionRequired 
        feature="Advanced QR Code Generation"
        plan="pro"
      >
        <Card className="p-6">
          <QRCreator />
        </Card>
      </SubscriptionRequired>
    </div>
  )
}