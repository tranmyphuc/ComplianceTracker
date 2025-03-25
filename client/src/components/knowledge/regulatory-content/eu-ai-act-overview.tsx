
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookIcon, FileTextIcon, DownloadIcon } from "lucide-react";

export function EuAiActOverview() {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center">
          <BookIcon className="h-5 w-5 mr-2 text-primary" />
          <CardTitle>EU AI Act Overview</CardTitle>
        </div>
        <CardDescription>Comprehensive guide to the regulation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">What is the EU AI Act?</h3>
        <p>
          The EU AI Act is a comprehensive legal framework specifically regulating artificial intelligence systems 
          in the European Union. It establishes a risk-based approach that categorizes AI applications based on 
          their potential risk level.
        </p>
        
        <h3 className="text-lg font-semibold">Key Provisions</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="font-medium">Risk-Based Classification:</span> Systems are categorized as unacceptable risk (prohibited), 
            high-risk (heavily regulated), limited risk (transparency requirements), or minimal risk (minimal regulation).
          </li>
          <li>
            <span className="font-medium">Prohibited AI Systems:</span> Systems that pose an unacceptable risk to fundamental 
            rights are prohibited, including social scoring, subliminal manipulation, and exploitative systems targeting vulnerable groups.
          </li>
          <li>
            <span className="font-medium">High-Risk AI Requirements:</span> Systems that significantly impact health, safety, 
            or fundamental rights must comply with strict requirements including risk management, data governance, technical 
            documentation, record-keeping, transparency, human oversight, and robustness.
          </li>
          <li>
            <span className="font-medium">Transparency Obligations:</span> Systems with specific transparency obligations (limited risk) 
            must disclose that they are AI systems when interacting with humans.
          </li>
          <li>
            <span className="font-medium">Governance Framework:</span> Establishment of a European Artificial Intelligence Board 
            and national competent authorities for supervision and enforcement.
          </li>
        </ul>
        
        <h3 className="text-lg font-semibold">Implementation Timeline</h3>
        <p>
          The EU AI Act follows this implementation timeline:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="font-medium">March 2024:</span> Entry into force (20 days after final publication)</li>
          <li><span className="font-medium">August 2024:</span> Prohibited practices take effect (6 months after entry into force)</li>
          <li><span className="font-medium">Feb-Aug 2025:</span> GPAI provisions apply (12-18 months after entry into force)</li>
          <li><span className="font-medium">Aug 2025-Feb 2026:</span> High-risk system provisions apply (24-36 months after entry into force)</li>
          <li><span className="font-medium">August 2026:</span> Full application of the AI Act</li>
        </ul>
        
        <h3 className="text-lg font-semibold">Compliance Requirements</h3>
        <p>
          A complete breakdown of the EU AI Act includes these key compliance requirements:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Risk management system implementation</li>
          <li>Data governance and management practices</li>
          <li>Technical documentation and record-keeping</li>
          <li>Transparency and provision of information to users</li>
          <li>Human oversight measures</li>
          <li>Accuracy, robustness, and cybersecurity</li>
          <li>Conformity assessment procedures</li>
          <li>Registration in the EU database</li>
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="flex items-center gap-1">
          <FileTextIcon className="h-4 w-4" />
          Full Text
        </Button>
        <Button variant="outline" className="flex items-center gap-1">
          <DownloadIcon className="h-4 w-4" />
          Download PDF
        </Button>
      </CardFooter>
    </Card>
  );
}

export default EuAiActOverview;
