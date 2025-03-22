import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useLocation } from 'wouter';
import { initializeFirebase } from '@/lib/firebase'; 

// Define our own user type that works for both Firebase and backend auth
export interface AppUser {
  id?: number;
  uid: string;
  email: string;
  username?: string;
  displayName?: string;
  role?: string;
  department?: string;
  // Add any Firebase User properties we need to support
  emailVerified?: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  setUser: (user: AppUser | null) => void;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  const logout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUser(null);
      setLocation('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    // Initialize Firebase if it hasn't been already
    initializeFirebase();
    
    const auth = getAuth();
    
    // Set up the auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // If in development mode and the development admin user flag is set,
        // auto-login as admin for easier testing
        if (process.env.NODE_ENV === 'development' && window.location.search.includes('dev_admin')) {
          console.log('DEVELOPMENT MODE: Auto-login with admin user');
          const adminUser: AppUser = {
            uid: 'admin-uid',
            email: 'admin@example.com',
            username: 'admin',
            displayName: 'Admin User',
            role: 'admin',
            department: 'Information Technology',
            emailVerified: true
          };
          setUser(adminUser);
          setLoading(false);
          return;
        }

        try {
          // Convert Firebase user to our AppUser type
          const appUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            emailVerified: firebaseUser.emailVerified,
          };

          // Fetch additional user data from our backend
          const response = await fetch(`/api/users/profile?uid=${firebaseUser.uid}`);
          
          if (response.ok) {
            const userData = await response.json();
            // Merge backend user data with Firebase user data
            setUser({
              ...appUser,
              id: userData.id,
              username: userData.username,
              role: userData.role,
              department: userData.department,
            });
          } else {
            // If we can't get the backend data, just use the Firebase data
            setUser(appUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Just use the Firebase data if we can't get the backend data
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            emailVerified: firebaseUser.emailVerified,
          });
        }
      } else {
        // If in development mode, auto-login as admin for easier testing
        if (process.env.NODE_ENV === 'development') {
          console.log('DEVELOPMENT MODE ACTIVATED: Auto-login with admin user');
          const adminUser: AppUser = {
            uid: 'admin-uid',
            email: 'admin@example.com',
            username: 'admin',
            displayName: 'Admin User',
            role: 'admin',
            department: 'Information Technology',
            emailVerified: true
          };
          setUser(adminUser);
        } else {
          setUser(null);
        }
      }
      
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [setLocation]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};