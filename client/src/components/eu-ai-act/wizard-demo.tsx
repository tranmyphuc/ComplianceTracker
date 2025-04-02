import React, { useState } from "react";
import { ComplianceTooltipWizard } from "./compliance-tooltip-wizard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, AlertTriangleIcon, CheckCircleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the ComplianceRecommendation interface for our results
interface ComplianceRecommendation {
  id: string;
  articleId: string;
  summary: string;
  complianceLevel: "compliant" | "partial" | "non-compliant" | "not-applicable";
  actionItems: string[];
}

export function WizardDemo() {
  const [systemDescription, setSystemDescription] = useState("");
  const [recommendations, setRecommendations] = useState<ComplianceRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(false);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemDescription(e.target.value);
  };

  const handleRecommendationsGenerated = (newRecommendations: ComplianceRecommendation[]) => {
    setRecommendations(newRecommendations);
    setActiveTab("recommendations");
    setLoading(false);
  };

  const runAnalysis = () => {
    if (!systemDescription) return;
    
    setLoading(true);
    // This call will be handled by the compliance-tooltip-wizard component
    // It manages its own API calls and will invoke our callback when done
  };

  // Map compliance levels to appropriate styling
  const getComplianceBadge = (level: string) => {
    switch (level) {
      case "compliant":
        return <Badge className="bg-green-500">Compliant</Badge>;
      case "partial":
        return <Badge className="bg-yellow-500">Partially Compliant</Badge>;
      case "non-compliant":
        return <Badge className="bg-red-500">Non-Compliant</Badge>;
      case "not-applicable":
        return <Badge className="bg-gray-500">Not Applicable</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  // Map compliance levels to appropriate icon
  const getComplianceIcon = (level: string) => {
    switch (level) {
      case "compliant":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "partial":
        return <AlertTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case "non-compliant":
        return <AlertTriangleIcon className="w-5 h-5 text-red-500" />;
      case "not-applicable":
        return <InfoIcon className="w-5 h-5 text-gray-500" />;
      default:
        return <InfoIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>EU AI Act Compliance Wizard</CardTitle>
          <CardDescription>
            Analyze your AI system against the EU AI Act and get compliance recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">System Description</TabsTrigger>
              <TabsTrigger value="recommendations" disabled={recommendations.length === 0}>
                Recommendations {recommendations.length > 0 && `(${recommendations.length})`}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>AI System Assessment</AlertTitle>
                  <AlertDescription>
                    Describe your AI system's purpose, capabilities, intended use, and any high-risk areas it might operate in. 
                    The more details you provide, the more accurate the compliance analysis will be.
                  </AlertDescription>
                </Alert>
                
                <Textarea 
                  placeholder="Describe your AI system in detail..." 
                  className="min-h-[200px]"
                  value={systemDescription}
                  onChange={handleDescriptionChange}
                />
              </div>
              
              <div className="flex justify-end">
                <ComplianceTooltipWizard 
                  systemDescription={systemDescription}
                  onRecommendationsGenerated={handleRecommendationsGenerated}
                  trigger={
                    <Button 
                      onClick={runAnalysis} 
                      disabled={!systemDescription || loading}
                      className="ml-auto"
                    >
                      {loading ? "Analyzing..." : "Analyze Compliance"}
                    </Button>
                  }
                />
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-4 pt-4">
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <Card key={rec.id} className="overflow-hidden">
                      <CardHeader className="flex flex-row items-center gap-3 pb-2">
                        {getComplianceIcon(rec.complianceLevel)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Article {rec.articleId}</CardTitle>
                            {getComplianceBadge(rec.complianceLevel)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="mb-2 text-gray-700 dark:text-gray-300">{rec.summary}</div>
                        {rec.actionItems.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-sm font-semibold mb-2">Action Items:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {rec.actionItems.map((item, idx) => (
                                <li key={idx} className="text-sm">{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No recommendations yet. Please run the compliance analysis first.
                  </p>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("description")}>
                  Back to Description
                </Button>
                <Button onClick={() => {
                  setSystemDescription("");
                  setRecommendations([]);
                  setActiveTab("description");
                }}>
                  Start New Analysis
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}