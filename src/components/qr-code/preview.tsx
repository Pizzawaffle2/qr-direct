// File: src/components/qr-code/preview.tsx
"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QRCodeOptions, QRCodeData } from "@/lib/types/qr-code"
import { QRGenerator } from "@/services/qr-generator"
import { Download, Share2, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { ShareDialog } from "@/components/ui/share-dialog"

interface PreviewProps {
  data: QRCodeData
  options: QRCodeOptions
  isGenerating?: boolean
}

export function QRPreview({ data, options, isGenerating = false }: PreviewProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    generateQRCode()
  }, [data, options])

  const generateQRCode = async () => {
    try {
      const qrDataUrl = await QRGenerator.generateQR(data, options)
      setQrCode(qrDataUrl)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      })
    }
  }

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
              className="flex items-center justify-center aspect-square text-muted-foreground"
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