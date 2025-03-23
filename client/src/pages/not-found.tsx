import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';

const NotFound: React.FC = () => {
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
};

export default NotFound;
