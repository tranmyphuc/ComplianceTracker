
import React, { useState, useEffect } from 'react';
import { Bell, Info, AlertTriangle, Clock, CheckCircle, X, Calendar, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Types for notifications
type NotificationPriority = 'high' | 'medium' | 'low';
type NotificationCategory = 'regulatory' | 'deadline' | 'system' | 'approval';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  isRead: boolean;
  priority: NotificationPriority;
  category: NotificationCategory;
  relatedSystem?: string;
  actionLink?: string;
}

// Mock notifications for demonstration
const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'EU AI Act Implementation Deadline Approaching',
    message: 'The deadline for implementing core provisions of the EU AI Act is in 30 days. Review your compliance status.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
    priority: 'high',
    category: 'regulatory',
    actionLink: '/documentation/risk-assessment'
  },
  {
    id: '2',
    title: 'Risk Assessment Required: Customer Service AI',
    message: 'A new risk assessment is required for the Customer Service AI system due to recent updates.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: false,
    priority: 'medium',
    category: 'system',
    relatedSystem: 'CS-AI-001',
    actionLink: '/risk-assessment'
  },
  {
    id: '3',
    title: 'Technical Documentation Due in 7 Days',
    message: 'Complete technical documentation for the HR Recruitment Assistant is due by next week.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    isRead: true,
    priority: 'medium',
    category: 'deadline',
    relatedSystem: 'HR-AI-002',
    actionLink: '/documentation'
  },
  {
    id: '4',
    title: 'New Article 10 Guidance Published',
    message: 'The European Commission has released new guidance on Article 10 (Data Governance) compliance requirements.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    isRead: true,
    priority: 'medium',
    category: 'regulatory',
    actionLink: '/knowledge-center'
  },
  {
    id: '5',
    title: 'Approval Required: Updated Risk Assessment',
    message: 'The updated risk assessment for Financial Analysis Tool requires your approval.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    isRead: true,
    priority: 'high',
    category: 'approval',
    relatedSystem: 'FIN-AI-003',
    actionLink: '/workflow'
  }
];

// Settings interface
interface NotificationSettings {
  emailNotifications: boolean;
  notificationFrequency: 'immediately' | 'daily' | 'weekly';
  priorityThreshold: 'all' | 'medium-high' | 'high-only';
}

// Component for notification settings
const NotificationSettings: React.FC<{ 
  settings: NotificationSettings; 
  onUpdateSettings: (settings: NotificationSettings) => void;
  onClose: () => void;
}> = ({ settings, onUpdateSettings, onClose }) => {
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings);
  
  const handleChange = (key: keyof NotificationSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = () => {
    onUpdateSettings(localSettings);
    onClose();
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Email Notifications</h4>
        <RadioGroup 
          value={localSettings.emailNotifications ? 'enabled' : 'disabled'}
          onValueChange={(val) => handleChange('emailNotifications', val === 'enabled')}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="enabled" id="email-enabled" />
            <Label htmlFor="email-enabled">Enabled</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="disabled" id="email-disabled" />
            <Label htmlFor="email-disabled">Disabled</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Notification Frequency</h4>
        <RadioGroup 
          value={localSettings.notificationFrequency} 
          onValueChange={(val: 'immediately' | 'daily' | 'weekly') => handleChange('notificationFrequency', val)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="immediately" id="freq-immediately" />
            <Label htmlFor="freq-immediately">Immediately</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="freq-daily" />
            <Label htmlFor="freq-daily">Daily Digest</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="freq-weekly" />
            <Label htmlFor="freq-weekly">Weekly Digest</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Priority Level</h4>
        <RadioGroup 
          value={localSettings.priorityThreshold} 
          onValueChange={(val: 'all' | 'medium-high' | 'high-only') => handleChange('priorityThreshold', val)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="priority-all" />
            <Label htmlFor="priority-all">All notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium-high" id="priority-medium-high" />
            <Label htmlFor="priority-medium-high">Medium and high priority only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high-only" id="priority-high-only" />
            <Label htmlFor="priority-high-only">High priority only</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex justify-end pt-2">
        <Button variant="outline" size="sm" className="mr-2" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

// Notification item component
const NotificationItem: React.FC<{ 
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ notification, onMarkAsRead, onDelete }) => {
  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };
  
  // Get icon based on category
  const getCategoryIcon = () => {
    switch (notification.category) {
      case 'regulatory': return <Info className="h-4 w-4 text-blue-500" />;
      case 'deadline': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'system': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'approval': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Info className="h-4 w-4" />;
    }
  };
  
  // Get priority badge variant
  const getPriorityBadge = () => {
    switch (notification.priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };
  
  return (
    <div className={`p-3 rounded-lg mb-2 border ${notification.isRead ? 'bg-background' : 'bg-muted/40'}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-2">
          {getCategoryIcon()}
          <div>
            <div className="font-medium">{notification.title}</div>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <div className="flex items-center mt-1 space-x-2">
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(notification.date)}
              </span>
              {notification.relatedSystem && (
                <Badge variant="outline" className="text-xs">
                  System: {notification.relatedSystem}
                </Badge>
              )}
              <Badge variant={getPriorityBadge()} className="text-xs">
                {notification.priority}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {!notification.isRead && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => onMarkAsRead(notification.id)}
              title="Mark as read"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-muted-foreground" 
            onClick={() => onDelete(notification.id)}
            title="Delete"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {notification.actionLink && (
        <div className="mt-2">
          <Button 
            variant="link" 
            size="sm" 
            className="p-0 h-auto text-xs text-primary"
            asChild
          >
            <a href={notification.actionLink}>View Details</a>
          </Button>
        </div>
      )}
    </div>
  );
};

// Main notification system component
const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    notificationFrequency: 'immediately',
    priorityThreshold: 'all'
  });
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Filter notifications based on active tab
  const getFilteredNotifications = () => {
    if (activeTab === 'all') return notifications;
    return notifications.filter(n => n.category === activeTab);
  };
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };
  
  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };
  
  // Update settings
  const updateSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    // In a real app, you would send this to the backend
    console.log('Updated notification settings:', newSettings);
  };
  
  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) setIsOpen(false);
    };
    
    // Add event listener for outside clicks
    document.addEventListener('click', handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);
  
  return (
    <div className="relative inline-block">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[380px] p-0" 
          onClick={(e) => e.stopPropagation()}
          side="bottom" 
          align="end"
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Notifications</CardTitle>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => setSettingsOpen(true)}
                    title="Notification settings"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    Mark all as read
                  </Button>
                </div>
              </div>
              <CardDescription>
                Stay updated on regulatory changes and compliance deadlines
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b px-4">
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                    <TabsTrigger value="regulatory" className="flex-1">Regulatory</TabsTrigger>
                    <TabsTrigger value="deadline" className="flex-1">Deadlines</TabsTrigger>
                    <TabsTrigger value="system" className="flex-1">Systems</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="m-0">
                  <ScrollArea className="h-[300px] px-4 py-2">
                    {getFilteredNotifications().length > 0 ? (
                      getFilteredNotifications().map(notification => (
                        <NotificationItem 
                          key={notification.id} 
                          notification={notification} 
                          onMarkAsRead={markAsRead}
                          onDelete={deleteNotification}
                        />
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No notifications to display</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="regulatory" className="m-0">
                  <ScrollArea className="h-[300px] px-4 py-2">
                    {getFilteredNotifications().length > 0 ? (
                      getFilteredNotifications().map(notification => (
                        <NotificationItem 
                          key={notification.id} 
                          notification={notification} 
                          onMarkAsRead={markAsRead}
                          onDelete={deleteNotification}
                        />
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No regulatory updates to display</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="deadline" className="m-0">
                  <ScrollArea className="h-[300px] px-4 py-2">
                    {getFilteredNotifications().length > 0 ? (
                      getFilteredNotifications().map(notification => (
                        <NotificationItem 
                          key={notification.id} 
                          notification={notification} 
                          onMarkAsRead={markAsRead}
                          onDelete={deleteNotification}
                        />
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No upcoming deadlines</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="system" className="m-0">
                  <ScrollArea className="h-[300px] px-4 py-2">
                    {getFilteredNotifications().length > 0 ? (
                      getFilteredNotifications().map(notification => (
                        <NotificationItem 
                          key={notification.id} 
                          notification={notification} 
                          onMarkAsRead={markAsRead}
                          onDelete={deleteNotification}
                        />
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No system alerts to display</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="border-t p-2 flex justify-center">
              <Button variant="link" size="sm" asChild className="text-xs">
                <a href="/notifications/all">View all notifications</a>
              </Button>
            </CardFooter>
          </Card>
          
          {settingsOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setSettingsOpen(false)}>
              <Card className="w-[350px] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationSettings 
                    settings={settings} 
                    onUpdateSettings={updateSettings}
                    onClose={() => setSettingsOpen(false)}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationSystem;
