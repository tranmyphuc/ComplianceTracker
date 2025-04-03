/**
 * Authentication middleware
 */
import { Request, Response, NextFunction } from 'express';
import { findTestUserByUid } from '../test-users';
import { User } from '@shared/schema';
import '../types/session-types';

// Extend the Request type with user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
      token?: string;
    }
  }
}

/**
 * Authentication middleware
 * 
 * This middleware checks for a user in the session and adds it to the request object.
 * If using tokens (in headers), it also verifies the token and populates the user.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Skip for static assets
  if (
    req.path.startsWith('/assets') || 
    req.path === '/favicon.ico'
  ) {
    return next();
  }

  // First check if user is already in the session
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }
  
  // Then check for Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      // In a real app, we would verify the JWT token
      // For test purposes, we'll parse the base64 token we generated
      const decodedData = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if token is expired
      if (decodedData.exp < Date.now()) {
        return res.status(401).json({ message: 'Token expired' });
      }
      
      // Find user by UID
      const user = findTestUserByUid(decodedData.uid);
      if (user) {
        // Add user to request
        req.user = user;
        req.token = token;
        
        // Add user to session for future requests
        if (req.session) {
          req.session.user = user;
          req.session.token = token;
        }
      }
    } catch (error) {
      console.error('Error parsing auth token:', error);
      // Continue without user (will be handled by protected routes)
    }
  }
  
  next();
}

/**
 * Protected route middleware
 * 
 * This middleware ensures a route is only accessible to authenticated users.
 * It should be used on routes that require authentication.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  next();
}

// Define valid role types
export type UserRole = "user" | "admin" | "operator" | "developer" | "decision_maker";

/**
 * Role-based authorization middleware
 * 
 * This middleware ensures a route is only accessible to users with specific roles.
 * It should be used on routes that require specific roles.
 * 
 * @param allowedRoles Array of roles that are allowed to access the route
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // First ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Then check if user has required role
    const userRole = (req.user.role as UserRole) || 'user' as UserRole;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
}