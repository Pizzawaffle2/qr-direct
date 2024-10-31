// File: src/components/forms/vcard-form.tsx
"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
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
  User,
  Building,
  Phone,
  Mail,
  Globe,
  MapPin,
  FileText
} from "lucide-react"
import { TemplateDialog } from "../template/template-dialog"
import { StyleForm } from "../qr-code/style-form"
import { vcardSchema, defaultStyleValues } from "@/lib/types/qr-forms"
import { Card, CardContent } from "@/components/ui/card"

type VCardFormValues = z.infer<typeof vcardSchema>

const defaultValues: VCardFormValues = {
  title: "",
  firstName: "",
  lastName: "",
  organization: "",
  email: "",
  phone: "",
  mobile: "",
  website: "",
  address: "",
  note: "",
  style: defaultStyleValues,
}

interface FormSectionProps {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}

const FormSection = ({ title, icon: Icon, children }: FormSectionProps) => (
  <Card className="border border-border/50">
    <CardContent className="pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-medium text-lg">{title}</h3>
      </div>
      {children}
    </CardContent>
  </Card>
)

export function VCardForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrCode, setQRCode] = useState<string | null>(null)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const { toast } = useToast()
  const { addToHistory } = useHistoryStore()

  const form = useForm<VCardFormValues>({
    resolver: zodResolver(vcardSchema),
    defaultValues,
  })

  const onSubmit = async (data: VCardFormValues) => {
    try {
      setIsGenerating(true)
      const qrCodeData = {
        id: crypto.randomUUID(),
        type: 'vcard' as const,
        title: data.title,
        firstName: data.firstName,
        lastName: data.lastName,
        organization: data.organization,
        email: data.email,
        phone: data.phone,
        mobile: data.mobile,
        website: data.website,
        address: data.address,
        note: data.note,
        created: new Date(),
        ...data.style,
      }

      const qrCodeUrl = await QRCodeService.generateQRCode(qrCodeData)
      setQRCode(qrCodeUrl)
      
      addToHistory(qrCodeData)

      toast({
        title: "Success",
        description: "Contact QR code generated successfully!",
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
    setActiveTab("basic")
  }

  const handleDownload = () => {
    if (!qrCode) return
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `${form.getValues().title || 'contact-qr-code'}.png`
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
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Business Contact QR Code" 
                      {...field}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="additional">Additional Info</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <FormSection title="Personal Information" icon={User}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="John" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Doe" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormSection>

                <FormSection title="Organization" icon={Building}>
                  <FormField
                    control={form.control}
                    name="organization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company/Organization</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Company Ltd." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormSection>

                <FormSection title="Contact Information" icon={Phone}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Phone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+1234567890" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Phone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+1234567890" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormSection>
              </TabsContent>

              <TabsContent value="additional" className="space-y-6">
                <FormSection title="Online Presence" icon={Globe}>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="john@example.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://example.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormSection>

                <FormSection title="Address" icon={MapPin}>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Enter full address"
                            className="resize-none"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormSection>

                <FormSection title="Additional Notes" icon={FileText}>
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Add any additional information"
                            className="resize-none"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormSection>
              </TabsContent>
            </Tabs>

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