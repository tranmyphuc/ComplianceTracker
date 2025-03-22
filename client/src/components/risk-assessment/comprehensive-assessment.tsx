
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, HelpCircle, Info, Users, Shield, Database, Eye, Brain, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Risk assessment types
interface RiskCategory {
  id: string;
  name: string;
  description: string;
  questions: RiskQuestion[];
}

interface RiskQuestion {
  id: string;
  question: string;
  description: string;
  type: 'slider' | 'radio' | 'text';
  options?: string[];
  weight: number;
}

interface AssessmentResult {
  categoryScores: Record<string, number>;
  overallScore: number;
  riskLevel: 'High' | 'Limited' | 'Minimal';
  recommendations: string[];
}

const ComprehensiveRiskAssessment: React.FC<{ systemId?: string; onComplete?: (result: AssessmentResult) => void }> = ({ 
  systemId,
  onComplete 
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('fundamental');
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);
  
  // Define risk assessment categories
  const riskCategories: RiskCategory[] = [
    {
      id: 'fundamental',
      name: 'Fundamental Rights Impact',
      description: 'Assess the potential impact on fundamental rights such as privacy, non-discrimination, and human dignity.',
      questions: [
        {
          id: 'privacy_impact',
          question: 'Privacy Impact',
          description: 'How significantly could the system impact individual privacy?',
          type: 'slider',
          weight: 1.5
        },
        {
          id: 'discrimination_potential',
          question: 'Discrimination Potential',
          description: 'Could the system perpetuate or amplify discrimination against protected groups?',
          type: 'radio',
          options: [
            'No risk of discrimination',
            'Low potential for unintended bias',
            'Moderate discrimination concerns',
            'High risk of systematic discrimination'
          ],
          weight: 1.8
        },
        {
          id: 'vulnerable_groups',
          question: 'Vulnerable Groups',
          description: 'Does the system interact with or make decisions affecting vulnerable groups?',
          type: 'radio',
          options: [
            'No interaction with vulnerable groups',
            'Limited interaction with minimal impact',
            'Regular interaction with moderate impact',
            'Significant decision-making affecting vulnerable populations'
          ],
          weight: 1.5
        }
      ]
    },
    {
      id: 'technical',
      name: 'Technical Robustness',
      description: 'Evaluate the technical robustness, reliability and security of the AI system.',
      questions: [
        {
          id: 'accuracy',
          question: 'System Accuracy',
          description: 'How accurately does the system perform its intended function?',
          type: 'slider',
          weight: 1.2
        },
        {
          id: 'reliability',
          question: 'System Reliability',
          description: 'How reliable is the system in terms of consistent performance?',
          type: 'slider',
          weight: 1.0
        },
        {
          id: 'security',
          question: 'Cybersecurity Measures',
          description: 'How comprehensive are the cybersecurity measures protecting the system?',
          type: 'radio',
          options: [
            'Basic security measures only',
            'Standard industry security practices',
            'Enhanced security with regular testing',
            'Comprehensive security with continuous monitoring'
          ],
          weight: 1.3
        }
      ]
    },
    {
      id: 'governance',
      name: 'Data Governance',
      description: 'Assess the data quality, management, and protection practices.',
      questions: [
        {
          id: 'data_quality',
          question: 'Data Quality',
          description: 'How would you rate the quality of data used by the system?',
          type: 'slider',
          weight: 1.2
        },
        {
          id: 'data_protection',
          question: 'Data Protection Measures',
          description: 'What level of data protection measures are implemented?',
          type: 'radio',
          options: [
            'Basic data protection',
            'Standard compliance with regulations',
            'Enhanced protection beyond requirements',
            'Comprehensive protection with regular audits'
          ],
          weight: 1.4
        },
        {
          id: 'data_sources',
          question: 'Data Sources',
          description: 'What are the primary sources of data used by the system?',
          type: 'text',
          weight: 0.8
        }
      ]
    },
    {
      id: 'oversight',
      name: 'Human Oversight',
      description: 'Evaluate the level and effectiveness of human oversight implemented for the AI system.',
      questions: [
        {
          id: 'oversight_mechanisms',
          question: 'Oversight Mechanisms',
          description: 'What human oversight mechanisms are in place?',
          type: 'radio',
          options: [
            'No specific oversight mechanisms',
            'Basic review of system outputs',
            'Regular human review of critical decisions',
            'Comprehensive oversight with intervention capabilities'
          ],
          weight: 1.5
        },
        {
          id: 'human_autonomy',
          question: 'Human Autonomy',
          description: 'To what extent does the system preserve human autonomy in decision-making?',
          type: 'slider',
          weight: 1.3
        },
        {
          id: 'override_capabilities',
          question: 'Override Capabilities',
          description: 'Can humans effectively override system decisions when necessary?',
          type: 'radio',
          options: [
            'No override capability',
            'Limited override with restrictions',
            'Standard override for most functions',
            'Comprehensive override capabilities'
          ],
          weight: 1.4
        }
      ]
    },
    {
      id: 'transparency',
      name: 'Transparency',
      description: 'Assess the explainability and transparency of the AI system and its decisions.',
      questions: [
        {
          id: 'explainability',
          question: 'System Explainability',
          description: 'How explainable are the system\'s decisions to end users?',
          type: 'slider',
          weight: 1.3
        },
        {
          id: 'documentation',
          question: 'Documentation Quality',
          description: 'How comprehensive is the system documentation?',
          type: 'radio',
          options: [
            'Minimal documentation',
            'Basic technical documentation',
            'Comprehensive technical documentation',
            'Full documentation with user-friendly explanations'
          ],
          weight: 1.1
        },
        {
          id: 'disclosure',
          question: 'AI Disclosure',
          description: 'How clearly is the use of AI disclosed to users?',
          type: 'radio',
          options: [
            'No disclosure',
            'Limited disclosure in terms of service',
            'Clear disclosure during system use',
            'Comprehensive disclosure with educational resources'
          ],
          weight: 1.2
        }
      ]
    }
  ];
  
  // Total number of questions across all categories
  const totalQuestions = riskCategories.reduce((total, category) => total + category.questions.length, 0);
  
  // Calculate progress percentage
  const calculateProgress = () => {
    const answeredQuestions = Object.keys(responses).length;
    return (answeredQuestions / totalQuestions) * 100;
  };
  
  // Handle response changes
  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  // Calculate risk score for current tab
  const calculateTabScore = (tabId: string) => {
    const category = riskCategories.find(cat => cat.id === tabId);
    if (!category) return 0;
    
    let score = 0;
    let totalWeight = 0;
    
    category.questions.forEach(question => {
      const response = responses[question.id];
      totalWeight += question.weight;
      
      if (response !== undefined) {
        if (question.type === 'slider') {
          score += (response / 100) * question.weight;
        } else if (question.type === 'radio' && question.options) {
          const valueIndex = question.options.indexOf(response);
          if (valueIndex !== -1) {
            score += ((valueIndex + 1) / question.options.length) * question.weight;
          }
        } else if (question.type === 'text' && response.trim() !== '') {
          // For text inputs, just check if they're completed
          score += 0.5 * question.weight;
        }
      }
    });
    
    return totalWeight > 0 ? (score / totalWeight) * 100 : 0;
  };
  
  // Next step handler
  const handleNextStep = () => {
    const categoryIndex = riskCategories.findIndex(cat => cat.id === activeTab);
    if (categoryIndex < riskCategories.length - 1) {
      setActiveTab(riskCategories[categoryIndex + 1].id);
    } else {
      // Calculate final assessment
      calculateAssessment();
    }
  };
  
  // Previous step handler
  const handlePrevStep = () => {
    const categoryIndex = riskCategories.findIndex(cat => cat.id === activeTab);
    if (categoryIndex > 0) {
      setActiveTab(riskCategories[categoryIndex - 1].id);
    }
  };
  
  // Calculate final assessment
  const calculateAssessment = async () => {
    setIsAssessing(true);
    
    try {
      // Calculate scores for each category
      const categoryScores: Record<string, number> = {};
      riskCategories.forEach(category => {
        categoryScores[category.name] = calculateTabScore(category.id);
      });
      
      // Calculate overall score (weighted average)
      const totalScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0);
      const overallScore = totalScore / Object.keys(categoryScores).length;
      
      // Determine risk level
      let riskLevel: 'High' | 'Limited' | 'Minimal';
      if (overallScore >= 70) {
        riskLevel = 'Minimal';
      } else if (overallScore >= 40) {
        riskLevel = 'Limited';
      } else {
        riskLevel = 'High';
      }
      
      // Generate recommendations
      const recommendations = generateRecommendations(categoryScores, responses);
      
      // Create final assessment result
      const result: AssessmentResult = {
        categoryScores,
        overallScore,
        riskLevel,
        recommendations
      };
      
      // Set assessment result
      setAssessmentResult(result);
      
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete(result);
      }
      
      // Show success toast
      toast({
        title: "Risk Assessment Complete",
        description: "Your comprehensive risk assessment has been successfully completed.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error calculating assessment:", error);
      toast({
        title: "Assessment Error",
        description: "There was an error completing the risk assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAssessing(false);
    }
  };
  
  // Generate recommendations based on scores and responses
  const generateRecommendations = (categoryScores: Record<string, number>, responses: Record<string, any>): string[] => {
    const recommendations: string[] = [];
    
    // Add recommendations based on category scores
    Object.entries(categoryScores).forEach(([category, score]) => {
      if (score < 40) {
        switch (category) {
          case 'Fundamental Rights Impact':
            recommendations.push("Conduct a detailed Fundamental Rights Impact Assessment (FRIA) to address high-risk concerns in fundamental rights impacts.");
            recommendations.push("Implement specific safeguards for privacy and anti-discrimination measures.");
            break;
          case 'Technical Robustness':
            recommendations.push("Enhance technical robustness through additional testing and validation procedures.");
            recommendations.push("Implement a comprehensive error handling and fallback system.");
            break;
          case 'Data Governance':
            recommendations.push("Review and enhance data quality management processes and data protection measures.");
            recommendations.push("Document data sources, processing methods, and implement regular data quality audits.");
            break;
          case 'Human Oversight':
            recommendations.push("Strengthen human oversight mechanisms with clear intervention protocols.");
            recommendations.push("Implement training for human overseers to effectively monitor and intervene in AI operations.");
            break;
          case 'Transparency':
            recommendations.push("Improve system explainability and documentation to enhance transparency.");
            recommendations.push("Develop clear communication materials about AI functionality for end-users.");
            break;
        }
      } else if (score < 70) {
        switch (category) {
          case 'Fundamental Rights Impact':
            recommendations.push("Review fundamental rights protections and consider additional safeguards where appropriate.");
            break;
          case 'Technical Robustness':
            recommendations.push("Consider enhancing technical validation procedures for improved system reliability.");
            break;
          case 'Data Governance':
            recommendations.push("Review data governance practices to ensure ongoing compliance with best practices.");
            break;
          case 'Human Oversight':
            recommendations.push("Evaluate and potentially enhance human oversight mechanisms for critical decisions.");
            break;
          case 'Transparency':
            recommendations.push("Consider improvements to system documentation and user communications.");
            break;
        }
      }
    });
    
    // Make sure we have at least a few recommendations
    if (recommendations.length === 0) {
      recommendations.push("Maintain current compliance measures and continue regular monitoring.");
      recommendations.push("Consider periodic reassessment as the system evolves or regulations change.");
    }
    
    return recommendations;
  };
  
  // Render question based on type
  const renderQuestion = (question: RiskQuestion) => {
    switch (question.type) {
      case 'slider':
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Low Risk</span>
              <span>High Risk</span>
            </div>
            <Slider
              value={[responses[question.id] || 50]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => handleResponseChange(question.id, value[0])}
              className="py-2"
            />
            <div className="text-right text-sm">
              Risk Level: {responses[question.id] || 50}/100
            </div>
          </div>
        );
      case 'radio':
        return (
          <RadioGroup
            value={responses[question.id] || ''}
            onValueChange={(value) => handleResponseChange(question.id, value)}
            className="space-y-2"
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-option-${index}`} />
                <Label htmlFor={`${question.id}-option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'text':
        return (
          <Textarea
            placeholder="Enter your response..."
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="min-h-32"
          />
        );
      default:
        return null;
    }
  };
  
  // Render each category tab
  const renderCategoryTab = (category: RiskCategory) => {
    return (
      <TabsContent value={category.id} className="space-y-6 py-2">
        <div className="flex items-center space-x-2">
          {getRiskIcon(category.id)}
          <div>
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
        </div>
        
        <div className="space-y-8">
          {category.questions.map((question) => (
            <div key={question.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{question.question}</h4>
                  <p className="text-sm text-muted-foreground">{question.description}</p>
                </div>
                <Badge variant="outline" className="ml-2">Weight: {question.weight.toFixed(1)}</Badge>
              </div>
              <div className="pt-2">
                {renderQuestion(question)}
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
    );
  };
  
  // Get icon for risk category
  const getRiskIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'fundamental':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'technical':
        return <Shield className="h-5 w-5 text-green-500" />;
      case 'governance':
        return <Database className="h-5 w-5 text-amber-500" />;
      case 'oversight':
        return <Eye className="h-5 w-5 text-purple-500" />;
      case 'transparency':
        return <Info className="h-5 w-5 text-indigo-500" />;
      default:
        return <HelpCircle className="h-5 w-5" />;
    }
  };
  
  // Render risk level badge
  const renderRiskLevelBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High':
        return (
          <Badge variant="destructive" className="text-sm px-3 py-1">
            <AlertCircle className="mr-1 h-4 w-4" />
            High Risk
          </Badge>
        );
      case 'Limited':
        return (
          <Badge variant="warning" className="text-sm px-3 py-1 bg-amber-500">
            <AlertTriangle className="mr-1 h-4 w-4" />
            Limited Risk
          </Badge>
        );
      case 'Minimal':
        return (
          <Badge variant="success" className="text-sm px-3 py-1 bg-green-500">
            <CheckCircle className="mr-1 h-4 w-4" />
            Minimal Risk
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Render results view
  const renderResults = () => {
    if (!assessmentResult) return null;
    
    return (
      <div className="space-y-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Overall Risk Assessment</h3>
              <p className="text-sm text-muted-foreground">Based on your comprehensive assessment</p>
            </div>
            <div className="flex items-center space-x-4">
              {renderRiskLevelBadge(assessmentResult.riskLevel)}
              <div className="text-2xl font-bold">
                {Math.round(assessmentResult.overallScore)}
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="mb-3 font-medium">Score Breakdown</h4>
            <div className="space-y-3">
              {Object.entries(assessmentResult.categoryScores).map(([category, score]) => (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{category}</span>
                    <span className="font-medium">{Math.round(score)}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Key Recommendations</h3>
          <ul className="space-y-2">
            {assessmentResult.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">EU AI Act Compliance Next Steps</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Based on your risk assessment, here are recommended next steps for compliance with the EU AI Act:
          </p>
          
          <div className="space-y-4">
            {assessmentResult.riskLevel === 'High' && (
              <div className="p-4 rounded-md bg-red-50 border border-red-200">
                <h4 className="font-medium text-red-800 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" /> High-Risk AI System Requirements
                </h4>
                <p className="mt-1 text-sm text-red-700">
                  Your system falls under the high-risk category. You must comply with all stringent requirements in Articles 8-15, including:
                </p>
                <ul className="mt-2 text-sm text-red-700 space-y-1 list-disc pl-5">
                  <li>Implement a comprehensive risk management system</li>
                  <li>Ensure data governance with high-quality datasets</li>
                  <li>Create detailed technical documentation</li>
                  <li>Enable automatic logging of events</li>
                  <li>Design for effective human oversight</li>
                  <li>Achieve appropriate levels of accuracy and robustness</li>
                </ul>
              </div>
            )}
            
            {assessmentResult.riskLevel === 'Limited' && (
              <div className="p-4 rounded-md bg-amber-50 border border-amber-200">
                <h4 className="font-medium text-amber-800 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" /> Limited Risk AI System Requirements
                </h4>
                <p className="mt-1 text-sm text-amber-700">
                  Your system falls under the limited risk category, which requires specific transparency obligations:
                </p>
                <ul className="mt-2 text-sm text-amber-700 space-y-1 list-disc pl-5">
                  <li>Notify users they are interacting with an AI system</li>
                  <li>Inform users when content is AI-generated</li>
                  <li>Disclose when emotion recognition or biometric categorization is used</li>
                  <li>Label deepfakes or manipulated content</li>
                </ul>
              </div>
            )}
            
            {assessmentResult.riskLevel === 'Minimal' && (
              <div className="p-4 rounded-md bg-green-50 border border-green-200">
                <h4 className="font-medium text-green-800 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" /> Minimal Risk AI System Requirements
                </h4>
                <p className="mt-1 text-sm text-green-700">
                  Your system falls under the minimal risk category, which has the fewest regulatory requirements:
                </p>
                <ul className="mt-2 text-sm text-green-700 space-y-1 list-disc pl-5">
                  <li>Voluntary compliance with codes of conduct is encouraged</li>
                  <li>Consider implementing basic transparency measures as best practice</li>
                  <li>Monitor for changes in system usage or functionality that might change risk category</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => setAssessmentResult(null)}>
            Back to Assessment
          </Button>
          <Button>
            Save Assessment Results
          </Button>
          <Button variant="default">
            Generate Compliance Report
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Comprehensive Risk Assessment</CardTitle>
        <CardDescription>
          Complete this assessment to evaluate the risk level of your AI system under the EU AI Act framework
        </CardDescription>
        
        {!assessmentResult && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Assessment Progress</span>
              <span className="text-sm text-muted-foreground">
                {Object.keys(responses).length}/{totalQuestions} Questions
              </span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {assessmentResult ? (
          renderResults()
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
              {riskCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  <span className="hidden md:inline">{category.name}</span>
                  <span className="md:hidden">{category.name.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {riskCategories.map((category) => renderCategoryTab(category))}
          </Tabs>
        )}
      </CardContent>
      
      {!assessmentResult && (
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={handlePrevStep}
            disabled={activeTab === riskCategories[0].id}
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNextStep}
            disabled={isAssessing}
          >
            {activeTab === riskCategories[riskCategories.length - 1].id ? 'Complete Assessment' : 'Next'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ComprehensiveRiskAssessment;
