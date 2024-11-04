"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useHistoryStore } from "@/lib/store/history-store"
import { 
  Loader2, 
  Download, 
  RefreshCcw, 
  Save,
  Mail,
  MessageSquare,
  Link
} from "lucide-react"
import { TemplateDialog } from "../ui/template-dialog"
import { UnifiedStyleForm } from "../ui/unified-style-form"
import { QRStyleSchema, defaultStyleValues } from "@/lib/types/qr-styles"
import { QRPreview } from "@/components/ui/preview"
import { QRGenerator } from "@/components/ui/qr-generator"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const QR_TYPE = 'email' as const;

const emailFormSchema = z.object({
  title: z.string().optional(),
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
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const { toast } = useToast()
  const { addToHistory } = useHistoryStore()

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues,
  })

  const getPreviewData = () => {
    const title = form.watch('title');
    const email = form.watch('email');
    const subject = form.watch('subject');
    const body = form.watch('body');
    
    if (!email) {
      return null;
    }

    return {
      type: QR_TYPE,
      title: title || 'Email QR Code',
      email,
      subject,
      body,
    };
  };

  const onSubmit = async (data: EmailFormValues) => {
    if (externalSubmit) {
      externalSubmit(data);
      return;
    }

    try {
      setIsGenerating(true)
      const qrCodeData = {
        id: crypto.randomUUID(),
        type: QR_TYPE,
        title: data.title || 'Email QR Code',
        email: data.email,
        subject: data.subject,
        body: data.body,
        created: new Date(),
      }

      const qrCodeUrl = await QRGenerator.generateQR(qrCodeData, data.style)
      setQrCode(qrCodeUrl)
      
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
    setQrCode(null)
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
    <div className="grid grid-cols-1 md:grid-cols-[1fr,400px] gap-8 w-full">
      <div className="space-y-8">
        <Card className="bg-slate-900/50 border-slate-800/50">
          <div className="p-6 space-y-8">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
              <Mail className="h-5 w-5" />
              <h2 className="text-lg font-medium">Email QR Code</h2>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Email QR Code" 
                          {...field}
                          className="border-slate-800 bg-slate-900/50"
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
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="email"
                            placeholder="example@domain.com" 
                            {...field}
                            className="pl-10 border-slate-800 bg-slate-900/50"
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
                            className="pl-10 border-slate-800 bg-slate-900/50"
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
                            className="pl-10 min-h-[100px] resize-none border-slate-800 bg-slate-900/50"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="w-full grid grid-cols-4 gap-4 bg-slate-900/50 p-1">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="style">Style</TabsTrigger>
                    <TabsTrigger value="logo">Logo</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="mt-4">
                    <UnifiedStyleForm
                      value={form.watch('style')}
                      onChange={(style) => form.setValue('style', style)}
                    />
                  </TabsContent>

                  <TabsContent value="colors" className="mt-4">
                    <UnifiedStyleForm
                      value={form.watch('style')}
                      onChange={(style) => form.setValue('style', style)}
                    />
                  </TabsContent>

                  <TabsContent value="style" className="mt-4">
                    <UnifiedStyleForm
                      value={form.watch('style')}
                      onChange={(style) => form.setValue('style', style)}
                    />
                  </TabsContent>

                  <TabsContent value="logo" className="mt-4">
                    <UnifiedStyleForm
                      value={form.watch('style')}
                      onChange={(style) => form.setValue('style', style)}
                    />
                  </TabsContent>
                </Tabs>

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
              </form>
            </Form>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <QRPreview 
          data={getPreviewData()}
          style={form.watch('style')}
          isGenerating={isGenerating}
        />

        {qrCode && !externalSubmit && (
          <Card className="bg-slate-900/50 border-slate-800/50 p-4">
            <div className="flex gap-3">
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
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}
      </div>

      <TemplateDialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        onSave={async (template) => {
          try {
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