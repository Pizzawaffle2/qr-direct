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
import { QRPreview } from "@/components/qr-code/preview"
import { QRGenerator } from "@/components/qr-code/qr-generator"
import { 
  Loader2, 
  Download, 
  RefreshCcw, 
  Save,
  Mail,
  MessageSquare,
  Link
} from "lucide-react"
import { TemplateDialog } from "../template/template-dialog"
import { UnifiedStyleForm } from "../qr-code/unified-style-form"
import { QRStyleSchema, defaultStyleValues } from "@/lib/types/qr-styles"

const emailFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().optional(),
  body: z.string().optional(),
  style: QRStyleSchema,
})

type EmailFormValues = z.infer<typeof emailFormSchema>

const defaultValues: EmailFormValues = {
  title: "",
  email: "",
  subject: "",
  body: "",
  style: defaultStyleValues,
}

interface EmailFormProps {
  onSubmit?: (data: EmailFormValues) => void;
}

export function EmailForm({ onSubmit: externalSubmit }: EmailFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrCode, setQRCode] = useState<string | null>(null)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const { toast } = useToast()
  const { addToHistory } = useHistoryStore()

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues,
  })

  const onSubmit = async (data: EmailFormValues) => {
    if (externalSubmit) {
      externalSubmit(data);
      return;
    }
  
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
      }
  
      const qrCodeUrl = await QRGenerator.generateQR(qrCodeData, data.style)
      setQRCode(qrCodeUrl)
      
      addToHistory({
        ...qrCodeData,
        url: qrCodeUrl,
      })
  
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
            <QRPreview 
  data={{
    type: 'email',
    email: form.watch('email'),
    subject: form.watch('subject'),
    body: form.watch('body'),
  }}
  style={form.watch('style')}
  isGenerating={isGenerating}
/>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Email QR Code" 
                      {...field}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="email"
                          placeholder="example@domain.com" 
                          {...field}
                          className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary"
                        />
                      </div>
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
                      <div className="relative">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Email subject" 
                          {...field}
                          className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary"
                        />
                      </div>
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
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea 
                          placeholder="Enter email message" 
                          {...field}
                          className="pl-10 min-h-[100px] resize-none transition-all duration-300 focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <UnifiedStyleForm
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
        {qrCode && !externalSubmit && (
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