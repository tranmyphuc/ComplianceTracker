
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { performance } from 'perf_hooks';

// Error types
export enum ErrorType {
  VALIDATION = 'validation_error',
  AUTHENTICATION = 'authentication_error',
  AUTHORIZATION = 'authorization_error',
  RESOURCE_NOT_FOUND = 'resource_not_found',
  EXTERNAL_SERVICE = 'external_service_error',
  DATABASE = 'database_error',
  AI_MODEL = 'ai_model_error',
  BUSINESS_LOGIC = 'business_logic_error',
  RATE_LIMIT = 'rate_limit_error',
  CONFIGURATION = 'configuration_error',
  SERVICE_UNAVAILABLE = 'service_unavailable',
  UNKNOWN = 'unknown_error'
}

// Base error class
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;
  public readonly timestamp: Date;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    this.timestamp = new Date();
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specialized error classes
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, ErrorType.VALIDATION, 400, true, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, ErrorType.AUTHENTICATION, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, ErrorType.AUTHORIZATION, 403);
  }
}

export class ResourceNotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    const message = id
      ? `${resource} with ID ${id} not found`
      : `${resource} not found`;
    super(message, ErrorType.RESOURCE_NOT_FOUND, 404);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, details?: any) {
    super(
      `Error in external service: ${service}`,
      ErrorType.EXTERNAL_SERVICE,
      502,
      true,
      details
    );
  }
}

export class DatabaseError extends AppError {
  constructor(operation: string, details?: any) {
    super(
      `Database error during ${operation}`,
      ErrorType.DATABASE,
      500,
      true,
      details
    );
  }
}

export class AIModelError extends AppError {
  constructor(model: string, details?: any) {
    super(
      `AI model error: ${model}`,
      ErrorType.AI_MODEL,
      500,
      true,
      details
    );
  }
}

export class BusinessLogicError extends AppError {
  constructor(message: string, details?: any) {
    super(
      message,
      ErrorType.BUSINESS_LOGIC,
      400,
      true,
      details
    );
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, ErrorType.RATE_LIMIT, 429);
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string, details?: any) {
    super(
      message,
      ErrorType.CONFIGURATION,
      500,
      true,
      details
    );
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(service: string, details?: any) {
    super(
      `Service unavailable: ${service}`,
      ErrorType.SERVICE_UNAVAILABLE,
      503,
      true,
      details
    );
  }
}

// Error logging
export const logError = (err: Error | AppError): void => {
  const timestamp = new Date().toISOString();
  
  // Format error differently based on whether it's an AppError
  const errorLog = err instanceof AppError
    ? {
        timestamp,
        type: err.type,
        statusCode: err.statusCode,
        message: err.message,
        isOperational: err.isOperational,
        details: err.details,
        stack: err.stack
      }
    : {
        timestamp,
        type: ErrorType.UNKNOWN,
        message: err.message,
        stack: err.stack
      };
  
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR LOG:', JSON.stringify(errorLog, null, 2));
  } else {
    // In production we'd want to use a proper logging service
    // This would be implemented when moving to production
    console.error(`ERROR: ${timestamp} - ${err.message}`);
  }
};

// Error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  // Default error values
  let statusCode = 500;
  let errorType = ErrorType.UNKNOWN;
  let errorMessage = 'Internal server error';
  let errorDetails = undefined;
  
  // Handle different error types
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorType = err.type;
    errorMessage = err.message;
    errorDetails = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    errorType = ErrorType.VALIDATION;
    errorMessage = 'Validation error';
    errorDetails = err.errors;
  } else if (err.name === 'SyntaxError') {
    statusCode = 400;
    errorType = ErrorType.VALIDATION;
    errorMessage = 'Invalid JSON';
  }
  
  // Log the error
  logError(err);
  
  // Only include error details in development
  const response = {
    status: 'error',
    type: errorType,
    message: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { 
      details: errorDetails,
      stack: err.stack 
    })
  };
  
  return res.status(statusCode).json(response);
};

// Request tracking for performance monitoring
export const requestTracker = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = performance.now();
  
  // Store the original end method
  const originalEnd = res.end;
  
  // Override the end method
  res.end = function(...args: any[]): any {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Log request performance
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration.toFixed(2)}ms`
    );
    
    // Call the original end method
    return originalEnd.apply(this, args);
  };
  
  next();
};

// Authentication middleware
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    throw new AuthenticationError();
  }
  
  try {
    // Implement actual token verification logic here
    // For now, this is a placeholder
    const token = authHeader.split(' ')[1];
    // In a real implementation, verify token and add user to request
    // req.user = decoded;
    next();
  } catch (error) {
    throw new AuthenticationError('Invalid authentication token');
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Assuming req.user contains user info after authentication
    const userRole = (req as any).user?.role;
    
    if (!userRole || !roles.includes(userRole)) {
      throw new AuthorizationError();
    }
    
    next();
  };
};

// Export a function to convert any error to an AppError
export const normalizeError = (error: any): AppError => {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof ZodError) {
    return new ValidationError('Validation error', error.errors);
  }
  
  return new AppError(
    error.message || 'Unknown error',
    ErrorType.UNKNOWN,
    500,
    false
  );
};
