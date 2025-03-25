import { useState, useEffect } from "react";
import { AssessmentWizard } from "@/components/risk-assessment/assessment-wizard";
import { AdvancedRiskWizard } from "@/components/risk-assessment/advanced-wizard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  RocketIcon, 
  ShieldCheckIcon, 
  ArrowRightIcon,
  InfoIcon,
  ClipboardListIcon,
  FileTextIcon,
  ScanTextIcon,
  LightbulbIcon
} from "lucide-react";
import { useLocation, Link } from "wouter";
import { InlineTip, TipButton, useComplianceTips } from "@/components/compliance-tips";

export default function RiskAssessment() {
  const [activeTab, setActiveTab] = useState("advanced-wizard");
  const [location, navigate] = useLocation();
  const { showTip, recordFeedback } = useComplianceTips();
  
  // Get system ID from URL if available
  const systemId = new URLSearchParams(window.location.search).get("systemId");
  
  // Trigger a specific tip when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      showTip('risk-1');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [showTip]);
  
  // Handle completion of assessment
  const handleAssessmentComplete = (result: any) => {
    console.log("Assessment completed:", result);
    // This could save the assessment to the database or navigate to a results page
    
    // Show a tip when assessment is completed
    showTip('risk-2');
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Risk Assessment</h1>
          <p className="text-neutral-500 mt-1">Evaluate and classify AI systems based on EU AI Act requirements</p>
        </div>
        
        <div className="flex gap-2">
          <Link href="/risk-assessment/text-analyzer">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
            >
              <ScanTextIcon className="h-4 w-4" />
              <span className="hidden sm:inline-block">Text Risk Analyzer</span>
              <span className="inline-block sm:hidden">Analyze Text</span>
            </Button>
          </Link>
          
          <Link href="/register-system">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <RocketIcon className="h-4 w-4" />
              <span className="hidden sm:inline-block">Register New System</span>
              <span className="inline-block sm:hidden">Register</span>
            </Button>
          </Link>
        </div>
      </div>
      
      {systemId ? (
        <div className="mb-6">
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <InfoIcon className="text-blue-500 h-5 w-5 mr-2" />
                <div>
                  <p className="font-medium">Currently assessing system with ID: {systemId}</p>
                  <p className="text-sm text-blue-700">Start a comprehensive risk assessment for this system</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/risk-assessment")}
                className="text-blue-700"
              >
                Clear
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}
      
      {/* Inline tip that's always visible */}
      <div className="mb-6">
        <InlineTip 
          tip={{
            title: "EU AI Act Risk Assessment Requirements",
            content: "Under the EU AI Act, all high-risk AI systems require a comprehensive risk assessment before deployment. Ensure you capture all needed information in this assessment.",
            category: "governance",
            relevantArticles: ["Article 9", "Article 16", "Article 17"],
            learnMoreLink: "/knowledge-center"
          }}
          jackStyle={true}
        />
      </div>
      
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="advanced-wizard" className="gap-2">
              <ShieldCheckIcon className="h-4 w-4" />
              <span className="hidden sm:inline-block">Comprehensive Assessment</span>
              <span className="inline-block sm:hidden">Comprehensive</span>
            </TabsTrigger>
            <TabsTrigger value="standard-wizard" className="gap-2">
              <ClipboardListIcon className="h-4 w-4" />
              <span className="hidden sm:inline-block">Standard Assessment</span>
              <span className="inline-block sm:hidden">Standard</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Tip button that shows a popup when clicked */}
          <TipButton 
            tipId="risk-1" 
            variant="ghost"
          />
        </div>
        
        <TabsContent value="advanced-wizard" className="mt-6">
          <AdvancedRiskWizard 
            systemId={systemId || undefined} 
            onComplete={handleAssessmentComplete}
          />
        </TabsContent>
        
        <TabsContent value="standard-wizard" className="mt-6">
          <Card className="border-neutral-200 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <InfoIcon className="h-4 w-4 mr-1 text-blue-500" />
                Standard Risk Assessment
              </CardTitle>
              <CardDescription>
                This is the standard risk assessment wizard that covers the basic requirements of the EU AI Act.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3 pt-0">
              <div className="flex gap-2 items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Badge variant="secondary" className="w-fit">Legacy Version</Badge>
                  <p className="text-sm text-neutral-500">
                    We recommend using the comprehensive assessment wizard for more detailed analysis.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="gap-1"
                  onClick={() => setActiveTab("advanced-wizard")}
                >
                  Switch to Comprehensive
                  <ArrowRightIcon className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <AssessmentWizard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
