
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { InfoIcon, CheckCircle, FileText, BookIcon, ArrowRightIcon, DownloadIcon } from 'lucide-react';
import { Link } from 'wouter';

const ISO42001Page: React.FC = () => {
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">ISO 42001 - AI Management System</h1>
        <p className="text-muted-foreground">
          International standard for artificial intelligence management systems
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Introduction to ISO 42001</CardTitle>
          <CardDescription>Understanding the new global standard for AI management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            ISO 42001 is the world's first international standard for artificial intelligence management systems. Released in 2024, it provides organizations with a comprehensive framework for managing the risks and maximizing the benefits of AI technologies. This standard defines requirements for establishing, implementing, maintaining, and continually improving an AI management system.
          </p>
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Key Information</AlertTitle>
            <AlertDescription>
              ISO 42001 is officially titled "Artificial intelligence — Management system — Requirements" and was developed by the ISO/IEC JTC 1/SC 42 committee dedicated to artificial intelligence.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Primary Objectives</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Establish a structured approach to AI governance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Ensure responsible development and use of AI systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Enhance trust in AI applications through standardized processes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Support regulatory compliance including the EU AI Act</span>
                </li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Key Components</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Leadership and commitment to AI governance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Planning for AI risks and opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>AI operational management and control</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Performance evaluation and continual improvement</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Structure & Requirements</TabsTrigger>
          <TabsTrigger value="benefits">Benefits & Applications</TabsTrigger>
          <TabsTrigger value="integration">EU AI Act Integration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ISO 42001 Structure</CardTitle>
              <CardDescription>High-level structure of the standard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                ISO 42001 follows the High-Level Structure (HLS) common to all ISO management system standards, making it compatible with other standards like ISO 9001 (Quality), ISO 27001 (Information Security), and ISO 31000 (Risk Management).
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">1. Context of the Organization</h4>
                  <p className="text-muted-foreground text-sm">Understanding the organization and its context, interested parties' needs and expectations, and determining the scope of the AI management system.</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium">2. Leadership</h4>
                  <p className="text-muted-foreground text-sm">Top management commitment, policy establishment, and assignment of roles, responsibilities, and authorities.</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium">3. Planning</h4>
                  <p className="text-muted-foreground text-sm">Actions to address risks and opportunities, establishing AI objectives, and planning to achieve them.</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium">4. Support</h4>
                  <p className="text-muted-foreground text-sm">Resources, competence, awareness, communication, and documented information.</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium">5. Operation</h4>
                  <p className="text-muted-foreground text-sm">Operational planning and control, AI lifecycle management, AI supply chain management.</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium">6. Performance Evaluation</h4>
                  <p className="text-muted-foreground text-sm">Monitoring, measurement, analysis, evaluation, internal audit, and management review.</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium">7. Improvement</h4>
                  <p className="text-muted-foreground text-sm">Nonconformity and corrective action, continual improvement.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Key Requirements</CardTitle>
              <CardDescription>Essential requirements of ISO 42001</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">AI Policy</h4>
                  <p className="text-muted-foreground text-sm">Establishing an AI policy that provides a framework for setting and reviewing AI-related objectives.</p>
                </div>
                <div>
                  <h4 className="font-medium">Risk Assessment</h4>
                  <p className="text-muted-foreground text-sm">Comprehensive risk assessment procedures for AI systems, addressing technical, ethical, and social risks.</p>
                </div>
                <div>
                  <h4 className="font-medium">Lifecycle Management</h4>
                  <p className="text-muted-foreground text-sm">Managing the entire AI system lifecycle from design and development to deployment, use, and retirement.</p>
                </div>
                <div>
                  <h4 className="font-medium">Competence and Awareness</h4>
                  <p className="text-muted-foreground text-sm">Ensuring personnel have the necessary competence and awareness of AI governance principles and processes.</p>
                </div>
                <div>
                  <h4 className="font-medium">Documentation</h4>
                  <p className="text-muted-foreground text-sm">Maintaining documented information on AI systems, including design specifications, training data, and performance metrics.</p>
                </div>
                <div>
                  <h4 className="font-medium">Internal Audit</h4>
                  <p className="text-muted-foreground text-sm">Conducting regular internal audits to ensure the AI management system is effectively implemented and maintained.</p>
                </div>
                <div>
                  <h4 className="font-medium">Continual Improvement</h4>
                  <p className="text-muted-foreground text-sm">Processes for continually improving the suitability, adequacy, and effectiveness of the AI management system.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Benefits of ISO 42001</CardTitle>
              <CardDescription>Advantages of implementing the standard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Organizational Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Enhanced AI governance and accountability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Improved risk management for AI deployments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Streamlined compliance with regulatory requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Systematic approach to AI system development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Demonstration of commitment to responsible AI</span>
                    </li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Business Advantages</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Competitive advantage in AI-related markets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Increased stakeholder trust and confidence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Reduced costs through risk mitigation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Improved AI system performance and reliability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Enhanced innovation through structured processes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Applications Across Industries</CardTitle>
              <CardDescription>How ISO 42001 can be applied in different sectors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Healthcare</h3>
                  <p className="text-sm text-muted-foreground">
                    For medical AI applications, providing a framework for ensuring patient safety, data privacy, and clinical efficacy while managing risks associated with medical decision support systems.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Financial Services</h3>
                  <p className="text-sm text-muted-foreground">
                    For AI in banking and financial services, ensuring fair lending practices, explainable credit decisions, and robust risk management for algorithmic trading and fraud detection.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Manufacturing</h3>
                  <p className="text-sm text-muted-foreground">
                    For industrial AI applications, providing guidance on quality assurance, predictive maintenance, process optimization, and worker safety in automated environments.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Public Sector</h3>
                  <p className="text-sm text-muted-foreground">
                    For government AI applications, ensuring transparency, fairness, and accountability in public service delivery, social welfare systems, and administrative decision-making.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Retail & E-commerce</h3>
                  <p className="text-sm text-muted-foreground">
                    For consumer-facing AI, managing personalization algorithms, recommendation systems, and customer service automation with appropriate privacy and transparency safeguards.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Transportation</h3>
                  <p className="text-sm text-muted-foreground">
                    For mobility applications, providing guidance on safety management for autonomous systems, route optimization, and predictive maintenance while ensuring robust risk controls.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ISO 42001 and EU AI Act Alignment</CardTitle>
              <CardDescription>How these frameworks complement each other</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                ISO 42001 and the EU AI Act are complementary frameworks that together provide a comprehensive approach to AI governance and compliance. While the EU AI Act establishes legal requirements for AI systems in the European market, ISO 42001 provides a management system framework that can help organizations implement and maintain compliance with these requirements.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border px-4 py-2 text-left">EU AI Act Requirement</th>
                      <th className="border px-4 py-2 text-left">ISO 42001 Support</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2">Risk Management System</td>
                      <td className="border px-4 py-2">Provides a structured framework for risk identification, assessment, and mitigation throughout the AI lifecycle</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">Technical Documentation</td>
                      <td className="border px-4 py-2">Defines requirements for maintaining documented information about AI systems, including design, data, and testing</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">Data Governance</td>
                      <td className="border px-4 py-2">Establishes processes for data quality management, bias detection, and appropriate data handling</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">Human Oversight</td>
                      <td className="border px-4 py-2">Defines roles, responsibilities, and processes for meaningful human oversight of AI systems</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">Accuracy and Robustness</td>
                      <td className="border px-4 py-2">Provides frameworks for testing, validation, and monitoring of AI system performance</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">Transparency</td>
                      <td className="border px-4 py-2">Establishes requirements for communication about AI capabilities and limitations</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Implementation Strategy</CardTitle>
              <CardDescription>Integrated approach to ISO 42001 and EU AI Act compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">1. Integrated Gap Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Conduct a comprehensive assessment of current AI practices against both ISO 42001 requirements and EU AI Act provisions, identifying common areas and specific gaps in each framework.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">2. Unified Documentation System</h3>
                  <p className="text-sm text-muted-foreground">
                    Establish a harmonized documentation approach that satisfies both the management system requirements of ISO 42001 and the technical documentation requirements of the EU AI Act.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">3. Risk-Based Implementation</h3>
                  <p className="text-sm text-muted-foreground">
                    Prioritize implementation actions based on risk levels, focusing first on high-risk AI systems as defined in the EU AI Act, using ISO 42001's risk management framework.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">4. Integrated Auditing</h3>
                  <p className="text-sm text-muted-foreground">
                    Develop an audit program that evaluates compliance with both frameworks simultaneously, avoiding duplication of effort and ensuring comprehensive coverage.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">5. Continuous Improvement</h3>
                  <p className="text-sm text-muted-foreground">
                    Implement a cycle of continuous improvement that addresses both management system effectiveness (ISO 42001) and specific compliance requirements (EU AI Act).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="bg-muted/50 rounded-lg p-6 mt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Ready to Implement ISO 42001?</h2>
            <p className="text-muted-foreground">
              Our platform can help you integrate ISO 42001 with your EU AI Act compliance strategy
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <DownloadIcon className="h-4 w-4" />
              Download Guide
            </Button>
            <Button className="flex items-center gap-2">
              <ArrowRightIcon className="h-4 w-4" />
              Start Assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISO42001Page;
