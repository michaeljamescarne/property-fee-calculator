/**
 * Centralized Error Handling Utility
 * Provides consistent error handling across the application
 */

import { NextResponse } from "next/server";

export interface ApiError {
  error: string;
  message?: string;
  details?: unknown;
  code?: string;
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

/**
 * Handle API errors and return standardized response
 */
export function handleApiError(error: unknown): NextResponse<ApiError> {
  // Log error for debugging
  logError(error);

  // Handle known AppError instances
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  // Handle validation errors (Zod)
  if (error && typeof error === "object" && "issues" in error) {
    return NextResponse.json(
      {
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: error,
      },
      { status: 400 }
    );
  }

  // Handle unknown errors
  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";

  return NextResponse.json(
    {
      error: errorMessage,
      code: "INTERNAL_ERROR",
    },
    { status: 500 }
  );
}

/**
 * Log error with context
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
  };

  // In production, you might want to send this to a logging service
  // For now, we'll use console.error
  console.error("[ERROR]", JSON.stringify(errorInfo, null, 2));
}

/**
 * Wrapper for API route handlers with error handling
 */
export function withErrorHandler<T>(
  handler: (request: Request) => Promise<T>
) {
  return async (request: Request): Promise<T | NextResponse<ApiError>> => {
    try {
      return await handler(request);
    } catch (error) {
      return handleApiError(error);
    }
  };
}



