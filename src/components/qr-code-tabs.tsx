// File: src/components/qr-code-tabs.tsx
'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { URLForm } from './forms/url-form';
import { VCardForm } from './forms/vcard-form';
import { WiFiForm } from './forms/wifi-form';
import { EmailForm } from './forms/email-form';
import { PhoneForm } from './forms/phone-form';
import { QRPreview } from './qr-code/preview';
import { useQRCode } from '@/hooks/use-qr-code';
import { useHistoryStore } from '@/lib/store/history-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, User, Wifi, Mail, Phone } from 'lucide-react';

export function QRCodeTabs() {
  const [activeTab, setActiveTab] = useState('url');
  const { generateQRCode, isGenerating } = useQRCode();
  const { addToHistory } = useHistoryStore();

  const tabs = [
    { id: 'url', label: 'URL', icon: Globe },
    { id: 'vcard', label: 'VCard', icon: User },
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'phone', label: 'Phone', icon: Phone },
  ];

  const handleGenerate = async (data: any, type: string) => {
    try {
      const qrCode = await generateQRCode(data, type);
      if (qrCode) {
        addToHistory({
          id: Date.now().toString(),
          title: `${type.toUpperCase()} QR Code`,
          url: qrCode,
          type,
          created: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto mb-8">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="url" className="mt-0">
                <URLForm onSubmit={(data) => handleGenerate(data, 'url')} />
              </TabsContent>

              <TabsContent value="vcard" className="mt-0">
                <VCardForm onSubmit={(data) => handleGenerate(data, 'vcard')} />
              </TabsContent>

              <TabsContent value="wifi" className="mt-0">
                <WiFiForm onSubmit={(data) => handleGenerate(data, 'wifi')} />
              </TabsContent>

              <TabsContent value="email" className="mt-0">
                <EmailForm onSubmit={(data) => handleGenerate(data, 'email')} />
              </TabsContent>

              <TabsContent value="phone" className="mt-0">
                <PhoneForm onSubmit={(data) => handleGenerate(data, 'phone')} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative">
          <QRPreview isLoading={isGenerating} />
        </div>
      </div>
    </Tabs>
  );
}