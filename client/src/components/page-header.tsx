import React from 'react';

interface PageHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function PageHeader({ children, className = '' }: PageHeaderProps) {
  return (
    <div className={`mb-6 space-y-2 ${className}`}>
      {children}
    </div>
  );
}

interface PageHeaderHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function PageHeaderHeading({ children, className = '' }: PageHeaderHeadingProps) {
  return (
    <h1 className={`text-3xl font-bold tracking-tight ${className}`}>
      {children}
    </h1>
  );
}

interface PageHeaderDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageHeaderDescription({ children, className = '' }: PageHeaderDescriptionProps) {
  return (
    <p className={`text-muted-foreground text-lg ${className}`}>
      {children}
    </p>
  );
}