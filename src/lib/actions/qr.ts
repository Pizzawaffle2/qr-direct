// src/lib/actions/qr.ts

"use server"

import QRCode from "qrcode"
import { QRCodeData, QRStyleOptions } from "@/types/qr"

export async function generateQR(data: QRCodeData, style: QRStyleOptions) {
  try {
    const qrData = formatQRData(data)
    
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: style.errorCorrection || 'M',
      width: style.size || 400,
      margin: style.margin || 4,
      color: {
        dark: style.foregroundColor || '#000000',
        light: style.backgroundColor || '#ffffff'
      }
    })

    return { success: true, dataUrl: qrCodeDataUrl }
  } catch (error) {
    console.error('QR generation error:', error)
    return { success: false, error: 'Failed to generate QR code' }
  }
}

function formatQRData(data: QRCodeData): string {
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
      return `WIFI:T:${data.networkType};S:${data.ssid};P:${data.password};H:${data.hidden};`
    case 'location':
      return `geo:${data.latitude},${data.longitude}`
    default:
      throw new Error('Unsupported QR code type')
  }
}