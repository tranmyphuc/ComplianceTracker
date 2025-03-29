import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Info, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FeatureChecklistProps {
  title: string;
  description?: string;
}

interface Feature {
  name: string;
  description?: string;
  essential: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
}

export function FeatureComparison({ title, description }: FeatureChecklistProps) {
  const features: Feature[] = [
    // System Registration Features
    { 
      name: "AI System Registration", 
      description: "Register and document your AI systems in compliance with the EU AI Act",
      essential: "Up to 3 systems", 
      professional: "Up to 10 systems", 
      enterprise: "Unlimited" 
    },
    { 
      name: "Risk Assessment Tools", 
      description: "Tools to determine the risk level of your AI systems according to EU AI Act classifications",
      essential: "Basic", 
      professional: "Advanced", 
      enterprise: "Custom + Advanced" 
    },
    { 
      name: "Compliance Documentation", 
      description: "Generate required technical documentation and compliance records",
      essential: true, 
      professional: true, 
      enterprise: true 
    },
    { 
      name: "Multi-department Access", 
      description: "Allow multiple departments to collaborate on compliance",
      essential: false, 
      professional: "5 users", 
      enterprise: "25+ users" 
    },
    
    // Support & Updates
    { 
      name: "Regulatory Updates", 
      description: "Stay informed about changes to the EU AI Act and related regulations",
      essential: "Quarterly", 
      professional: "Monthly", 
      enterprise: "Real-time" 
    },
    { 
      name: "Support Response Time", 
      description: "Response time for support inquiries",
      essential: "48 hours", 
      professional: "24 hours", 
      enterprise: "SLA-based priority" 
    },
    { 
      name: "Dedicated Account Manager", 
      description: "Personal point of contact for your compliance needs",
      essential: false, 
      professional: false, 
      enterprise: true 
    },
    { 
      name: "Expert Consultation Hours", 
      description: "Access to AI compliance experts",
      essential: false, 
      professional: "5 hours / year", 
      enterprise: "15 hours / year" 
    },
    
    // Advanced Features
    { 
      name: "Compliance Dashboard", 
      description: "Visual overview of your compliance status",
      essential: "Basic", 
      professional: "Advanced", 
      enterprise: "Custom + Advanced" 
    },
    { 
      name: "Risk Monitoring", 
      description: "Continuous monitoring of compliance risks",
      essential: false, 
      professional: "Basic", 
      enterprise: "Advanced" 
    },
    { 
      name: "Custom Workflow Automation", 
      description: "Automate compliance workflows specific to your organization",
      essential: false, 
      professional: false, 
      enterprise: true 
    },
    { 
      name: "API Access", 
      description: "Programmatic access to compliance data",
      essential: false, 
      professional: "Read-only", 
      enterprise: "Full access" 
    },
    
    // Training & Documentation
    { 
      name: "Training Resources", 
      description: "Educational materials for compliance team members",
      essential: "Basic", 
      professional: "3 roles", 
      enterprise: "All roles" 
    },
    { 
      name: "Document Template Generator", 
      description: "Create compliant documentation",
      essential: "Standard", 
      professional: "With branding", 
      enterprise: "Custom templates" 
    },
    { 
      name: "Compliance Certificates", 
      description: "Documentation of training completion and compliance efforts",
      essential: false, 
      professional: true, 
      enterprise: true 
    },
    { 
      name: "Annual Compliance Audit", 
      description: "Comprehensive review of compliance status",
      essential: false, 
      professional: false, 
      enterprise: true 
    },
  ];

  // Group features by category for better organization
  const featureGroups = [
    {
      category: "Registration & Assessment",
      features: features.slice(0, 4)
    },
    {
      category: "Support & Updates",
      features: features.slice(4, 8)
    },
    {
      category: "Advanced Capabilities",
      features: features.slice(8, 12)
    },
    {
      category: "Training & Documentation",
      features: features.slice(12, 16)
    }
  ];

  function renderFeatureValue(value: boolean | string) {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-green-500" />
      ) : (
        <X className="h-5 w-5 text-gray-300" />
      );
    }
    
    return <span className="text-sm font-medium">{value}</span>;
  }

  return (
    <Card className="mb-8 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && <p className="text-gray-500 text-sm">{description}</p>}
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left text-sm font-semibold text-gray-600 border-b border-r border-gray-100">Feature</th>
                <th className="p-4 text-center w-1/5 text-sm font-semibold text-blue-600 border-b border-r border-gray-100">Essential</th>
                <th className="p-4 text-center w-1/5 text-sm font-semibold text-purple-600 border-b border-r border-gray-100">Professional</th>
                <th className="p-4 text-center w-1/5 text-sm font-semibold text-indigo-600 border-b border-gray-100">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {featureGroups.map((group, groupIndex) => (
                <>
                  <tr key={`category-${groupIndex}`} className="bg-gray-50">
                    <td colSpan={4} className="px-4 py-2 text-sm font-bold text-gray-700 border-b border-gray-200">
                      {group.category}
                    </td>
                  </tr>
                  {group.features.map((feature, featureIndex) => (
                    <tr 
                      key={`feature-${groupIndex}-${featureIndex}`} 
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm border-r border-gray-100">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{feature.name}</span>
                          {feature.description && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="cursor-help">
                                    <Info className="h-4 w-4 text-gray-400" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs text-xs">
                                    {feature.description}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center border-r border-gray-100">
                        {renderFeatureValue(feature.essential)}
                      </td>
                      <td className="px-4 py-3 text-center border-r border-gray-100">
                        {renderFeatureValue(feature.professional)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {renderFeatureValue(feature.enterprise)}
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}