"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Loader2, 
  Download, 
  Save, 
  Maximize2, 
  QrCode, 
  X,
  FileType
} from "lucide-react"
import { cn } from "@/lib/utils"
import { QRCodeData, QRStyleOptions } from "@/lib/types/qr-code"
import { useQRStore } from "@/lib/store/qr-store"
import { useElementSize } from "@/hooks/use-element-size"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ErrorBoundary } from "@/components/ui/error-boundary"

interface PreviewProps {
  data?: Partial<QRCodeData>
  style?: QRStyleOptions
  isGenerating?: boolean
  className?: string
  onDownload?: (format: string) => void
  onSave?: () => void
}

// File type options for download
const FILE_TYPES = [
  { label: "PNG Image", value: "png" },
  { label: "SVG Vector", value: "svg" },
  { label: "PDF Document", value: "pdf" },
] as const

type FileType = typeof FILE_TYPES[number]["value"]

const PreviewPlaceholder = () => (
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
)

const PreviewLoading = () => (
  <motion.div
    key="loading"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="h-full flex items-center justify-center"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 className="h-8 w-8 text-muted-foreground" />
    </motion.div>
  </motion.div>
)

const PreviewError = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <motion.div
    key="error"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="h-full flex flex-col items-center justify-center gap-4 text-destructive text-sm text-center px-4"
  >
    <p>{message}</p>
    {onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try Again
      </Button>
    )}
  </motion.div>
)

const PreviewImage = ({ url }: { url: string }) => (
  <motion.div
    key="preview"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="h-full flex items-center justify-center"
  >
    <motion.img
      src={url}
      alt="QR Code Preview"
      className="max-w-full max-h-full object-contain"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    />
  </motion.div>
)

const DownloadButton = ({ 
  onDownload, 
  disabled 
}: { 
  onDownload: (type: FileType) => void
  disabled?: boolean 
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={disabled}
      >
        <Download className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {FILE_TYPES.map((type) => (
        <DropdownMenuItem
          key={type.value}
          onClick={() => onDownload(type.value)}
        >
          <FileType className="mr-2 h-4 w-4" />
          {type.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
)

export function QRPreview({ 
  data,
  style,
  isGenerating = false,
  className,
  onDownload,
  onSave
}: PreviewProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { ref, width } = useElementSize()
  const [previewSize, setPreviewSize] = useState(300)
  const { toast } = useToast()

  // Update preview size based on container width
  useEffect(() => {
    if (width) {
      setPreviewSize(Math.min(width - 40, 400))
    }
  }, [width])

  const generatePreview = useCallback(async () => {
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

      if (!response.ok) {
        throw new Error(`Failed to generate preview: ${response.statusText}`)
      }
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setQrCode(url)
    } catch (error) {
      console.error("Preview error:", error)
      setPreviewError(error instanceof Error ? error.message : "Failed to generate preview")
      toast({
        title: "Error",
        description: "Failed to generate QR code preview",
        variant: "destructive",
      })
    }
  }, [data, style, toast])

  // Generate preview when data or style changes
  useEffect(() => {
    const timeoutId = setTimeout(generatePreview, 300)
    return () => {
      clearTimeout(timeoutId)
      if (qrCode) URL.revokeObjectURL(qrCode)
    }
  }, [qrCode, generatePreview])

  const handleDownload = useCallback(async (fileType: FileType) => {
    if (!qrCode) return
    
    try {
      const response = await fetch(qrCode)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `qr-code.${fileType}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      onDownload?.(fileType)
      toast({
        title: "Success",
        description: `QR code downloaded as ${fileType.toUpperCase()}`,
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Error",
        description: "Failed to download QR code",
        variant: "destructive",
      })
    }
  }, [qrCode, onDownload, toast])

  return (
    <ErrorBoundary
      fallback={
        <PreviewError
          message="Something went wrong displaying the preview"
          onRetry={generatePreview}
        />
      }
    >
      <Card 
        ref={ref}
        className={cn(
          "relative overflow-hidden bg-white dark:bg-slate-900/50 border-slate-800/50",
          className
        )}
      >
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          {qrCode && (
            <DownloadButton onDownload={handleDownload} disabled={isGenerating} />
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
              <PreviewLoading />
            ) : previewError ? (
              <PreviewError 
                message={previewError}
                onRetry={generatePreview}
              />
            ) : qrCode ? (
              <PreviewImage url={qrCode} />
            ) : (
              <PreviewPlaceholder />
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
                <DialogFooter className="absolute bottom-4 right-4 flex gap-2">
                  <DownloadButton 
                    onDownload={handleDownload}
                    disabled={isGenerating}
                  />
                  {onSave && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onSave}
                      className="shadow-lg"
                      disabled={isGenerating}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  )}
                </DialogFooter>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  )
}