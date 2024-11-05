// src/app/api/qr/list/route.ts
export async function GET(req: Request) {
    try {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
  
      const qrCodes = await prisma.qRCode.findMany({
        where: { userId: session.user.id },
        orderBy: { created: 'desc' },
      })
  
      return NextResponse.json(qrCodes)
    } catch (error) {
      console.error('QR list error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch QR codes' },
        { status: 500 }
      )
    }
  }