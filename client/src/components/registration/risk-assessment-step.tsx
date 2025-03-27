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
            
            setSghAsiaAiResults(processedResults);
            
            // Update form data with determined risk level
            if (processedResults.riskLevel && typeof processedResults.riskLevel === 'string') {
              setFormData((prev: any) => ({
                ...prev,
                riskLevel: processedResults.riskLevel
              }));
            }
            
            // Generate potential impact if empty
            if (!formData.potentialImpact && results.specificConcerns) {
              const concerns = Array.isArray(results.specificConcerns) 
                ? results.specificConcerns 
                : typeof results.specificConcerns === 'string'
                  ? [results.specificConcerns]
                  : [];
                  
              if (concerns.length > 0) {
                const impact = concerns.join(". ");
                setFormData((prev: any) => ({
                  ...prev,
                  potentialImpact: impact
                }));
              }
            }
          } catch (processingError) {
            console.error('Error processing detailed risk factors:', processingError);
            // Fall back to basic processing
            handleBasicResults(results);
          }
        } else {
          // Handle basic analysis results
          handleBasicResults(results);
        }
      } else {
        // Handle invalid response
        throw new Error("Received invalid response format from API");
      }
      
      // Helper function to handle basic analysis results
      function handleBasicResults(results: any) {
        setSghAsiaAiResults(results);
        
        // Update risk level in form - with additional validation
        const riskLevel = results.riskLevel || results.riskClassification;
        if (riskLevel && typeof riskLevel === 'string') {
          setFormData(prev => ({
            ...prev,
            riskLevel: riskLevel
          }));
        }
        
        // Generate potential impact if empty
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
      {/* SGH ASIA AI Advanced Risk Analyzer Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-800 text-white rounded-lg p-4 shadow-md border border-blue-700">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-2 h-10 w-10 flex items-center justify-center">
                <Bot className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="font-medium text-white">SGH ASIA AI Risk Analyzer</h3>
                <p className="text-blue-100 text-sm">AI-powered EU AI Act compliance assessment</p>
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
                  Analyze with SGH ASIA AI
                </>
              )}
            </Button>
          </div>
          
          <div className="text-xs text-blue-200 bg-blue-900/50 p-2 rounded">
            <p className="font-medium">What SGH ASIA AI will do:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Automatically classify your system based on EU AI Act criteria</li>
              <li>Determine appropriate risk level and regulatory requirements</li>
              <li>Identify relevant EU AI Act articles and compliance needs</li>
              <li>Suggest mitigation strategies and documentation requirements</li>
            </ul>
          </div>
        </div>
      </div>

      {showAiAnalysis && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 overflow-hidden">
          <div className="bg-blue-700 text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-4 w-4" />
              <h3 className="font-medium">SGH ASIA AI Analysis Results</h3>
            </div>
            <Badge variant="outline" className="bg-white text-blue-700 border-none">
              {typeof aiAnalysisRiskLevel === 'string' ? aiAnalysisRiskLevel.charAt(0).toUpperCase() + aiAnalysisRiskLevel.slice(1) : 'Unknown'} Risk
            </Badge>
          </div>
          
          <div className="p-4 space-y-3">
            <div>
              <p className="text-sm">Based on the information provided, this system appears to be a:</p>
              <p className="font-medium text-blue-800 mt-1">{typeof aiAnalysisCategory === 'string' ? aiAnalysisCategory : 'AI System'} with {typeof aiAnalysisRiskLevel === 'string' ? aiAnalysisRiskLevel : 'unknown'} risk classification</p>
            </div>
            
            {relevantArticles.length > 0 && (
              <div>
                <p className="text-sm font-medium text-blue-800">Relevant EU AI Act Articles:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {relevantArticles.map((article: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">{article}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {suggestedImprovements.length > 0 && (
              <div>
                <p className="text-sm font-medium text-blue-800">Suggested Compliance Measures:</p>
                <ul className="text-sm mt-1 space-y-1 list-disc list-inside text-gray-700">
                  {suggestedImprovements.slice(0, 3).map((improvement: string, index: number) => (
                    <li key={index}>{improvement}</li>
                  ))}
                  {suggestedImprovements.length > 3 && (
                    <li className="text-blue-600 cursor-pointer hover:underline">
                      +{suggestedImprovements.length - 3} more recommendations...
                    </li>
                  )}
                </ul>
              </div>
            )}
            
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
              <SparklesIcon className="h-3 w-3" />
              <span>Analysis provided by SGH ASIA AI Compliance Engine</span>
            </div>
          </div>
        </div>
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
              {isAnalyzing ? "Analyzing..." : "Use SGH ASIA AI Suggestion"}
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