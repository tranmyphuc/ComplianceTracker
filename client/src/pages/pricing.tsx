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

  // Calculate ROI based on company size and AI systems
  const calculateROI = (planTier: 'essential' | 'professional' | 'enterprise') => {
    const companyFactors = {
      small: 1,
      medium: 2.5,
      enterprise: 5
    };
    
    const planFactors = {
      essential: 3,
      professional: 5,
      enterprise: 8
    };

    const baseROI = aiSystems * 5000 * companyFactors[companySize] * planFactors[planTier];
    const planCost = getPlanPrice(planTier, billingCycle);
    
    return {
      annualSavings: baseROI,
      breakEvenMonths: Math.ceil((planCost * 12) / (baseROI / 12)),
      fiveYearROI: (baseROI * 5 - planCost * 5).toLocaleString(),
      penaltyAvoidance: (baseROI * 7).toLocaleString()
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
      
      {/* Interactive ROI Calculator */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-6 w-6 text-purple-600" />
            Interactive ROI Calculator
          </CardTitle>
          <CardDescription>
            Customize parameters to see potential savings and break-even timeline for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Organization Size</h4>
              <div className="flex gap-2">
                {['small', 'medium', 'enterprise'].map((size) => (
                  <Button 
                    key={size}
                    onClick={() => setCompanySize(size as any)}
                    variant={companySize === size ? "default" : "outline"}
                    size="sm"
                    className="flex-1 capitalize"
                  >
                    {size}
                  </Button>
                ))}
              </div>
              
              <h4 className="font-medium text-sm pt-2">Number of AI Systems</h4>
              <div className="flex gap-2">
                {[1, 3, 5, 10, 15].map((num) => (
                  <Button 
                    key={num}
                    onClick={() => setAiSystems(num)}
                    variant={aiSystems === num ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                  >
                    {num}
                  </Button>
                ))}
              </div>
              
              <h4 className="font-medium text-sm pt-2">Billing Preference</h4>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setBillingCycle('annual')}
                  variant={billingCycle === 'annual' ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  Annual <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-0">Save up to 22%</Badge>
                </Button>
                <Button 
                  onClick={() => setBillingCycle('monthly')}
                  variant={billingCycle === 'monthly' ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  Monthly
                </Button>
              </div>
            </div>
            
            <div className="col-span-2">
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium mb-3">Estimated ROI Analysis</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {tiers.map((tier) => {
                    const roi = calculateROI(tier.key as any);
                    return (
                      <div key={tier.key} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          tier.key === 'essential' ? 'bg-blue-500' : 
                          tier.key === 'professional' ? 'bg-purple-500' : 
                          'bg-indigo-500'
                        }`}></div>
                        <div className="text-sm font-medium">{tier.name}</div>
                      </div>
                    );
                  })}
                  
                  <div className="col-span-2 mt-2">
                    <div className="text-sm font-medium mb-1">5-Year ROI Comparison</div>
                    <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                      {tiers.map((tier, i) => {
                        const roi = calculateROI(tier.key as any);
                        const value = parseInt(roi.fiveYearROI.replace(/,/g, ''));
                        const maxValue = parseInt(calculateROI('enterprise').fiveYearROI.replace(/,/g, ''));
                        const width = (value / maxValue) * 100;
                        
                        return (
                          <div 
                            key={tier.key}
                            className={`absolute top-0 h-full ${
                              tier.key === 'essential' ? 'bg-blue-500' : 
                              tier.key === 'professional' ? 'bg-purple-500' : 
                              'bg-indigo-500'
                            }`}
                            style={{
                              left: i > 0 ? `${i * 33}%` : '0%',
                              width: `${100 / tiers.length}%`
                            }}
                          >
                            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                              €{(value / 1000000).toFixed(1)}M
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="col-span-2 mt-2">
                    <div className="text-sm font-medium mb-1">Break-Even Timeline (Months)</div>
                    <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                      {tiers.map((tier) => {
                        const roi = calculateROI(tier.key as any);
                        return (
                          <div 
                            key={tier.key}
                            className="relative h-full"
                          >
                            <div
                              className={`absolute top-0 h-full ${
                                tier.key === 'essential' ? 'bg-blue-500' : 
                                tier.key === 'professional' ? 'bg-purple-500' : 
                                'bg-indigo-500'
                              }`}
                              style={{ 
                                width: `${(roi.breakEvenMonths / 36) * 100}%`,
                                maxWidth: '100%'
                              }}
                            >
                              <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                                {roi.breakEvenMonths} months
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Immediate</span>
                      <span>6 months</span>
                      <span>12 months</span>
                      <span>24 months</span>
                      <span>36 months</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Cost Comparison */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            Cost Comparison: Platform vs. Traditional Approaches
          </CardTitle>
          <CardDescription>
            See how our platform provides significant cost savings compared to traditional compliance methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3 text-left text-sm font-medium text-gray-500">Compliance Approach</th>
                  <th className="p-3 text-center text-sm font-medium text-gray-500">Year 1 Cost</th>
                  <th className="p-3 text-center text-sm font-medium text-gray-500">Staffing Requirements</th>
                  <th className="p-3 text-center text-sm font-medium text-gray-500">Implementation Time</th>
                  <th className="p-3 text-center text-sm font-medium text-gray-500">5-Year Total Cost</th>
                  <th className="p-3 text-center text-sm font-medium text-gray-500">Completeness</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 text-sm font-medium">In-house Compliance Team</td>
                  <td className="p-3 text-center text-sm">€150,000 - €300,000</td>
                  <td className="p-3 text-center text-sm">2-5 FTEs</td>
                  <td className="p-3 text-center text-sm">6-12 months</td>
                  <td className="p-3 text-center text-sm">€750,000+</td>
                  <td className="p-3 text-center text-sm">
                    <div className="flex justify-center">
                      <div className="w-20 h-2 bg-gray-200 rounded overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 text-sm font-medium">External Consultants</td>
                  <td className="p-3 text-center text-sm">€80,000 - €200,000</td>
                  <td className="p-3 text-center text-sm">0.5-1 FTE + Consultants</td>
                  <td className="p-3 text-center text-sm">3-6 months</td>
                  <td className="p-3 text-center text-sm">€400,000+</td>
                  <td className="p-3 text-center text-sm">
                    <div className="flex justify-center">
                      <div className="w-20 h-2 bg-gray-200 rounded overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: "90%" }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="border-b bg-green-50">
                  <td className="p-3 text-sm font-medium">Our Platform (Professional Plan)</td>
                  <td className="p-3 text-center text-sm font-semibold text-green-700">€12,000</td>
                  <td className="p-3 text-center text-sm">0.2-0.5 FTE</td>
                  <td className="p-3 text-center text-sm font-semibold text-green-700">2-4 weeks</td>
                  <td className="p-3 text-center text-sm font-semibold text-green-700">€60,000</td>
                  <td className="p-3 text-center text-sm">
                    <div className="flex justify-center">
                      <div className="w-20 h-2 bg-green-200 rounded overflow-hidden">
                        <div className="h-full bg-green-600" style={{ width: "95%" }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-sm font-medium">Do Nothing (Non-Compliance)</td>
                  <td className="p-3 text-center text-sm">€0</td>
                  <td className="p-3 text-center text-sm">0 FTE</td>
                  <td className="p-3 text-center text-sm">0 months</td>
                  <td className="p-3 text-center text-sm text-red-600 font-semibold">€35M+ risk exposure</td>
                  <td className="p-3 text-center text-sm">
                    <div className="flex justify-center">
                      <div className="w-20 h-2 bg-gray-200 rounded overflow-hidden">
                        <div className="h-full bg-gray-300" style={{ width: "0%" }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-yellow-50 p-3 rounded-md border border-yellow-100 text-sm text-yellow-800">
            <strong>Note:</strong> Non-compliance with the EU AI Act may result in penalties of up to €35 million or 7% of global annual revenue, whichever is higher.
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
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