// src/lib/errors/index.ts

export class ApiError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }

  static BadRequest(message: string = 'Bad Request', code: string = 'BAD_REQUEST') {
    return new ApiError(message, 400, code);
  }

  static Unauthorized(message: string = 'Unauthorized', code: string = 'UNAUTHORIZED') {
    return new ApiError(message, 401, code);
  }

  static Forbidden(message: string = 'Forbidden', code: string = 'FORBIDDEN') {
    return new ApiError(message, 403, code);
  }

  static NotFound(message: string = 'Not Found', code: string = 'NOT_FOUND') {
    return new ApiError(message, 404, code);
  }

  static TooManyRequests(
    message: string = 'Too Many Requests',
    code: string = 'RATE_LIMIT_EXCEEDED'
  ) {
    return new ApiError(message, 429, code);
  }

  static InternalServer(
    message: string = 'Internal Server Error',
    code: string = 'INTERNAL_SERVER_ERROR'
  ) {
    return new ApiError(message, 500, code);
  }
}

// Custom error for subscription-related errors
export class SubscriptionError extends ApiError {
  constructor(message: string, statusCode: number = 403) {
    super(message, statusCode, 'SUBSCRIPTION_ERROR');
    this.name = 'SubscriptionError';
  }
}

// Custom error for validation errors
export class ValidationError extends ApiError {
  public errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>) {
    super('Validation Error', 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

// Error handling middleware
export async function withErrorHandler(
  handler: () => Promise<any>
): Promise<{ data?: any; error?: ApiError }> {
  try {
    const data = await handler();
    return { data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { error };
    }

    console.error('Unhandled error:', error);
    return {
      error: new ApiError('An unexpected error occurred', 500, 'INTERNAL_SERVER_ERROR'),
    };
  }
}

// Response helper
export function createErrorResponse(error: ApiError) {
  return new Response(
    JSON.stringify({
      error: {
        message: error.message,
        code: error.code,
        ...(error instanceof ValidationError && { errors: error.errors }),
      },
    }),
    {
      status: error.statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
