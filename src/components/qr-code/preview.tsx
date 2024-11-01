// File: src/components/qr-code/preview.tsx
"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QRCodeData, QRCodeOptions } from "@/lib/types/qr-code"
import { QRGenerator } from "./qr-generator"
import { Download, Share2, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { ShareDialog } from "@/components/ui/share-dialog"

interface PreviewProps {
  data?: Partial<QRCodeData>
  style?: QRCodeOptions
  isGenerating?: boolean
}

export function QRPreview({ data, style, isGenerating = false }: PreviewProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const generatePreview = async () => {
      // Clear previous error
      setPreviewError(null)

      // Check if we have enough data to generate a preview
      if (!data || !style || Object.keys(data).length === 0) {
        return
      }

      try {
        const previewData = {
          id: 'preview',
          created: new Date(),
          ...data,
        } as QRCodeData

        const qrDataUrl = await QRGenerator.generateQR(previewData, style)
        setQrCode(qrDataUrl)
      } catch (error) {
        console.error('Preview generation error:', error)
        setPreviewError(error instanceof Error ? error.message : 'Failed to generate preview')
      }
    }

    // Debounce the preview generation to avoid too many updates
    clearTimeout(timeoutId)
    timeoutId = setTimeout(generatePreview, 200)

    return () => clearTimeout(timeoutId)
  }, [data, style])

  const handleDownload = () => {
    if (!qrCode) return

    const link = document.createElement("a")
    link.href = qrCode
    link.download = `qr-code-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Success",
      description: "QR code downloaded successfully",
    })
  }

  return (
    <div className="relative">
      <Card className="p-6 bg-white dark:bg-gray-800 backdrop-blur-lg bg-opacity-50">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center aspect-square"
            >
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </motion.div>
          ) : previewError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center aspect-square text-destructive text-sm text-center px-4"
            >
              {previewError}
            </motion.div>
          ) : qrCode ? (
            <motion.div
              key="qr-code"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="aspect-square relative"
            >
              <img
                src={qrCode}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center aspect-square text-muted-foreground text-sm text-center"
            >
              Enter details to generate QR code
            </motion.div>
          )}
        </AnimatePresence>

        {qrCode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 mt-4"
          >
            <Button
              onClick={handleDownload}
              className="flex-1"
              variant="default"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              onClick={() => setIsSharing(true)}
              variant="outline"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </Card>

      <ShareDialog
        open={isSharing}
        onOpenChange={setIsSharing}
        imageUrl={qrCode || undefined}
      />
    </div>
  )
}