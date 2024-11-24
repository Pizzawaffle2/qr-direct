import {NextResponse } from 'next/server';
import QRCode from 'qrcode';
import {getServerSession } from 'next-auth';
import {authOptions } from '@/lib/auth';
import {QRStyleOptions } from '@/types/qr';

interface QRGenerationRequest {
  data: any;
  type: 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard' | 'location';
  style: QRStyleOptions;
}

// Helper functions for QR content generation
function generateVCardContent(data: any): string {
  const {
    firstName = '',
    lastName = '',
    email = '',
    phone = '',
    company = '',
    title = '',
    address = '',
    website = '',
  } = data;

  return `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName}
FN:${firstName} ${lastName}
${email ? `EMAIL:${email}` : ''}
${phone ? `TEL:${phone}` : ''}
${company ? `ORG:${company}` : ''}
${title ? `TITLE:${title}` : ''}
${address ? `ADR:;;${address}` : ''}
${website ? `URL:${website}` : ''}
END:VCARD`;
}

function generateWiFiContent(data: any): string {
  const { ssid, password, networkType = 'WPA', hidden = false } = data;
  return `WIFI:T:${networkType};S:${ssid};P:${password};H:${hidden};`;
}

function generateEmailContent(data: any): string {
  const { email, subject = '', body = '' } = data;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function generateSMSContent(data: any): string {
  const { phone, message = '' } = data;
  return `sms:${phone}${message ? `?body=${encodeURIComponent(message)}` : ''}`;
}

function generateLocationContent(data: any): string {
  const { latitude, longitude, query } = data;
  if (query) {
    return `geo:0,0?q=${encodeURIComponent(query)}`;
  }
  return `geo:${latitude},${longitude}`;
}

function validateQRContent(content: string, type: string): boolean {
  switch (type) {
    case 'url':
      try {
        new URL(content);
        return true;
      } catch {
        return false;
      }
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.split(':')[1]);
    case 'phone':
    case 'sms':
      return /^\+?[\d\s-()]+$/.test(content.split(':')[1]);
    default:
      return content.length > 0;
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { data, type, style }: QRGenerationRequest = await req.json();

    // Configure QR code options
    const qrOptions = {
      errorCorrectionLevel: style?.errorCorrection || 'M',
      margin: style?.margin || 4,
      color: {
        dark: style?.foregroundColor || '#000000',
        light: style?.backgroundColor || '#FFFFFF',
      },
      width: style?.size || 1024,
      // Quality options
      rendererOpts: {
        quality: 1,
      },
    };

    // Generate content based on type
    let content = '';
    switch (type) {
      case 'url':
        content = data.url;
        break;
      case 'text':
        content = data.text;
        break;
      case 'email':
        content = generateEmailContent(data);
        break;
      case 'phone':
        content = `tel:${data.phone}`;
        break;
      case 'sms':
        content = generateSMSContent(data);
        break;
      case 'wifi':
        content = generateWiFiContent(data);
        break;
      case 'vcard':
        content = generateVCardContent(data);
        break;
      case 'location':
        content = generateLocationContent(data);
        break;
      default:
        throw new Error('Unsupported QR code type');
    }

    // Validate content
    if (!validateQRContent(content, type)) {
      return new Response('Invalid QR code content', { status: 400 });
    }

    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(content, qrOptions);

    // Return the data URL
    return NextResponse.json({
      url: qrCodeDataURL,
      content, // Include content for debugging/verification
      type,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('QR generation error:', error);

    if (error instanceof Error) {
      return new Response(error.message, { status: 400 });
    }

    return new Response('Failed to generate QR code', { status: 500 });
  }
}

// Optional: Add GET method to retrieve QR code generation history
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Implement QR code history retrieval logic here
    return NextResponse.json({ message: 'Not implemented' });
  } catch (error) {
    console.error('QR history retrieval error:', error);
    return new Response('Failed to retrieve QR codes', { status: 500 });
  }
}
