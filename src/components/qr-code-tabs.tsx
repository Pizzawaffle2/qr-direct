// src/components/qr-code-tabs.tsx

'use client';

import {useState } from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {Card } from '@/components/ui/card';
import {Link, FileText, Wifi, Mail, Phone, MessageSquare, MapPin, Contact } from 'lucide-react';
import {QRCodeData, QRStyleOptions } from '@/types/qr';
import {QRPreview } from '@/components/qr/preview';
import {URLForm } from '@/components/qr/forms/url-form';
import {TextForm } from '@/components/qr/forms/text-form';
import {WifiForm } from '@/components/qr/forms/wifi-form';
import {EmailForm } from '@/components/qr/forms/email-form';
import {PhoneForm } from '@/components/qr/forms/phone-form';
import {SMSForm } from '@/components/qr/forms/sms-form';
import {LocationForm } from '@/components/qr/forms/location-form';
import {VCardForm } from '@/components/qr/forms/vcard-form';
import {StyleEditor } from '@/components/qr/style-editor';

const QR_TYPES = [
  { id: 'url', icon: Link, label: 'URL', component: URLForm },
  { id: 'text', icon: FileText, label: 'Text', component: TextForm },
  { id: 'wifi', icon: Wifi, label: 'WiFi', component: WifiForm },
  { id: 'email', icon: Mail, label: 'Email', component: EmailForm },
  { id: 'phone', icon: Phone, label: 'Phone', component: PhoneForm },
  { id: 'sms', icon: MessageSquare, label: 'SMS', component: SMSForm },
  { id: 'location', icon: MapPin, label: 'Location', component: LocationForm },
  { id: 'vcard', icon: Contact, label: 'vCard', component: VCardForm },
] as const;

export function QRCodeTabs() {
  const [activeTab, setActiveTab] = useState<string>('url');
  const [qrData, setQrData] = useState<Partial<QRCodeData>>({ type: 'url' });
  const [qrStyle, setQrStyle] = useState<QRStyleOptions>({
    size: 300,
    margin: 4,
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    errorCorrection: 'M',
  });

  const ActiveForm = QR_TYPES.find((type) => type.id === activeTab)?.component;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setQrData({ type: value });
  };

  const handleDataChange = (data: Partial<QRCodeData>) => {
    setQrData({ ...data, type: activeTab });
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-8">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid h-auto grid-cols-4 gap-2 lg:grid-cols-8">
            {QR_TYPES.map(({ id, icon: Icon, label }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-blue-500/20"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">
            {ActiveForm && (
              <Card className="p-6">
                <ActiveForm value={qrData} onChange={handleDataChange} />
              </Card>
            )}
          </div>
        </Tabs>

        <Card className="p-6">
          <StyleEditor value={qrStyle} onChange={setQrStyle} />
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <QRPreview data={qrData} style={qrStyle} />
      </div>
    </div>
  );
}
