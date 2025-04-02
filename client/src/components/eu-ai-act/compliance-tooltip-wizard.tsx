import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, ArrowRight, LucideWand2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArticleReference } from "./article-reference";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface ComplianceTooltipWizardProps {
  trigger?: React.ReactNode;
  systemDescription?: string;
  onRecommendationsGenerated?: (recommendations: ComplianceRecommendation[]) => void;
}

interface ComplianceRecommendation {
  id: string;
  articleId: string;
  summary: string;
  complianceLevel: "compliant" | "partial" | "non-compliant" | "not-applicable";
  actionItems: string[];
}

/**
 * Interactive AI Compliance Tooltip Wizard
 * 
 * This component allows users to get AI-powered recommendations on EU AI Act compliance
 * based on their system description. It provides an interactive wizard that generates
 * article-specific compliance recommendations.
 */
export function ComplianceTooltipWizard({
  trigger,
  systemDescription = "",
  onRecommendationsGenerated,
}: ComplianceTooltipWizardProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"input" | "analyzing" | "results">("input");
  const [description, setDescription] = useState(systemDescription);
  const [systemName, setSystemName] = useState("");
  const [systemPurpose, setSystemPurpose] = useState("");
  const [recommendations, setRecommendations] = useState<ComplianceRecommendation[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Query to fetch relevant articles based on system type (when we reach the analysis step)
  const { data: relevantArticles, isLoading: articlesLoading } = useQuery({
    queryKey: ['/api/eu-ai-act/articles'],
    enabled: step === "analyzing",
  });

  // Mutation to generate compliance recommendations
  const generateMutation = useMutation({
    mutationFn: async () => {
      return apiRequest<ComplianceRecommendation[]>(
        '/api/compliance/analyze-wizard',
        {
          method: 'POST',
          body: {
            systemName,
            systemPurpose,
            systemDescription: description
          }
        }
      );
    },
    onSuccess: (data) => {
      setRecommendations(data);
      setStep("results");
      if (onRecommendationsGenerated) {
        onRecommendationsGenerated(data);
      }
    },
    onError: (error) => {
      toast({
        title: "Error generating recommendations",
        description: "Unable to analyze your system. Please try again or contact support.",
        variant: "destructive"
      });
      setStep("input");
    }
  });

  const handleStartAnalysis = () => {
    if (!description.trim() || !systemName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a system name and description to continue.",
        variant: "destructive"
      });
      return;
    }
    
    setStep("analyzing");
    generateMutation.mutate();
  };

  const handleClose = () => {
    setOpen(false);
    // Reset state if dialog is closed
    setTimeout(() => {
      if (step === "results") {
        // Keep results for a bit in case they reopen
        return;
      }
      setStep("input");
    }, 300);
  };

  const getComplianceBadgeVariant = (level: string) => {
    switch(level) {
      case "compliant": return "success";
      case "partial": return "warning";
      case "non-compliant": return "destructive";
      case "not-applicable": return "outline";
      default: return "secondary";
    }
  };

  const renderComplianceBadge = (level: string) => {
    const variant = getComplianceBadgeVariant(level);
    const icon = level === "compliant" ? 
      <CheckCircle className="h-4 w-4 mr-1" /> : 
      <AlertCircle className="h-4 w-4 mr-1" />;
    
    return (
      <Badge variant={variant as any} className="flex items-center gap-1">
        {icon}
        {level.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      setOpen(value);
      if (!value) handleClose();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" className="gap-2">
            <LucideWand2 className="h-4 w-4" />
            AI Compliance Wizard
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <LucideWand2 className="h-5 w-5" />
            EU AI Act Compliance Wizard
          </DialogTitle>
          <DialogDescription>
            Get AI-powered compliance recommendations for your system based on the EU AI Act
          </DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="system-name">AI System Name</Label>
              <Input
                id="system-name"
                placeholder="e.g., HR Recruitment Assistant"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="system-purpose">System Purpose</Label>
              <Input
                id="system-purpose"
                placeholder="e.g., Automating candidate screening and resume analysis"
                value={systemPurpose}
                onChange={(e) => setSystemPurpose(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="system-description">
                Detailed System Description
              </Label>
              <Textarea
                id="system-description"
                placeholder="Describe how your AI system works, what data it uses, and its primary functions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-sm text-gray-500">
                The more details you provide, the more accurate the compliance recommendations will be.
              </p>
            </div>
          </div>
        )}

        {step === "analyzing" && (
          <div className="py-8 space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-pulse flex space-x-4 items-center justify-center">
                <div className="rounded-full bg-blue-400 h-12 w-12 flex items-center justify-center">
                  <LucideWand2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Analyzing Your System</h3>
              <p className="text-center text-gray-500 max-w-md">
                Our AI is analyzing your system based on the EU AI Act requirements to generate compliance recommendations...
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-500">Analyzing Relevant Articles</div>
              <div className="space-y-2">
                {articlesLoading ? (
                  Array.from({length: 3}).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full rounded-md" />
                  ))
                ) : (
                  <div className="border rounded-md p-4 bg-gray-50">
                    <p className="text-sm text-gray-600">
                      Based on your input, we're analyzing the following key articles for compliance:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline">Article 5</Badge>
                      <Badge variant="outline">Article 6</Badge>
                      <Badge variant="outline">Article 9</Badge>
                      <Badge variant="outline">Article 10</Badge>
                      <Badge variant="outline">Article 13</Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === "results" && (
          <div className="py-4 space-y-4">
            <div className="pb-2">
              <h3 className="text-base font-medium">Compliance Recommendations for {systemName}</h3>
              <p className="text-sm text-gray-500">
                Here are article-specific recommendations based on your system description. 
                Click on any article to see detailed information.
              </p>
            </div>
            
            <div className="space-y-4">
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <Card key={rec.id} className={`border-l-4 ${
                    rec.complianceLevel === 'compliant' ? 'border-l-green-500' :
                    rec.complianceLevel === 'partial' ? 'border-l-amber-500' :
                    rec.complianceLevel === 'non-compliant' ? 'border-l-red-500' :
                    'border-l-gray-300'
                  }`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">
                          <ArticleReference articleId={rec.articleId}>
                            {rec.articleId}
                          </ArticleReference>
                        </CardTitle>
                        {renderComplianceBadge(rec.complianceLevel)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm">{rec.summary}</p>
                    </CardContent>
                    {rec.actionItems && rec.actionItems.length > 0 && (
                      <CardFooter className="pt-0 flex flex-col items-start">
                        <p className="text-xs font-medium text-gray-500 mb-1">Recommended Actions:</p>
                        <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                          {rec.actionItems.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </CardFooter>
                    )}
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 space-y-2">
                  <AlertCircle className="h-8 w-8 text-amber-500 mx-auto" />
                  <h3 className="font-medium">No recommendations available</h3>
                  <p className="text-sm text-gray-500">
                    We couldn't generate recommendations. Try providing more details about your system.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="mt-6">
          {step === "input" && (
            <Button type="submit" onClick={handleStartAnalysis}>
              Generate Recommendations <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          
          {step === "analyzing" && (
            <Button disabled variant="outline">
              Analyzing...
            </Button>
          )}
          
          {step === "results" && (
            <div className="flex w-full justify-between">
              <Button 
                variant="outline" 
                onClick={() => setStep("input")}
              >
                New Analysis
              </Button>
              <Button onClick={handleClose}>
                Close
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}