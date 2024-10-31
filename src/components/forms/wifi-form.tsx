// File: src/components/forms/wifi-form.tsx
"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { QRCodeService } from "@/services/qr-service"
import { useToast } from "@/components/ui/use-toast"
import { useHistoryStore } from "@/lib/store/history-store"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Loader2, 
  Download, 
  RefreshCcw, 
  Save, 
  Wifi, 
  Eye, 
  EyeOff,
  ShieldCheck
} from "lucide-react"
import { TemplateDialog } from "../template/template-dialog"
import { StyleForm } from "../qr-code/style-form"
import { wifiSchema, defaultStyleValues } from "@/lib/types/qr-forms"

type WiFiFormValues = z.infer<typeof wifiSchema>

const defaultValues: WiFiFormValues = {
  title: "",
  ssid: "",
  password: "",
  encryption: "WPA2",
  hidden: false,
  style: defaultStyleValues,
}

const encryptionTypes = [
  { label: "WPA/WPA2", value: "WPA2" },
  { label: "WEP", value: "WEP" },
  { label: "None", value: "" },
] as const

export function WiFiForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrCode, setQRCode] = useState<string | null>(null)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const { addToHistory } = useHistoryStore()

  const form = useForm<WiFiFormValues>({
    resolver: zodResolver(wifiSchema),
    defaultValues,
  })

  const onSubmit = async (data: WiFiFormValues) => {
    try {
      setIsGenerating(true)
      const qrCodeData = {
        id: crypto.randomUUID(),
        type: 'wifi' as const,
        title: data.title,
        ssid: data.ssid,
        password: data.password,
        encryption: data.encryption,
        hidden: data.hidden,
        created: new Date(),
        ...data.style,
      }

      const qrCodeUrl = await QRCodeService.generateQRCode(qrCodeData)
      setQRCode(qrCodeUrl)
      
      addToHistory(qrCodeData)

      toast({
        title: "Success",
        description: "WiFi QR code generated successfully!",
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
    link.download = `${form.getValues().title || 'wifi-qr-code'}.png`
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
                      placeholder="WiFi Network QR Code" 
                      {...field}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="ssid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Network Name (SSID)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Your WiFi Network" 
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
                name="encryption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Type</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <ShieldCheck className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Select security type" />
                      </SelectTrigger>
                      <SelectContent>
                        {encryptionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Network Password" 
                        {...field}
                        className="pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hidden"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Hidden Network</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Enable if your WiFi network is hidden
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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