// src/app/(dashboard)/dashboard/qr-codes/new/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRContentForm } from "@/components/qr/content-form";
import { QRStylePicker } from "@/components/qr/style-picker";
import QRPreview from "@/components/qr/preview";
import { StyleEditor } from "@/components/qr/style-editor";
import { ChevronLeft, Download, Share2 } from "lucide-react";
import Link from "next/link";
import { 
  Link as LinkIcon, 
  Type, 
  Mail, 
  Phone, 
  MessageSquare, 
  Wifi, 
  Contact, 
  MapPin,
  FileText,
  User,
  QrCode,
  MessageSquare as Sms
} from 'lucide-react';
import { QR_STYLE_PRESETS } from '@/lib/qr-presets';
import type { QRCodeData, QRStyleOptions } from "@/types/qr";

const QR_CODE_TYPES = {
  url: {
    name: 'URL',
    description: 'Create QR code for website links',
    icon: LinkIcon
  },
  text: {
    name: 'Text',
    description: 'Create QR code for plain text',
    icon: Type
  },
  email: {
    name: 'Email',
    description: 'Create QR code for email address',
    icon: Mail
  },
  phone: {
    name: 'Phone',
    description: 'Create QR code for phone numbers',
    icon: Phone
  },
  sms: {
    name: 'SMS',
    description: 'Create QR code for text messages',
    icon: MessageSquare
  },
  wifi: {
    name: 'WiFi',
    description: 'Create QR code for WiFi networks',
    icon: Wifi
  },
  vcard: {
    name: 'vCard',
    description: 'Create QR code for contact information',
    icon: Contact
  },
  location: {
    name: 'Location',
    description: 'Create QR code for geographic locations',
    icon: MapPin
  }
} as const;

type QRCodeType = keyof typeof QR_CODE_TYPES;

const getInitialData = (type: QRCodeType): QRCodeData => {
  switch (type) {
    case 'url':
      return { type, url: '' };
    case 'text':
      return { type, text: '' };
    case 'email':
      return { type, email: '' };
    case 'phone':
      return { type, phone: '' };
    case 'sms':
      return { type, phone: '' };
    case 'wifi':
      return { type, ssid: '', networkType: 'WPA', hidden: false };
    case 'vcard':
      return { type, firstName: '' };
    case 'location':
      return { type, latitude: 0, longitude: 0 };
  }
};

const getQRTypeInfo = (type: string) => {
  switch (type) {
    case 'url':
      return Link;
    case 'text':
      return FileText;
    case 'email':
      return Mail;
    case 'phone':
      return Phone;
    case 'sms':
      return Sms;
    case 'wifi':
      return Wifi;
    case 'vcard':
      return User;
    case 'location':
      return MapPin;
    default:
      return QrCode;
  }
};

export default function NewQRCodePage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<"content" | "style">("content");
  const [styleMode, setStyleMode] = useState<"templates" | "custom">("templates");
  const [type, setType] = useState<QRCodeType>("url");
  const [data, setData] = useState<QRCodeData>(getInitialData("url"));
  const [style, setStyle] = useState<QRStyleOptions>(QR_STYLE_PRESETS[0].style);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTypeChange = (newType: QRCodeType) => {
    setType(newType);
    setData(getInitialData(newType));
  };

  const handleSave = async () => {
    setIsGenerating(true);
    try {
      // Add your save logic here
      router.push("/dashboard/qr-codes");
    } catch (error) {
      console.error("Failed to save QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50 dark:bg-gray-900/50">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container flex h-16 items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="flex items-center gap-2"
          >
            <Link href="/dashboard/qr-codes">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Create New QR Code</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button size="sm" disabled={isGenerating} onClick={handleSave}>
              {isGenerating ? "Saving..." : "Save QR Code"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Editor */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6">
              <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as typeof currentTab)}>
                <TabsList className="mb-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6">
                  {/* QR Type Selection */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.entries(QR_CODE_TYPES) as [QRCodeType, typeof QR_CODE_TYPES[QRCodeType]][]).map(([key, value]) => {
                      const Icon = value.icon;
                      return (
                        <Button
                          key={key}
                          variant={type === key ? "default" : "outline"}
                          className="h-auto flex-col py-4 px-2"
                          onClick={() => handleTypeChange(key)}
                        >
                          <div className={`${type === key ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className="mt-2">{value.name}</span>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Content Form */}
                  <div className="mt-6">
                    <QRContentForm
                      type={type}
                      initialData={data}
                      onChange={setData}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="style">
                  <div className="space-y-6">
                    <Tabs value={styleMode} onValueChange={(v) => setStyleMode(v as typeof styleMode)}>
                      <TabsList>
                        <TabsTrigger value="templates">Templates</TabsTrigger>
                        <TabsTrigger value="custom">Custom</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    {styleMode === "templates" ? (
                      <QRStylePicker
                        presets={QR_STYLE_PRESETS}
                        value={style}
                        onChange={setStyle}
                        onCustomize={(templateStyle) => {
                          setStyle(templateStyle);
                          setStyleMode("custom");
                        }}
                      />
                    ) : (
                      <StyleEditor
                        value={style}
                        onChange={setStyle}
                      />
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div>
            <div className="sticky top-24">
              <Card className="p-6">
                <div className="mb-4 text-lg font-semibold">Preview</div>
                <QRPreview
                  data={data}
                  style={style}
                />
                <div className="mt-6 space-y-2">
                  <Button className="w-full" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download PNG
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share QR Code
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}