
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle,
  Shield,
  Plus,
  ArrowLeft
} from "lucide-react";
import axios from 'axios';

export default function SystemRiskManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [system, setSystem] = useState(null);
  const [riskControls, setRiskControls] = useState([]);
  const [riskEvents, setRiskEvents] = useState([]);
  const [riskManagementSystem, setRiskManagementSystem] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch system details
        const systemResponse = await axios.get(`/api/systems/${id}`);
        setSystem(systemResponse.data);
        
        // Try to fetch risk management system
        try {
          const rmsResponse = await axios.get(`/api/risk-management/system/${id}`);
          setRiskManagementSystem(rmsResponse.data);
          
          // If RMS exists, fetch controls and events
          const controlsResponse = await axios.get(`/api/risk-management/controls/${id}`);
          setRiskControls(controlsResponse.data);
          
          const eventsResponse = await axios.get(`/api/risk-management/events/${id}`);
          setRiskEvents(eventsResponse.data);
        } catch (error) {
          // RMS might not exist yet, which is okay
          console.log('Risk management system not found:', error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load risk management data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, toast]);
  
  const handleCreateRiskManagement = async () => {
    try {
      const response = await axios.post(`/api/risk-management/system/${id}`);
      setRiskManagementSystem(response.data);
      toast({
        title: "Success",
        description: "Risk management system created successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Error creating RMS:', error);
      toast({
        title: "Error",
        description: "Failed to create risk management system",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-semibold">Risk Management</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (!system) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-semibold">Risk Management</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">System Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The AI system you're looking for could not be found.
              </p>
              <Button onClick={() => navigate('/systems')}>
                View All Systems
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-semibold">Risk Management</h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(`/systems/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to System
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{system.name}</CardTitle>
          <CardDescription>
            {system.description || 'No description provided'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
              <p className="text-lg font-semibold">
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  system.riskLevel === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400' :
                  system.riskLevel === 'limited' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400' :
                  'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400'
                }`}>
                  {system.riskLevel ? system.riskLevel.charAt(0).toUpperCase() + system.riskLevel.slice(1) : 'Not assessed'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Department</p>
              <p className="text-lg font-semibold">{system.department || 'Not specified'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {!riskManagementSystem ? (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <CardTitle>Set Up Risk Management</CardTitle>
            </div>
            <CardDescription>
              Create a risk management system to track and control risks for this AI system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              A risk management system will help you:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mb-4">
              <li>Create and track risk controls for identified compliance gaps</li>
              <li>Record and manage risk events and incidents</li>
              <li>Monitor the effectiveness of your risk mitigation measures</li>
              <li>Generate reports for periodic management review</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateRiskManagement}>
              <Plus className="h-4 w-4 mr-2" />
              Create Risk Management System
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="controls">Risk Controls</TabsTrigger>
            <TabsTrigger value="events">Risk Events</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Risk Management Overview</CardTitle>
                <CardDescription>
                  Status and summary of your risk management system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p className="text-lg font-semibold">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        riskManagementSystem.status === 'active' ? 'bg-green-100 text-green-700' :
                        riskManagementSystem.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {riskManagementSystem.status.charAt(0).toUpperCase() + riskManagementSystem.status.slice(1).replace('_', ' ')}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Review</p>
                    <p className="text-lg font-semibold">
                      {riskManagementSystem.lastReviewDate 
                        ? new Date(riskManagementSystem.lastReviewDate).toLocaleDateString() 
                        : 'Never reviewed'}
                    </p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Risk Controls</h3>
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-medium rounded-full px-2.5 py-0.5">
                        {riskControls.length}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {riskControls.length === 0 
                        ? 'No risk controls have been created yet.' 
                        : `${riskControls.filter(c => c.implementationStatus === 'implemented').length} implemented, ${riskControls.filter(c => c.implementationStatus !== 'implemented').length} pending.`}
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Risk Events</h3>
                      <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 text-xs font-medium rounded-full px-2.5 py-0.5">
                        {riskEvents.length}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {riskEvents.length === 0 
                        ? 'No risk events have been recorded yet.' 
                        : `${riskEvents.filter(e => e.status === 'new' || e.status === 'under_investigation').length} open, ${riskEvents.filter(e => e.status === 'resolved' || e.status === 'closed').length} closed.`}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate(`/risk-management/${id}/review`)}>
                  Review Risk Management System
                </Button>
                <Button onClick={() => navigate(`/risk-management/${id}/plan`)}>
                  Generate Implementation Plan
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="controls" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Risk Controls</h2>
              <Button onClick={() => navigate(`/risk-management/${id}/controls/create`)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Risk Control
              </Button>
            </div>
            
            {riskControls.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <Shield className="h-10 w-10 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-medium mb-2">No Risk Controls</h2>
                    <p className="text-muted-foreground mb-4">
                      You haven't created any risk controls for this system yet.
                    </p>
                    <Button onClick={() => navigate(`/risk-management/${id}/controls/create`)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Control
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {riskControls.map((control) => (
                  <Card key={control.controlId} className="hover:bg-accent/10 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{control.name}</CardTitle>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          control.implementationStatus === 'implemented' ? 'bg-green-100 text-green-700' :
                          control.implementationStatus === 'verified' ? 'bg-blue-100 text-blue-700' :
                          control.implementationStatus === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                          control.implementationStatus === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {control.implementationStatus.charAt(0).toUpperCase() + 
                            control.implementationStatus.slice(1).replace('_', ' ')}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{control.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-primary/10 text-primary text-xs rounded px-2 py-1">
                          {control.controlType.charAt(0).toUpperCase() + control.controlType.slice(1)}
                        </span>
                        {control.effectiveness && (
                          <span className={`text-xs rounded px-2 py-1 ${
                            control.effectiveness === 'very_effective' ? 'bg-green-100 text-green-700' :
                            control.effectiveness === 'effective' ? 'bg-blue-100 text-blue-700' :
                            control.effectiveness === 'partially_effective' ? 'bg-yellow-100 text-yellow-700' :
                            control.effectiveness === 'ineffective' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {control.effectiveness.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/risk-management/${id}/controls/${control.controlId}`)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="events" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Risk Events</h2>
              <Button onClick={() => navigate(`/risk-management/${id}/events/create`)}>
                <Plus className="h-4 w-4 mr-2" />
                Record Risk Event
              </Button>
            </div>
            
            {riskEvents.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-medium mb-2">No Risk Events</h2>
                    <p className="text-muted-foreground mb-4">
                      No risk events have been recorded for this system yet.
                    </p>
                    <Button onClick={() => navigate(`/risk-management/${id}/events/create`)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Record First Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {riskEvents.map((event) => (
                  <Card key={event.eventId} className="hover:bg-accent/10 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {event.severity === 'critical' ? (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          ) : event.severity === 'high' ? (
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                          ) : event.severity === 'medium' ? (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-blue-500" />
                          )}
                          <CardTitle className="text-base">
                            {event.eventType.replace('_', ' ').charAt(0).toUpperCase() + 
                              event.eventType.replace('_', ' ').slice(1)}
                          </CardTitle>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          event.status === 'new' ? 'bg-blue-100 text-blue-700' :
                          event.status === 'under_investigation' ? 'bg-yellow-100 text-yellow-700' :
                          event.status === 'resolved' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {event.status.replace('_', ' ')}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`text-xs rounded px-2 py-1 ${
                          event.severity === 'critical' ? 'bg-red-100 text-red-700' :
                          event.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                          event.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {event.severity}
                        </span>
                        <span className="bg-gray-100 text-gray-700 text-xs rounded px-2 py-1">
                          {new Date(event.detectionDate).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/risk-management/${id}/events/${event.eventId}`)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Risk Management Reports</CardTitle>
                <CardDescription>
                  Generate and view reports about your risk management activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="hover:bg-accent/10 transition-colors cursor-pointer"
                       onClick={() => navigate(`/risk-management/${id}/reports/summary`)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Risk Management Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive overview of your risk management system status, controls, and events.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:bg-accent/10 transition-colors cursor-pointer"
                       onClick={() => navigate(`/risk-management/${id}/reports/implementation`)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Implementation Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Detailed plan for implementing and improving your risk management system.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:bg-accent/10 transition-colors cursor-pointer"
                       onClick={() => navigate(`/risk-management/${id}/reports/effectiveness`)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Control Effectiveness</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Analysis of how effective your risk controls are at mitigating identified risks.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:bg-accent/10 transition-colors cursor-pointer"
                       onClick={() => navigate(`/risk-management/${id}/reports/compliance`)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Compliance Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Current compliance status based on your risk controls and management activities.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
