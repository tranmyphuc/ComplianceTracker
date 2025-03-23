import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';
import { AppLayout } from "@/components/layout/app-layout";

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
