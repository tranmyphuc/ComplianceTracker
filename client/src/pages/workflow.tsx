import React, { useState } from 'react';
import { AIWorkflowDiagram } from '@/components/workflow/ai-workflow-diagram';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, HelpCircle, RefreshCw } from 'lucide-react';

export default function WorkflowPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [simulating, setSimulating] = useState(false);

  // Simulates a full workflow process
  const simulateWorkflow = () => {
    setSimulating(true);
    setActiveStep(0);
    
    const steps = [1, 2, 3, 4];
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setActiveStep(steps[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
        setSimulating(false);
      }
    }, 1500);
  };
  
  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SGH ASIA AI System Workflow</h1>
          <p className="text-muted-foreground mt-1">Understanding how our compliance analysis system works</p>
        </div>
        <Button 
          onClick={simulateWorkflow} 
          disabled={simulating}
          className="flex items-center gap-2"
        >
          {simulating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Simulate Workflow
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>AI Processing Workflow</CardTitle>
                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                  <HelpCircle className="h-4 w-4" />
                  Help
                </Button>
              </div>
              <CardDescription>
                Visual representation of how the SGH ASIA AI processes your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIWorkflowDiagram activeStep={activeStep} />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Workflow Information</CardTitle>
              <CardDescription>
                Learn more about our AI processing workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="timing">Timing</TabsTrigger>
                  <TabsTrigger value="errors">Error Handling</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-4 space-y-4">
                  <p className="text-sm">
                    The SGH ASIA AI system uses a multi-tiered approach for analyzing AI systems against EU AI Act criteria:
                  </p>
                  <ul className="space-y-2 text-sm list-disc pl-5">
                    <li>
                      <strong>Primary Analysis</strong>: DeepSeek AI provides deep regulatory insights based on current EU AI Act requirements
                    </li>
                    <li>
                      <strong>Fallback Chain</strong>: If primary analysis fails, the system smoothly transitions to Gemini AI, then Google Search API
                    </li>
                    <li>
                      <strong>Contextual Enhancement</strong>: Results are enriched with relevant regulatory articles and specific compliance requirements
                    </li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="timing" className="mt-4">
                  <div className="space-y-4">
                    <p className="text-sm">Expected processing times for each step:</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Data Input Validation</span>
                        <span className="font-mono">~1 second</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Primary AI Analysis (DeepSeek)</span>
                        <span className="font-mono">5-15 seconds</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Fallback Processing (if needed)</span>
                        <span className="font-mono">+5-10 seconds</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Data Enrichment</span>
                        <span className="font-mono">2-4 seconds</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Results Preparation</span>
                        <span className="font-mono">1-2 seconds</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium border-t pt-2 mt-2">
                        <span>Total Processing Time</span>
                        <span className="font-mono">8-30 seconds</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="errors" className="mt-4">
                  <div className="space-y-4">
                    <p className="text-sm">Our system implements robust error handling:</p>
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong className="block">API Timeouts</strong>
                        <p className="text-muted-foreground">When primary DeepSeek AI exceeds response time, automatic fallback to Gemini AI occurs.</p>
                      </div>
                      <div>
                        <strong className="block">Malformed Responses</strong>
                        <p className="text-muted-foreground">If AI returns non-JSON data, our system cleans and formats responses for consistency.</p>
                      </div>
                      <div>
                        <strong className="block">Complete API Failure</strong>
                        <p className="text-muted-foreground">When all AI services fail, the system falls back to Google Search API for minimal functionality.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="bg-muted/50 flex items-start gap-2 text-xs text-muted-foreground rounded-b-lg border-t">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>This workflow visualization helps you understand system operations and troubleshoot any issues that might occur during compliance analysis.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}