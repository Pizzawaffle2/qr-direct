// src/app/api/qr/[id]/route.ts

import {NextResponse } from 'next/server';
import {getServerSession } from 'next-auth';
import {authOptions } from '@/lib/auth';
import {prisma } from '@/lib/db/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const qrCode = await prisma.qRCode.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        analytics: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    return NextResponse.json(qrCode);
  } catch (error) {
    console.error('QR fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch QR code' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const qrCode = await prisma.qRCode.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('QR deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete QR code' }, { status: 500 });
  }
}
