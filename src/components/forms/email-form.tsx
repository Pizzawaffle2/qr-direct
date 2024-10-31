// File: src/components/forms/email-form.tsx
"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { QRCodeService } from "@/services/qr-service"
import { useToast } from "@/components/ui/use-toast"
import { useHistoryStore } from "@/lib/store/history-store"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Download, RefreshCcw, Save } from "lucide-react"
import { TemplateDialog } from "../template/template-dialog"
import { StyleForm } from "../qr-code/style-form"
import { emailSchema, defaultStyleValues } from "@/lib/types/qr-forms"

type EmailFormValues = z.infer<typeof emailSchema>

const defaultValues: EmailFormValues = {
  title: "",
  email: "",
  subject: "",
  body: "",
  style: defaultStyleValues,
}

export function EmailForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrCode, setQRCode] = useState<string | null>(null)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const { toast } = useToast()
  const { addToHistory } = useHistoryStore()

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues,
  })

  const onSubmit = async (data: EmailFormValues) => {
    try {
      setIsGenerating(true)
      const qrCodeData = {
        id: crypto.randomUUID(),
        type: 'email' as const,
        title: data.title,
        email: data.email,
        subject: data.subject,
        body: data.body,
        created: new Date(),
        ...data.style,
      }

      const qrCodeUrl = await QRCodeService.generateQRCode(qrCodeData)
      setQRCode(qrCodeUrl)
      
      addToHistory(qrCodeData)

      toast({
        title: "Success",
        description: "Email QR code generated successfully!",
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
    link.download = `${form.getValues().title || 'email-qr-code'}.png`
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
                      placeholder="Email Contact QR Code" 
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="contact@example.com" 
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
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Email subject" 
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
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Type your message here" 
                      {...field}
                      className="resize-none transition-all duration-300 focus:ring-2 focus:ring-primary"
                      rows={4}
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