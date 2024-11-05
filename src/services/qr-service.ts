// src/services/qr-service.ts
import sharp from 'sharp'
import QRCode from 'qrcode'
import { QRCodeData, QRStyleOptions } from '@/types/qr'
import { prisma } from '@/lib/db/prisma'
import { ApiError } from '@/lib/errors'

export class QRService {
  static async create(userId: string, data: QRCodeData, style: QRStyleOptions) {
    try {
      // Create QR code record
      const qrCode = await prisma.qRCode.create({
        data: {
          userId,
          title: data.title || 'Untitled QR Code',
          type: data.type,
          content: data,
          backgroundColor: style.backgroundColor || '#FFFFFF',
          foregroundColor: style.foregroundColor || '#000000',
          logo: style.logo,
        },
      })

      // Generate QR code
      const qrImage = await this.generateQR(data, style)

      return { qrCode, image: qrImage }
    } catch (error) {
      console.error('QR creation error:', error)
      throw new ApiError('Failed to create QR code', 500)
    }
  }

  static async generateQR(data: QRCodeData, style: QRStyleOptions) {
    try {
      const qrData = this.formatQRData(data)
      
      const qrBuffer = await QRCode.toBuffer(qrData, {
        width: style.size || 400,
        margin: style.margin || 4,
        color: {
          dark: style.foregroundColor || '#000000',
          light: style.backgroundColor || '#FFFFFF',
        },
        errorCorrectionLevel: style.errorCorrection || 'M',
      })

      if (style.logo) {
        return this.addLogo(qrBuffer, style.logo, style.size || 400)
      }

      return qrBuffer
    } catch (error) {
      console.error('QR generation error:', error)
      throw new ApiError('Failed to generate QR code', 500)
    }
  }

  private static async addLogo(qrBuffer: Buffer, logoUrl: string, size: number) {
    const logoSize = Math.floor(size * 0.2) // Logo takes 20% of QR code
    const logoBuffer = await fetch(logoUrl).then(res => res.arrayBuffer())
    
    return sharp(qrBuffer)
      .composite([{
        input: Buffer.from(logoBuffer),
        gravity: 'center',
        blend: 'over',
      }])
      .toBuffer()
  }

  private static formatQRData(data: QRCodeData): string {
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
        throw new ApiError('Unsupported QR code type', 400)
    }
  }
}

// src/types/qr.ts
export interface QRCodeData {
  type: 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'location'
  title?: string
  url?: string
  text?: string
  email?: string
  subject?: string
  phone?: string
  message?: string
  ssid?: string
  password?: string
  networkType?: 'WEP' | 'WPA' | 'nopass'
  hidden?: boolean
  latitude?: number
  longitude?: number
}

export interface QRStyleOptions {
  size?: number
  margin?: number
  backgroundColor?: string
  foregroundColor?: string
  errorCorrection?: 'L' | 'M' | 'Q' | 'H'
  logo?: string
}