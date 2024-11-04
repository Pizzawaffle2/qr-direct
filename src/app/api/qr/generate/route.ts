// src/app/api/qr/generate/route.ts

import { withApiRateLimit } from '@/middleware'
import { NextResponse } from 'next/server'

async function handler(req: Request) {
  // Your API logic here
  return NextResponse.json({ success: true })
}

export const POST = withApiRateLimit(handler)