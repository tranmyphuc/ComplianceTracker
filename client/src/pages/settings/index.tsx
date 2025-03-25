
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ApiKeyManagement from '@/components/settings/api-key-management';
import { KeyRound, UserCog, Bell, Shield, Database } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('api-keys');

  return (
    <>
      <Helmet>
        <title>Settings | EU AI Act Compliance Platform</title>
      </Helmet>
      <div className="container mx-auto py-8 max-w-7xl">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure your platform settings and integrations
          </p>
        </div>
        
        <Tabs defaultValue="api-keys" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl">
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              <span className="hidden sm:inline">AI API Keys</span>
              <span className="inline sm:hidden">Keys</span>
            </TabsTrigger>
            <TabsTrigger value="user" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              <span className="hidden sm:inline">User Settings</span>
              <span className="inline sm:hidden">User</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="inline sm:hidden">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
              <span className="inline sm:hidden">Security</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Database</span>
              <span className="inline sm:hidden">DB</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="api-keys" className="space-y-6">
            <ApiKeyManagement />
          </TabsContent>
          
          <TabsContent value="user" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Settings</CardTitle>
                <CardDescription>Manage your user profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-4 text-gray-500">
                  User settings configuration will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-4 text-gray-500">
                  Notification settings configuration will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage security and access controls</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-4 text-gray-500">
                  Security settings configuration will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Settings</CardTitle>
                <CardDescription>Configure database connections and backups</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-4 text-gray-500">
                  Database settings configuration will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SettingsPage;

