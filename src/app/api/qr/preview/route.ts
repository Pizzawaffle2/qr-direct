import { NextResponse } from "next/server"
import { QRGenerator } from "@/services/qr-generator";
import { QRStyleOptions } from "@/lib/types/qr-styles";
import { QRCodeData } from "@/lib/types/qr-code"

export async function POST(req: Request) {
  try {
    const { data, style } = await req.json() as {
      data: Partial<QRCodeData>
      style: QRStyleOptions
    }

    // Validate required data based on QR type
    if (!data.type) {
      return new NextResponse("QR code type is required", { status: 400 })
    }

    // Type-specific validation
    switch (data.type) {
      case 'url':
        if (!data.url) {
          return new NextResponse("URL is required", { status: 400 })
        }
        break
      case 'phone':
        if (!data.number) {
          return new NextResponse("Phone number is required", { status: 400 })
        }
        break
      case 'email':
        if (!data.email) {
          return new NextResponse("Email is required", { status: 400 })
        }
        break
      case 'wifi':
        if (!data.ssid) {
          return new NextResponse("Network name is required", { status: 400 })
        }
        break
      case 'vcard':
        if (!data.firstName || !data.lastName) {
          return new NextResponse("Name is required", { status: 400 })
        }
        break
    }

    // Generate preview
    const qrCode = await QRGenerator.generatePreview(data, style)

    // Convert SVG to PNG if requested
    if (style.format === 'png') {
      // Implement PNG conversion if needed
    }

    return new NextResponse(qrCode, {
      headers: {
        'Content-Type': style.format === 'png' ? 'image/png' : 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error("Preview generation error:", error)
    return new NextResponse("Failed to generate preview", { status: 500 })
  }
}

export const runtime = 'edge'