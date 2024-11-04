// src/app/api/qr/preview/route.ts

import { NextResponse } from 'next/server'
import { QRGenerator } from '@/services/qr-generator'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data, style } = body

    if (!data || !style) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const buffer = await QRGenerator.generatePreview(data, style)
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}