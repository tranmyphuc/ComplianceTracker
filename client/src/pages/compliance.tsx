import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Compliance() {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance</h1>
        <p className="text-muted-foreground">
          Manage your compliance with the EU AI Act and related regulations
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Compliance Dashboard</CardTitle>
          <CardDescription>Overall compliance status for your AI systems</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Compliance dashboard content goes here.</p>
        </CardContent>
      </Card>
    </div>
  );
}