/**
 * Development Authentication Middleware
 * 
 * This middleware automatically adds admin authentication data to requests
 * in development mode to avoid requiring login for demos and testing.
 * 
 * IMPORTANT: This should only be enabled in development environments!
 */

import { Request, Response, NextFunction } from 'express';
import { defaultAdmin } from './config';

export const developmentAuth = (req: Request, res: Response, next: NextFunction) => {
  // Skip for public routes or those that already have auth
  if (
    req.path.startsWith('/assets') || 
    req.path.startsWith('/api/auth') ||
    req.path === '/favicon.ico'
  ) {
    return next();
  }

  // Add admin user information to the request
  if (!req.user) {
    req.user = {
      ...defaultAdmin,
      // Add required user properties for the application
      id: 1,
      createdAt: new Date(),
      lastLogin: new Date()
    };
  }

  // Log development authentication (only on API requests to reduce noise)
  if (req.path.startsWith('/api/') && req.path !== '/api/auth/login' && req.path !== '/api/auth/register') {
    console.log(`🔑 Dev Auth: Authenticated request to ${req.path} as admin user`);
  }

  next();
};