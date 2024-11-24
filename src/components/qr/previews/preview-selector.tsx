// src/components/qr/preview-selector.tsx

import {QRCodeData } from '@/types/qr';
import {URLPreview } from './previews/url-preview';
import {WifiPreview } from './previews/wifi-preview';
import {EmailPreview } from './previews/email-preview';
import {PhonePreview } from './previews/phone-preview';
import {SMSPreview } from './previews/sms-preview';
import {LocationPreview } from './previews/location-preview';
import {VCardPreview } from './previews/vcard-preview';

interface PreviewSelectorProps {
  data: Partial<QRCodeData>;
}

export function PreviewSelector({ data }: PreviewSelectorProps) {
  switch (data.type) {
    case 'url':
      return <URLPreview data={data as any} />;
    case 'wifi':
      return <WifiPreview data={data as any} />;
    case 'email':
      return <EmailPreview data={data as any} />;
    case 'phone':
      return <PhonePreview data={data as any} />;
    case 'sms':
      return <SMSPreview data={data as any} />;
    case 'location':
      return <LocationPreview data={data as any} />;
    case 'vcard':
      return <VCardPreview data={data as any} />;
    default:
      return null;
  }
}
