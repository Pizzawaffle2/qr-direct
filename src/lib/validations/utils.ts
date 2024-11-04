// src/lib/validations/utils.ts

import { ZodError } from "zod"
import { ApiError } from "@/lib/errors"
import * as schemas from "./config"

export type ValidationResult<T> = {
  success: boolean
  data?: T
  error?: string
}

export async function validateData<T>(
  schema: typeof schemas[keyof typeof schemas],
  data: unknown
): Promise<ValidationResult<T>> {
  try {
    const validatedData = await schema.parseAsync(data)
    return {
      success: true,
      data: validatedData as T,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      }
    }
    return {
      success: false,
      error: "Validation failed",
    }
  }
}

export function validateApiRequest<T>(
  schema: typeof schemas[keyof typeof schemas]
) {
  return async (req: Request) => {
    try {
      const body = await req.json()
      const result = await validateData<T>(schema, body)
      
      if (!result.success) {
        throw new ApiError(result.error || "Validation failed", 400)
      }
      
      return result.data as T
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError("Invalid request body", 400)
    }
  }
}

export function validateQueryParams<T>(
  schema: typeof schemas[keyof typeof schemas],
  searchParams: URLSearchParams
) {
  const params = Object.fromEntries(searchParams.entries())
  return validateData<T>(schema, params)
}