
// src/components/qr/previews/phone-preview.tsx
import { Card } from "@/components/ui/card"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PhonePreviewProps {
  data: {
    title: string
    phone: string
  }
}

export function PhonePreview({ data }: PhonePreviewProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Phone className="h-5 w-5" />
        {data.title}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          {data.phone}
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.href = `tel:${data.phone}`}
        >
          Call Now
        </Button>
      </div>
    </Card>
  )
}
