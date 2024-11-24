// File: src/app/api/templates/preview/route.ts
import {NextResponse } from 'next/server';
import {getServerSession } from 'next-auth';
import {authOptions } from '@/lib/auth';
import {PreviewGenerator } from '@/services/preview-generator';
import type { QRStyle } from '@/lib/types/qr-styles';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { style }: { style: QRStyle } = await req.json();

    // Generate preview with smaller size for thumbnails
    const preview = await PreviewGenerator.generatePreview({
      style,
      size: 150, // Smaller size for thumbnails
    });

    return NextResponse.json({ preview });
  } catch (error) {
    console.error('Preview generation error:', error);
    return new Response('Failed to generate preview', { status: 500 });
  }
}
