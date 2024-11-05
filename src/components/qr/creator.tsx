// src/components/qr/creator.tsx
"use client"

import { useState } from "react"
import { TypeSelector } from "./type-selector"
import { StyleEditor } from "./style-editor"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Download, Save } from "lucide-react"
import { QRCodeData, QRStyleOptions } from "@/types/qr"
import { QRPreview } from "./preview"

export function QRCreator() {
  const [qrData, setQrData] = useState<Partial<QRCodeData>>({})
  const [style, setStyle] = useState<QRStyleOptions>({
    size: 400,
    margin: 4,
    backgroundColor: "#FFFFFF",
    foregroundColor: "#000000",
    errorCorrection: "M",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      const response = await fetch("/api/qr/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: qrData, style }),
      })

      if (!response.ok) throw new Error("Failed to generate QR code")

      const result = await response.json()
      toast({
        title: "Success",
        description: "QR code generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <TypeSelector
          value={qrData}
          onChange={setQrData}
        />
        <StyleEditor
          value={style}
          onChange={setStyle}
        />
        <div className="flex gap-4">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              "Generate"
            )}
          </Button>
        </div>
      </div>
      
      <div>
        <QRPreview
          data={qrData}
          style={style}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  )
}