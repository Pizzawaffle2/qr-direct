// src/app/(dashboard)/qr/list/page.tsx
"use client"

import { useSession } from "next-auth/react"
import { QRList } from "@/components/qr/list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ListQRPage() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My QR Codes</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your QR codes
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/qr/new")}
          className="bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>

      <QRList />
    </div>
  )
}