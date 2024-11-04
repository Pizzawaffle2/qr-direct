// File: src/app/api/qr/route.ts
import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { data, type, style } = await req.json();

    const qrOptions = {
      errorCorrectionLevel: style?.errorCorrectionLevel || 'M',
      margin: style?.margin || 4,
      color: {
        dark: style?.foregroundColor || '#000000',
        light: style?.backgroundColor || '#FFFFFF',
      },
    };

    let content = '';
    switch (type) {
      case 'url':
        content = data.url;
        break;
      case 'vcard':
        content = generateVCardContent(data);
        break;
      // Add other cases for different QR types
    }

    const qrCodeDataURL = await QRCode.toDataURL(content, qrOptions);
    return NextResponse.json({ url: qrCodeDataURL });
  } catch (error) {
    console.error('QR generation error:', error);
    return new Response('Failed to generate QR code', { status: 500 });
  }
}