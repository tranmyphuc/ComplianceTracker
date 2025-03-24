
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Calendar, FileText, Link as LinkIcon, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RegulatoryUpdate {
  id: string;
  title: string;
  date: string;
  source: string;
  severity: 'high' | 'medium' | 'low';
  impactAreas: string[];
  read: boolean;
  type: 'amendment' | 'guidance' | 'deadline' | 'interpretation';
}

export function RegulatoryUpdateAlerts() {
  const [updates, setUpdates] = React.useState<RegulatoryUpdate[]>([
    {
      id: "1",
      title: "Updated Technical Documentation Requirements for High-Risk AI Systems",
      date: "2025-03-20",
      source: "European Commission",
      severity: 'high',
      impactAreas: ['Documentation', 'Compliance'],
      read: false,
      type: 'amendment'
    },
    {
      id: "2",
      title: "New Guidance on Human Oversight Implementation",
      date: "2025-03-15",
      source: "AI Office",
      severity: 'medium',
      impactAreas: ['Human Oversight', 'Training'],
      read: false,
      type: 'guidance'
    },
    {
      id: "3",
      title: "Upcoming Deadline for General Purpose AI Registration",
      date: "2025-03-10",
      source: "EU Digital Services",
      severity: 'high',
      impactAreas: ['Registration', 'Compliance'],
      read: true,
      type: 'deadline'
    },
    {
      id: "4",
      title: "Clarification on Risk Management System Requirements",
      date: "2025-02-28",
      source: "AI Office",
      severity: 'medium',
      impactAreas: ['Risk Management'],
      read: true,
      type: 'interpretation'
    }
  ]);

  const markAsRead = (id: string) => {
    setUpdates(prevUpdates => 
      prevUpdates.map(update => 
        update.id === id ? { ...update, read: true } : update
      )
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500 hover:bg-red-600';
      case 'medium': return 'bg-amber-500 hover:bg-amber-600';
      case 'low': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-slate-500 hover:bg-slate-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'amendment': return <FileText className="h-4 w-4" />;
      case 'guidance': return <Info className="h-4 w-4" />;
      case 'deadline': return <Calendar className="h-4 w-4" />;
      case 'interpretation': return <LinkIcon className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const unreadCount = updates.filter(update => !update.read).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Regulatory Updates
            </CardTitle>
            <CardDescription>
              Stay informed about EU AI Act changes and requirements
            </CardDescription>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {unreadCount} New
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {updates.map(update => (
              <div 
                key={update.id} 
                className={`p-4 border rounded-lg transition-colors ${!update.read ? 'bg-muted/50' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {!update.read && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      )}
                      <Badge variant={update.severity === 'high' ? 'destructive' : 'secondary'} className="flex gap-1">
                        {update.severity === 'high' && <AlertTriangle className="h-3 w-3" />}
                        {update.severity.charAt(0).toUpperCase() + update.severity.slice(1)} Severity
                      </Badge>
                      <Badge variant="outline" className="flex gap-1">
                        {getTypeIcon(update.type)}
                        {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                      </Badge>
                    </div>
                    <h3 className="font-medium">{update.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {update.impactAreas.map(area => (
                        <Badge key={area} variant="outline">{area}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {update.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {update.source}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <Button variant="outline" size="sm">View Details</Button>
                  {!update.read && (
                    <Button 
                      size="sm" 
                      onClick={() => markAsRead(update.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
