import React from 'react';
import AppRoutes from './routes';

// Import global CSS
import './index.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <AppRoutes />
    </div>
  );
};

export default App;