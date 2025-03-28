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
      // Before sending request, make sure we have at least basic information
      if (!formData.name || !formData.department) {
        toast({
          title: "Missing Information",
          description: "Please provide at least a system name and department before analyzing.",
          variant: "destructive"
        });
        setIsAnalyzing(false);
        setSghAsiaAiInProgress(false);
        return;
      }
      
      // First try to analyze using AI text analysis
      const systemDescription = 
        `Name: ${formData.name}\n` +
        `Vendor: ${formData.vendor || 'Unknown'}\n` + 
        `Version: ${formData.version || 'Unknown'}\n` + 
        `Department: ${formData.department}\n` + 
        `Purpose: ${formData.purpose || 'Unknown'}\n` + 
        `Description: ${formData.description || 'Unknown'}\n` + 
        `AI Capabilities: ${formData.aiCapabilities || 'Unknown'}\n` + 
        `Training Datasets: ${formData.trainingDatasets || 'Unknown'}\n` +
        `Usage Context: ${formData.usageContext || 'Unknown'}`;
      
      // Call the AI analysis API with text input
      const analysisResponse = await fetch('/api/analyze/ai-system-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: systemDescription,
          analysisType: 'risk_assessment'
        })
      });

      if (!analysisResponse.ok) {
        console.warn('Text analysis failed, falling back to system data analysis');
        // Fall back to system data analysis if text analysis fails
        return await fallbackToSystemAnalysis();
      }

      // Process AI text analysis response
      const aiResults = await analysisResponse.json();
      
      if (!aiResults || typeof aiResults !== 'object') {
        console.warn('Invalid AI text analysis response, falling back to system data analysis');
        return await fallbackToSystemAnalysis();
      }
      
      // Extract risk assessment data from AI response
      const processedResults = processAIResults(aiResults);
      
      // Update the UI and form data with the results
      updateWithResults(processedResults);
      
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
  
  // Fallback to system data analysis if text analysis fails
  const fallbackToSystemAnalysis = async () => {
    try {
      // Add analysis type parameter to request detailed risk parameters
      const dataToSend = {
        ...formData,
        analysisType: 'detailed_risk_parameters'
      };
      
      // Use enhanced formData for analysis
      const response = await fetch('/api/analyze/system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Safely parse and handle the response
      let results;
      try {
        results = await response.json();
      } catch (parseError) {
        console.error('Failed to parse API response:', parseError);
        throw new Error('Invalid JSON response from server');
      }
      
      // Enhanced safe processing of results
      if (results && typeof results === 'object') {
        // Process detailed risk parameters if available
        if (results.riskFactors && Array.isArray(results.riskFactors)) {
          try {
            // Convert detailed results format to the format expected by our UI
            const processedResults = {
              ...results,
              riskLevel: determineRiskLevelFromFactors(results.riskFactors),
              relevantArticles: extractArticlesFromFactors(results.riskFactors),
              suggestedImprovements: Array.isArray(results.mitigationStrategies) 
                ? results.mitigationStrategies 
                : []
            };
            
            // Update with processed results
            updateWithResults(processedResults);
          } catch (processingError) {
            console.error('Error processing detailed risk factors:', processingError);
            // Fall back to basic processing
            updateWithResults(results);
          }
        } else {
          // Handle basic analysis results
          updateWithResults(results);
        }
      } else {
        // Handle invalid response
        throw new Error("Received invalid response format from API");
      }
      
      return true;
    } catch (error) {
      console.error('Error in fallback analysis:', error);
      throw error;
    }
  };
  
  // Process AI results to extract relevant risk assessment data
  const processAIResults = (aiResults: any) => {
    // Initialize with default structure
    const processedResults: any = {
      riskLevel: 'unknown',
      relevantArticles: [],
      suggestedImprovements: [],
      category: '',
      potentialImpact: '',
      vulnerabilities: [],
      riskFactors: []
    };
    
    try {
      // Extract risk level
      if (aiResults.riskLevel) {
        processedResults.riskLevel = aiResults.riskLevel.toLowerCase();
      } else if (aiResults.riskClassification) {
        processedResults.riskLevel = aiResults.riskClassification.toLowerCase();
      } else if (aiResults.risk_level) {
        processedResults.riskLevel = aiResults.risk_level.toLowerCase();
      }
      
      // Extract system category
      if (aiResults.category) {
        processedResults.category = aiResults.category;
      } else if (aiResults.systemCategory) {
        processedResults.category = aiResults.systemCategory;
      } else if (aiResults.system_type) {
        processedResults.category = aiResults.system_type;
      }
      
      // Extract potential impact
      if (aiResults.potentialImpact) {
        processedResults.potentialImpact = typeof aiResults.potentialImpact === 'string'
          ? aiResults.potentialImpact
          : Array.isArray(aiResults.potentialImpact)
            ? aiResults.potentialImpact.join('. ')
            : '';
      } else if (aiResults.impact) {
        processedResults.potentialImpact = typeof aiResults.impact === 'string'
          ? aiResults.impact
          : Array.isArray(aiResults.impact)
            ? aiResults.impact.join('. ')
            : '';
      }
      
      // Extract relevant EU AI Act articles
      if (aiResults.relevantArticles) {
        processedResults.relevantArticles = Array.isArray(aiResults.relevantArticles)
          ? aiResults.relevantArticles
          : typeof aiResults.relevantArticles === 'string'
            ? [aiResults.relevantArticles]
            : [];
      } else if (aiResults.euAiActArticles) {
        processedResults.relevantArticles = Array.isArray(aiResults.euAiActArticles)
          ? aiResults.euAiActArticles
          : typeof aiResults.euAiActArticles === 'string'
            ? [aiResults.euAiActArticles]
            : [];
      }
      
      // Extract suggestions/improvements
      if (aiResults.suggestedImprovements) {
        processedResults.suggestedImprovements = Array.isArray(aiResults.suggestedImprovements)
          ? aiResults.suggestedImprovements
          : typeof aiResults.suggestedImprovements === 'string'
            ? [aiResults.suggestedImprovements]
            : [];
      } else if (aiResults.mitigationStrategies) {
        processedResults.suggestedImprovements = Array.isArray(aiResults.mitigationStrategies)
          ? aiResults.mitigationStrategies
          : typeof aiResults.mitigationStrategies === 'string'
            ? [aiResults.mitigationStrategies]
            : [];
      } else if (aiResults.recommendations) {
        processedResults.suggestedImprovements = Array.isArray(aiResults.recommendations)
          ? aiResults.recommendations
          : typeof aiResults.recommendations === 'string'
            ? [aiResults.recommendations]
            : [];
      }
      
      // Extract vulnerabilities
      if (aiResults.vulnerabilities) {
        processedResults.vulnerabilities = Array.isArray(aiResults.vulnerabilities)
          ? aiResults.vulnerabilities.join('. ')
          : typeof aiResults.vulnerabilities === 'string'
            ? aiResults.vulnerabilities
            : '';
      }
      
      return processedResults;
    } catch (error) {
      console.error('Error processing AI results:', error);
      return processedResults;
    }
  };
  
  // Update UI and form data with processed results
  const updateWithResults = (results: any) => {
    if (!results) return;
    
    setSghAsiaAiResults(results);
    
    // Update risk level in form if available
    if (results.riskLevel && typeof results.riskLevel === 'string') {
      setFormData(prev => ({
        ...prev,
        riskLevel: results.riskLevel.toLowerCase()
      }));
    }
    
    // Update potential impact if empty and available in results
    if (!formData.potentialImpact && results.potentialImpact) {
      const impact = typeof results.potentialImpact === 'string' 
        ? results.potentialImpact
        : Array.isArray(results.potentialImpact)
          ? results.potentialImpact.join(". ")
          : '';
          
      if (impact) {
        setFormData(prev => ({
          ...prev,
          potentialImpact: impact
        }));
      }
    }
    
    // Update vulnerabilities if empty and available in results
    if (!formData.vulnerabilities && results.vulnerabilities) {
      const vulnerabilities = typeof results.vulnerabilities === 'string' 
        ? results.vulnerabilities
        : Array.isArray(results.vulnerabilities)
          ? results.vulnerabilities.join(". ")
          : '';
          
      if (vulnerabilities) {
        setFormData(prev => ({
          ...prev,
          vulnerabilities: vulnerabilities
        }));
      }
    }
  };
  
  // Helper function to determine risk level from risk factors
  const determineRiskLevelFromFactors = (riskFactors: any[]) => {
    if (!Array.isArray(riskFactors) || riskFactors.length === 0) {
      return 'unknown';
    }
    
    // Calculate average score
    const totalScore = riskFactors.reduce((sum, factor) => sum + (factor.score || 0), 0);
    const avgScore = totalScore / riskFactors.length;
    
    // Determine risk level based on average score
    if (avgScore < 30) return 'unacceptable';
    if (avgScore < 50) return 'high';
    if (avgScore < 80) return 'limited';
    return 'minimal';
  };
  
  // Helper function to extract articles from risk factors
  const extractArticlesFromFactors = (riskFactors: any[]) => {
    if (!Array.isArray(riskFactors)) return [];
    
    const articles = new Set();
    riskFactors.forEach(factor => {
      if (factor.euAiActArticle) {
        articles.add(factor.euAiActArticle);
      }
    });
    
    return Array.from(articles);
  };

  // Use AI analysis to highlight risk levels - with safeguards for malformed responses
  const showAiAnalysis = !!(sghAsiaAiResults && typeof sghAsiaAiResults === 'object');
  
  // Handle server responses with different field names (riskLevel vs riskClassification)
  const aiAnalysisRiskLevel = showAiAnalysis 
    ? sghAsiaAiResults.riskLevel || sghAsiaAiResults.riskClassification || 'unknown'
    : null;
    
  const aiAnalysisCategory = showAiAnalysis 
    ? sghAsiaAiResults.category || sghAsiaAiResults.systemCategory || null
    : null;
    
  // Safely handle potential missing arrays
  // Process and normalize relevant articles to ensure they're always strings
  const relevantArticles = (() => {
    if (!showAiAnalysis) return [];

    let articles = sghAsiaAiResults.relevantArticles || sghAsiaAiResults.euAiActArticles || [];
    
    // If not an array, try to convert to array
    if (!Array.isArray(articles)) {
      if (typeof articles === 'string') {
        articles = [articles];
      } else if (typeof articles === 'object') {
        // If it's an object with articles data, try to extract string values
        articles = [];
      } else {
        articles = [];
      }
    }
    
    // Ensure all items are strings
    return articles.map(article => {
      if (typeof article === 'string') {
        return article;
      } else if (article && typeof article === 'object') {
        // If the article is an object with a name/title property
        return article.name || article.title || article.article || 
               (article.relevant_article ? article.relevant_article : JSON.stringify(article));
      }
      return String(article);
    });
  })();
    
  // Process and normalize suggested improvements to ensure they're always strings
  const suggestedImprovements = (() => {
    if (!showAiAnalysis) return [];
    
    let improvements = sghAsiaAiResults.suggestedImprovements || 
                      sghAsiaAiResults.mitigationStrategies || 
                      sghAsiaAiResults.improvements || [];
    
    // If not an array, try to convert to array
    if (!Array.isArray(improvements)) {
      if (typeof improvements === 'string') {
        improvements = [improvements];
      } else if (typeof improvements === 'object') {
        // If it's an object with improvement data, try to extract string values
        improvements = [];
      } else {
        improvements = [];
      }
    }
    
    // Ensure all items are strings
    return improvements.map(improvement => {
      if (typeof improvement === 'string') {
        return improvement;
      } else if (improvement && typeof improvement === 'object') {
        // If the improvement is an object with a description/text property
        return improvement.description || improvement.text || improvement.implementation || 
               JSON.stringify(improvement);
      }
      return String(improvement);
    });
  })();

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
            <p>Based on the information provided, this system appears to be a <strong>{typeof aiAnalysisCategory === 'string' ? aiAnalysisCategory : 'Unknown'}</strong> system with a <strong>{typeof aiAnalysisRiskLevel === 'string' ? aiAnalysisRiskLevel : 'Unknown'}</strong> risk level.</p>
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
                <li key={i}>• {typeof improvement === 'string' ? improvement : (
                  improvement && typeof improvement === 'object' ? 
                    JSON.stringify(improvement).substring(0, 100) + 
                    (JSON.stringify(improvement).length > 100 ? '...' : '') : 
                    String(improvement)
                )}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};