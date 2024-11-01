// File: src/components/forms/url-form.tsx
"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useHistoryStore } from "@/lib/store/history-store"
import { motion } from "framer-motion"
import { 
  Loader2, 
  Download, 
  RefreshCcw, 
  Save,
  Globe,
  Link
} from "lucide-react"
import { TemplateDialog } from "../template/template-dialog"
import { UnifiedStyleForm } from "../qr-code/unified-style-form"
import { QRStyleSchema, defaultStyleValues } from "@/lib/types/qr-styles"
import { QRPreview } from "@/components/qr-code/preview"
import { QRGenerator } from "@/components/qr-code/qr-generator"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const urlFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Please enter a valid URL").transform(url => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }),
  style: QRStyleSchema,
})

type URLFormValues = z.infer<typeof urlFormSchema>

const defaultValues: URLFormValues = {
  title: "",
  url: "",
  style: defaultStyleValues,
}

interface URLFormProps {
  onSubmit?: (data: URLFormValues) => void;
}

export function URLForm({ onSubmit: externalSubmit }: URLFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const { toast } = useToast()
  const { addToHistory } = useHistoryStore()

  const form = useForm<URLFormValues>({
    resolver: zodResolver(urlFormSchema),
    defaultValues,
  })

  const onSubmit = async (data: URLFormValues) => {
    if (externalSubmit) {
      externalSubmit(data);
      return;
    }

    try {
      setIsGenerating(true)
      const qrCodeData = {
        id: crypto.randomUUID(),
        type: 'url' as const,
        title: data.title,
        url: data.url,
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
        description: "URL QR code generated successfully!",
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
    link.download = `${form.getValues().title || 'url-qr-code'}.png`
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
              <Globe className="h-5 w-5" />
              <h2 className="text-lg font-medium">URL QR Code</h2>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Website QR Code" 
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
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="example.com" 
                            {...field}
                            className="pl-10 border-slate-800 bg-slate-900/50"
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

                  <div className="mt-4 space-y-4">
                    <UnifiedStyleForm
                      value={form.watch('style')}
                      onChange={(style) => form.setValue('style', style)}
                    />
                  </div>
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
          data={{
            type: 'url',
            title: form.watch('title'),
            url: form.watch('url'),
          }}
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