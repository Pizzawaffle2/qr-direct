// src/lib/api-error.ts

export enum ApiErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

interface ApiErrorDetails {
  [key: string]: unknown;
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: ApiErrorCode = ApiErrorCode.INTERNAL_SERVER_ERROR,
    public readonly details?: ApiErrorDetails
  ) {
    super(message);
    this.name = 'ApiError';
    
    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  public toJSON() {
    return {
      error: {
        message: this.message,
        code: this.code,
        statusCode: this.statusCode,
        ...(this.details && { details: this.details }),
      },
    };
  }

  // Static factory methods for common error types
  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(401, message, ApiErrorCode.UNAUTHORIZED);
  }

  static badRequest(message: string, details?: ApiErrorDetails): ApiError {
    return new ApiError(400, message, ApiErrorCode.BAD_REQUEST, details);
  }

  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(404, message, ApiErrorCode.NOT_FOUND);
  }

  static methodNotAllowed(message = 'Method not allowed'): ApiError {
    return new ApiError(405, message, ApiErrorCode.METHOD_NOT_ALLOWED);
  }

  static internal(message = 'Internal server error'): ApiError {
    return new ApiError(500, message, ApiErrorCode.INTERNAL_SERVER_ERROR);
  }
}

// Usage example:
/*
try {
  // Some code that might throw
} catch (error) {
  if (!session) {
    throw ApiError.unauthorized('User session not found');
  }
  
  if (!data) {
    throw ApiError.badRequest('Invalid input', { field: 'missing_field' });
  }
  
  throw ApiError.internal('Something went wrong');
}
*/
