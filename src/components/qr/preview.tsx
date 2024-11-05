// src/components/qr/preview.tsx

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Download, Maximize2, QrCode } from "lucide-react"
import { cn } from "@/lib/utils"
import { QRCodeData, QRStyleOptions } from "@/types/qr"
import { useElementSize } from "@/hooks/use-element-size"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { generateQR } from "@/lib/actions/qr"

interface PreviewProps {
  data?: Partial<QRCodeData>
  style?: QRStyleOptions
  isGenerating?: boolean
  className?: string
}

export function QRPreview({ 
  data,
  style,
  isGenerating = false,
  className 
}: PreviewProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { ref, width } = useElementSize()
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true

    const generatePreview = async () => {
      try {
        setPreviewError(null)
        
        if (!data || !style) {
          setQrCode(null)
          return
        }

        const result = await generateQR(data as QRCodeData, style)

        if (!mounted) return

        if (result.success && result.dataUrl) {
          setQrCode(result.dataUrl)
        } else {
          throw new Error(result.error || 'Failed to generate QR code')
        }
      } catch (error) {
        console.error("Preview error:", error)
        setPreviewError("Failed to generate preview")
        toast({
          title: "Error",
          description: "Failed to generate QR code preview",
          variant: "destructive",
        })
      }
    }

    const timeoutId = setTimeout(generatePreview, 300)

    return () => {
      mounted = false
      clearTimeout(timeoutId)
    }
  }, [data, style, toast])

  const handleDownload = async () => {
    if (!qrCode) return

    const link = document.createElement('a')
    link.href = qrCode
    link.download = 'qr-code.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <Card 
        ref={ref}
        className={cn(
          "relative overflow-hidden bg-white dark:bg-slate-900/50 border-slate-800/50",
          className
        )}
      >
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          {qrCode && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsFullscreen(true)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="aspect-square p-4">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center"
              >
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </motion.div>
            ) : previewError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center text-destructive text-sm text-center px-4"
              >
                {previewError}
              </motion.div>
            ) : qrCode ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center"
              >
                <motion.img
                  src={qrCode}
                  alt="QR Code Preview"
                  className="max-w-full max-h-full object-contain"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground"
              >
                <QrCode className="h-12 w-12" />
                <p className="text-sm text-center">
                  Enter details to preview your QR code
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>QR Code Preview</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="aspect-square p-8">
            {qrCode && (
              <div className="relative">
                <img
                  src={qrCode}
                  alt="QR Code Preview"
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-4 right-4">
                  <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}