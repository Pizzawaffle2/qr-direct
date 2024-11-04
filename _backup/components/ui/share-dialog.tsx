// File: src/components/ui/share-dialog.tsx
"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import {
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Copy,
  Check,
  Share2
} from "lucide-react"

interface ShareDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  imageUrl?: string
}

export function ShareDialog({ open, onOpenChange, imageUrl }: ShareDialogProps) {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const shareUrl = imageUrl || (typeof window !== 'undefined' ? window.location.href : '')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      })
    }
  }

  const shareViaNetwork = (network: string) => {
    let url = ''
    const text = "Check out this QR code!"

    switch (network) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      default:
        return
    }

    window.open(url, '_blank', 'width=600,height=400')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="font-mono text-sm"
            />
          </div>
          <Button 
            type="button" 
            size="sm" 
            className="px-3" 
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy</span>
          </Button>
        </div>
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => shareViaNetwork('facebook')}
          >
            <Facebook className="h-4 w-4" />
            <span className="sr-only">Share on Facebook</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => shareViaNetwork('twitter')}
          >
            <Twitter className="h-4 w-4" />
            <span className="sr-only">Share on Twitter</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => shareViaNetwork('linkedin')}
          >
            <Linkedin className="h-4 w-4" />
            <span className="sr-only">Share on LinkedIn</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}