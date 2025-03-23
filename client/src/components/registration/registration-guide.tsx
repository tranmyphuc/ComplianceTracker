import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle2, ClipboardList, FileText, ShieldAlert } from "lucide-react";
import { Separator } from "../ui/separator";

export const RegistrationGuide: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Registration Guide</CardTitle>
        <CardDescription>
          Learn about AI system registration under the EU AI Act
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="space-y-2">
          <h3 className="font-medium flex items-center">
            <ClipboardList className="h-4 w-4 mr-2" />
            Why Register AI Systems?
          </h3>
          <p className="text-muted-foreground">
            The EU AI Act requires organizations to register AI systems based on their risk level.
            Registration helps ensure compliance, transparency, and accountability.
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="font-medium flex items-center">
            <ShieldAlert className="h-4 w-4 mr-2" />
            Risk Classification
          </h3>
          <ul className="space-y-2 pl-6 list-disc text-muted-foreground">
            <li>
              <span className="font-medium text-red-600">Unacceptable Risk:</span> Systems posing unacceptable risks to safety, fundamental rights, or EU values. These are prohibited.
            </li>
            <li>
              <span className="font-medium text-amber-600">High Risk:</span> Systems with significant potential to harm health, safety, or fundamental rights. Subject to strict requirements.
            </li>
            <li>
              <span className="font-medium text-blue-600">Limited Risk:</span> Systems with specific transparency obligations, such as chatbots or emotion recognition.
            </li>
            <li>
              <span className="font-medium text-green-600">Minimal Risk:</span> All other AI systems with minimal regulatory requirements.
            </li>
          </ul>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="font-medium flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Registration Process
          </h3>
          <ol className="space-y-2 pl-6 list-decimal text-muted-foreground">
            <li>
              <span className="font-medium">Basic Information:</span> Provide system name, description, purpose, and ownership details.
            </li>
            <li>
              <span className="font-medium">Technical Details:</span> Document AI capabilities, training data, and deployment context.
            </li>
            <li>
              <span className="font-medium">Risk Assessment:</span> Evaluate potential risks and impacts of the system.
            </li>
            <li>
              <span className="font-medium">Review & Submit:</span> Verify information and submit for compliance tracking.
            </li>
          </ol>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="font-medium flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Tips for Completion
          </h3>
          <ul className="space-y-1 pl-6 list-disc text-muted-foreground">
            <li>Be thorough and accurate when describing system capabilities</li>
            <li>Document data sources and training methodologies clearly</li>
            <li>Consider all potential impacts, especially on vulnerable groups</li>
            <li>Detail risk mitigation measures implemented</li>
            <li>Keep technical documentation updated as the system evolves</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};