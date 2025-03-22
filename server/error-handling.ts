
import { Response } from 'express';

/**
 * Standardized error handling for API endpoints
 */
export function handleError(error: any, res: Response): void {
  console.error('API Error:', error);
  
  // Handle different types of errors with appropriate status codes
  if (error.name === 'ValidationError') {
    res.status(400).json({
      message: 'Validation error',
      details: error.message
    });
    return;
  }
  
  if (error.name === 'NotFoundError') {
    res.status(404).json({
      message: 'Resource not found',
      details: error.message
    });
    return;
  }
  
  if (error.name === 'AuthorizationError') {
    res.status(403).json({
      message: 'Not authorized',
      details: error.message
    });
    return;
  }
  
  // Add a page to navigate to the risk assessment wizard
  res.status(500).json({
    message: 'Server error',
    details: error.message || 'An unexpected error occurred'
  });
}
