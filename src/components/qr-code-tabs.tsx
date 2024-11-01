// File: src/components/qr-code-tabs.tsx
"use client"

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { URLForm } from './forms/url-form'
import { VCardForm } from './forms/vcard-form'
import { WiFiForm } from './forms/wifi-form'
import { EmailForm } from './forms/email-form'
import { PhoneForm } from './forms/phone-form'
import { QRPreview } from './qr-code/preview'
import { useQRCode } from '@/hooks/use-qr-code'
import { useHistoryStore } from '@/lib/store/history-store'
import { motion } from 'framer-motion'
import { Globe, User, Wifi, Mail, Phone } from 'lucide-react'

export function QRCodeTabs() {
  const [activeTab, setActiveTab] = useState('url')
  const { generateQRCode, isGenerating } = useQRCode()
  const { addToHistory } = useHistoryStore()

  const tabs = [
    { id: 'url', label: 'URL', icon: Globe },
    { id: 'vcard', label: 'VCard', icon: User },
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'phone', label: 'Phone', icon: Phone },
  ]

  const handleGenerate = async (data: any, type: string) => {
    try {
      const qrCode = await generateQRCode(data, type)
      if (qrCode) {
        addToHistory({
          id: Date.now().toString(),
          title: `${type.toUpperCase()} QR Code`,
          url: qrCode,
          type,
          created: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  return (
    <div className="w-full">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full max-w-screen-xl mx-auto"
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5 bg-slate-900/50">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="mt-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="grid-cols-1 md:grid-cols-[1fr,400px] gap-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-screen-xl"
          >
            <TabsContent 
              value="url" 
              className="mt-0 data-[state=active]:flex"
            >
              <URLForm onSubmit={(data) => handleGenerate(data, 'url')} />
            </TabsContent>

            <TabsContent 
              value="vcard" 
              className="mt-0 data-[state=active]:flex"
            >
              <VCardForm onSubmit={(data) => handleGenerate(data, 'vcard')} />
            </TabsContent>

            <TabsContent 
              value="wifi" 
              className="mt-0 data-[state=active]:flex"
            >
              <WiFiForm onSubmit={(data) => handleGenerate(data, 'wifi')} />
            </TabsContent>

            <TabsContent 
              value="email" 
              className="mt-0 data-[state=active]:flex"
            >
              <EmailForm onSubmit={(data) => handleGenerate(data, 'email')} />
            </TabsContent>

            <TabsContent 
              value="phone" 
              className="mt-0 data-[state=active]:flex"
            >
              <PhoneForm onSubmit={(data) => handleGenerate(data, 'phone')} />
            </TabsContent>
          </motion.div>
        </div>
      </Tabs>
    </div>
  )
}