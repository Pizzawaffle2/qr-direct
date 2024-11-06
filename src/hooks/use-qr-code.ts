// src/hooks/use-qr-code.ts

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { QRCodeData, QRStyleOptions } from "@/types/qr"
import { QRCodeService } from "@/services/qr-service"

export function useQRCode() {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generateQR = async (data: QRCodeData, style: QRStyleOptions) => {
    try {
      setIsGenerating(true)
      const dataUrl = await QRCodeService.generateDataUrl(data, style)
      return dataUrl
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQR = async (dataUrl: string, fileName?: string) => {
    try {
      await QRCodeService.download(dataUrl, fileName)
      toast({
        title: "Success",
        description: "QR code downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code",
        variant: "destructive",
      })
    }
  }

  return {
    generateQR,
    downloadQR,
    isGenerating
  }
}