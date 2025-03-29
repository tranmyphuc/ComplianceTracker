import React from 'react';

interface PageHeaderProps {
  heading: string;
  subheading?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({ heading, subheading, actions, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{heading}</h1>
        {subheading && (
          <p className="mt-1 text-sm text-muted-foreground">{subheading}</p>
        )}
        {children}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}