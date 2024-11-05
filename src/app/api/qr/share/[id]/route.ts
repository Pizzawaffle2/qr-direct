
// src/app/api/qr/share/[id]/route.ts

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      // Increment scan count
      await prisma.analytics.create({
        data: {
          qrCodeId: params.id,
          scans: 1,
          location: req.headers.get("cf-ipcountry") || null,
          device: req.headers.get("user-agent") || null,
        },
      })
  
      const qrCode = await prisma.qRCode.findUnique({
        where: { id: params.id },
      })
  
      if (!qrCode) {
        return NextResponse.json({ error: "QR code not found" }, { status: 404 })
      }
  
      // Handle redirect based on QR type
      switch (qrCode.type) {
        case "url":
          return NextResponse.redirect(qrCode.content.url)
        case "text":
        case "wifi":
        case "location":
          return NextResponse.json(qrCode.content)
        default:
          return NextResponse.json({ error: "Invalid QR type" }, { status: 400 })
      }
    } catch (error) {
      console.error("QR share error:", error)
      return NextResponse.json(
        { error: "Failed to process QR code" },
        { status: 500 }
      )
    }
  }