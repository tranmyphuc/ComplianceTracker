import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { InfoIcon, AlertTriangleIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Define interfaces for the component props and data structures
export interface ComplianceRecommendation {
  id: string;
  articleId: string;
  summary: string;
  complianceLevel: "compliant" | "partial" | "non-compliant" | "not-applicable";
  actionItems: string[];
}

interface ComplianceTooltipWizardProps {
  trigger?: React.ReactNode;
  systemDescription?: string;
  onRecommendationsGenerated?: (recommendations: ComplianceRecommendation[]) => void;
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
  onRecommendationsGenerated
}: ComplianceTooltipWizardProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(systemDescription);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to handle description changes within the dialog
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  // Function to analyze the system description and generate recommendations
  const analyzeCompliance = async () => {
    if (!description.trim()) {
      setError("Please provide a system description");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest('/api/compliance/analyze/compliance', {
        method: 'POST',
        body: JSON.stringify({ description }),
      });

      if (response.error) {
        throw new Error(response.error);
      }

      const recommendations = response.recommendations || [];
      
      if (onRecommendationsGenerated) {
        onRecommendationsGenerated(recommendations);
      }
      
      setOpen(false); // Close dialog after successful analysis
      
      toast({
        title: "Analysis complete",
        description: `Generated ${recommendations.length} compliance recommendations`,
      });
    } catch (err: any) {
      console.error("Error analyzing compliance:", err);
      
      // Handle specific error types with custom messages
      if (err.message?.includes("extraction failed")) {
        setError("Extraction Failed: Unable to extract insights from your description. Please provide more specific details about your AI system.");
      } else if (err.message?.includes("suggestion process failed")) {
        setError("Suggestion Process Failed: Unable to generate recommendations. Please try again with more detailed information about your AI system.");
      } else {
        setError(`Failed to analyze compliance: ${err.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Analyze EU AI Act Compliance</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>EU AI Act Compliance Analyzer</DialogTitle>
          <DialogDescription>
            Analyze your AI system against EU AI Act requirements and get article-specific recommendations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Enhanced Analysis</AlertTitle>
            <AlertDescription>
              Our AI-powered analyzer will assess your system against key EU AI Act articles and provide tailored recommendations for compliance.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="system-description">AI System Description</Label>
            <Textarea
              id="system-description"
              placeholder="Describe your AI system's purpose, capabilities, and intended use..."
              value={description || systemDescription}
              onChange={handleDescriptionChange}
              rows={6}
              className="resize-none"
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={analyzeCompliance} 
            disabled={!description.trim() || loading}
          >
            {loading ? (
              <>
                <Spinner className="mr-2" />
                Analyzing...
              </>
            ) : (
              "Analyze Compliance"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}