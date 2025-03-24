import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  BellIcon, 
  CheckIcon, 
  RefreshCwIcon, 
  Shield, 
  ShieldCheck, 
  User, 
  Key, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  AlertTriangle, 
  X, 
  Play 
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Settings() {
  const { toast } = useToast();

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings Saved",
      description: "Your general settings have been updated successfully."
    });
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notification Preferences Saved",
      description: "Your notification settings have been updated successfully."
    });
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Account Settings Saved",
      description: "Your account settings have been updated successfully."
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="api-keys">
              <div className="flex items-center gap-1.5">
                <Key className="h-4 w-4" />
                <span>API Keys</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your general application preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveGeneral} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FormLabel htmlFor="language">Language</FormLabel>
                        <Select defaultValue="en">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select your preferred language for the application interface.
                        </FormDescription>
                      </div>

                      <div className="space-y-2">
                        <FormLabel htmlFor="theme">Theme</FormLabel>
                        <Select defaultValue="light">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose your preferred color theme.
                        </FormDescription>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel>Automatic Updates</FormLabel>
                          <FormDescription>
                            Automatically fetch the latest compliance information.
                          </FormDescription>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel>AI Suggestions</FormLabel>
                          <FormDescription>
                            Enable AI-powered suggestions and insights.
                          </FormDescription>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <FormLabel htmlFor="timezone">Timezone</FormLabel>
                      <Select defaultValue="utc">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                          <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                          <SelectItem value="cet">CET (Central European Time)</SelectItem>
                          <SelectItem value="ist">IST (Indian Standard Time)</SelectItem>
                          <SelectItem value="jst">JST (Japan Standard Time)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Set your local timezone for accurate deadlines and timestamps.
                      </FormDescription>
                    </div>
                  </div>

                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how and when you would like to be notified
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveNotifications} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel>Risk Assessment Reports</FormLabel>
                          <FormDescription>
                            Receive email notifications when risk assessment reports are generated.
                          </FormDescription>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel>Compliance Updates</FormLabel>
                          <FormDescription>
                            Get notified about changes to EU AI Act regulations.
                          </FormDescription>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel>Deadline Reminders</FormLabel>
                          <FormDescription>
                            Receive reminders about upcoming compliance deadlines.
                          </FormDescription>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel>System Registration Notifications</FormLabel>
                          <FormDescription>
                            Get notified when a new AI system is registered.
                          </FormDescription>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <h3 className="text-lg font-medium mt-6">In-App Notifications</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel>Task Assignments</FormLabel>
                          <FormDescription>
                            Receive notifications when you are assigned a new task.
                          </FormDescription>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel>Comments and Mentions</FormLabel>
                          <FormDescription>
                            Get notified when someone comments on or mentions you.
                          </FormDescription>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel>System Updates</FormLabel>
                          <FormDescription>
                            Be notified about platform updates and new features.
                          </FormDescription>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Button type="submit">Save Preferences</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information and security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveAccount} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Profile Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FormLabel htmlFor="fullName">Full Name</FormLabel>
                        <Input id="fullName" placeholder="Your full name" defaultValue="Admin" />
                      </div>

                      <div className="space-y-2">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input id="email" type="email" placeholder="Your email" defaultValue="admin@sgh.asia" readOnly />
                        <FormDescription>
                          Your primary email address is managed by your administrator.
                        </FormDescription>
                      </div>

                      <div className="space-y-2">
                        <FormLabel htmlFor="jobTitle">Job Title</FormLabel>
                        <Input id="jobTitle" placeholder="Your job title" defaultValue="Compliance Officer" />
                      </div>

                      <div className="space-y-2">
                        <FormLabel htmlFor="department">Department</FormLabel>
                        <Input id="department" placeholder="Your department" defaultValue="IT Infrastructure & Security" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <FormLabel htmlFor="bio">Bio</FormLabel>
                      <Textarea 
                        id="bio" 
                        placeholder="Tell us a little about yourself"
                        defaultValue="Focused on ensuring EU AI Act compliance across all SGH ASIA systems and processes."
                        rows={4}
                      />
                    </div>

                    <h3 className="text-lg font-medium mt-6">Security</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel>Two-Factor Authentication</FormLabel>
                          <FormDescription>
                            Add an extra layer of security to your account.
                          </FormDescription>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel>Session Timeout</FormLabel>
                          <FormDescription>
                            Automatically log out after period of inactivity.
                          </FormDescription>
                        </div>
                        <Select defaultValue="30">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Timeout" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button variant="outline" type="button" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                        Change Password
                      </Button>
                    </div>
                  </div>

                  <Button type="submit">Save Account Settings</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}