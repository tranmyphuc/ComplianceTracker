
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, FileTextIcon, DownloadIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RiskClassification() {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center">
          <AlertTriangleIcon className="h-5 w-5 mr-2 text-primary" />
          <CardTitle>Risk Classification</CardTitle>
        </div>
        <CardDescription>Understanding AI risk categories</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">EU AI Act Risk-Based Approach</h3>
        <p>
          The EU AI Act establishes a risk-based approach to regulating AI systems, categorizing them based on 
          their potential impact on health, safety, and fundamental rights. Understanding these risk categories 
          is essential for determining applicable requirements.
        </p>
        
        <div className="space-y-4 mt-4">
          <div className="p-4 border rounded-md bg-red-50">
            <div className="flex items-center mb-2">
              <Badge variant="destructive">Unacceptable Risk</Badge>
            </div>
            <p className="text-sm">
              AI systems posing an unacceptable risk to people's safety, livelihoods, or rights are prohibited under the EU AI Act.
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm">
              <li>Social scoring systems by public authorities</li>
              <li>Systems using subliminal or manipulative techniques</li>
              <li>Systems exploiting vulnerabilities of specific groups</li>
              <li>Real-time remote biometric identification in publicly accessible spaces for law enforcement (with limited exceptions)</li>
              <li>Emotion recognition in workplaces and educational institutions</li>
              <li>Biometric categorization using sensitive characteristics</li>
            </ul>
          </div>
          
          <div className="p-4 border rounded-md bg-amber-50">
            <div className="flex items-center mb-2">
              <Badge className="bg-amber-600">High Risk</Badge>
            </div>
            <p className="text-sm">
              AI systems with significant potential impact on health, safety, or fundamental rights are subject to 
              strict requirements before market placement.
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm">
              <li>Critical infrastructure (e.g., transport) that could put lives at risk</li>
              <li>Educational or vocational training systems</li>
              <li>Safety components of products subject to third-party conformity assessment</li>
              <li>Employment, worker management, and access to self-employment</li>
              <li>Essential private and public services (e.g., credit scoring, social benefits)</li>
              <li>Law enforcement systems that may interfere with people's rights</li>
              <li>Migration, asylum, and border control management</li>
              <li>Administration of justice and democratic processes</li>
            </ul>
            <p className="text-sm mt-2">
              High-risk systems must comply with requirements including risk management, data governance, 
              technical documentation, record-keeping, transparency, human oversight, accuracy, and security.
            </p>
          </div>
          
          <div className="p-4 border rounded-md bg-blue-50">
            <div className="flex items-center mb-2">
              <Badge className="bg-blue-600">Limited Risk</Badge>
            </div>
            <p className="text-sm">
              AI systems with specific transparency obligations require minimum disclosure requirements.
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm">
              <li>Systems interacting with humans (must disclose they are AI)</li>
              <li>Emotion recognition or biometric categorization systems</li>
              <li>AI-generated or manipulated image, audio, or video content (deepfakes)</li>
            </ul>
            <p className="text-sm mt-2">
              These systems must have transparency measures that enable users to make informed decisions 
              about their interaction with the AI system.
            </p>
          </div>
          
          <div className="p-4 border rounded-md bg-green-50">
            <div className="flex items-center mb-2">
              <Badge className="bg-green-600">Minimal Risk</Badge>
            </div>
            <p className="text-sm">
              AI systems posing minimal or no risk to citizens' rights or safety are subject to very light regulation.
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm">
              <li>AI-enabled video games</li>
              <li>Spam filters</li>
              <li>Basic AI-powered inventory management systems</li>
              <li>Simple recommendation systems</li>
            </ul>
            <p className="text-sm mt-2">
              The vast majority of AI systems fall into this category. While not subject to specific obligations, 
              providers are encouraged to adhere to voluntary codes of conduct.
            </p>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mt-4">Risk Assessment Considerations</h3>
        <p>
          When determining the risk level of your AI system, consider these factors:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Intended purpose and use cases of the AI system</li>
          <li>Sector of deployment (healthcare, education, law enforcement, etc.)</li>
          <li>Potential impact on fundamental rights</li>
          <li>Level of autonomy in decision-making</li>
          <li>Categories of data used by the system</li>
          <li>Potential consequences of system failure or misuse</li>
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="flex items-center gap-1">
          <FileTextIcon className="h-4 w-4" />
          Risk Assessment Guide
        </Button>
        <Button variant="outline" className="flex items-center gap-1">
          <DownloadIcon className="h-4 w-4" />
          Download Checklist
        </Button>
      </CardFooter>
    </Card>
  );
}

export default RiskClassification;
