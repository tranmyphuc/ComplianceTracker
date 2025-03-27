import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg';
}

export function Spinner({ className, size = 'default', ...props }: SpinnerProps) {
  const sizeClass = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8'
  }[size];

  return (
    <div className={cn('flex items-center justify-center', className)} {...props}>
      <Loader2 className={cn('animate-spin text-primary', sizeClass)} />
    </div>
  );
}