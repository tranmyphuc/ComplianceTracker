
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckIcon, BellIcon, BellOffIcon, ExternalLinkIcon, InfoIcon, AlertTriangleIcon, BellRingIcon } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

// Types for the notification center
interface RegulatoryUpdate {
  id: string;
  title: string;
  description: string;
  date: string;
  impactLevel: 'high' | 'medium' | 'low';
  category: string;
  isRead: boolean;
  actionRequired: boolean;
  relevantArticles: string[];
  url?: string;
}

interface Deadline {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  isCompleted: boolean;
  systemId?: string;
  systemName?: string;
}

interface UserNotificationSettings {
  email: string;
  emailNotifications: boolean;
  browserNotifications: boolean;
  updateTypes: {
    regulatory: boolean;
    deadlines: boolean;
    riskChanges: boolean;
    systemUpdates: boolean;
  }
}

export function RegulationNotificationCenter() {
  // State for notifications and settings
  const [tab, setTab] = useState('updates');
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState<UserNotificationSettings>({
    email: 'user@example.com',
    emailNotifications: true,
    browserNotifications: true,
    updateTypes: {
      regulatory: true,
      deadlines: true,
      riskChanges: true,
      systemUpdates: true,
    }
  });

  // Fetch mock updates
  useEffect(() => {
    // This would be an API call in production
    const mockUpdates: RegulatoryUpdate[] = [
      {
        id: '1',
        title: 'EU AI Act Final Text Published',
        description: 'The final text of the EU AI Act has been published in the Official Journal of the European Union.',
        date: '2024-06-01',
        impactLevel: 'high',
        category: 'regulatory',
        isRead: false,
        actionRequired: true,
        relevantArticles: ['All'],
      },
      {
        id: '2',
        title: 'New Guidance on Risk Assessment Methodology',
        description: 'The European Commission has published new guidance on risk assessment methodologies for high-risk AI systems.',
        date: '2024-05-15',
        impactLevel: 'medium',
        category: 'guidance',
        isRead: true,
        actionRequired: false,
        relevantArticles: ['Article 9'],
        url: 'https://example.com/guidance'
      },
      {
        id: '3',
        title: 'Risk Classification Update for Healthcare AI',
        description: 'Updated classification criteria for healthcare AI systems now requires additional validation for diagnostics apps.',
        date: '2024-05-10',
        impactLevel: 'high',
        category: 'classification',
        isRead: false,
        actionRequired: true,
        relevantArticles: ['Annex III'],
      },
      {
        id: '4',
        title: 'Implementation Timeline Extended',
        description: 'The Commission has extended certain implementation deadlines by 6 months for small and medium enterprises.',
        date: '2024-04-22',
        impactLevel: 'medium',
        category: 'timeline',
        isRead: false,
        actionRequired: false,
        relevantArticles: ['Article 85'],
      },
      {
        id: '5',
        title: 'Technical Standards Publication',
        description: 'New technical standards for conformity assessment procedures have been published by European standardization bodies.',
        date: '2024-04-15',
        impactLevel: 'medium',
        category: 'standards',
        isRead: true,
        actionRequired: false,
        relevantArticles: ['Article 40'],
      },
    ];

    const mockDeadlines: Deadline[] = [
      {
        id: 'd1',
        title: 'Conformity Assessment Due',
        description: 'Complete conformity assessment for healthcare diagnostic system',
        date: '2024-07-15',
        type: 'assessment',
        isCompleted: false,
        systemId: 'sys-123',
        systemName: 'MediScan AI'
      },
      {
        id: 'd2',
        title: 'Risk Reassessment Required',
        description: 'Scheduled quarterly risk reassessment for HR recruitment system',
        date: '2024-06-30',
        type: 'reassessment',
        isCompleted: false,
        systemId: 'sys-456',
        systemName: 'TalentMatch AI'
      },
      {
        id: 'd3',
        title: 'Technical Documentation Update',
        description: 'Update technical documentation to reflect system changes',
        date: '2024-06-10',
        type: 'documentation',
        isCompleted: false,
        systemId: 'sys-789',
        systemName: 'DataInsight Analytics'
      },
      {
        id: 'd4',
        title: 'Human Oversight Implementation',
        description: 'Implement enhanced human oversight measures as per recent guidance',
        date: '2024-06-05',
        type: 'implementation',
        isCompleted: true,
        systemId: 'sys-123',
        systemName: 'MediScan AI'
      },
    ];

    setUpdates(mockUpdates);
    setDeadlines(mockDeadlines);

    // Count unread notifications
    const unread = mockUpdates.filter(update => !update.isRead).length;
    setUnreadCount(unread);
  }, []);

  // Mark an update as read
  const markAsRead = (id: string) => {
    setUpdates(updates.map(update => 
      update.id === id ? { ...update, isRead: true } : update
    ));
    updateUnreadCount();
  };

  // Mark a deadline as completed
  const markAsCompleted = (id: string) => {
    setDeadlines(deadlines.map(deadline => 
      deadline.id === id ? { ...deadline, isCompleted: true } : deadline
    ));
  };

  // Update unread count
  const updateUnreadCount = () => {
    const count = updates.filter(update => !update.isRead).length;
    setUnreadCount(count);
  };

  // Save notification settings
  const saveSettings = () => {
    // This would be an API call in production
    console.log('Saving notification settings:', settings);
    // Show success toast or confirmation
  };

  // Get deadline status badge color
  const getDeadlineStatusColor = (deadline: Deadline) => {
    if (deadline.isCompleted) return "bg-green-100 text-green-800";
    
    const deadlineDate = new Date(deadline.date);
    const today = new Date();
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return "bg-red-100 text-red-800";
    if (daysDiff <= 7) return "bg-amber-100 text-amber-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRingIcon className="h-5 w-5 text-primary" />
            <CardTitle>Regulatory Notification Center</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">{unreadCount} new</Badge>
            )}
          </div>
        </div>
        <CardDescription>Stay updated with regulatory changes and compliance deadlines</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="updates">Regulatory Updates</TabsTrigger>
            <TabsTrigger value="deadlines">Compliance Deadlines</TabsTrigger>
            <TabsTrigger value="settings">Notification Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="updates" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {updates.length === 0 ? (
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>No updates</AlertTitle>
                    <AlertDescription>
                      You're all caught up! No new regulatory updates at this time.
                    </AlertDescription>
                  </Alert>
                ) : (
                  updates.map(update => (
                    <Card key={update.id} className={`overflow-hidden ${!update.isRead ? 'border-primary/50 bg-primary/5' : ''}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-base">{update.title}</CardTitle>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{update.date}</span>
                              <Badge variant={
                                update.impactLevel === 'high' ? 'destructive' :
                                update.impactLevel === 'medium' ? 'default' : 'outline'
                              } className="text-xs">
                                {update.impactLevel} impact
                              </Badge>
                              {update.actionRequired && (
                                <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-200">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                          </div>
                          {!update.isRead && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 rounded-full p-0"
                              onClick={() => markAsRead(update.id)}
                            >
                              <CheckIcon className="h-3 w-3" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground">{update.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {update.relevantArticles.map(article => (
                            <Badge key={article} variant="outline" className="text-xs">
                              {article}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="flex justify-between w-full">
                          <Badge variant="outline" className="text-xs">
                            {update.category}
                          </Badge>
                          {update.url && (
                            <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                              <a href={update.url} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1">
                                View details
                                <ExternalLinkIcon className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="deadlines" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {deadlines.length === 0 ? (
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>No deadlines</AlertTitle>
                    <AlertDescription>
                      You have no upcoming compliance deadlines.
                    </AlertDescription>
                  </Alert>
                ) : (
                  deadlines.map(deadline => (
                    <Card key={deadline.id} className={deadline.isCompleted ? 'opacity-70' : ''}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-base">{deadline.title}</CardTitle>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Due: {deadline.date}</span>
                              <Badge variant="outline" className={`text-xs ${getDeadlineStatusColor(deadline)}`}>
                                {deadline.isCompleted ? 'Completed' : 'Pending'}
                              </Badge>
                            </div>
                          </div>
                          {!deadline.isCompleted && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={() => markAsCompleted(deadline.id)}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground">{deadline.description}</p>
                        {deadline.systemName && (
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs">
                              System: {deadline.systemName}
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Badge variant="outline" className="text-xs">
                          {deadline.type}
                        </Badge>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notification Preferences</h3>
                
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="browser-notifications" className="text-base">Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                    </div>
                    <Switch 
                      id="browser-notifications" 
                      checked={settings.browserNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, browserNotifications: checked})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notification Types</h3>
                
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="regulatory-updates" className="text-base">Regulatory Updates</Label>
                      <p className="text-sm text-muted-foreground">Changes to EU AI Act and related regulations</p>
                    </div>
                    <Switch 
                      id="regulatory-updates" 
                      checked={settings.updateTypes.regulatory}
                      onCheckedChange={(checked) => setSettings({
                        ...settings, 
                        updateTypes: {...settings.updateTypes, regulatory: checked}
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="deadline-reminders" className="text-base">Deadline Reminders</Label>
                      <p className="text-sm text-muted-foreground">Reminders for upcoming compliance deadlines</p>
                    </div>
                    <Switch 
                      id="deadline-reminders" 
                      checked={settings.updateTypes.deadlines}
                      onCheckedChange={(checked) => setSettings({
                        ...settings, 
                        updateTypes: {...settings.updateTypes, deadlines: checked}
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="risk-changes" className="text-base">Risk Classification Changes</Label>
                      <p className="text-sm text-muted-foreground">Updates when your systems' risk levels change</p>
                    </div>
                    <Switch 
                      id="risk-changes" 
                      checked={settings.updateTypes.riskChanges}
                      onCheckedChange={(checked) => setSettings({
                        ...settings, 
                        updateTypes: {...settings.updateTypes, riskChanges: checked}
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system-updates" className="text-base">System Updates</Label>
                      <p className="text-sm text-muted-foreground">Notifications about changes to your AI systems</p>
                    </div>
                    <Switch 
                      id="system-updates" 
                      checked={settings.updateTypes.systemUpdates}
                      onCheckedChange={(checked) => setSettings({
                        ...settings, 
                        updateTypes: {...settings.updateTypes, systemUpdates: checked}
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Email Settings</h3>
                <div className="flex gap-2">
                  <Input 
                    value={settings.email} 
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    placeholder="Email address"
                    type="email"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button onClick={saveSettings}>Save Notification Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
