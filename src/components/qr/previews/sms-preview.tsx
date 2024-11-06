

// src/components/qr/previews/sms-preview.tsx
import { Card } from "@/components/ui/card"
import { MessageSquare, Phone, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SMSPreviewProps {
  data: {
    title: string
    phone: string
    message?: string
  }
}

export function SMSPreview({ data }: SMSPreviewProps) {
  const handleSendClick = () => {
    const url = `sms:${data.phone}${data.message ? `?body=${encodeURIComponent(data.message)}` : ''}`
    window.location.href = url
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <MessageSquare className="h-5 w-5" />
        {data.title}
      </div>
      <div className="space-y-3">
        <p className="text-sm flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          {data.phone}
        </p>
        {data.message && (
          <div className="text-sm flex gap-2">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
            <p className="whitespace-pre-wrap">{data.message}</p>
          </div>
        )}
        <Button 
          variant="outline" 
          size="sm"
          className="w-full"
          onClick={handleSendClick}
        >
          Send Message
        </Button>
      </div>
    </Card>
  )
}