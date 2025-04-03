/**
 * Session type definitions
 */
import { User } from '@shared/schema';
import session from 'express-session';

// Extend the express-session session interface with our custom properties
declare module 'express-session' {
  interface SessionData {
    user?: User;
    token?: string;
  }
}