
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldIcon, FileTextIcon, DownloadIcon } from "lucide-react";

export function GdprAiAct() {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center">
          <ShieldIcon className="h-5 w-5 mr-2 text-primary" />
          <CardTitle>GDPR & AI Act</CardTitle>
        </div>
        <CardDescription>Intersection of data protection and AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">The Dual Regulatory Framework</h3>
        <p>
          The EU AI Act works alongside GDPR to create a comprehensive framework for AI governance. 
          While GDPR focuses on personal data protection, the AI Act addresses broader AI-specific risks.
          Understanding how these regulations intersect is crucial for comprehensive compliance.
        </p>
        
        <h3 className="text-lg font-semibold">Key Intersections</h3>
        <div className="space-y-3">
          <div className="border p-3 rounded-md">
            <h4 className="font-medium">Data Governance Requirements</h4>
            <p className="text-sm mt-1">
              <span className="font-medium">GDPR:</span> Focuses on lawful processing, purpose limitation, data minimization, 
              and storage limitation for personal data.
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">AI Act:</span> Requires appropriate data governance practices including examination 
              of biases, establishing data management procedures, and using appropriate data preparation techniques.
            </p>
            <p className="text-sm mt-1 text-blue-700">
              <span className="font-medium">Compliance Approach:</span> Establish integrated data governance practices that 
              satisfy both GDPR principles and AI Act requirements, particularly for training, validation, and testing datasets.
            </p>
          </div>
          
          <div className="border p-3 rounded-md">
            <h4 className="font-medium">Risk Assessment</h4>
            <p className="text-sm mt-1">
              <span className="font-medium">GDPR:</span> Requires Data Protection Impact Assessments (DPIAs) for high-risk 
              processing of personal data.
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">AI Act:</span> Mandates risk management systems for high-risk AI systems throughout 
              their lifecycle.
            </p>
            <p className="text-sm mt-1 text-blue-700">
              <span className="font-medium">Compliance Approach:</span> Develop an integrated risk assessment methodology that 
              combines DPIA requirements with AI risk management processes to efficiently address both regulations.
            </p>
          </div>
          
          <div className="border p-3 rounded-md">
            <h4 className="font-medium">Transparency & Information</h4>
            <p className="text-sm mt-1">
              <span className="font-medium">GDPR:</span> Requires informing data subjects about the existence of automated 
              decision-making, meaningful information about the logic involved, and the significance and consequences.
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">AI Act:</span> Requires transparency measures including instructions for use, 
              capabilities and limitations, performance specifications, and intended purpose.
            </p>
            <p className="text-sm mt-1 text-blue-700">
              <span className="font-medium">Compliance Approach:</span> Design comprehensive transparency measures that 
              satisfy both regulations, ensuring users and data subjects receive appropriate information about AI systems.
            </p>
          </div>
          
          <div className="border p-3 rounded-md">
            <h4 className="font-medium">Human Oversight</h4>
            <p className="text-sm mt-1">
              <span className="font-medium">GDPR:</span> Gives data subjects the right not to be subject to purely automated 
              decisions with significant effects (with exceptions).
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">AI Act:</span> Requires human oversight measures for high-risk AI systems, enabling 
              individuals to understand and interpret outputs and intervene when necessary.
            </p>
            <p className="text-sm mt-1 text-blue-700">
              <span className="font-medium">Compliance Approach:</span> Implement human oversight mechanisms that allow for 
              meaningful review of AI decision-making, satisfying both GDPR's restrictions on automated decisions and 
              the AI Act's oversight requirements.
            </p>
          </div>
          
          <div className="border p-3 rounded-md">
            <h4 className="font-medium">Documentation & Record-Keeping</h4>
            <p className="text-sm mt-1">
              <span className="font-medium">GDPR:</span> Requires documentation of processing activities and maintaining 
              records of all data processing activities.
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">AI Act:</span> Requires technical documentation, record-keeping, and logs for 
              high-risk AI systems.
            </p>
            <p className="text-sm mt-1 text-blue-700">
              <span className="font-medium">Compliance Approach:</span> Develop an integrated documentation strategy that 
              satisfies both regulations' record-keeping requirements, ensuring comprehensive traceability.
            </p>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mt-4">Practical Compliance Strategies</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="font-medium">Unified Governance Structure:</span> Establish a cross-functional 
            team responsible for both GDPR and AI Act compliance.
          </li>
          <li>
            <span className="font-medium">Integrated Impact Assessments:</span> Develop assessment methodologies 
            that address both data protection and AI-specific risks simultaneously.
          </li>
          <li>
            <span className="font-medium">Comprehensive Documentation System:</span> Implement a documentation 
            framework that satisfies the requirements of both regulations.
          </li>
          <li>
            <span className="font-medium">Privacy-by-Design in AI Development:</span> Incorporate data protection 
            principles from the earliest stages of AI system development.
          </li>
          <li>
            <span className="font-medium">Regular Compliance Audits:</span> Conduct periodic reviews to ensure 
            ongoing compliance with both regulatory frameworks.
          </li>
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="flex items-center gap-1">
          <FileTextIcon className="h-4 w-4" />
          Compliance Guide
        </Button>
        <Button variant="outline" className="flex items-center gap-1">
          <DownloadIcon className="h-4 w-4" />
          Download Checklist
        </Button>
      </CardFooter>
    </Card>
  );
}

export default GdprAiAct;
