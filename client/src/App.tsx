import React from 'react';
import AppRoutes from './routes';
import { LanguageProvider } from './contexts/LanguageContext';

// Import global CSS
import './index.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <LanguageProvider>
        <AppRoutes />
      </LanguageProvider>
    </div>
  );
};

export default App;