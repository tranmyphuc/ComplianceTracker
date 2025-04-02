import React from 'react';
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { IntegratedApprovalButton } from "../approval/integrated-approval-button";

interface ReviewSubmitStepProps {
  formData: {
    name: string;
    description: string;
    purpose: string;
    version: string;
    department: string;
    vendor: string;
    internalOwner: string;
    aiCapabilities: string;
    trainingDatasets: string;
    usageContext: string;
    humansInLoop: boolean;
    dataSources: string;
    dataProtection: string;
    usesPersonalData: boolean;
    usesSensitiveData: boolean;
    riskLevel: string;
    potentialImpact: string;
    mitigationMeasures: string;
    vulnerabilities: string;
    impactsAutonomous: boolean;
    impactsVulnerableGroups: boolean;
    usesDeepLearning: boolean;
    isTransparent: boolean;
    confirmAccuracy: boolean;
    confirmCompliance: boolean;
    [key: string]: any;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors?: Record<string, string>;
}

export const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({
  formData,
  setFormData,
  errors = {}
}) => {
  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (typeof setFormData === 'function') {
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    } else {
      console.error("setFormData is not a function in ReviewSubmitStep");
    }
  };

  const getRiskLevelDisplay = () => {
    switch (formData.riskLevel) {
      case 'minimal': return { label: 'Minimal Risk', color: 'bg-green-100 text-green-800' };
      case 'limited': return { label: 'Limited Risk', color: 'bg-blue-100 text-blue-800' };
      case 'high': return { label: 'High Risk', color: 'bg-amber-100 text-amber-800' };
      case 'unacceptable': return { label: 'Unacceptable Risk', color: 'bg-red-100 text-red-800' };
      default: return { label: 'Not Specified', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const riskLevel = getRiskLevelDisplay();

  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{formData.name || 'Unnamed System'}</CardTitle>
              <CardDescription>System Review</CardDescription>
            </div>
            <Badge className={riskLevel.color}>{riskLevel.label}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Description</p>
                  <p>{formData.description || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Purpose</p>
                  <p>{formData.purpose || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Version</p>
                  <p>{formData.version || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Department</p>
                  <p>{formData.department || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Vendor/Provider</p>
                  <p>{formData.vendor || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Internal Owner</p>
                  <p>{formData.internalOwner || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Technical Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">AI Capabilities</p>
                  <p>{formData.aiCapabilities || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Training Datasets</p>
                  <p>{formData.trainingDatasets || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Usage Context</p>
                  <p>{formData.usageContext || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Human Oversight</p>
                  <p>{formData.humansInLoop ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Data Processing</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.usesPersonalData && (
                      <Badge variant="outline">Personal Data</Badge>
                    )}
                    {formData.usesSensitiveData && (
                      <Badge variant="outline">Sensitive Data</Badge>
                    )}
                    {!formData.usesPersonalData && !formData.usesSensitiveData && (
                      <span>No personal or sensitive data</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Risk Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Potential Impact</p>
                  <p>{formData.potentialImpact || 'Not provided'}</p>
                </div>
                {formData.vulnerabilities && (
                  <div>
                    <p className="text-gray-500">Vulnerabilities</p>
                    <p>{formData.vulnerabilities}</p>
                  </div>
                )}
                {formData.mitigationMeasures && (
                  <div>
                    <p className="text-gray-500">Mitigation Measures</p>
                    <p>{formData.mitigationMeasures}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500">Risk Factors</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.impactsAutonomous && (
                      <Badge variant="outline">Autonomous Decisions</Badge>
                    )}
                    {formData.impactsVulnerableGroups && (
                      <Badge variant="outline">Impacts Vulnerable Groups</Badge>
                    )}
                    {formData.usesDeepLearning && (
                      <Badge variant="outline">Deep Learning</Badge>
                    )}
                    {formData.isTransparent && (
                      <Badge variant="outline" className="bg-green-50">Transparent</Badge>
                    )}
                    {!formData.impactsAutonomous && !formData.impactsVulnerableGroups && 
                     !formData.usesDeepLearning && !formData.isTransparent && (
                      <span>None specified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4 pt-4">
        <div className={errors.confirmAccuracy ? "space-y-2 pb-2" : "space-y-2"}>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="confirmAccuracy" 
              checked={formData.confirmAccuracy || false}
              onCheckedChange={(checked) => handleCheckboxChange('confirmAccuracy', checked === true)}
              className={errors.confirmAccuracy ? "border-red-500" : ""}
            />
            <label
              htmlFor="confirmAccuracy"
              className={errors.confirmAccuracy 
                ? "text-sm leading-none text-red-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-70" 
                : "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"}
            >
              I confirm that the information provided is accurate and complete
            </label>
          </div>
          {errors.confirmAccuracy && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.confirmAccuracy}
            </p>
          )}
        </div>
        
        <div className={errors.confirmCompliance ? "space-y-2 pb-2" : "space-y-2"}>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="confirmCompliance" 
              checked={formData.confirmCompliance || false}
              onCheckedChange={(checked) => handleCheckboxChange('confirmCompliance', checked === true)}
              className={errors.confirmCompliance ? "border-red-500" : ""}
            />
            <label
              htmlFor="confirmCompliance"
              className={errors.confirmCompliance 
                ? "text-sm leading-none text-red-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-70" 
                : "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"}
            >
              I understand that this system must comply with all relevant regulations, including the EU AI Act
            </label>
          </div>
          {errors.confirmCompliance && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.confirmCompliance}
            </p>
          )}
        </div>
      </div>
      
      {/* Add approval button */}
      <div className="mt-6 flex justify-between">
        <IntegratedApprovalButton 
          moduleId={formData.systemId || `AI-SYS-${Math.floor(1000 + Math.random() * 9000)}`}
          moduleType="system_registration"
          moduleName={`System Registration: ${formData.name || 'Unnamed System'}`}
          moduleData={{
            systemName: formData.name || 'Unnamed System',
            riskLevel: formData.riskLevel || 'Unknown',
            department: formData.department || '',
            description: formData.description || '',
          }}
          buttonText={`Request Approval for ${formData.name || 'This System'}`}
          buttonVariant="outline"
          className="w-full"
        />
      </div>
    </div>
  );
};