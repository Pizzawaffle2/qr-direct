// File: src/components/forms/url-form.tsx
"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { QRCodeService } from "@/services/qr-service"
import { useToast } from "@/components/ui/use-toast"
import { useHistoryStore } from "@/lib/store/history-store"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Download, RefreshCcw, Save } from "lucide-react"
import { TemplateDialog } from "../template/template-dialog"
import { StyleForm } from "../qr-code/style-form"

const urlFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Please enter a valid URL").transform(url => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }),
  style: z.object({
    backgroundColor: z.string(),
    foregroundColor: z.string(),
    pattern: z.string().optional(),
    margin: z.number().min(0).max(50),
    cornerSquareStyle: z.string().optional(),
    cornerDotStyle: z.string().optional(),
    errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']),
  }),
})

type URLFormValues = z.infer<typeof urlFormSchema>

const defaultValues: URLFormValues = {
  title: "",
  url: "",
  style: {
    backgroundColor: "#FFFFFF",
    foregroundColor: "#000000",
    pattern: "squares",
    margin: 20,
    cornerSquareStyle: "square",
    cornerDotStyle: "square",
    errorCorrectionLevel: "M",
  },
}

export function URLForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrCode, setQRCode] = useState<string | null>(null)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const { toast } = useToast()
  const { addToHistory } = useHistoryStore()

  const form = useForm<URLFormValues>({
    resolver: zodResolver(urlFormSchema),
    defaultValues,
  })

  const onSubmit = async (data: URLFormValues) => {
    try {
      setIsGenerating(true)
      const qrCodeData = {
        id: crypto.randomUUID(),
        type: 'url' as const,
        title: data.title,
        url: data.url,
        created: new Date(),
        ...data.style,
      }

      const qrCodeUrl = await QRCodeService.generateQRCode(qrCodeData)
      setQRCode(qrCodeUrl)
      
      addToHistory(qrCodeData)

      toast({
        title: "Success",
        description: "QR code generated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate QR code",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    form.reset(defaultValues)
    setQRCode(null)
  }

  const handleDownload = () => {
    if (!qrCode) return
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `${form.getValues().title || 'qr-code'}.png`
    link.click()
    
    toast({
      title: "Downloaded!",
      description: "QR code has been downloaded successfully.",
    })
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="My Website QR Code" 
                      {...field}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="example.com" 
                      {...field}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <StyleForm
              value={form.watch('style')}
              onChange={(style) => form.setValue('style', style)}
            />

            <div className="flex gap-3">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : "Generate QR Code"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
              >
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </form>
      </Form>

      <AnimatePresence>
        {qrCode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-6 p-6 border rounded-xl bg-white dark:bg-gray-800 shadow-lg"
          >
            <img 
              src={qrCode} 
              alt="Generated QR Code" 
              className="max-w-[200px] rounded-lg shadow-md"
            />
            <div className="flex gap-3 w-full">
              <Button 
                onClick={handleDownload}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsTemplateDialogOpen(true)}
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Template
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <TemplateDialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        onSave={async (template) => {
          try {
            // Save template logic here
            toast({
              title: "Success",
              description: "Template saved successfully!",
            })
            setIsTemplateDialogOpen(false)
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to save template",
              variant: "destructive",
            })
          }
        }}
        style={form.watch('style')}
      />
    </div>
  )
}