import { useState, useEffect, useCallback, createContext, useContext } from 'react';

export interface UserSettings {
  language: string;
  theme: 'light' | 'dark' | 'system';
  highContrastMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  avatarUrl?: string;
  receiveNotifications: boolean;
  setLanguage: (language: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setHighContrastMode: (highContrast: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setAvatarUrl: (url?: string) => void;
  setReceiveNotifications: (receive: boolean) => void;
  resetSettings: () => void;
}

// Default user settings
const defaultSettings = {
  language: 'en',
  theme: 'system' as const,
  highContrastMode: false,
  fontSize: 'medium' as const,
  receiveNotifications: true,
};

const STORAGE_KEY = 'user_settings';

// Create context
const UserSettingsContext = createContext<UserSettings | null>(null);

// Hook for component use
export function useUserSettings(): UserSettings {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
}

// Provider component
export function UserSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(() => {
    // Load from localStorage on initial render
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        try {
          return { ...defaultSettings, ...JSON.parse(savedSettings) };
        } catch (e) {
          console.error('Failed to parse user settings:', e);
        }
      }
    }
    return defaultSettings;
  });

  // Persist settings to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings]);

  // Setting update functions
  const setLanguage = useCallback((language: string) => {
    setSettings((prev: typeof defaultSettings) => ({ ...prev, language }));
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    setSettings((prev: typeof defaultSettings) => ({ ...prev, theme }));
  }, []);

  const setHighContrastMode = useCallback((highContrastMode: boolean) => {
    setSettings((prev: typeof defaultSettings) => ({ ...prev, highContrastMode }));
  }, []);

  const setFontSize = useCallback((fontSize: 'small' | 'medium' | 'large') => {
    setSettings((prev: typeof defaultSettings) => ({ ...prev, fontSize }));
  }, []);

  const setAvatarUrl = useCallback((avatarUrl?: string) => {
    setSettings((prev: typeof defaultSettings) => ({ ...prev, avatarUrl }));
  }, []);

  const setReceiveNotifications = useCallback((receiveNotifications: boolean) => {
    setSettings((prev: typeof defaultSettings) => ({ ...prev, receiveNotifications }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const value: UserSettings = {
    ...settings,
    setLanguage,
    setTheme,
    setHighContrastMode,
    setFontSize,
    setAvatarUrl,
    setReceiveNotifications,
    resetSettings,
  };

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
}

// Export the context for use in App.tsx
export { UserSettingsContext };