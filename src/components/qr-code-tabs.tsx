// File: src/components/qr-code-tabs.tsx
"use client"

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
import { Card, CardContent } from '@/components/ui/card';

interface QRFormData {
  title: string;
  type: string;
  [key: string]: any;
}

const tabs = [
  { id: 'url', label: 'URL', icon: Globe },
  { id: 'vcard', label: 'VCard', icon: User },
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'phone', label: 'Phone', icon: Phone },
] as const;

type TabType = typeof tabs[number]['id'];

interface FormSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
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
);

export function QRCodeTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('url');
  const { generateQRCode, isGenerating } = useQRCode();
  const { addToHistory } = useHistoryStore();

  const handleGenerate = async (data: QRFormData) => {
    try {
      const qrCode = await generateQRCode(data);
      if (qrCode) {
        addToHistory({
          id: crypto.randomUUID(),
          title: data.title || `${data.type.toUpperCase()} QR Code`,
          url: qrCode,
          type: data.type,
          created: new Date().toISOString(),
          ...data,
        });
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="w-full">
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
              <TabsContent value={activeTab} className="mt-0 data-[state=active]:block">
                <FormSection 
                  title={`${tabs.find(t => t.id === activeTab)?.label} QR Code`} 
                  icon={tabs.find(t => t.id === activeTab)?.icon || Globe}
                >
                  {activeTab === 'url' && (
                    <URLForm onSubmit={(data) => handleGenerate({ ...data, type: 'url' })} />
                  )}
                  {activeTab === 'vcard' && (
                    <VCardForm onSubmit={(data) => handleGenerate({ ...data, type: 'vcard' })} />
                  )}
                  {activeTab === 'wifi' && (
                    <WiFiForm onSubmit={(data) => handleGenerate({ ...data, type: 'wifi' })} />
                  )}
                  {activeTab === 'email' && (
                    <EmailForm onSubmit={(data) => handleGenerate({ ...data, type: 'email' })} />
                  )}
                  {activeTab === 'phone' && (
                    <PhoneForm onSubmit={(data) => handleGenerate({ ...data, type: 'phone' })} />
                  )}
                </FormSection>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative">
          <QRPreview isGenerating={isGenerating} />
        </div>
      </div>
    </Tabs>
  );
}