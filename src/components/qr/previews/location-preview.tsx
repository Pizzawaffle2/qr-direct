
// src/components/qr/previews/location-preview.tsx
import { Card } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LocationPreviewProps {
  data: {
    title: string
    latitude: number
    longitude: number
    name?: string
  }
}

export function LocationPreview({ data }: LocationPreviewProps) {
  const handleOpenMap = () => {
    const url = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
    window.open(url, '_blank')
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <MapPin className="h-5 w-5" />
        {data.title}
      </div>
      <div className="space-y-3">
        {data.name && (
          <p className="text-sm font-medium">{data.name}</p>
        )}
        <p className="text-sm flex items-center gap-2">
          <Navigation className="h-4 w-4 text-muted-foreground" />
          {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
        </p>
        <Button 
          variant="outline" 
          size="sm"
          className="w-full"
          onClick={handleOpenMap}
        >
          Open in Maps
        </Button>
      </div>
    </Card>
  )
}