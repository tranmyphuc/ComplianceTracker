import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { queryClient } from '@/lib/queryClient';
import AppRoutes from './routes';

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <AppRoutes />
    </QueryClientProvider>
  );
};

export default App;