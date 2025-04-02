/**
 * Error handling utilities for the application
 * Defines custom error types and common error handling patterns
 */

/**
 * Error type enumeration for categorizing errors
 */
export enum ErrorType {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  DATABASE = 'DATABASE',
  AI_MODEL = 'AI_MODEL',
  RATE_LIMIT = 'RATE_LIMIT',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Base application error class
 */
export class AppError extends Error {
  public status: number;
  public details?: any;
  public errorType: ErrorType;

  constructor(message: string, errorType: ErrorType = ErrorType.UNKNOWN, status: number = 500, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.details = details;
    this.errorType = errorType;
  }
}

/**
 * Error for AI model failures
 */
export class AIModelError extends AppError {
  constructor(message: string, details?: any) {
    super(`AI model error: ${message}`, ErrorType.AI_MODEL, 500, details);
    this.name = 'AIModelError';
  }
}

/**
 * Error for API rate limit issues
 */
export class RateLimitError extends AppError {
  constructor(message: string, details?: any) {
    super(`Rate limit exceeded: ${message}`, ErrorType.RATE_LIMIT, 429, details);
    this.name = 'RateLimitError';
  }
}

/**
 * Error for authentication failures
 */
export class AuthenticationError extends AppError {
  constructor(message: string, details?: any) {
    super(`Authentication error: ${message}`, ErrorType.AUTHENTICATION, 401, details);
    this.name = 'AuthenticationError';
  }
}

/**
 * Error for authorization failures
 */
export class AuthorizationError extends AppError {
  constructor(message: string, details?: any) {
    super(`Authorization error: ${message}`, ErrorType.AUTHORIZATION, 403, details);
    this.name = 'AuthorizationError';
  }
}

/**
 * Error for validation failures
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(`Validation error: ${message}`, ErrorType.VALIDATION, 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Error for not found resources
 */
export class NotFoundError extends AppError {
  constructor(message: string, details?: any) {
    super(`Not found: ${message}`, ErrorType.RESOURCE_NOT_FOUND, 404, details);
    this.name = 'NotFoundError';
  }
}

/**
 * Alias for NotFoundError (ResourceNotFoundError)
 */
export class ResourceNotFoundError extends NotFoundError {
  constructor(message: string, details?: any) {
    super(message, details);
    this.name = 'ResourceNotFoundError';
  }
}

/**
 * Error for database operation failures
 */
export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super(`Database error: ${message}`, ErrorType.DATABASE, 500, details);
    this.name = 'DatabaseError';
  }
}

/**
 * Error for external service failures
 */
export class ExternalServiceError extends AppError {
  constructor(message: string, details?: any) {
    super(`External service error: ${message}`, ErrorType.EXTERNAL_SERVICE, 500, details);
    this.name = 'ExternalServiceError';
  }
}

/**
 * Error for business logic failures
 */
export class BusinessLogicError extends AppError {
  constructor(message: string, details?: any) {
    super(`Business logic error: ${message}`, ErrorType.UNKNOWN, 400, details);
    this.name = 'BusinessLogicError';
  }
}

/**
 * Error for configuration failures
 */
export class ConfigurationError extends AppError {
  constructor(message: string, details?: any) {
    super(`Configuration error: ${message}`, ErrorType.UNKNOWN, 500, details);
    this.name = 'ConfigurationError';
  }
}

/**
 * Error for service unavailable failures
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string, details?: any) {
    super(`Service unavailable: ${message}`, ErrorType.EXTERNAL_SERVICE, 503, details);
    this.name = 'ServiceUnavailableError';
  }
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: Error): any {
  if (error instanceof AppError) {
    return {
      message: error.message,
      error: error.name,
      status: error.status,
      details: error.details
    };
  }
  
  return {
    message: error.message || 'An unexpected error occurred',
    error: error.name || 'UnknownError',
    status: 500
  };
}

/**
 * Log error with appropriate level based on error type
 */
export function logError(error: Error): void {
  if (error instanceof RateLimitError) {
    console.warn(`Rate limit error: ${error.message}`, error);
  } else if (error instanceof ValidationError || error instanceof NotFoundError) {
    console.info(`Client error: ${error.message}`, error);
  } else {
    console.error(`Server error: ${error.message}`, error);
  }
}

/**
 * Check if an error is a retryable one
 * Some errors are temporary and worth retrying the operation
 */
export function isRetryableError(error: Error): boolean {
  if (error instanceof RateLimitError) {
    return true;
  }
  
  if (error instanceof DatabaseError && error.message.includes('connection')) {
    return true;
  }
  
  if (error instanceof AIModelError && error.message.includes('timeout')) {
    return true;
  }
  
  return false;
}