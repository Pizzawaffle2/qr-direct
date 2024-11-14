// src/components/qr/export-options.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Download, Loader2 } from "lucide-react"
import { exportQRCode } from "@/lib/export-utils"

interface ExportOptionsProps {
  settings: QRCodeSettings
  className?: string
  disabled?: boolean
}

interface ExportFormat {
  id: string
  label: string
  extension: string
  mimeType: string
}

const EXPORT_FORMATS: ExportFormat[] = [
  { 
    id: 'png', 
    label: 'PNG Image', 
    extension: '.png', 
    mimeType: 'image/png' 
  },
  { 
    id: 'svg', 
    label: 'SVG Vector', 
    extension: '.svg', 
    mimeType: 'image/svg+xml' 
  },
  { 
    id: 'pdf', 
    label: 'PDF Document', 
    extension: '.pdf', 
    mimeType: 'application/pdf' 
  }
]

export function ExportOptions({ 
  settings, 
  className = "", 
  disabled = false 
}: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const { toast } = useToast()

  const handleExport = async (format: ExportFormat) => {
    try {
      setIsExporting(format.id)

      const fileName = `qr-code-${Date.now()}${format.extension}`
      const result = await exportQRCode(settings, format.id)

      if (!result) {
        throw new Error(`Failed to export as ${format.label}`)
      }

      // Create download link
      const blob = new Blob([result], { type: format.mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: `QR code exported as ${format.label}`,
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export QR code",
        variant: "destructive",
      })
    } finally {
      setIsExporting(null)
    }
  }

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            disabled={disabled || isExporting !== null}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {EXPORT_FORMATS.map((format) => (
            <ExportMenuItem
              key={format.id}
              format={format}
              isExporting={isExporting === format.id}
              onClick={() => handleExport(format)}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Separated components for better organization
interface ExportMenuItemProps {
  format: ExportFormat
  isExporting: boolean
  onClick: () => void
}

function ExportMenuItem({ format, isExporting, onClick }: ExportMenuItemProps) {
  return (
    <DropdownMenuItem
      disabled={isExporting}
      onClick={onClick}
      className="flex items-center"
    >
      {isExporting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {format.label}
    </DropdownMenuItem>
  )
}

// Types
interface QRCodeSettings {
  content: string
  style: {
    foreground: string
    background: string
    size: number
  }
  logo?: {
    url: string
    size: number
    position: { x: number; y: number }
  }
}
