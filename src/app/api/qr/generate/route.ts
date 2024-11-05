// src/app/api/qr/generate/route.ts

import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import sharp from 'sharp'
import { ApiError } from '@/lib/errors'

export async function POST(req: Request) {
  try {
    const { data, style } = await req.json()

    // Generate QR code buffer
    const qrBuffer = await QRCode.toBuffer(formatQRData(data), {
      errorCorrectionLevel: style.errorCorrection || 'M',
      width: style.size || 400,
      margin: style.margin || 4,
      color: {
        dark: style.darkColor || '#000000',
        light: style.lightColor || '#ffffff'
      }
    })

    // Apply styling with sharp
    let qrImage = sharp(qrBuffer)

    // Add logo if provided
    if (style.logo) {
      const logoBuffer = await fetch(style.logo).then(res => res.arrayBuffer())
      const logoSize = Math.floor(style.size * 0.2) // Logo takes 20% of QR code
      
      qrImage = qrImage.composite([{
        input: Buffer.from(logoBuffer),
        gravity: 'center',
        blend: 'over',
      }])
    }

    // Convert to PNG buffer
    const finalBuffer = await qrImage.png().toBuffer()

    return new NextResponse(finalBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': finalBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('QR generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}

function formatQRData(data: any): string {
  switch (data.type) {
    case 'url':
      return data.url
    case 'text':
      return data.text
    case 'email':
      return `mailto:${data.email}${data.subject ? `?subject=${data.subject}` : ''}`
    case 'phone':
      return `tel:${data.phone}`
    case 'sms':
      return `sms:${data.phone}${data.message ? `?body=${data.message}` : ''}`
    case 'wifi':
      return `WIFI:T:${data.networkType};S:${data.ssid};P:${data.password};H:${data.hidden ? 'true' : 'false'};`
    case 'location':
      return `geo:${data.latitude},${data.longitude}`
    default:
      throw new ApiError('Unsupported QR code type', 400)
  }
}