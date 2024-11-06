// src/lib/qr-generator.ts

import QRCode from "qrcode"
import { QRCodeData, QRStyleOptions } from "@/types/qr"

export async function generateQRCode(data: QRCodeData, style: QRStyleOptions): Promise<string> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  // Generate base QR code
  const qrCodeDataUrl = await QRCode.toDataURL(formatQRData(data), {
    errorCorrectionLevel: style.errorCorrection || 'M',
    width: style.size || 400,
    margin: style.margin || 4,
    color: {
      dark: style.foregroundColor || '#000000',
      light: style.backgroundColor || '#FFFFFF',
    },
  })

  // Create base QR code image
  const qrImage = new Image()
  await new Promise((resolve) => {
    qrImage.onload = resolve
    qrImage.src = qrCodeDataUrl
  })

  // Set canvas size
  canvas.width = style.size || 400
  canvas.height = style.size || 400

  // Draw QR code
  ctx.drawImage(qrImage, 0, 0)

  // Add logo if provided
  if (style.logo) {
    const logoImg = new Image()
    await new Promise((resolve) => {
      logoImg.onload = resolve
      logoImg.src = style.logo
    })

    // Calculate logo position and size
    const logoSize = (style.size || 400) * (style.logoSize || 20) / 100
    const x = ((style.size || 400) * (style.logoPosition?.x || 50) / 100) - (logoSize / 2)
    const y = ((style.size || 400) * (style.logoPosition?.y || 50) / 100) - (logoSize / 2)

    // Apply logo effects
    ctx.save()
    
    // Position and rotation
    ctx.translate(x + logoSize / 2, y + logoSize / 2)
    ctx.rotate((style.logoRotation || 0) * Math.PI / 180)
    ctx.translate(-(x + logoSize / 2), -(y + logoSize / 2))

    // Shadow
    if (style.logoShadow?.enabled) {
      ctx.shadowColor = style.logoShadow.color || 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = style.logoShadow.blur || 0
      ctx.shadowOffsetX = style.logoShadow.x || 0
      ctx.shadowOffsetY = style.logoShadow.y || 0
    }

    // Logo background
    if (style.logoBackgroundColor) {
      ctx.fillStyle = style.logoBackgroundColor
      if (style.logoShape === 'circle') {
        ctx.beginPath()
        ctx.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2, 0, Math.PI * 2)
        ctx.fill()
      } else if (style.logoShape === 'rounded') {
        const radius = 12
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + logoSize - radius, y)
        ctx.quadraticCurveTo(x + logoSize, y, x + logoSize, y + radius)
        ctx.lineTo(x + logoSize, y + logoSize - radius)
        ctx.quadraticCurveTo(x + logoSize, y + logoSize, x + logoSize - radius, y + logoSize)
        ctx.lineTo(x + radius, y + logoSize)
        ctx.quadraticCurveTo(x, y + logoSize, x, y + logoSize - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.fill()
      } else {
        ctx.fillRect(x, y, logoSize, logoSize)
      }
    }

    // Draw logo with effects
    if (style.logoEffects) {
      const filters = []
      if (style.logoEffects.blur) filters.push(`blur(${style.logoEffects.blur}px)`)
      if (style.logoEffects.brightness) filters.push(`brightness(${style.logoEffects.brightness}%)`)
      if (style.logoEffects.contrast) filters.push(`contrast(${style.logoEffects.contrast}%)`)
      if (style.logoEffects.grayscale) filters.push('grayscale(1)')
      if (style.logoEffects.invert) filters.push('invert(1)')
      if (style.logoEffects.sepia) filters.push('sepia(1)')
      ctx.filter = filters.join(' ')
    }

    ctx.globalAlpha = style.logoOpacity || 1
    ctx.drawImage(logoImg, x, y, logoSize, logoSize)

    // Draw border
    if (style.logoBorder?.width) {
      ctx.strokeStyle = style.logoBorder.color || '#000'
      ctx.lineWidth = style.logoBorder.width
      if (style.logoBorder.style === 'dashed') {
        ctx.setLineDash([8, 4])
      } else if (style.logoBorder.style === 'dotted') {
        ctx.setLineDash([2, 2])
      }
      
      if (style.logoShape === 'circle') {
        ctx.beginPath()
        ctx.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2, 0, Math.PI * 2)
        ctx.stroke()
      } else if (style.logoShape === 'rounded') {
        const radius = 12
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + logoSize - radius, y)
        ctx.quadraticCurveTo(x + logoSize, y, x + logoSize, y + radius)
        ctx.lineTo(x + logoSize, y + logoSize - radius)
        ctx.quadraticCurveTo(x + logoSize, y + logoSize, x + logoSize - radius, y + logoSize)
        ctx.lineTo(x + radius, y + logoSize)
        ctx.quadraticCurveTo(x, y + logoSize, x, y + logoSize - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.stroke()
      } else {
        ctx.strokeRect(x, y, logoSize, logoSize)
      }
    }

    ctx.restore()
  }

  return canvas.toDataURL('image/png')
}