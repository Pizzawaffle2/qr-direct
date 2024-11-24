'use client';

import {useState } from 'react';
import {QRTypeSelector } from './type-selector';
import {StyleEditor } from './style-editor';
import {Button } from '@/components/ui/button';
import {useToast } from '@/components/ui/use-toast';
import {Loader2, Download, Save } from 'lucide-react';
import {QRCodeData, QRStyleOptions } from '@/types/qr';
import QRPreview from './preview';

const QR_TYPES = {
  url: { name: 'URL', icon: 'Link' },
  text: { name: 'Text', icon: 'Type' },
  email: { name: 'Email', icon: 'Mail' },
  phone: { name: 'Phone', icon: 'Phone' },
  sms: { name: 'SMS', icon: 'MessageSquare' },
  wifi: { name: 'WiFi', icon: 'Wifi' },
  location: { name: 'Location', icon: 'MapPin' },
  event: { name: 'Event', icon: 'Calendar' },
} as const;

export function QRCreator() {
  const [qrData, setQrData] = useState<Partial<QRCodeData>>({});
  const [style, setStyle] = useState<QRStyleOptions>({
    size: 400,
    margin: 4,
    backgroundColor: '#FFFFFF',
    foregroundColor: '#000000',
    errorCorrection: 'M',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    // Validate required data before proceeding
    if (!qrData.type) {
      toast({
        title: 'Error',
        description: 'Please select a QR code type',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsGenerating(true);
      const response = await fetch('/api/qr/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: qrData, style }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate QR code: ${response.statusText}`);
      }

      const result = await response.json();

      // Only show success toast if we have a valid result
      if (result) {
        toast({
          title: 'Success',
          description: 'QR code generated successfully',
        });
      }
    } catch (error) {
      console.error('QR generation error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate QR code',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <QRTypeSelector
        selectedType={qrData.type || ''}
        types={QR_TYPES}
        onChange={(type) => setQrData((prev) => ({ ...prev, type: type as QRCodeData['type'] }))}
      />
      <StyleEditor value={style} onChange={setStyle} />
      <QRPreview data={qrData} style={style} />
      <div className="flex gap-2">
        <Button onClick={handleGenerate} disabled={isGenerating || !qrData.type}>
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Generate QR Code
        </Button>
      </div>
    </div>
  );
}
