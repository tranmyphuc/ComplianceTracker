import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Download, ExternalLink, FileText, BarChart, CheckCircle2, AlertCircle, BookOpen, Euro } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

// Define risk levels
enum RiskLevel {
  UNACCEPTABLE = "Unacceptable Risk",
  HIGH = "High Risk",
  LIMITED = "Limited Risk",
  MINIMAL = "Minimal Risk"
}

// Phase type for implementation timeline
interface Phase {
  title: string;
  timeline: string;
  tasks: string[];
  isExpanded?: boolean;
}

// Financial projection type
interface FinancialProjection {
  year: string;
  revenue: number;
  costs: number;
  profit: number;
}

// Pricing package type
interface PricingPackage {
  title: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

// Investment details interface
interface InvestmentDetail {
  category: string;
  amount: number;
  description: string;
  percentage: number;
  subItems?: InvestmentDetail[];
  isExpanded?: boolean;
}

// Resource allocation interface
interface ResourceAllocation {
  category: string;
  percentage: number;
  description: string;
}

// Risk mitigation interface
interface RiskMitigation {
  risk: string;
  impact: string;
  likelihood: string;
  mitigation: string;
}

export default function BusinessPlanPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // State for the expandable phases
  const [phases, setPhases] = useState<Phase[]>([
    {
      title: "Phase 1: Platform Development & MVP Launch",
      timeline: "Q2-Q3 2025",
      tasks: [
        "Develop core compliance assessment modules",
        "Create documentation templates for high-risk systems",
        "Build AI knowledge base with initial content",
        "Implement basic reporting functionality",
        "Launch MVP to early adopters"
      ],
      isExpanded: false
    },
    {
      title: "Phase 2: Enhanced Features & Market Expansion",
      timeline: "Q3-Q4 2025",
      tasks: [
        "Add advanced risk assessment capabilities",
        "Implement AI-assisted documentation generation",
        "Develop compliance workflow management",
        "Expand knowledge base with sector-specific guidance",
        "Launch marketing campaign targeting regulated industries"
      ],
      isExpanded: false
    },
    {
      title: "Phase 3: Enterprise Integration & Advanced AI",
      timeline: "Q1-Q2 2026",
      tasks: [
        "Implement enterprise integrations (SAP, Salesforce, etc.)",
        "Develop advanced compliance monitoring with real-time alerts",
        "Add multi-language support for international clients",
        "Create AI-powered regulatory update monitoring",
        "Establish partnership program with consultancies"
      ],
      isExpanded: false
    },
    {
      title: "Phase 4: Global Expansion & Advanced Features",
      timeline: "Q3-Q4 2026",
      tasks: [
        "Expand to additional jurisdictions (UK, US, Canada, etc.)",
        "Develop API ecosystem for third-party integrations",
        "Implement advanced analytics and benchmarking",
        "Create industry-specific compliance templates",
        "Launch white-label solution for partners"
      ],
      isExpanded: false
    }
  ]);
  
  // State for investment details
  const [investmentDetails, setInvestmentDetails] = useState<InvestmentDetail[]>([
    { 
      category: "Technical Development", 
      amount: 650000, 
      description: "Software development, cloud infrastructure, DevOps, and QA testing", 
      percentage: 43,
      subItems: [
        { category: "Frontend Development", amount: 200000, description: "UI components, responsive design, client-side features", percentage: 13 },
        { category: "Backend Development", amount: 180000, description: "API services, database optimization, authentication", percentage: 12 },
        { category: "DevOps & Infrastructure", amount: 150000, description: "CI/CD pipeline, cloud services, monitoring systems", percentage: 10 },
        { category: "QA & Testing", amount: 120000, description: "Automated testing, manual testing, security audits", percentage: 8 }
      ]
    },
    { 
      category: "AI & Data Science", 
      amount: 350000, 
      description: "AI model development, training, and validation services", 
      percentage: 23,
      subItems: [
        { category: "LLM Integration", amount: 120000, description: "AI APIs integration, prompt engineering, context handling", percentage: 8 },
        { category: "Training Data Preparation", amount: 90000, description: "Dataset curation, labeling, enhancement for EU AI Act specifics", percentage: 6 },
        { category: "Model Validation", amount: 80000, description: "Testing, validation against compliance benchmarks", percentage: 5 },
        { category: "AI Explainability Tools", amount: 60000, description: "Transparency mechanisms, decision explanations", percentage: 4 }
      ]
    },
    { 
      category: "Compliance Research", 
      amount: 180000, 
      description: "Legal expertise, regulatory analysis, and compliance framework development", 
      percentage: 12,
      subItems: [
        { category: "Regulatory Analysis", amount: 70000, description: "Deep legal research on EU AI Act requirements", percentage: 5 },
        { category: "Framework Development", amount: 60000, description: "Creating compliance methodologies and assessment tools", percentage: 4 },
        { category: "Legal Content Creation", amount: 50000, description: "Documentation templates, guidance materials", percentage: 3 }
      ]
    },
    { 
      category: "Sales & Marketing", 
      amount: 220000, 
      description: "Market launch, client acquisition, and brand development", 
      percentage: 15,
      subItems: [
        { category: "Go-to-Market Strategy", amount: 80000, description: "Market positioning, pricing strategy, launch plan", percentage: 5 },
        { category: "Digital Marketing", amount: 70000, description: "Content marketing, SEO, paid acquisition", percentage: 5 },
        { category: "Sales Team", amount: 70000, description: "Sales personnel, training, CRM setup", percentage: 5 }
      ]
    },
    { 
      category: "Operations & Admin", 
      amount: 100000, 
      description: "General operational costs and administrative overhead", 
      percentage: 7,
      subItems: [
        { category: "Project Management", amount: 40000, description: "Program coordination, timeline management", percentage: 3 },
        { category: "Administrative Support", amount: 35000, description: "Administrative staff, operational expenses", percentage: 2 },
        { category: "Business Tools", amount: 25000, description: "Software subscriptions, productivity tools", percentage: 2 }
      ]
    }
  ]);

  // Resource allocation data
  const resourceAllocation: ResourceAllocation[] = [
    { 
      category: "Engineering", 
      percentage: 40, 
      description: "Software engineers, DevOps, QA specialists"
    },
    { 
      category: "AI/ML Specialists", 
      percentage: 20, 
      description: "Data scientists, ML engineers, prompt engineers"
    },
    { 
      category: "Compliance & Legal", 
      percentage: 15, 
      description: "Compliance experts, legal advisors, regulatory specialists"
    },
    { 
      category: "Product & UX", 
      percentage: 10, 
      description: "Product managers, designers, UX researchers"
    },
    { 
      category: "Sales & Marketing", 
      percentage: 10, 
      description: "Sales team, marketing specialists, customer success"
    },
    { 
      category: "Administration", 
      percentage: 5, 
      description: "General administrative and management"
    }
  ];

  // Risk mitigation strategies
  const riskMitigationStrategies: RiskMitigation[] = [
    {
      risk: "Regulatory changes",
      impact: "High",
      likelihood: "Medium",
      mitigation: "Maintain close monitoring of regulatory developments with dedicated legal team; implement modular architecture for rapid adaptation"
    },
    {
      risk: "Market adoption delays",
      impact: "Medium",
      likelihood: "Medium",
      mitigation: "Early adopter program with incentives; phased rollout strategy; robust customer feedback loops"
    },
    {
      risk: "Technical integration challenges",
      impact: "Medium",
      likelihood: "High",
      mitigation: "Standardized API development; pre-built connectors for major enterprise systems; dedicated integration support team"
    },
    {
      risk: "Competitive pressure",
      impact: "Medium",
      likelihood: "High",
      mitigation: "Continuous innovation; focus on differentiated AI capabilities; strategic partnerships with consultancies"
    },
    {
      risk: "Resource constraints",
      impact: "High",
      likelihood: "Medium",
      mitigation: "Staged funding approach; flexible resourcing model with core team and expert contractors; prioritization framework"
    }
  ];
  
  // Financial projections data
  const financialProjections: FinancialProjection[] = [
    { year: "2025", revenue: 1250000, costs: 870000, profit: 380000 },
    { year: "2026", revenue: 4100000, costs: 2130000, profit: 1970000 },
    { year: "2027", revenue: 8750000, costs: 3950000, profit: 4800000 }
  ];
  
  // Pricing packages
  const pricingPackages: PricingPackage[] = [
    {
      title: "Essential",
      price: "€10,000",
      description: "For organizations with limited AI systems or just beginning their compliance journey",
      features: [
        "Risk assessment for up to 5 AI systems",
        "Basic documentation templates",
        "EU AI Act knowledge base access",
        "Compliance gap analysis",
        "Email support"
      ]
    },
    {
      title: "Professional",
      price: "€25,000",
      description: "For organizations with multiple AI systems requiring comprehensive compliance management",
      features: [
        "Risk assessment for up to 20 AI systems",
        "Advanced documentation generation",
        "AI-assisted compliance recommendations",
        "Workflow management for compliance tasks",
        "Regulatory updates monitoring",
        "Technical documentation export",
        "Priority support with 24-hour response"
      ],
      recommended: true
    },
    {
      title: "Enterprise",
      price: "€60,000+",
      description: "For large organizations with complex AI deployments and stringent compliance requirements",
      features: [
        "Unlimited AI systems",
        "Custom compliance workflows",
        "Enterprise system integrations",
        "Multi-jurisdiction compliance",
        "Advanced analytics and reporting",
        "API access for custom integrations",
        "Dedicated account manager",
        "Custom training and onboarding",
        "SLA with guaranteed response times"
      ]
    }
  ];
  
  // Toggle phase expansion
  const togglePhaseExpansion = (index: number) => {
    setPhases(prevPhases => 
      prevPhases.map((phase, i) => 
        i === index ? { ...phase, isExpanded: !phase.isExpanded } : phase
      )
    );
  };
  
  // Download business plan PDF
  const downloadBusinessPlan = () => {
    // In a real implementation, this would generate or fetch a PDF
    toast({
      title: "Download Started",
      description: "Your business plan PDF is being prepared for download.",
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Feature Coming Soon",
        description: "The PDF download feature will be available in the next update.",
      });
    }, 2000);
  };
  
  // State for customization mode
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const [customInvestmentFocus, setCustomInvestmentFocus] = useState("balanced");
  
  // Toggle customization mode
  const toggleCustomizeMode = () => {
    setIsCustomizeMode(!isCustomizeMode);
    if (!isCustomizeMode) {
      toast({
        title: "Customize Mode Enabled",
        description: "You can now adjust implementation parameters to fit your organization's needs.",
      });
    } else {
      toast({
        title: "Changes Saved",
        description: "Your customized implementation plan has been saved.",
      });
    }
  };
  
  // Function to customize implementation plan based on focus area
  const customizeImplementationPlan = (focusArea: string) => {
    setCustomInvestmentFocus(focusArea);
    toast({
      title: "Plan Updated",
      description: `Implementation plan adjusted with focus on ${focusArea} priorities.`,
    });
  };
  
  // Animation variants for motion elements
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SGH ASIA - EU AI Act Compliance Platform</h1>
          <p className="text-muted-foreground mt-2">
            Business Plan & Implementation Strategy
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={downloadBusinessPlan}>
            <Download className="mr-2 h-4 w-4" />
            Download Plan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="executive-summary" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="executive-summary">Executive Summary</TabsTrigger>
          <TabsTrigger value="market-analysis">Market Analysis</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>
        
        {/* Executive Summary Tab */}
        <TabsContent value="executive-summary" className="space-y-4 py-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card>
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
                <CardDescription>
                  Overview of SGH ASIA's EU AI Act Compliance Platform business opportunity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  This business plan outlines the market opportunity, implementation strategy, and financial projections for SGH ASIA's EU AI Act Compliance Platform. The platform will help organizations navigate the complex requirements of the European Union's Artificial Intelligence Act, ensuring compliance while minimizing costs and operational disruptions.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <BarChart className="h-10 w-10 mx-auto text-primary mb-4" />
                      <h3 className="font-medium">Market Size</h3>
                      <div className="text-3xl font-bold text-primary mt-2">€66.4B</div>
                      <p className="text-sm text-muted-foreground">European AI market in 2025</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <AlertCircle className="h-10 w-10 mx-auto text-primary mb-4" />
                      <h3 className="font-medium">Non-Compliance Penalty</h3>
                      <div className="text-3xl font-bold text-primary mt-2">€35M</div>
                      <p className="text-sm text-muted-foreground">or 7% of annual turnover</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Euro className="h-10 w-10 mx-auto text-primary mb-4" />
                      <h3 className="font-medium">Projected 3-Year ROI</h3>
                      <div className="text-3xl font-bold text-primary mt-2">523%</div>
                      <p className="text-sm text-muted-foreground">For SGH ASIA's investment</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-muted p-6 rounded-lg mt-6">
                  <h3 className="text-lg font-semibold mb-4">Key Business Opportunity</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>Regulatory imperative: All EU AI deployments require compliance by August 2026</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>Significant market demand: Companies unprepared for compliance requirements</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>High stakes: Non-compliance penalties up to €35M or 7% of global annual turnover</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>Differentiated solution: Combines compliance expertise with cutting-edge technology</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      <span>Scalable platform: Expandable to other regions and compliance frameworks</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        {/* Market Analysis Tab */}
        <TabsContent value="market-analysis" className="space-y-4 py-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card>
              <CardHeader>
                <CardTitle>Market Analysis</CardTitle>
                <CardDescription>
                  Analysis of the EU AI Act compliance market opportunity and competitive landscape
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Market Size & Opportunity</h3>
                  <p className="text-muted-foreground mb-4">
                    The European artificial intelligence market is valued at <span className="bg-yellow-100 px-1">€66.4 billion in 2025</span> and is projected to grow at a CAGR of 33.2% through 2030. With the EU AI Act now in force, every organization developing or deploying AI systems within the EU must comply with its requirements, creating a substantial market for compliance solutions.
                  </p>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Key Market Drivers</h4>
                    <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                      <li>The EU AI Act entered into force on August 1, 2024, with full applicability by August 2, 2026</li>
                      <li>An estimated 72% of organizations now use AI for at least one business function, all requiring compliance</li>
                      <li>Compliance with the EU AI Act costs organizations between €29,000 and €400,000 per AI system</li>
                      <li>Total industry compliance costs are estimated between €1.6 billion and €3.3 billion annually</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Compliance Requirements & Pain Points</h3>
                  <p className="text-muted-foreground mb-4">
                    The EU AI Act imposes a risk-based regulatory framework with four levels of AI systems:
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border px-4 py-2 text-left">Risk Level</th>
                          <th className="border px-4 py-2 text-left">Examples</th>
                          <th className="border px-4 py-2 text-left">Key Requirements</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-4 py-2"><strong>{RiskLevel.UNACCEPTABLE}</strong></td>
                          <td className="border px-4 py-2">Social scoring, manipulation, exploitation of vulnerabilities</td>
                          <td className="border px-4 py-2">Prohibited from development or deployment</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2"><strong>{RiskLevel.HIGH}</strong></td>
                          <td className="border px-4 py-2">Critical infrastructure, education, employment, law enforcement</td>
                          <td className="border px-4 py-2">
                            Risk management, data governance, documentation, human oversight, transparency, technical robustness
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2"><strong>{RiskLevel.LIMITED}</strong></td>
                          <td className="border px-4 py-2">Chatbots, emotion recognition systems, deepfakes</td>
                          <td className="border px-4 py-2">Transparency obligations, disclosure requirements</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2"><strong>{RiskLevel.MINIMAL}</strong></td>
                          <td className="border px-4 py-2">Simple AI video games, spam filters, inventory systems</td>
                          <td className="border px-4 py-2">Voluntary codes of conduct</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Compliance Costs & Penalties</h3>
                  <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                    <li><strong>Compliance Costs:</strong> €29,000 per AI model on average, up to €400,000 for high-risk systems</li>
                    <li>
                      <strong>Penalties for Non-Compliance:</strong>
                      <ul className="list-circle ml-6 mt-1 space-y-1">
                        <li>Up to <span className="bg-yellow-100 px-1">€35 million or 7% of annual worldwide turnover</span> for prohibited practices</li>
                        <li>Up to €15 million or 3% of annual worldwide turnover for most violations</li>
                        <li>Up to €7.5 million or 1.5% of annual worldwide turnover for providing incorrect information</li>
                      </ul>
                    </li>
                    <li><strong>Business Disruption:</strong> Non-compliant AI systems cannot be deployed in the EU market</li>
                    <li><strong>Reputational Damage:</strong> Public notification of non-compliance</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Competitive Landscape</h3>
                  <p className="text-muted-foreground mb-4">
                    The EU AI Act compliance solution market is still emerging, with several key players:
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border px-4 py-2 text-left">Provider</th>
                          <th className="border px-4 py-2 text-left">Solution Type</th>
                          <th className="border px-4 py-2 text-left">Target Market</th>
                          <th className="border px-4 py-2 text-left">Pricing</th>
                          <th className="border px-4 py-2 text-left">Market Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-4 py-2">OneTrust</td>
                          <td className="border px-4 py-2">Comprehensive governance platform</td>
                          <td className="border px-4 py-2">Enterprise</td>
                          <td className="border px-4 py-2">€50,000+ annually</td>
                          <td className="border px-4 py-2">Market leader; expensive</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">Holistic AI</td>
                          <td className="border px-4 py-2">AI governance and audit solution</td>
                          <td className="border px-4 py-2">Mid-market</td>
                          <td className="border px-4 py-2">€15,000-40,000 annually</td>
                          <td className="border px-4 py-2">Strong technical focus</td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">Dataiku</td>
                          <td className="border px-4 py-2">Data platform with compliance modules</td>
                          <td className="border px-4 py-2">Data-centric companies</td>
                          <td className="border px-4 py-2">€20,000-60,000 annually</td>
                          <td className="border px-4 py-2">Integration with data science workflows</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        {/* Implementation Tab */}
        <TabsContent value="implementation" className="space-y-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-xl font-semibold">Implementation Plan</h2>
            <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
              <Button
                variant={isCustomizeMode ? "default" : "outline"}
                size="sm"
                onClick={toggleCustomizeMode}
              >
                {isCustomizeMode ? "Save Changes" : "Customize Plan"}
              </Button>
              
              {isCustomizeMode && (
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={customInvestmentFocus === "speed" ? "secondary" : "outline"} 
                    size="sm"
                    onClick={() => customizeImplementationPlan("speed")}
                  >
                    Speed-focused
                  </Button>
                  <Button 
                    variant={customInvestmentFocus === "balanced" ? "secondary" : "outline"} 
                    size="sm"
                    onClick={() => customizeImplementationPlan("balanced")}
                  >
                    Balanced
                  </Button>
                  <Button 
                    variant={customInvestmentFocus === "cost" ? "secondary" : "outline"} 
                    size="sm"
                    onClick={() => customizeImplementationPlan("cost")}
                  >
                    Cost-focused
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {isCustomizeMode && (
            <Card className="mb-4 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-blue-800 mb-2">Customization Mode</h3>
                <p className="text-sm text-blue-700 mb-2">
                  Adjust your implementation plan based on organizational priorities:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li><strong>Speed-focused:</strong> Prioritizes faster time-to-market with more AI automation but higher initial costs</li>
                  <li><strong>Balanced:</strong> Default approach with even distribution of resources and timelines</li>
                  <li><strong>Cost-focused:</strong> Optimizes for lower initial investment but extends implementation timeline</li>
                </ul>
              </CardContent>
            </Card>
          )}
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card>
              <CardHeader>
                <CardTitle>Implementation Timeline</CardTitle>
                <CardDescription>
                  Phased approach to platform development and market launch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {phases.map((phase, index) => (
                    <div key={index} className="border rounded-lg">
                      <div 
                        className="flex justify-between items-center p-4 cursor-pointer bg-muted/50"
                        onClick={() => togglePhaseExpansion(index)}
                      >
                        <div>
                          <h3 className="font-medium text-primary">{phase.title}</h3>
                          <p className="text-sm text-muted-foreground">{phase.timeline}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          {phase.isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                      
                      {phase.isExpanded && (
                        <div className="p-4 border-t">
                          <ul className="space-y-2">
                            {phase.tasks.map((task, taskIndex) => (
                              <li key={taskIndex} className="flex items-start">
                                <span className="text-primary mr-2">✓</span>
                                <span className="text-muted-foreground">{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Implementation Progress</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">MVP Development</span>
                        <span className="text-sm">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Compliance Framework</span>
                        <span className="text-sm">60%</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Early Adopter Program</span>
                        <span className="text-sm">40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Market Launch Preparation</span>
                        <span className="text-sm">25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investment Requirements Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Investment Breakdown</CardTitle>
                <CardDescription>
                  Detailed allocation of initial €1.5M investment requirement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border px-4 py-2 text-left">Investment Category</th>
                          <th className="border px-4 py-2 text-left">Amount (€)</th>
                          <th className="border px-4 py-2 text-left">Description</th>
                          <th className="border px-4 py-2 text-left">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {investmentDetails.map((item, index) => (
                          <React.Fragment key={index}>
                            <tr className={index % 2 === 0 ? 'bg-muted/30' : ''}>
                              <td className="border px-4 py-2 font-medium">
                                <button 
                                  onClick={() => {
                                    setInvestmentDetails(prevDetails => 
                                      prevDetails.map((detail, i) => 
                                        i === index 
                                          ? { ...detail, isExpanded: !detail.isExpanded } 
                                          : detail
                                      )
                                    );
                                  }}
                                  className="flex items-center text-left"
                                >
                                  {item.category}
                                  {item.subItems && (
                                    <span className="ml-2">
                                      {item.isExpanded ? 
                                        <ChevronUp className="h-4 w-4" /> : 
                                        <ChevronDown className="h-4 w-4" />
                                      }
                                    </span>
                                  )}
                                </button>
                              </td>
                              <td className="border px-4 py-2">€{item.amount.toLocaleString()}</td>
                              <td className="border px-4 py-2 text-muted-foreground">{item.description}</td>
                              <td className="border px-4 py-2">{item.percentage}%</td>
                            </tr>
                            
                            {/* Render sub-items if expanded and they exist */}
                            {item.isExpanded && item.subItems && item.subItems.map((subItem, subIndex) => (
                              <tr key={`${index}-${subIndex}`} className="bg-blue-50">
                                <td className="border px-4 py-2 pl-8 text-sm">└ {subItem.category}</td>
                                <td className="border px-4 py-2 text-sm">€{subItem.amount.toLocaleString()}</td>
                                <td className="border px-4 py-2 text-sm text-muted-foreground">{subItem.description}</td>
                                <td className="border px-4 py-2 text-sm">{subItem.percentage}%</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                        <tr className="bg-primary/10 font-medium">
                          <td className="border px-4 py-2">Total Investment</td>
                          <td className="border px-4 py-2">€{investmentDetails.reduce((total, item) => total + item.amount, 0).toLocaleString()}</td>
                          <td className="border px-4 py-2"></td>
                          <td className="border px-4 py-2">100%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Investment Strategy</h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="text-primary mr-2">✓</span>
                            <div>
                              <span className="font-medium">Staged Investment Approach</span>
                              <p className="text-sm text-muted-foreground">Initial seed of €1.5M with Series A of €4M targeted for Q3 2025 based on MVP traction</p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">✓</span>
                            <div>
                              <span className="font-medium">Revenue Reinvestment</span>
                              <p className="text-sm text-muted-foreground">60% of early revenue directed to R&D and platform enhancement through 2026</p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">✓</span>
                            <div>
                              <span className="font-medium">Strategic Partnerships</span>
                              <p className="text-sm text-muted-foreground">Co-investment opportunities with legal and consulting partners to extend platform capabilities</p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <span className="text-primary mr-2">✓</span>
                            <div>
                              <span className="font-medium">EU Grant Applications</span>
                              <p className="text-sm text-muted-foreground">Applications for Horizon Europe and Digital Europe Programme funding for AI governance innovations</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Resource Allocation</h3>
                      <ul className="space-y-3">
                        {resourceAllocation.map((resource, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-full">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">{resource.category}</span>
                                <span className="text-sm">{resource.percentage}%</span>
                              </div>
                              <Progress value={resource.percentage} className="h-2" />
                              <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Implementation Approach Comparison Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Implementation Approach Comparison</CardTitle>
                <CardDescription>
                  Traditional Development vs. AI Agent Implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border px-4 py-2 text-left">Aspect</th>
                        <th className="border px-4 py-2 text-left">Traditional Development</th>
                        <th className="border px-4 py-2 text-left">AI Agent Implementation</th>
                        <th className="border px-4 py-2 text-left">Advantage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-muted/30">
                        <td className="border px-4 py-2 font-medium">Development Time</td>
                        <td className="border px-4 py-2 text-muted-foreground">12-18 months for full functionality</td>
                        <td className="border px-4 py-2 text-muted-foreground">6-9 months with AI-accelerated development</td>
                        <td className="border px-4 py-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            AI Approach
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-medium">Development Cost</td>
                        <td className="border px-4 py-2 text-muted-foreground">€1.8-2.2M for complete platform</td>
                        <td className="border px-4 py-2 text-muted-foreground">€1.2-1.5M with AI efficiencies</td>
                        <td className="border px-4 py-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            AI Approach
                          </Badge>
                        </td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="border px-4 py-2 font-medium">Team Size</td>
                        <td className="border px-4 py-2 text-muted-foreground">15-20 full-time specialists</td>
                        <td className="border px-4 py-2 text-muted-foreground">8-12 specialists with AI assistance</td>
                        <td className="border px-4 py-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            AI Approach
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-medium">Adaptability</td>
                        <td className="border px-4 py-2 text-muted-foreground">Limited ability to adapt to changing requirements</td>
                        <td className="border px-4 py-2 text-muted-foreground">High adaptability with AI-driven dynamic components</td>
                        <td className="border px-4 py-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            AI Approach
                          </Badge>
                        </td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="border px-4 py-2 font-medium">Maintenance Cost</td>
                        <td className="border px-4 py-2 text-muted-foreground">25-30% of initial development cost annually</td>
                        <td className="border px-4 py-2 text-muted-foreground">15-20% of initial cost with self-improving AI</td>
                        <td className="border px-4 py-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            AI Approach
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-medium">Technical Complexity</td>
                        <td className="border px-4 py-2 text-muted-foreground">Higher initial complexity requiring specialized expertise</td>
                        <td className="border px-4 py-2 text-muted-foreground">Reduced complexity through AI-powered abstractions</td>
                        <td className="border px-4 py-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            AI Approach
                          </Badge>
                        </td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="border px-4 py-2 font-medium">Regulatory Updates</td>
                        <td className="border px-4 py-2 text-muted-foreground">Manual monitoring and code updates</td>
                        <td className="border px-4 py-2 text-muted-foreground">Automated monitoring with AI-suggested updates</td>
                        <td className="border px-4 py-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            AI Approach
                          </Badge>
                        </td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="border px-4 py-2 font-medium">Knowledge Base Development</td>
                        <td className="border px-4 py-2 text-muted-foreground">Content from legal experts (€180-220/hour)</td>
                        <td className="border px-4 py-2 text-muted-foreground">AI-assisted content generation with expert review</td>
                        <td className="border px-4 py-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            AI Approach
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-medium">Documentation Quality</td>
                        <td className="border px-4 py-2 text-muted-foreground">High quality but standardized templates</td>
                        <td className="border px-4 py-2 text-muted-foreground">High quality with intelligent context adaptation</td>
                        <td className="border px-4 py-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            AI Approach
                          </Badge>
                        </td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="border px-4 py-2 font-medium">Integration Complexity</td>
                        <td className="border px-4 py-2 text-muted-foreground">Custom code for each integration point</td>
                        <td className="border px-4 py-2 text-muted-foreground">AI-assisted adaptors and intelligent mapping</td>
                        <td className="border px-4 py-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            AI Approach
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-4 py-2 font-medium">Stakeholder Alignment</td>
                        <td className="border px-4 py-2 text-muted-foreground">Multiple review cycles and document versions</td>
                        <td className="border px-4 py-2 text-muted-foreground">AI-assisted translation of requirements to specifications</td>
                        <td className="border px-4 py-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            AI Approach
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-3">AI Implementation Benefits</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">✓</span>
                        <span className="text-blue-700">47% faster time-to-market with AI-accelerated development</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">✓</span>
                        <span className="text-blue-700">32% reduction in total development costs</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">✓</span>
                        <span className="text-blue-700">60% reduction in regulatory update implementation time</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">✓</span>
                        <span className="text-blue-700">75% reduction in knowledge base content creation costs</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <h3 className="font-medium text-amber-800 mb-3">AI Implementation Challenges</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-amber-600 mr-2">⚠</span>
                        <span className="text-amber-700">Requires specialized AI engineering expertise</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-600 mr-2">⚠</span>
                        <span className="text-amber-700">Need for robust AI/human collaboration workflows</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-600 mr-2">⚠</span>
                        <span className="text-amber-700">Close attention to AI-generated content quality control</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-amber-600 mr-2">⚠</span>
                        <span className="text-amber-700">Additional testing required for AI-powered components</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Mitigation Strategy Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Implementation Risk Mitigation</CardTitle>
                <CardDescription>
                  Strategies to manage and mitigate key implementation risks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border px-4 py-2 text-left">Risk Factor</th>
                        <th className="border px-4 py-2 text-left">Impact</th>
                        <th className="border px-4 py-2 text-left">Likelihood</th>
                        <th className="border px-4 py-2 text-left">Mitigation Strategy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskMitigationStrategies.map((strategy, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-muted/30' : ''}>
                          <td className="border px-4 py-2 font-medium">{strategy.risk}</td>
                          <td className="border px-4 py-2">
                            <Badge className={`${
                              strategy.impact === 'High' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 
                              strategy.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : 
                              'bg-green-100 text-green-800 hover:bg-green-100'
                            }`}>
                              {strategy.impact}
                            </Badge>
                          </td>
                          <td className="border px-4 py-2">
                            <Badge className={`${
                              strategy.likelihood === 'High' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 
                              strategy.likelihood === 'Medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : 
                              'bg-green-100 text-green-800 hover:bg-green-100'
                            }`}>
                              {strategy.likelihood}
                            </Badge>
                          </td>
                          <td className="border px-4 py-2 text-muted-foreground">{strategy.mitigation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Implementation Success Factors</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span className="text-blue-700">Strong technical leadership team with experience in regulatory technology</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span className="text-blue-700">Partnerships with legal experts specializing in EU AI regulation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span className="text-blue-700">Agile development methodology with biweekly release cycles</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span className="text-blue-700">Early adopter program with initial client pilots established</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span className="text-blue-700">Continuous regulatory monitoring and advisory board of EU AI experts</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        {/* Financials Tab */}
        <TabsContent value="financials" className="space-y-4 py-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card>
              <CardHeader>
                <CardTitle>Financial Projections</CardTitle>
                <CardDescription>
                  Three-year revenue and profit forecasts for the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse mb-6">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border px-4 py-2 text-left">Year</th>
                        <th className="border px-4 py-2 text-left">Revenue</th>
                        <th className="border px-4 py-2 text-left">Costs</th>
                        <th className="border px-4 py-2 text-left">Profit</th>
                        <th className="border px-4 py-2 text-left">Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialProjections.map((year, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2">{year.year}</td>
                          <td className="border px-4 py-2">€{year.revenue.toLocaleString()}</td>
                          <td className="border px-4 py-2">€{year.costs.toLocaleString()}</td>
                          <td className="border px-4 py-2">€{year.profit.toLocaleString()}</td>
                          <td className="border px-4 py-2">{Math.round((year.profit / year.revenue) * 100)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Revenue Streams</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <div>
                          <span className="font-medium">Subscription Licenses</span>
                          <p className="text-sm text-muted-foreground">Annual subscription fees based on tier and usage</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <div>
                          <span className="font-medium">Implementation Services</span>
                          <p className="text-sm text-muted-foreground">Setup, configuration, and integration services</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <div>
                          <span className="font-medium">Training & Certification</span>
                          <p className="text-sm text-muted-foreground">Professional certification for compliance officers</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <div>
                          <span className="font-medium">Partner Program</span>
                          <p className="text-sm text-muted-foreground">Revenue sharing with consulting partners</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Key Investment Areas</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <div>
                          <span className="font-medium">Platform Development</span>
                          <p className="text-sm text-muted-foreground">Engineering team and technology infrastructure</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <div>
                          <span className="font-medium">Compliance Expertise</span>
                          <p className="text-sm text-muted-foreground">Regulatory specialists and content development</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <div>
                          <span className="font-medium">Sales & Marketing</span>
                          <p className="text-sm text-muted-foreground">Market expansion and customer acquisition</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <div>
                          <span className="font-medium">Customer Success</span>
                          <p className="text-sm text-muted-foreground">Support, training, and retention initiatives</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-muted p-6 rounded-lg mt-8">
                  <h3 className="text-lg font-semibold mb-4">Return on Investment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">523%</div>
                      <p className="text-sm text-muted-foreground">3-Year ROI</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">16</div>
                      <p className="text-sm text-muted-foreground">Months to Breakeven</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">€7.1M</div>
                      <p className="text-sm text-muted-foreground">3-Year Cumulative Profit</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-4 py-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card>
              <CardHeader>
                <CardTitle>Pricing Strategy</CardTitle>
                <CardDescription>
                  Value-based pricing tiers for different organization sizes and needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pricingPackages.map((pkg, index) => (
                    <Card key={index} className={`${pkg.recommended ? 'border-primary' : 'border'}`}>
                      <CardHeader className={`${pkg.recommended ? 'bg-primary text-white' : 'bg-muted'}`}>
                        <CardTitle className="text-center">{pkg.title}</CardTitle>
                        {pkg.recommended && (
                          <Badge className="absolute top-2 right-2 bg-white text-primary">Recommended</Badge>
                        )}
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold">{pkg.price}</div>
                          <p className="text-sm text-muted-foreground">per year</p>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-6 text-center">
                          {pkg.description}
                        </p>
                        
                        <ul className="space-y-2">
                          {pkg.features.map((feature, fIndex) => (
                            <li key={fIndex} className="flex items-start">
                              <span className="text-primary mr-2">✓</span>
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant={pkg.recommended ? "default" : "outline"}>
                          Get Started
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                
                <div className="bg-muted p-6 rounded-lg mt-8">
                  <h3 className="text-lg font-semibold mb-4">Custom Solutions</h3>
                  <p className="text-muted-foreground mb-4">
                    For organizations with unique requirements or complex AI deployments, we offer custom pricing and implementation packages. Our team will work with you to develop a tailored solution that meets your specific compliance needs.
                  </p>
                  <Button variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Contact Sales
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}