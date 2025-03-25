
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileTextIcon, GavelIcon, DownloadIcon } from "lucide-react";

export function Iso42001Overview() {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center">
          <GavelIcon className="h-5 w-5 mr-2 text-primary" />
          <CardTitle>ISO 42001</CardTitle>
        </div>
        <CardDescription>AI Management System Standard</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">What is ISO 42001?</h3>
        <p>
          ISO 42001 is the international standard for AI management systems, providing organizations with a framework 
          to effectively manage artificial intelligence. It establishes requirements for the development, 
          implementation, maintenance, and continual improvement of an AI management system within an organization.
        </p>
        
        <h3 className="text-lg font-semibold">Key Components</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="font-medium">AI Management System Framework:</span> A structured approach to managing AI 
            risks and opportunities, including leadership commitment, planning, support, operation, performance evaluation, 
            and improvement.
          </li>
          <li>
            <span className="font-medium">Risk-Based Approach:</span> Requirements for identifying, assessing, and 
            managing risks associated with AI systems throughout their lifecycle.
          </li>
          <li>
            <span className="font-medium">Governance Structure:</span> Defining roles, responsibilities, and 
            accountabilities for AI management within the organization.
          </li>
          <li>
            <span className="font-medium">Transparency and Documentation:</span> Requirements for documenting AI 
            processes, decisions, and outcomes to ensure transparency and traceability.
          </li>
        </ul>
        
        <h3 className="text-lg font-semibold">Relation to EU AI Act Compliance</h3>
        <p>
          ISO 42001 complements EU AI Act requirements in several important ways:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="font-medium">Management System Alignment:</span> ISO 42001 provides a management 
            system approach that can help organizations implement the risk management requirements of the EU AI Act.
          </li>
          <li>
            <span className="font-medium">Documentation Support:</span> The standard's documentation requirements 
            align with the technical documentation and record-keeping obligations under the EU AI Act.
          </li>
          <li>
            <span className="font-medium">Risk Assessment Framework:</span> ISO 42001's risk assessment methodology 
            can help organizations fulfill the EU AI Act's risk management obligations.
          </li>
          <li>
            <span className="font-medium">Governance Structure:</span> The standard's governance requirements 
            support the human oversight provisions of the EU AI Act.
          </li>
          <li>
            <span className="font-medium">Continuous Improvement:</span> ISO 42001's focus on performance evaluation 
            and improvement aligns with the EU AI Act's post-market monitoring requirements.
          </li>
        </ul>
        
        <h3 className="text-lg font-semibold">Implementation Benefits</h3>
        <p>
          Implementing ISO 42001 can provide several benefits for organizations seeking EU AI Act compliance:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Structured approach to meeting regulatory requirements</li>
          <li>Established framework for risk management</li>
          <li>Clear documentation guidelines that support compliance evidence</li>
          <li>Internationally recognized standard that demonstrates commitment to responsible AI</li>
          <li>Continuous improvement mechanisms that help maintain compliance over time</li>
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="flex items-center gap-1">
          <FileTextIcon className="h-4 w-4" />
          Standard Details
        </Button>
        <Button variant="outline" className="flex items-center gap-1">
          <DownloadIcon className="h-4 w-4" />
          Download Guide
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Iso42001Overview;
