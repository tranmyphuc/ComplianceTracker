import React, { useState } from 'react';
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { Badge } from "../ui/badge";
import { AlertCircle, Bot, SparklesIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

interface RiskAssessmentStepProps {
  formData: {
    riskLevel: string;
    potentialImpact: string;
    mitigationMeasures: string;
    vulnerabilities: string;
    impactsAutonomous: boolean;
    impactsVulnerableGroups: boolean;
    usesDeepLearning: boolean;
    isTransparent: boolean;
    [key: string]: any;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  aiSystemAnalysis?: any;
  errors?: Record<string, string>;
  sghAsiaAiResults?: any;
  setSghAsiaAiResults: React.Dispatch<React.SetStateAction<any>>;
  sghAsiaAiInProgress: boolean;
  setSghAsiaAiInProgress: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RiskAssessmentStep: React.FC<RiskAssessmentStepProps> = ({
  formData,
  setFormData,
  aiSystemAnalysis,
  errors = {},
  sghAsiaAiResults,
  setSghAsiaAiResults,
  sghAsiaAiInProgress,
  setSghAsiaAiInProgress
}) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev: any) => ({ ...prev, [name]: checked }));
  };

  // Handle AI Risk Analysis
  const analyzeRiskWithAI = async () => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    setSghAsiaAiInProgress(true);
    
    try {
      const response = await fetch('/api/analyze/system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const results = await response.json();
      setSghAsiaAiResults(results);

      // Update risk level in form
      if (results.riskLevel) {
        setFormData(prev => ({
          ...prev,
          riskLevel: results.riskLevel
        }));
      }

      // Generate potential impact if empty
      if (!formData.potentialImpact && results.potentialImpact) {
        setFormData(prev => ({
          ...prev,
          potentialImpact: results.potentialImpact
        }));
      }

      toast({
        title: "AI Analysis Complete",
        description: "SGH ASIA AI has analyzed your system and suggested a risk level.",
      });
    } catch (error) {
      console.error('Error analyzing risk:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your AI system. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setSghAsiaAiInProgress(false);
    }
  };

  // Use AI analysis to highlight risk levels
  const showAiAnalysis = !!sghAsiaAiResults;
  
  const aiAnalysisRiskLevel = showAiAnalysis 
    ? sghAsiaAiResults.riskLevel || 'unknown'
    : null;
    
  const aiAnalysisCategory = showAiAnalysis 
    ? sghAsiaAiResults.category || null
    : null;
    
  const relevantArticles = showAiAnalysis && Array.isArray(sghAsiaAiResults.relevantArticles)
    ? sghAsiaAiResults.relevantArticles
    : [];
    
  const suggestedImprovements = showAiAnalysis && Array.isArray(sghAsiaAiResults.suggestedImprovements)
    ? sghAsiaAiResults.suggestedImprovements
    : [];

  return (
    <div className="space-y-6">
      {/* SGH AI Assistant Risk Analyzer Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg p-4 shadow-md border border-blue-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-2 h-10 w-10 flex items-center justify-center">
              <Bot className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <h3 className="font-medium text-white">SGH AI Risk Analyzer</h3>
              <p className="text-blue-100 text-sm">Auto-analyze system risk level based on Steps 1 & 2</p>
            </div>
          </div>
          <Button 
            onClick={analyzeRiskWithAI} 
            disabled={isAnalyzing || sghAsiaAiInProgress}
            className="bg-white text-blue-800 hover:bg-blue-50 flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="h-4 w-4 border-2 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4" />
                Suggest Risk Level
              </>
            )}
          </Button>
        </div>
      </div>

      {showAiAnalysis && (
        <Alert variant={aiAnalysisRiskLevel === "high" ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>AI Analysis Results</AlertTitle>
          <AlertDescription>
            <p>Based on the information provided, this system appears to be a <strong>{aiAnalysisCategory}</strong> system with a <strong>{aiAnalysisRiskLevel}</strong> risk level.</p>
            {relevantArticles.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Relevant EU AI Act Articles:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {relevantArticles.map((article: string, index: number) => (
                    <Badge key={index} variant="outline">{article}</Badge>
                  ))}
                </div>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="riskLevel">Estimated Risk Level <span className="text-red-500">*</span></Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={analyzeRiskWithAI} 
              disabled={isAnalyzing || sghAsiaAiInProgress}
              className="h-7 px-2 text-xs text-blue-700"
            >
              {isAnalyzing ? "Analyzing..." : "Use SGH AI Suggestion"}
            </Button>
          </div>
          <Select
            value={formData.riskLevel}
            onValueChange={(value) => handleSelectChange('riskLevel', value)}
          >
            <SelectTrigger 
              id="riskLevel" 
              className={errors.riskLevel ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">Minimal Risk</SelectItem>
              <SelectItem value="limited">Limited Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
              <SelectItem value="unacceptable">Unacceptable Risk</SelectItem>
            </SelectContent>
          </Select>
          {errors.riskLevel ? (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.riskLevel}
            </p>
          ) : (
            aiAnalysisRiskLevel && formData.riskLevel && formData.riskLevel !== aiAnalysisRiskLevel && (
              <p className="text-xs text-amber-600 mt-1">
                Note: Your selected risk level differs from the AI recommendation ({aiAnalysisRiskLevel}).
              </p>
            )
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="potentialImpact">Potential Impact <span className="text-red-500">*</span></Label>
          <Textarea
            id="potentialImpact"
            name="potentialImpact"
            placeholder="Describe potential impacts on individuals, organizations, or society"
            value={formData.potentialImpact}
            onChange={handleInputChange}
            className={errors.potentialImpact ? "border-red-500" : ""}
            rows={3}
            required
          />
          {errors.potentialImpact && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.potentialImpact}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vulnerabilities">Vulnerabilities</Label>
          <Textarea
            id="vulnerabilities"
            name="vulnerabilities"
            placeholder="Identify any known vulnerabilities or limitations"
            value={formData.vulnerabilities}
            onChange={handleInputChange}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mitigationMeasures">Risk Mitigation Measures</Label>
          <Textarea
            id="mitigationMeasures"
            name="mitigationMeasures"
            placeholder="Describe measures to mitigate identified risks"
            value={formData.mitigationMeasures}
            onChange={handleInputChange}
            rows={2}
          />
        </div>

        <div className="space-y-3 pt-3">
          <Label>Risk Factors</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="impactsAutonomous" 
                checked={formData.impactsAutonomous || false}
                onCheckedChange={(checked) => handleCheckboxChange('impactsAutonomous', checked === true)}
              />
              <label
                htmlFor="impactsAutonomous"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                System makes autonomous decisions
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="impactsVulnerableGroups" 
                checked={formData.impactsVulnerableGroups || false}
                onCheckedChange={(checked) => handleCheckboxChange('impactsVulnerableGroups', checked === true)}
              />
              <label
                htmlFor="impactsVulnerableGroups"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                System may impact vulnerable groups
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="usesDeepLearning" 
                checked={formData.usesDeepLearning || false}
                onCheckedChange={(checked) => handleCheckboxChange('usesDeepLearning', checked === true)}
              />
              <label
                htmlFor="usesDeepLearning"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Uses deep learning or complex ML models
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isTransparent" 
                checked={formData.isTransparent || false}
                onCheckedChange={(checked) => handleCheckboxChange('isTransparent', checked === true)}
              />
              <label
                htmlFor="isTransparent"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                System decisions are explainable and transparent
              </label>
            </div>
          </div>
        </div>
        
        {showAiAnalysis && suggestedImprovements.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Suggested Improvements</h4>
            <ul className="space-y-1 text-xs text-blue-800">
              {suggestedImprovements.map((improvement: string, i: number) => (
                <li key={i}>• {improvement}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};