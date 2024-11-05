// src/app/api/qr/create/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { QRService } from '@/services/qr-service'
import { handleApiError, createSuccessResponse } from '@/lib/utils/api'
import { ApiError } from '@/lib/errors'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw ApiError.Unauthorized()
    }

    const body = await req.json()
    const result = await QRService.create(session.user.id, body.data, body.style)
    
    return createSuccessResponse(result)
  } catch (error) {
    return handleApiError(error)
  }
}