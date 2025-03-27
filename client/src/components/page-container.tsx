import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`container mx-auto py-6 px-4 md:px-6 lg:px-8 max-w-7xl ${className}`}>
      {children}
    </div>
  );
}