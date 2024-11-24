// src/app/api/qr/analytics/route.ts

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const qrId = searchParams.get('qrId');
    const period = searchParams.get('period') || '7d';

    const periodMap = {
      '7d': -7,
      '30d': -30,
      '90d': -90,
    };

    const analytics = await prisma.analytics.findMany({
      where: {
        qrCodeId: qrId!,
        date: {
          gte: new Date(
            new Date().setDate(new Date().getDate() + periodMap[period as keyof typeof periodMap])
          ),
        },
      },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
