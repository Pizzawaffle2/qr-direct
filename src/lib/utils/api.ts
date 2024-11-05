// src/lib/utils/api.ts

import { ApiError } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
        },
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          message: 'Validation Error',
          code: 'VALIDATION_ERROR',
          errors: error.errors,
        },
      },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      error: {
        message: 'Internal Server Error',
        code: 'INTERNAL_SERVER_ERROR',
      },
    },
    { status: 500 }
  )
}

export function createSuccessResponse(data: any) {
  return NextResponse.json({ data })
}