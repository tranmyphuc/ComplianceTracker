/**
 * Error handling utilities for the EU AI Act Compliance Platform
 */

import { Response } from 'express';

/**
 * Generic error handling middleware for API routes
 */
export const handleApiError = (res: Response, error: any, message?: string) => {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      error: error.message,
      status: error.statusCode
    });
  }
  
  // Default to a 500 internal server error
  return res.status(500).json({
    error: message || 'An unexpected error occurred',
    status: 500
  });
};

/**
 * Create a standardized API error with status code
 */
export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    
    // This line is needed to properly extend built-in classes in TypeScript
    Object.setPrototypeOf(this, ApiError.prototype);
  }
  
  static notFound(message: string = 'Resource not found') {
    return new ApiError(message, 404);
  }
  
  static badRequest(message: string = 'Invalid request') {
    return new ApiError(message, 400);
  }
  
  static unauthorized(message: string = 'Unauthorized') {
    return new ApiError(message, 401);
  }
  
  static forbidden(message: string = 'Forbidden') {
    return new ApiError(message, 403);
  }
  
  static internal(message: string = 'Internal server error') {
    return new ApiError(message, 500);
  }
}