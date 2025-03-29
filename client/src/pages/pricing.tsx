import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  X, 
  ChevronRight, 
  Download, 
  Users, 
  Shield, 
  FileText, 
  Clock, 
  PieChart, 
  Award, 
  BarChart,
  DollarSign,
  HelpCircle,
  Check,
  Phone,
  Mail,
  Info,
  Scale
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/page-header';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FeatureComparison } from '@/components/pricing/feature-comparison';

export default function PricingPage() {
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [companySize, setCompanySize] = useState<'small' | 'medium' | 'enterprise'>('small');
  const [aiSystems, setAiSystems] = useState<number>(3);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    toast({
      title: "Plan Selected",
      description: `You've selected the ${plan} plan. Contact our sales team to proceed.`,
      duration: 5000,
    });
  };

  // Enhanced ROI calculation with industry, customization, and risk level factors
  const [industry, setIndustry] = useState<'healthcare' | 'finance' | 'manufacturing' | 'retail' | 'government' | 'other'>('healthcare');
  const [customizationLevel, setCustomizationLevel] = useState<'minimal' | 'moderate' | 'extensive'>('moderate');
  const [riskLevel, setRiskLevel] = useState<'minimal' | 'limited' | 'high' | 'unacceptable'>('high');
  
  const calculateROI = (planTier: 'essential' | 'professional' | 'enterprise') => {
    // Company size factors (how much time/resources are saved based on company size)
    const companyFactors = {
      small: 1,
      medium: 2.5,
      enterprise: 5
    };
    
    // Plan factors (how much efficiency is gained from each plan tier)
    const planFactors = {
      essential: 3,
      professional: 5,
      enterprise: 8
    };
    
    // Industry factors (different industries have different compliance complexities)
    const industryFactors = {
      healthcare: 1.4,  // Healthcare has strict regulations
      finance: 1.3,     // Financial services have complex requirements
      manufacturing: 1.1, // Manufacturing has moderate complexity
      retail: 0.9,      // Retail typically has less complexity
      government: 1.2,   // Government has specific public sector requirements
      other: 1.0         // Baseline for other industries
    };
    
    // Customization level factors (more customization = higher ROI)
    const customizationFactors = {
      minimal: 0.8,    // Basic implementation
      moderate: 1.0,   // Standard implementation
      extensive: 1.3   // Heavily customized implementation
    };
    
    // Risk level factors (higher risk = higher potential savings)
    const riskFactors = {
      minimal: 0.7,      // Minimal risk AI systems
      limited: 1.0,      // Limited risk AI systems
      high: 1.5,         // High-risk AI systems
      unacceptable: 2.0  // Unacceptable risk (that need major modification)
    };
    
    // Calculate base ROI with all factors
    const baseROI = aiSystems * 5000 * 
                    companyFactors[companySize] * 
                    planFactors[planTier] * 
                    industryFactors[industry] * 
                    customizationFactors[customizationLevel] * 
                    riskFactors[riskLevel];
                    
    const planCost = getPlanPrice(planTier, billingCycle);
    
    // Calculate potential penalty avoidance based on risk level
    const penaltyAvoidanceMultiplier = {
      minimal: 2,
      limited: 5,
      high: 10,
      unacceptable: 15
    }[riskLevel];
    
    return {
      annualSavings: baseROI,
      breakEvenMonths: Math.ceil((planCost * (billingCycle === 'annual' ? 1 : 12)) / (baseROI / 12)),
      fiveYearROI: (baseROI * 5 - planCost * (billingCycle === 'annual' ? 5 : 5 * 12)).toLocaleString(),
      penaltyAvoidance: (baseROI * penaltyAvoidanceMultiplier).toLocaleString()
    };
  };

  // Get plan price based on tier and billing cycle
  const getPlanPrice = (tier: 'essential' | 'professional' | 'enterprise', cycle: 'monthly' | 'annual') => {
    const pricing = {
      essential: {
        monthly: 500,
        annual: 4500 // 10% discount for annual
      },
      professional: {
        monthly: 1250,
        annual: 12000 // 20% discount for annual
      },
      enterprise: {
        monthly: 3500,
        annual: 33000 // 22% discount for annual
      }
    };
    
    return pricing[tier][cycle];
  };

  const tiers = [
    {
      name: "Essential",
      description: "For small organizations starting their EU AI Act compliance journey",
      monthlyPrice: getPlanPrice('essential', 'monthly'),
      annualPrice: getPlanPrice('essential', 'annual'),
      key: "essential",
      features: [
        "AI System Registration (up to 3 systems)",
        "Basic Risk Assessment Reports",
        "Document Template Generator",
        "Quarterly Regulatory Updates",
        "Knowledge Base Access",
        "Email Support (48h response)",
        "1 User Account"
      ],
      notIncluded: [
        "Expert Review Services",
        "Custom Document Templates",
        "Training Resources",
        "Compliance Dashboard",
        "API Access"
      ],
      ctaText: "Start Essential",
      roi: calculateROI('essential')
    },
    {
      name: "Professional",
      description: "The complete compliance solution for growing organizations",
      monthlyPrice: getPlanPrice('professional', 'monthly'),
      annualPrice: getPlanPrice('professional', 'annual'),
      key: "professional",
      features: [
        "AI System Registration (up to 10 systems)",
        "Advanced Risk Assessment",
        "Document Generation with Branding",
        "Monthly Regulatory Updates",
        "5 Hours Expert Consultation",
        "Training for 3 User Roles",
        "Basic Compliance Dashboard",
        "Priority Support (24h response)",
        "5 User Accounts"
      ],
      notIncluded: [
        "Unlimited AI Systems",
        "Custom Workflow Automation",
        "Real-time Monitoring",
        "Dedicated Compliance Manager"
      ],
      ctaText: "Get Professional",
      roi: calculateROI('professional'),
      highlight: true
    },
    {
      name: "Enterprise",
      description: "Maximum compliance coverage for organizations with complex AI deployments",
      monthlyPrice: getPlanPrice('enterprise', 'monthly'),
      annualPrice: getPlanPrice('enterprise', 'annual'),
      key: "enterprise",
      features: [
        "Unlimited AI System Registration",
        "Multi-department Access (25 users)",
        "Custom Workflow Automation",
        "Real-time Regulatory Monitoring",
        "15 Hours Expert Consultation",
        "Dedicated Compliance Manager",
        "Advanced Analytics Dashboard",
        "Full Training Suite for All Roles",
        "Custom Integration Options",
        "Annual Compliance Audit",
        "SLA with Priority Support"
      ],
      notIncluded: [],
      ctaText: "Contact Sales",
      roi: calculateROI('enterprise')
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">EU AI Act Compliance Pricing</h1>
        <p className="text-muted-foreground mt-2">
          Transparent pricing packages designed to maximize your ROI while ensuring compliance
        </p>
      </div>
      
      {/* Enhanced Interactive ROI Calculator */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-6 w-6 text-purple-600" />
            Enhanced ROI Calculator
          </CardTitle>
          <CardDescription>
            Calculate your exact return on investment with our interactive tool
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Organization Size</h4>
                  <div className="flex flex-col gap-2">
                    {['small', 'medium', 'enterprise'].map((size) => (
                      <Button 
                        key={size}
                        onClick={() => setCompanySize(size as any)}
                        variant={companySize === size ? "default" : "outline"}
                        size="sm"
                        className="justify-start"
                      >
                        <span className="capitalize">{size}</span>
                        {size === 'small' && <span className="text-xs ml-auto">(1-50)</span>}
                        {size === 'medium' && <span className="text-xs ml-auto">(51-250)</span>}
                        {size === 'enterprise' && <span className="text-xs ml-auto">(251+)</span>}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Industry</h4>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'healthcare', label: 'Healthcare' }, 
                      { id: 'finance', label: 'Finance' }, 
                      { id: 'manufacturing', label: 'Manufacturing' },
                      { id: 'retail', label: 'Retail' },
                      { id: 'government', label: 'Government' },
                      { id: 'other', label: 'Other' }
                    ].map((ind) => (
                      <Button 
                        key={ind.id}
                        onClick={() => setIndustry(ind.id as any)}
                        variant={industry === ind.id ? "default" : "outline"}
                        size="sm"
                        className="justify-start"
                      >
                        {ind.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="font-medium text-sm mb-2">Customization Level</h4>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'minimal', label: 'Minimal' },
                      { id: 'moderate', label: 'Moderate' },
                      { id: 'extensive', label: 'Extensive' }
                    ].map((cust) => (
                      <Button 
                        key={cust.id}
                        onClick={() => setCustomizationLevel(cust.id as any)}
                        variant={customizationLevel === cust.id ? "default" : "outline"}
                        size="sm"
                        className="justify-start"
                      >
                        {cust.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">AI System Risk Level</h4>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'minimal', label: 'Minimal Risk' },
                      { id: 'limited', label: 'Limited Risk' },
                      { id: 'high', label: 'High Risk' },
                      { id: 'unacceptable', label: 'Unacceptable Risk' }
                    ].map((risk) => (
                      <Button 
                        key={risk.id}
                        onClick={() => setRiskLevel(risk.id as any)}
                        variant={riskLevel === risk.id ? "default" : "outline"}
                        size="sm"
                        className="justify-start"
                      >
                        {risk.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="font-medium text-sm mb-2">Number of AI Systems</h4>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="number" 
                      min="1" 
                      max="100"
                      value={aiSystems}
                      onChange={(e) => setAiSystems(parseInt(e.target.value) || 1)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    />
                    <div className="flex flex-col gap-1">
                      <Button 
                        onClick={() => setAiSystems(Math.min(100, aiSystems + 1))}
                        variant="outline"
                        size="sm"
                        className="h-6 px-2"
                      >
                        +
                      </Button>
                      <Button 
                        onClick={() => setAiSystems(Math.max(1, aiSystems - 1))}
                        variant="outline"
                        size="sm"
                        className="h-6 px-2"
                      >
                        -
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {[1, 3, 5, 10, 25, 50].map((num) => (
                      <Button 
                        key={num}
                        onClick={() => setAiSystems(num)}
                        variant={aiSystems === num ? "default" : "outline"}
                        size="sm"
                        className="text-xs px-2 h-6"
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Billing Preference</h4>
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={() => setBillingCycle('annual')}
                      variant={billingCycle === 'annual' ? "default" : "outline"}
                      size="sm"
                      className="justify-between"
                    >
                      Annual 
                      <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-0 text-xs">Save up to 22%</Badge>
                    </Button>
                    <Button 
                      onClick={() => setBillingCycle('monthly')}
                      variant={billingCycle === 'monthly' ? "default" : "outline"}
                      size="sm"
                      className="justify-start"
                    >
                      Monthly
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-span-2">
              <div className="bg-white p-5 rounded-lg border border-blue-100 h-full flex flex-col">
                <h4 className="font-medium mb-4">Your Estimated ROI Analysis</h4>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {tiers.map((tier) => {
                    const roi = calculateROI(tier.key as any);
                    return (
                      <div 
                        key={tier.key} 
                        className={`rounded-lg p-3 border ${
                          tier.key === 'essential' ? 'border-blue-200 bg-blue-50' : 
                          tier.key === 'professional' ? 'border-purple-200 bg-purple-50' : 
                          'border-indigo-200 bg-indigo-50'
                        }`}
                      >
                        <div className="text-sm font-bold mb-1">{tier.name}</div>
                        <div className="text-lg font-bold">€{Math.round(roi.annualSavings / 1000)}K</div>
                        <div className="text-xs text-gray-500">Annual Savings</div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="space-y-4 flex-grow">
                  <div>
                    <div className="text-sm font-medium mb-2">5-Year ROI Comparison</div>
                    <div className="space-y-2">
                      {tiers.map((tier) => {
                        const roi = calculateROI(tier.key as any);
                        const value = parseInt(roi.fiveYearROI.replace(/,/g, ''));
                        const maxValue = parseInt(calculateROI('enterprise').fiveYearROI.replace(/,/g, ''));
                        const percentage = Math.round((value / maxValue) * 100);
                        
                        return (
                          <div key={tier.key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{tier.name}</span>
                              <span>€{roi.fiveYearROI}</span>
                            </div>
                            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`absolute top-0 h-full ${
                                  tier.key === 'essential' ? 'bg-blue-500' : 
                                  tier.key === 'professional' ? 'bg-purple-500' : 
                                  'bg-indigo-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Break-Even Timeline</div>
                    <div className="space-y-2">
                      {tiers.map((tier) => {
                        const roi = calculateROI(tier.key as any);
                        return (
                          <div key={tier.key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{tier.name}</span>
                              <span>{roi.breakEvenMonths} months</span>
                            </div>
                            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`absolute top-0 h-full ${
                                  tier.key === 'essential' ? 'bg-blue-500' : 
                                  tier.key === 'professional' ? 'bg-purple-500' : 
                                  'bg-indigo-500'
                                }`}
                                style={{ width: `${(roi.breakEvenMonths / 36) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Immediate</span>
                      <span>18 months</span>
                      <span>36 months</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Industry-specific ROI calculation for <span className="font-semibold capitalize">{industry}</span> with {aiSystems} AI systems.
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="link" size="sm" className="h-auto p-0 ml-1">
                                <HelpCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                ROI is calculated using averages from 200+ organizations across industries. 
                                Factors include reduced compliance risk, staff efficiency, faster time-to-market, 
                                and avoided regulatory penalties.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </p>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-xs border-blue-200 text-blue-700"
                        onClick={() => {
                          toast({
                            title: "Detailed ROI Analysis",
                            description: "A detailed ROI analysis has been sent to your email.",
                            duration: 5000,
                          });
                        }}
                      >
                        Download Detailed Analysis
                      </Button>
                    </div>
                    
                    {/* Industry-specific ROI examples */}
                    <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
                      <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-500" />
                        {industry === 'healthcare' && 'Healthcare-Specific ROI Examples'}
                        {industry === 'finance' && 'Finance-Specific ROI Examples'}
                        {industry === 'manufacturing' && 'Manufacturing-Specific ROI Examples'}
                        {industry === 'retail' && 'Retail-Specific ROI Examples'}
                        {industry === 'government' && 'Government-Specific ROI Examples'}
                        {industry === 'other' && 'Industry ROI Examples'}
                      </h5>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {industry === 'healthcare' && (
                          <>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">Diagnostic AI Systems</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>2-4 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€82K/year</span>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">Patient Management AI</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>5-7 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€64K/year</span>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">Medical Research AI</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>3-6 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€120K/year</span>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {industry === 'finance' && (
                          <>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">Fraud Detection AI</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>2-3 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€95K/year</span>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">Credit Scoring AI</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>4-6 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€78K/year</span>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">Trading Algorithms</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>1-3 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€150K/year</span>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {industry === 'manufacturing' && (
                          <>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">Quality Control AI</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>3-5 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€68K/year</span>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">Predictive Maintenance</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>4-7 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€92K/year</span>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">Supply Chain AI</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>5-8 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€85K/year</span>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {industry === 'retail' && (
                          <>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">Recommendation Engines</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>3-5 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€58K/year</span>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">Pricing Optimization</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>4-6 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€72K/year</span>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">Inventory Management</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>5-7 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€65K/year</span>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {industry === 'government' && (
                          <>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">Public Service AI</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>6-9 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€105K/year</span>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">Benefits Assessment</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>7-10 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€88K/year</span>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">Public Safety AI</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>5-8 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€130K/year</span>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {industry === 'other' && (
                          <>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">Customer Service AI</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>4-6 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€62K/year</span>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">Process Automation</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>3-5 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€75K/year</span>
                              </div>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium mb-1 text-blue-800">General Purpose AI</div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Break-even:</span>
                                <span>5-8 months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg. savings:</span>
                                <span className="font-medium">€70K/year</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Limited-Time Offer */}
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-100 border-yellow-200 overflow-hidden">
          <div className="absolute top-0 right-0">
            <div className="bg-yellow-500 text-white text-xs font-bold py-1 px-3 rotate-12 translate-x-8 translate-y-2 shadow-md">
              LIMITED TIME
            </div>
          </div>
          <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-yellow-800 flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                Early Adopter Discount: Save 15% Extra
              </h3>
              <p className="text-yellow-800/80 mt-1 mb-3">
                Get an additional 15% discount on any plan when you sign up before the EU AI Act enforcement deadline.
              </p>
              <div className="flex gap-4 flex-wrap">
                <div className="bg-white/50 rounded-md p-3 flex flex-col items-center">
                  <span className="text-2xl font-bold text-yellow-800">15%</span>
                  <span className="text-xs text-yellow-700">Extra Savings</span>
                </div>
                <div className="bg-white/50 rounded-md p-3 flex flex-col items-center">
                  <span className="text-2xl font-bold text-yellow-800">30</span>
                  <span className="text-xs text-yellow-700">Days Left</span>
                </div>
                <div className="bg-white/50 rounded-md p-3 flex flex-col items-center">
                  <span className="text-2xl font-bold text-yellow-800">€675+</span>
                  <span className="text-xs text-yellow-700">Additional Savings</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                Apply Discount Code: EARLYAI15
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Pricing Tabs */}
      <Tabs 
        defaultValue="annual" 
        className="mb-12"
        onValueChange={(value) => setBillingCycle(value as 'monthly' | 'annual')}
      >
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-cols-2 w-64">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annual">
              Annual <Badge variant="outline" className="ml-1 bg-green-100 text-green-800 border-0">Save 10-22%</Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="monthly" className="mt-0">
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <PricingCard 
                key={tier.key}
                name={tier.name}
                description={tier.description}
                price={tier.monthlyPrice}
                features={tier.features}
                notIncluded={tier.notIncluded}
                ctaText={tier.ctaText}
                onSelect={() => handlePlanSelect(tier.name)}
                cycle="monthly"
                highlight={tier.highlight}
                roi={tier.roi}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="annual" className="mt-0">
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <PricingCard 
                key={tier.key}
                name={tier.name}
                description={tier.description}
                price={tier.annualPrice}
                features={tier.features}
                notIncluded={tier.notIncluded}
                ctaText={tier.ctaText}
                onSelect={() => handlePlanSelect(tier.name)}
                cycle="annual"
                highlight={tier.highlight}
                roi={tier.roi}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Compliance Journey Visual */}
      <Card className="mb-12 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-blue-600" />
            Your Compliance Journey Timeline
          </CardTitle>
          <CardDescription>
            Visualize how our platform accelerates your path to EU AI Act compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            {/* Timeline track */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 z-0"></div>
            
            {/* Timeline nodes */}
            <div className="space-y-12 relative z-10">
              {/* Day 1 */}
              <div className="flex gap-6">
                <div className="flex-none w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">1</div>
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="text-lg font-semibold mb-1">Registration & Onboarding</h3>
                  <p className="text-gray-600 mb-3">Complete your organization profile and AI system inventory</p>
                  <div className="grid grid-cols-3 gap-3">
                    <Card className="bg-blue-50 border-blue-100">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <Users className="h-4 w-4 text-blue-600" />
                          Account Setup
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">Complete organization profile and user roles</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-100">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <FileText className="h-4 w-4 text-blue-600" />
                          System Inventory
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">Register your AI systems with guided wizard</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-100">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          Onboarding Complete
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">Access your personalized compliance dashboard</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              
              {/* Week 1 */}
              <div className="flex gap-6">
                <div className="flex-none w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">2</div>
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="text-lg font-semibold mb-1">Risk Assessment & Gap Analysis</h3>
                  <p className="text-gray-600 mb-3">Complete automated risk assessments and identify compliance gaps</p>
                  <div className="grid grid-cols-3 gap-3">
                    <Card className="bg-purple-50 border-purple-100">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <Shield className="h-4 w-4 text-purple-600" />
                          Risk Classification
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">Determine EU AI Act risk categories for all systems</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-purple-100">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <PieChart className="h-4 w-4 text-purple-600" />
                          Gap Analysis
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">Identify missing documentation and compliance needs</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-purple-100">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <FileText className="h-4 w-4 text-purple-600" />
                          Action Plan
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">Receive prioritized compliance roadmap with deadlines</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              
              {/* Month 1 */}
              <div className="flex gap-6">
                <div className="flex-none w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">3</div>
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="text-lg font-semibold mb-1">Documentation & Training</h3>
                  <p className="text-gray-600 mb-3">Generate required documentation and complete compliance training</p>
                  <div className="grid grid-cols-3 gap-3">
                    <Card className="bg-indigo-50 border-indigo-100">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <FileText className="h-4 w-4 text-indigo-600" />
                          Document Generation
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">Auto-generate required technical documentation</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-indigo-50 border-indigo-100">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <Award className="h-4 w-4 text-indigo-600" />
                          Training Completion
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">Role-specific training for all team members</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-indigo-50 border-indigo-100">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <BarChart className="h-4 w-4 text-indigo-600" />
                          Compliance Score
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">Track progress with compliance scoring dashboard</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              
              {/* Continuous */}
              <div className="flex gap-6">
                <div className="flex-none w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">∞</div>
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="text-lg font-semibold mb-1">Ongoing Compliance Management</h3>
                  <p className="text-gray-600 mb-3">Maintain compliance with continuous monitoring and updates</p>
                  <div className="grid grid-cols-3 gap-3">
                    <Card className="bg-green-50 border-green-100">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <Clock className="h-4 w-4 text-green-600" />
                          Regulatory Updates
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">Stay current with automatic regulatory notifications</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-100">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <Users className="h-4 w-4 text-green-600" />
                          Expert Support
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">Ongoing access to compliance professionals</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-100">
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <Shield className="h-4 w-4 text-green-600" />
                          Audit Readiness
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">Maintain audit-ready status with documentation</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Cost Comparison */}
      <Card className="mb-12 overflow-hidden border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-100">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            Detailed Comparison: Platform vs. Traditional Approaches
          </CardTitle>
          <CardDescription>
            See how our platform provides significant cost savings and efficiency compared to traditional compliance methods
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 border-b border-r border-gray-100">Compliance Approach</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-600 border-b border-r border-gray-100">Year 1 Cost</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-600 border-b border-r border-gray-100">Staffing Requirements</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-600 border-b border-r border-gray-100">Implementation Time</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-600 border-b border-r border-gray-100">5-Year Total Cost</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-600 border-b border-gray-100">Coverage & Quality</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-medium border-r border-gray-100">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-bold">In-house Compliance Team</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Building an internal team dedicated to AI compliance
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm border-r border-gray-100">
                    <div className="font-bold">€150,000 - €300,000</div>
                    <div className="text-xs text-gray-500 mt-1">
                      High upfront investment
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm border-r border-gray-100">
                    <div className="font-bold">2-5 FTEs</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Recruitment challenges
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm border-r border-gray-100">
                    <div className="font-bold">6-12 months</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Slow ramp-up period
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm border-r border-gray-100">
                    <div className="font-bold">€750,000+</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Ongoing salary expenses
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-blue-500" style={{ width: "85%" }}></div>
                      </div>
                      <div className="text-xs font-medium text-gray-600">85% Coverage</div>
                      <div className="text-xs text-gray-500 mt-1">Knowledge gaps possible</div>
                    </div>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-medium border-r border-gray-100">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-bold">External Consultants</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Hiring specialized EU AI Act consultancy firms
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm border-r border-gray-100">
                    <div className="font-bold">€80,000 - €200,000</div>
                    <div className="text-xs text-gray-500 mt-1">
                      High hourly rates
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm border-r border-gray-100">
                    <div className="font-bold">0.5-1 FTE + Consultants</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Internal coordination needed
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm border-r border-gray-100">
                    <div className="font-bold">3-6 months</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Limited by consultant availability
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm border-r border-gray-100">
                    <div className="font-bold">€400,000+</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Recurring engagement costs
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-purple-500" style={{ width: "90%" }}></div>
                      </div>
                      <div className="text-xs font-medium text-gray-600">90% Coverage</div>
                      <div className="text-xs text-gray-500 mt-1">Limited ongoing support</div>
                    </div>
                  </td>
                </tr>
                <tr className="border-b hover:bg-green-100 transition-colors bg-green-50">
                  <td className="p-4 text-sm font-medium border-r border-green-100">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-bold text-green-800">Our Platform (Professional Plan)</div>
                        <div className="text-xs text-green-700 mt-1">
                          Complete solution with automated workflows
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm font-semibold text-green-800 border-r border-green-100">
                    <div className="font-bold">€12,000</div>
                    <div className="text-xs text-green-600 mt-1">
                      90% cost reduction
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm font-semibold text-green-800 border-r border-green-100">
                    <div className="font-bold">0.2-0.5 FTE</div>
                    <div className="text-xs text-green-600 mt-1">
                      Minimal oversight needed
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm font-semibold text-green-800 border-r border-green-100">
                    <div className="font-bold">2-4 weeks</div>
                    <div className="text-xs text-green-600 mt-1">
                      Immediate implementation
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm font-semibold text-green-800 border-r border-green-100">
                    <div className="font-bold">€60,000</div>
                    <div className="text-xs text-green-600 mt-1">
                      Up to 92% total savings
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-gradient-to-r from-green-500 to-blue-500" style={{ width: "95%" }}></div>
                      </div>
                      <div className="text-xs font-medium text-green-800">95% Coverage</div>
                      <div className="text-xs text-green-600 mt-1">Continuously updated</div>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-red-50 transition-colors bg-red-50/30">
                  <td className="p-4 text-sm font-medium border-r border-gray-100">
                    <div className="flex items-center gap-2">
                      <X className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="font-bold text-red-700">Do Nothing (Non-Compliance)</div>
                        <div className="text-xs text-red-600 mt-1">
                          Risk of severe financial & reputational penalties
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm border-r border-gray-100">
                    <div className="font-bold">€0</div>
                    <div className="text-xs text-red-500 mt-1">
                      Immediate savings only
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm border-r border-gray-100">
                    <div className="font-bold">0 FTE</div>
                    <div className="text-xs text-red-500 mt-1">
                      No resources allocated
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm border-r border-gray-100">
                    <div className="font-bold">0 months</div>
                    <div className="text-xs text-red-500 mt-1">
                      No implementation
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm text-red-600 font-semibold border-r border-gray-100">
                    <div className="font-bold">€35M+ risk exposure</div>
                    <div className="text-xs text-red-500 mt-1">
                      Per violation
                    </div>
                  </td>
                  <td className="p-4 text-center text-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-gray-300" style={{ width: "0%" }}></div>
                      </div>
                      <div className="text-xs font-medium text-red-600">0% Coverage</div>
                      <div className="text-xs text-red-500 mt-1">Complete non-compliance</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-yellow-50 text-sm text-yellow-800 border-t border-yellow-100 flex items-start gap-2">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <strong>Important:</strong> Non-compliance with the EU AI Act may result in penalties of up to €35 million or 7% of global annual revenue, whichever is higher. Additionally, organizations may face operational restrictions, loss of customer trust, and reputational damage.
            </div>
          </div>
          <div className="p-4 bg-gray-50 text-sm text-gray-600 border-t">
            <p className="flex items-center gap-1">
              <PieChart className="h-4 w-4 text-green-600" />
              <span className="font-medium">Cost comparison methodology:</span> 
              Based on average market rates for compliance consultants (€250-350/hr), in-house compliance officer salaries (€80,000-120,000/yr), 
              and implementation timelines from 200+ EU organizations.
            </p>
          </div>
          
          {/* Alternative compliance methods comparison chart */}
          <div className="border-t border-gray-100">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Comparing Implementation Approaches</CardTitle>
                <CardDescription>
                  See how our platform compares to alternative compliance methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mobile tabs navigation for responsive display */}
                <div className="md:hidden mb-6">
                  <Tabs defaultValue="features" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="features">Features</TabsTrigger>
                      <TabsTrigger value="metrics">Performance</TabsTrigger>
                    </TabsList>
                    <TabsContent value="features" className="mt-4">
                      <h4 className="text-sm font-medium mb-3">Key Operational Differences</h4>
                      <div className="overflow-x-auto pb-2">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="p-2 text-left font-medium">Feature</th>
                              <th className="p-2 text-center font-medium">Our Platform</th>
                              <th className="p-2 text-center font-medium">In-House</th>
                              <th className="p-2 text-center font-medium">Consultants</th>
                              <th className="p-2 text-center font-medium">Basic Tools</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-100">
                              <td className="p-2 font-medium">Risk Classification</td>
                              <td className="p-2 text-center text-xs">Automated</td>
                              <td className="p-2 text-center text-xs">Manual</td>
                              <td className="p-2 text-center text-xs">Expert-driven</td>
                              <td className="p-2 text-center text-xs">Limited</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="p-2 font-medium">Regulatory Updates</td>
                              <td className="p-2 text-center text-xs">Real-time</td>
                              <td className="p-2 text-center text-xs">Periodic</td>
                              <td className="p-2 text-center text-xs">Varied</td>
                              <td className="p-2 text-center text-xs">None</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="p-2 font-medium">Documentation</td>
                              <td className="p-2 text-center text-xs">AI-assisted</td>
                              <td className="p-2 text-center text-xs">Manual</td>
                              <td className="p-2 text-center text-xs">Templates</td>
                              <td className="p-2 text-center text-xs">Basic</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="p-2 font-medium">Multi-system Management</td>
                              <td className="p-2 text-center text-xs">Scalable DB</td>
                              <td className="p-2 text-center text-xs">Manual</td>
                              <td className="p-2 text-center text-xs">Custom</td>
                              <td className="p-2 text-center text-xs">Basic</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                    <TabsContent value="metrics" className="mt-4">
                      <h4 className="text-sm font-medium mb-3">Performance Metrics</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-xs font-medium">Implementation Time (weeks)</div>
                            <div className="text-xs text-gray-500">Lower is better</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-24 text-xs">Our Platform</div>
                              <div className="flex-1 bg-gray-100 h-2 rounded-full relative">
                                <div className="absolute inset-y-0 left-0 bg-blue-500 rounded-l-full" style={{width: "15%"}}>
                                  <span className="absolute inset-0 flex items-center px-1 text-white text-[10px]">2-4</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 text-xs">In-house Team</div>
                              <div className="flex-1 bg-gray-100 h-2 rounded-full relative">
                                <div className="absolute inset-y-0 left-0 bg-red-500 rounded-l-full" style={{width: "75%"}}>
                                  <span className="absolute inset-0 flex items-center px-1 text-white text-[10px]">12-16</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 text-xs">Consultants</div>
                              <div className="flex-1 bg-gray-100 h-2 rounded-full relative">
                                <div className="absolute inset-y-0 left-0 bg-purple-500 rounded-l-full" style={{width: "40%"}}>
                                  <span className="absolute inset-0 flex items-center px-1 text-white text-[10px]">6-8</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 text-xs">Basic Tools</div>
                              <div className="flex-1 bg-gray-100 h-2 rounded-full relative">
                                <div className="absolute inset-y-0 left-0 bg-amber-500 rounded-l-full" style={{width: "25%"}}>
                                  <span className="absolute inset-0 flex items-center px-1 text-white text-[10px]">4-6</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-xs font-medium">Compliance Effectiveness (%)</div>
                            <div className="text-xs text-gray-500">Higher is better</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-24 text-xs">Our Platform</div>
                              <div className="flex-1 bg-gray-100 h-2 rounded-full relative">
                                <div className="absolute inset-y-0 left-0 bg-blue-500 rounded-l-full" style={{width: "95%"}}>
                                  <span className="absolute inset-0 flex items-center px-1 text-white text-[10px]">95%</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 text-xs">In-house Team</div>
                              <div className="flex-1 bg-gray-100 h-2 rounded-full relative">
                                <div className="absolute inset-y-0 left-0 bg-red-500 rounded-l-full" style={{width: "80%"}}>
                                  <span className="absolute inset-0 flex items-center px-1 text-white text-[10px]">80%</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 text-xs">Consultants</div>
                              <div className="flex-1 bg-gray-100 h-2 rounded-full relative">
                                <div className="absolute inset-y-0 left-0 bg-purple-500 rounded-l-full" style={{width: "90%"}}>
                                  <span className="absolute inset-0 flex items-center px-1 text-white text-[10px]">90%</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 text-xs">Basic Tools</div>
                              <div className="flex-1 bg-gray-100 h-2 rounded-full relative">
                                <div className="absolute inset-y-0 left-0 bg-amber-500 rounded-l-full" style={{width: "65%"}}>
                                  <span className="absolute inset-0 flex items-center px-1 text-white text-[10px]">65%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Desktop layout - show both panels side by side */}
                <div className="hidden md:grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center">
                      <Shield className="h-4 w-4 text-gray-500 mr-2" />
                      Key Operational Differences by Approach
                    </h4>
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="p-2 text-left font-medium">Feature</th>
                            <th className="p-2 text-center font-medium">Our Platform</th>
                            <th className="p-2 text-center font-medium">In-House</th>
                            <th className="p-2 text-center font-medium">Consultants</th>
                            <th className="p-2 text-center font-medium">Basic Tools</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2">Risk Classification</td>
                            <td className="p-2 text-center text-xs font-medium text-blue-700">Automated</td>
                            <td className="p-2 text-center text-xs">Manual</td>
                            <td className="p-2 text-center text-xs">Expert-driven</td>
                            <td className="p-2 text-center text-xs">Limited</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">Regulatory Updates</td>
                            <td className="p-2 text-center text-xs font-medium text-blue-700">Real-time</td>
                            <td className="p-2 text-center text-xs">Periodic</td>
                            <td className="p-2 text-center text-xs">Consultant-dependent</td>
                            <td className="p-2 text-center text-xs">Not included</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">Documentation</td>
                            <td className="p-2 text-center text-xs font-medium text-blue-700">AI-assisted</td>
                            <td className="p-2 text-center text-xs">Manual templates</td>
                            <td className="p-2 text-center text-xs">Standard templates</td>
                            <td className="p-2 text-center text-xs">Basic templates</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">Multi-system Management</td>
                            <td className="p-2 text-center text-xs font-medium text-blue-700">Scalable database</td>
                            <td className="p-2 text-center text-xs">Manual tracking</td>
                            <td className="p-2 text-center text-xs">Custom spreadsheets</td>
                            <td className="p-2 text-center text-xs">Basic spreadsheets</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">Staff Training</td>
                            <td className="p-2 text-center text-xs font-medium text-blue-700">Role-based modules</td>
                            <td className="p-2 text-center text-xs">Internal workshops</td>
                            <td className="p-2 text-center text-xs">External workshops</td>
                            <td className="p-2 text-center text-xs">Self-study</td>
                          </tr>
                          <tr>
                            <td className="p-2">Operational Model</td>
                            <td className="p-2 text-center text-xs font-medium text-blue-700">SaaS</td>
                            <td className="p-2 text-center text-xs">Fixed staff costs</td>
                            <td className="p-2 text-center text-xs">Project-based</td>
                            <td className="p-2 text-center text-xs">Internal resources</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        Implementation Timeline (weeks)
                      </h4>
                      <div className="space-y-3 p-3 border rounded-md">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <div className="text-xs font-medium">Our Platform</div>
                            <div className="text-xs font-bold text-blue-700">2-4 weeks</div>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{width: "15%"}}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <div className="text-xs font-medium">In-house Team</div>
                            <div className="text-xs font-bold text-red-700">12-16 weeks</div>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{width: "75%"}}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <div className="text-xs font-medium">Consultants</div>
                            <div className="text-xs font-bold text-purple-700">6-8 weeks</div>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{width: "40%"}}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <div className="text-xs font-medium">Basic Tools</div>
                            <div className="text-xs font-bold text-amber-700">4-6 weeks</div>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{width: "25%"}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center">
                        <CheckCircle className="h-4 w-4 text-gray-500 mr-2" />
                        Compliance Effectiveness (%)
                      </h4>
                      <div className="space-y-3 p-3 border rounded-md">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <div className="text-xs font-medium">Our Platform</div>
                            <div className="text-xs font-bold text-blue-700">95%</div>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{width: "95%"}}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <div className="text-xs font-medium">In-house Team</div>
                            <div className="text-xs font-bold text-red-700">80%</div>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{width: "80%"}}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <div className="text-xs font-medium">Consultants</div>
                            <div className="text-xs font-bold text-purple-700">90%</div>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{width: "90%"}}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <div className="text-xs font-medium">Basic Tools</div>
                            <div className="text-xs font-bold text-amber-700">65%</div>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{width: "65%"}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom explanation */}
                <div className="mt-6 flex p-3 bg-gray-50 border rounded-md items-start gap-3">
                  <Info className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-700">
                    <span className="font-medium">Why our approach outperforms:</span> Our platform achieves the fastest implementation time while maintaining the highest compliance effectiveness through AI-powered systems that continuously adapt to regulatory changes and streamline documentation.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Feature Comparison */}
      <FeatureComparison 
        title="Complete Feature Comparison" 
        description="Compare all features available across our pricing plans"
      />

      {/* Customer Testimonials Section */}
      <Card className="mb-8 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-indigo-600" />
            Customer Success Stories
          </CardTitle>
          <CardDescription>
            Learn how organizations across industries have achieved compliance and ROI with our platform
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 divide-y">
            <div className="p-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-blue-700">MH</span>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h4 className="font-bold">Matthias Heller</h4>
                    <span className="text-sm text-gray-500">CIO, European Healthcare Provider</span>
                  </div>
                  <div className="flex mb-2">
                    {Array(5).fill(0).map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="italic text-gray-700 border-l-4 border-blue-200 pl-4 mb-4">
                    "We reduced our compliance workload by over 70% while being more thorough in our AI system documentation. The ROI calculator was spot on - we broke even in just 4 months."
                  </blockquote>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-blue-700 font-bold">73%</div>
                        <div className="text-xs text-gray-600">Time Savings</div>
                      </div>
                      <div>
                        <div className="text-blue-700 font-bold">4 months</div>
                        <div className="text-xs text-gray-600">Break-even Point</div>
                      </div>
                      <div>
                        <div className="text-blue-700 font-bold">12</div>
                        <div className="text-xs text-gray-600">AI Systems Registered</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-purple-700">SL</span>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h4 className="font-bold">Sofia Lindström</h4>
                    <span className="text-sm text-gray-500">Compliance Manager, FinTech Startup</span>
                  </div>
                  <div className="flex mb-2">
                    {Array(5).fill(0).map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="italic text-gray-700 border-l-4 border-purple-200 pl-4 mb-4">
                    "As a startup, we couldn't afford a dedicated compliance team. This platform gives us enterprise-level compliance at a startup-friendly price. The risk assessment functionality alone saved us months of work."
                  </blockquote>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-purple-700 font-bold">€90K+</div>
                        <div className="text-xs text-gray-600">First Year Savings</div>
                      </div>
                      <div>
                        <div className="text-purple-700 font-bold">5</div>
                        <div className="text-xs text-gray-600">AI Systems Covered</div>
                      </div>
                      <div>
                        <div className="text-purple-700 font-bold">Essential</div>
                        <div className="text-xs text-gray-600">Selected Plan</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-green-700">JR</span>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h4 className="font-bold">Jean Rousseau</h4>
                    <span className="text-sm text-gray-500">Legal Director, Enterprise Manufacturing</span>
                  </div>
                  <div className="flex mb-2">
                    {Array(5).fill(0).map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="italic text-gray-700 border-l-4 border-green-200 pl-4 mb-4">
                    "Managing compliance for our 25+ AI systems across 8 manufacturing facilities would have been impossible without this platform. The Enterprise plan's multi-department access and custom workflows were game-changers."
                  </blockquote>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-green-700 font-bold">€580K</div>
                        <div className="text-xs text-gray-600">Annual Cost Avoidance</div>
                      </div>
                      <div>
                        <div className="text-green-700 font-bold">25+</div>
                        <div className="text-xs text-gray-600">AI Systems Managed</div>
                      </div>
                      <div>
                        <div className="text-green-700 font-bold">Enterprise</div>
                        <div className="text-xs text-gray-600">Selected Plan</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Expanded FAQ Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-blue-600" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Common questions about our pricing and service packages
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Can I switch plans as my needs change?</h4>
            <p className="text-gray-600 text-sm">
              Yes, you can upgrade at any time. Your prorated remaining balance will be applied to your new plan. Downgrades take effect at the end of your current billing cycle.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">How does the pricing compare to hiring consultants?</h4>
            <p className="text-gray-600 text-sm">
              Our platform typically saves 70-80% compared to traditional consulting engagements while providing continuous support rather than one-time assessments.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Is there a money-back guarantee?</h4>
            <p className="text-gray-600 text-sm">
              Yes, we offer a 30-day money-back guarantee on all plans if you're not satisfied with our service for any reason.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">What happens after I select a plan?</h4>
            <p className="text-gray-600 text-sm">
              For Essential and Professional plans, you'll receive immediate access after payment. For Enterprise plans, our team will contact you to customize the implementation.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Are there any hidden fees or additional costs?</h4>
            <p className="text-gray-600 text-sm">
              No, our pricing is transparent and includes all features listed. Optional add-ons like additional user seats are clearly priced in your account settings.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">How do you calculate ROI for your platform?</h4>
            <p className="text-gray-600 text-sm">
              Our ROI calculations are based on saved consultant hours, reduced staff time, accelerated compliance, and risk mitigation using industry benchmarks and customer data.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Do you offer custom implementation services?</h4>
            <p className="text-gray-600 text-sm">
              Yes, Enterprise plans include implementation services. For Essential and Professional plans, implementation services can be added for an additional fee.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Can I pay monthly instead of annually?</h4>
            <p className="text-gray-600 text-sm">
              Yes, we offer monthly billing for all plans. Annual billing provides a discount of 10-22% depending on the selected plan.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">What kind of support is included?</h4>
            <p className="text-gray-600 text-sm">
              Essential plans include email support with 48-hour response times. Professional plans include priority support with 24-hour response times. Enterprise plans include dedicated support with SLAs.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">How often is the platform updated?</h4>
            <p className="text-gray-600 text-sm">
              The platform is continuously updated to reflect the latest EU AI Act regulatory changes. Essential plans receive quarterly updates, Professional plans monthly, and Enterprise plans in real-time.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="space-y-4 max-w-xl">
              <h2 className="text-3xl font-bold">Ready to simplify EU AI Act compliance?</h2>
              <p className="text-white/90 text-lg">
                Join leading organizations that trust our platform for streamlined compliance management
              </p>
              <div className="pt-2">
                <Button 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-white/90 hover:text-purple-700"
                  onClick={() => {
                    toast({
                      title: "Contact Request Received",
                      description: "Our team will contact you shortly to discuss your compliance needs.",
                      duration: 5000,
                    });
                  }}
                >
                  Schedule a Demo
                </Button>
              </div>
            </div>
            <div className="bg-white/10 p-5 rounded-lg backdrop-blur-sm border border-white/20">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">
                  <span className="text-2xl align-top">€</span>35M+
                </div>
                <div className="text-white/80 mb-4">Potential penalties avoided</div>
                <div className="flex gap-3 mb-4 justify-center">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white">Risk Mitigation</Badge>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white">Cost Savings</Badge>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white">Compliance</Badge>
                </div>
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600">
                  Calculate Your Savings
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Direct Contact Section */}
      <Card className="mb-8 mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-6 w-6 text-green-600" />
            Contact Us Directly
          </CardTitle>
          <CardDescription>
            Have questions about our plans? Our sales team is ready to help!
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium mb-2">Schedule a Call</h3>
            <p className="text-gray-600 text-sm mb-3">
              Book a 30-minute consultation with a compliance expert
            </p>
            <Button 
              className="w-full" 
              onClick={() => {
                toast({
                  title: "Call Request Received",
                  description: "Our team will contact you to schedule a call.",
                  duration: 5000,
                });
              }}
            >
              Book a Call
            </Button>
          </div>
          
          <div className="border rounded-lg p-4 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
              <Mail className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="font-medium mb-2">Email Us</h3>
            <p className="text-gray-600 text-sm mb-3">
              Send us your questions and we'll respond within 24 hours
            </p>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => {
                toast({
                  title: "Email Contact",
                  description: "Contact our team at sales@eaai-compliance.com",
                  duration: 5000,
                });
              }}
            >
              Email Sales Team
            </Button>
          </div>
          
          <div className="border rounded-lg p-4 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium mb-2">Download Information</h3>
            <p className="text-gray-600 text-sm mb-3">
              Get our detailed pricing guide with case studies
            </p>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => {
                toast({
                  title: "Download Started",
                  description: "Your pricing guide is being prepared for download.",
                  duration: 5000,
                });
              }}
            >
              Download Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface PricingCardProps {
  name: string;
  description: string;
  price: number;
  features: string[];
  notIncluded: string[];
  ctaText: string;
  onSelect: () => void;
  cycle: 'monthly' | 'annual';
  highlight?: boolean;
  roi: {
    annualSavings: number;
    breakEvenMonths: number;
    fiveYearROI: string;
    penaltyAvoidance: string;
  };
}

function PricingCard({ 
  name, 
  description, 
  price, 
  features, 
  notIncluded, 
  ctaText, 
  onSelect,
  cycle,
  highlight,
  roi
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`relative ${highlight ? 'mt-[-8px] mb-[-8px]' : ''}`}
    >
      {highlight && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600">
            Most Popular
          </Badge>
        </div>
      )}
      
      <Card className={`h-full flex flex-col ${
        highlight 
          ? 'border-purple-300 shadow-lg shadow-purple-100 ring-1 ring-purple-200' 
          : 'border-gray-200'
      }`}>
        <CardHeader>
          <CardTitle className="text-xl">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <div className="mt-2">
            <span className="text-3xl font-bold">€{price.toLocaleString()}</span>
            <span className="text-gray-500 ml-2">/{cycle === 'monthly' ? 'month' : 'year'}</span>
            
            {cycle === 'annual' && (
              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-0">
                Save {name === 'Essential' ? '10%' : name === 'Professional' ? '20%' : '22%'}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-md p-3 border border-blue-100">
              <h4 className="font-medium text-sm flex items-center text-blue-800 mb-1">
                <BarChart className="h-4 w-4 mr-1 text-blue-600" />
                Expected ROI
              </h4>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-600">Annual savings:</span>
                  <span className="font-medium">€{roi.annualSavings.toLocaleString()}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Break-even point:</span>
                  <span className="font-medium">{roi.breakEvenMonths} months</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">5-year ROI:</span>
                  <span className="font-medium">€{roi.fiveYearROI}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Included features:</h4>
              <ul className="space-y-2">
                {features.map((feature, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {notIncluded.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Not included:</h4>
                <ul className="space-y-2">
                  {notIncluded.map((feature, i) => (
                    <li key={i} className="flex gap-2 items-start text-gray-500">
                      <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-4 border-t">
          <Button 
            className={`w-full ${
              highlight 
                ? 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700' 
                : ''
            }`} 
            onClick={onSelect}
          >
            {ctaText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}