// File: src/components/qr-code/preview.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Download, Save, Maximize2, QrCode } from "lucide-react"
import { cn } from "@/lib/utils"
import { QRCodeData, QRStyleOptions } from "@/lib/types/qr-code"
import { useQRStore } from "@/lib/store/qr-store"
import { useElementSize } from "@/hooks/use-element-size"
import { Dialog, DialogContent } from "@/components/ui/dialog"

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
  const [previewSize, setPreviewSize] = useState(300)

  // Update preview size based on container width
  useEffect(() => {
    if (width) {
      setPreviewSize(Math.min(width - 40, 400)) // Max size of 400px
    }
  }, [width])

  // Generate preview when data or style changes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const generatePreview = async () => {
      setPreviewError(null)
      
      if (!data || !style) {
        setQrCode(null)
        return
      }

      try {
        const response = await fetch("/api/qr/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data, style }),
        })

        if (!response.ok) throw new Error("Failed to generate preview")
        
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setQrCode(url)
      } catch (error) {
        console.error("Preview error:", error)
        setPreviewError("Failed to generate preview")
      }
    }

    // Debounce preview generation
    clearTimeout(timeoutId)
    timeoutId = setTimeout(generatePreview, 300)

    return () => {
      clearTimeout(timeoutId)
      if (qrCode) URL.revokeObjectURL(qrCode)
    }
  }, [data, style])

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
          <div className="aspect-square p-8">
            {qrCode && (
              <img
                src={qrCode}
                alt="QR Code Preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}