
import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, CheckCircle, FileDown, FileText, 
  Printer, ArrowRight, ChevronDown, ChevronUp, ArrowLeft 
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/language-switcher";

const RiskAssessmentResults: React.FC = () => {
  const { t } = useLanguage();
  const [openSections, setOpenSections] = React.useState<string[]>(['overview', 'classification']);
  
  // Toggle section visibility
  const toggleSection = (section: string) => {
    if (openSections.includes(section)) {
      setOpenSections(openSections.filter(s => s !== section));
    } else {
      setOpenSections([...openSections, section]);
    }
  };
  
  // Check if a section is open
  const isSectionOpen = (section: string) => openSections.includes(section);
  
  // Mock assessment data - in a real app this would come from the API
  const assessmentData = {
    systemName: "Employee Performance Assessment AI",
    riskLevel: "High Risk",
    date: new Date().toLocaleDateString(),
    assessmentId: "RA-" + Math.floor(Math.random() * 10000),
    riskFactors: [
      { name: "Employment Context", severity: "high", description: "Used for employee evaluation and career decisions" },
      { name: "Fundamental Rights", severity: "medium", description: "Could impact employment opportunities and professional development" },
      { name: "Autonomy Level", severity: "medium", description: "Partial autonomy with human verification for key decisions" },
      { name: "Data Types", severity: "high", description: "Processes personal and professional performance data" }
    ],
    relevantArticles: [
      { id: "Art. 6.2", name: "High-Risk AI Systems", description: "Evaluation of natural persons in employment contexts" },
      { id: "Art. 9", name: "Risk Management", description: "Requirements for ongoing risk assessment and mitigation" },
      { id: "Art. 10", name: "Data Governance", description: "Requirements for data quality and governance" },
      { id: "Art. 13", name: "Transparency", description: "Information to be provided to users of high-risk AI systems" },
      { id: "Art. 14", name: "Human Oversight", description: "Requirements for effective human oversight" }
    ],
    complianceGaps: [
      "Human oversight measures require additional documentation and implementation",
      "Transparency information for affected employees needs enhancement",
      "Data governance processes need to be formalized and documented"
    ],
    mitigationMeasures: [
      "Implement detailed human review protocols for all evaluation decisions",
      "Add employee appeals process and feedback mechanism",
      "Enhance decision explanation and transparency features",
      "Document data governance procedures and quality controls"
    ]
  };
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Risk Assessment Results</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Assessment ID: {assessmentData.assessmentId} | Date: {assessmentData.date}
          </p>
        </div>
      </div>
      
      {/* Overview Section */}
      <Collapsible open={isSectionOpen('overview')} className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>System Overview</CardTitle>
              <CollapsibleTrigger onClick={() => toggleSection('overview')} className="hover:bg-muted p-1 rounded">
                {isSectionOpen('overview') ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CollapsibleTrigger>
            </div>
            <CardDescription>{assessmentData.systemName}</CardDescription>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="grid gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Risk Classification</h3>
                  <p className="text-sm text-muted-foreground">EU AI Act compliance status</p>
                </div>
                <Badge variant={assessmentData.riskLevel === "High Risk" ? "destructive" : "default"} className="text-sm">
                  {assessmentData.riskLevel}
                </Badge>
              </div>
              
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>High-Risk AI System</AlertTitle>
                <AlertDescription>
                  This system is classified as high-risk under the EU AI Act Article 6.2 as it is used in employment context for evaluation of natural persons.
                </AlertDescription>
              </Alert>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
      {/* Classification Section */}
      <Collapsible open={isSectionOpen('classification')} className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Classification Factors</CardTitle>
              <CollapsibleTrigger onClick={() => toggleSection('classification')} className="hover:bg-muted p-1 rounded">
                {isSectionOpen('classification') ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CollapsibleTrigger>
            </div>
            <CardDescription>Key factors that influenced the risk classification</CardDescription>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                {assessmentData.riskFactors.map((factor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{factor.name}</h3>
                      <Badge variant={factor.severity === "high" ? "destructive" : "default"}>
                        {factor.severity === "high" ? "High Impact" : "Medium Impact"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{factor.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
      {/* Relevant Articles Section */}
      <Collapsible open={isSectionOpen('articles')} className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Relevant EU AI Act Articles</CardTitle>
              <CollapsibleTrigger onClick={() => toggleSection('articles')} className="hover:bg-muted p-1 rounded">
                {isSectionOpen('articles') ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CollapsibleTrigger>
            </div>
            <CardDescription>Articles that apply to this system</CardDescription>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                {assessmentData.relevantArticles.map((article, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="font-mono">{article.id}</Badge>
                      <h3 className="font-semibold">{article.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{article.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
      {/* Compliance Gaps Section */}
      <Collapsible open={isSectionOpen('gaps')} className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Compliance Gaps</CardTitle>
              <CollapsibleTrigger onClick={() => toggleSection('gaps')} className="hover:bg-muted p-1 rounded">
                {isSectionOpen('gaps') ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CollapsibleTrigger>
            </div>
            <CardDescription>Areas requiring improvement to ensure compliance</CardDescription>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                <ul className="list-disc pl-5 space-y-2">
                  {assessmentData.complianceGaps.map((gap, index) => (
                    <li key={index} className="text-muted-foreground">{gap}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
      {/* Mitigation Measures Section */}
      <Collapsible open={isSectionOpen('mitigation')} className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Recommended Mitigation Measures</CardTitle>
              <CollapsibleTrigger onClick={() => toggleSection('mitigation')} className="hover:bg-muted p-1 rounded">
                {isSectionOpen('mitigation') ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CollapsibleTrigger>
            </div>
            <CardDescription>Actions to address compliance gaps</CardDescription>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                <ul className="space-y-2">
                  {assessmentData.mitigationMeasures.map((measure, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button variant="outline" asChild>
          <Link to="/risk-assessment/wizard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Wizard
          </Link>
        </Button>
        
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/documentation/risk-assessment">
              <FileText className="mr-2 h-4 w-4" /> View Documentation
            </Link>
          </Button>
          <Button asChild>
            <Link to="/compliance">
              Continue to Compliance Plan <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentResults;
