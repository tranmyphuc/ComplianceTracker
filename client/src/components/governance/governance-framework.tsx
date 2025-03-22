
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircleIcon, 
  ClipboardListIcon, 
  UserPlusIcon, 
  BookIcon, 
  ShieldIcon, 
  AlertTriangleIcon, 
  InfoIcon, 
  ChevronRightIcon 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock data structure for governance framework
const governanceFramework = {
  policies: [
    { id: '1', name: 'AI Ethics Policy', status: 'complete', progress: 100 },
    { id: '2', name: 'AI Risk Management Policy', status: 'complete', progress: 100 },
    { id: '3', name: 'Data Governance Policy', status: 'in_progress', progress: 75 },
    { id: '4', name: 'Human Oversight Policy', status: 'in_progress', progress: 60 },
    { id: '5', name: 'Incident Response Policy', status: 'not_started', progress: 0 },
  ],
  roles: [
    { id: '1', title: 'AI Ethics Officer', description: 'Responsible for ensuring adherence to ethical AI principles', assigned: true },
    { id: '2', title: 'Data Protection Officer', description: 'Ensures compliance with data protection regulations', assigned: true },
    { id: '3', title: 'AI Risk Manager', description: 'Oversees AI risk assessment and mitigation processes', assigned: true },
    { id: '4', title: 'Technical Documentation Manager', description: 'Maintains comprehensive technical documentation', assigned: true },
    { id: '5', title: 'AI Incident Response Lead', description: 'Coordinates response to AI system incidents', assigned: false },
    { id: '6', title: 'Human Oversight Committee', description: 'Provides human oversight for high-risk AI systems', assigned: false },
  ],
  procedures: [
    { id: '1', name: 'AI System Registration Process', status: 'complete', progress: 100 },
    { id: '2', name: 'Risk Assessment Procedure', status: 'complete', progress: 100 },
    { id: '3', name: 'Data Quality Validation Process', status: 'in_progress', progress: 80 },
    { id: '4', name: 'AI Incident Reporting Procedure', status: 'in_progress', progress: 50 },
    { id: '5', name: 'AI System Audit Procedure', status: 'not_started', progress: 0 },
    { id: '6', name: 'Human Oversight Implementation Procedure', status: 'not_started', progress: 0 },
  ],
  training: [
    { id: '1', name: 'EU AI Act Compliance Fundamentals', status: 'complete', progress: 100, completionRate: '85%' },
    { id: '2', name: 'AI Ethics for Developers', status: 'complete', progress: 100, completionRate: '92%' },
    { id: '3', name: 'AI Risk Management', status: 'in_progress', progress: 65, completionRate: '60%' },
    { id: '4', name: 'Data Governance for AI', status: 'in_progress', progress: 40, completionRate: '35%' },
    { id: '5', name: 'Human Oversight of AI Systems', status: 'not_started', progress: 0, completionRate: '0%' },
  ]
};

export function GovernanceFramework() {
  const [activeTab, setActiveTab] = useState('policies');
  
  // Calculate overall framework completion
  const calculateOverallCompletion = () => {
    const allItems = [
      ...governanceFramework.policies,
      ...governanceFramework.procedures,
      ...governanceFramework.training
    ];
    
    const totalProgress = allItems.reduce((sum, item) => sum + item.progress, 0);
    return Math.round(totalProgress / allItems.length);
  };
  
  const overallCompletion = calculateOverallCompletion();
  
  // Calculate role assignment completion
  const roleAssignmentCompletion = Math.round(
    (governanceFramework.roles.filter(role => role.assigned).length / governanceFramework.roles.length) * 100
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>AI Governance Framework</CardTitle>
            <CardDescription>
              Establish a comprehensive governance structure for EU AI Act compliance
            </CardDescription>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">Overall Completion</p>
              <p className="text-2xl font-bold">{overallCompletion}%</p>
            </div>
            <Progress value={overallCompletion} className="w-24 h-2" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="policies" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="roles">Roles & Responsibilities</TabsTrigger>
            <TabsTrigger value="procedures">Procedures</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
          </TabsList>
          
          <TabsContent value="policies" className="space-y-4">
            <div className="grid gap-4">
              {governanceFramework.policies.map(policy => (
                <div key={policy.id} className="border rounded-md p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    {policy.status === 'complete' ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    ) : policy.status === 'in_progress' ? (
                      <ClipboardListIcon className="h-5 w-5 text-amber-500 mr-3" />
                    ) : (
                      <AlertTriangleIcon className="h-5 w-5 text-gray-400 mr-3" />
                    )}
                    <div>
                      <p className="font-medium">{policy.name}</p>
                      <div className="flex items-center mt-1">
                        <Progress value={policy.progress} className="w-24 h-1.5 mr-2" />
                        <span className="text-xs text-gray-500">{policy.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md mt-6">
              <div className="flex items-start">
                <InfoIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 font-medium">EU AI Act Policy Requirements</p>
                  <p className="text-sm text-blue-600 mt-1">
                    The EU AI Act requires organizations to establish formal policies for AI risk management (Article 9), 
                    data governance (Article 10), and human oversight (Article 14). Having these policies documented and 
                    implemented is essential for compliance, especially for high-risk AI systems.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="roles" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm">
                <span className="font-medium">{roleAssignmentCompletion}%</span> of required roles assigned
              </p>
              <Button size="sm">
                <UserPlusIcon className="h-4 w-4 mr-1" />
                Assign Role
              </Button>
            </div>
            
            <div className="grid gap-4">
              {governanceFramework.roles.map(role => (
                <div key={role.id} className={`border rounded-md p-4 ${role.assigned ? '' : 'border-dashed'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserPlusIcon className={`h-5 w-5 mr-3 ${role.assigned ? 'text-green-500' : 'text-gray-400'}`} />
                      <p className="font-medium">{role.title}</p>
                    </div>
                    {role.assigned ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Assigned</Badge>
                    ) : (
                      <Button variant="outline" size="sm">Assign</Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{role.description}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md mt-6">
              <div className="flex items-start">
                <InfoIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 font-medium">Clear Roles & Responsibilities</p>
                  <p className="text-sm text-blue-600 mt-1">
                    The EU AI Act requires clear allocation of responsibilities for compliance-related activities.
                    Organizations should establish roles for risk management, data governance, technical documentation,
                    and human oversight to ensure comprehensive coverage of compliance requirements.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="procedures" className="space-y-4">
            <div className="grid gap-4">
              {governanceFramework.procedures.map(procedure => (
                <div key={procedure.id} className="border rounded-md p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    {procedure.status === 'complete' ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                    ) : procedure.status === 'in_progress' ? (
                      <ClipboardListIcon className="h-5 w-5 text-amber-500 mr-3" />
                    ) : (
                      <AlertTriangleIcon className="h-5 w-5 text-gray-400 mr-3" />
                    )}
                    <div>
                      <p className="font-medium">{procedure.name}</p>
                      <div className="flex items-center mt-1">
                        <Progress value={procedure.progress} className="w-24 h-1.5 mr-2" />
                        <span className="text-xs text-gray-500">{procedure.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md mt-6">
              <div className="flex items-start">
                <InfoIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 font-medium">Documented Procedures</p>
                  <p className="text-sm text-blue-600 mt-1">
                    The EU AI Act requires organizations to implement well-documented procedures for risk management,
                    data governance, and human oversight. These procedures should be integrated into your organization's
                    broader quality management and compliance systems.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="training" className="space-y-4">
            <div className="grid gap-4">
              {governanceFramework.training.map(training => (
                <div key={training.id} className="border rounded-md p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    {training.status === 'complete' ? (
                      <BookIcon className="h-5 w-5 text-green-500 mr-3" />
                    ) : training.status === 'in_progress' ? (
                      <BookIcon className="h-5 w-5 text-amber-500 mr-3" />
                    ) : (
                      <BookIcon className="h-5 w-5 text-gray-400 mr-3" />
                    )}
                    <div>
                      <p className="font-medium">{training.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center">
                          <Progress value={training.progress} className="w-24 h-1.5 mr-2" />
                          <span className="text-xs text-gray-500">{training.progress}%</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-4">Completion: {training.completionRate}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md mt-6">
              <div className="flex items-start">
                <InfoIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 font-medium">Staff Training Requirements</p>
                  <p className="text-sm text-blue-600 mt-1">
                    The EU AI Act emphasizes the importance of appropriate training for staff involved in the development,
                    deployment, and oversight of AI systems. Training should cover technical aspects, ethical considerations,
                    and compliance requirements specific to each role's responsibilities.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Custom Badge component for use in this module
function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
