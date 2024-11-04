// File: src/components/ui/icon-loader.tsx
"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Loader2, ImageIcon } from "lucide-react"

interface IconLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: string
  color?: string
  size?: number
  loading?: boolean
}

export function IconLoader({ 
  icon, 
  color, 
  size = 24, 
  className,
  loading = false,
  ...props 
}: IconLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [svgContent, setSvgContent] = useState<string>("")

  useEffect(() => {
    const loadIcon = async () => {
      if (!icon) return

      try {
        setIsLoading(true)
        setError(false)
        
        const response = await fetch(icon)
        if (!response.ok) throw new Error('Failed to load icon')
        
        let svg = await response.text()
        
        // Add color if provided
        if (color) {
          svg = svg.replace(/fill="currentColor"/g, `fill="${color}"`)
        }
        
        setSvgContent(svg)
      } catch (err) {
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadIcon()
  }, [icon, color])

  if (loading || isLoading) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center text-muted-foreground",
          className
        )}
        style={{ width: size, height: size }}
        {...props}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted/30 rounded-md",
          className
        )}
        style={{ width: size, height: size }}
        {...props}
      >
        <ImageIcon className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
    )
  }

  if (!svgContent) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted/30 rounded-md",
          className
        )}
        style={{ width: size, height: size }}
        {...props}
      >
        <ImageIcon className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
    )
  }

  return (
    <div 
      className={cn("inline-block", className)}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      {...props}
    />
  )
}