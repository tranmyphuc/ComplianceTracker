import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { getFirebaseAuth } from './firebase';
import { User as FirebaseUser } from 'firebase/auth';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: string;
  department?: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthContextType>({
    user: null,
    loading: true, 
    error: null
  });

  useEffect(() => {
    // For development, use a mock admin user if no firebase auth
    const devMode = import.meta.env.MODE === 'development';
    if (devMode) {
      const mockAdminUser: AppUser = {
        uid: 'admin-uid',
        email: 'admin@example.com',
        displayName: 'Admin User',
        photoURL: null,
        role: 'decision_maker',
        department: 'IT',
      };
      
      setState({
        user: mockAdminUser,
        loading: false,
        error: null
      });
      console.log('DEVELOPMENT MODE: Auto-login with admin user');
      return;
    }
    
    const auth = getFirebaseAuth();
    if (!auth) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }
    
    const unsubscribe = auth.onAuthStateChanged(
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            // Get additional user data from our backend
            const idToken = await firebaseUser.getIdToken();
            const response = await fetch('/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${idToken}`
              }
            });
            
            if (response.ok) {
              const userData = await response.json();
              
              const appUser: AppUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                role: userData.role,
                department: userData.department
              };
              
              setState({
                user: appUser,
                loading: false,
                error: null
              });
            } else {
              throw new Error('Failed to fetch user data');
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            setState({
              user: {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
              },
              loading: false,
              error: 'Error fetching user data'
            });
          }
        } else {
          setState({
            user: null,
            loading: false,
            error: null
          });
        }
      },
      (error: any) => {
        console.error('Auth state error:', error);
        setState({
          user: null,
          loading: false,
          error: error.message
        });
      }
    );
    
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
};