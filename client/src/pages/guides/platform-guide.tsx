
import React from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PlatformGuide() {
  return (
    <div className="container py-8 mx-auto max-w-6xl">
      <div className="mb-8">
        <Link href="/guides">
          <Button variant="ghost" className="flex items-center gap-1 px-0 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Guides
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">EU AI Act Compliance Platform Guide</h1>
        <p className="text-gray-500 mt-2">
          A guided tour through SGH ASIA's comprehensive compliance solution
        </p>
      </div>

      {/* Tour Guide Introduction */}
      <Card className="mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="shrink-0 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src="/assets/image_1742811943052.png"
                alt="Jack from SGH Asia"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Hello, I'm Jack from SGH ASIA</h2>
              <p className="text-blue-100">
                I'm honored to be your guide on this journey to discover our exceptional 
                EU AI Act Compliance Platform. Let me show you how our solution can transform 
                regulatory compliance into a strategic advantage for your organization.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Platform Introduction</h2>
              <div className="aspect-video relative overflow-hidden mb-6 rounded-lg border">
                <img
                  src="/assets/image_1742743429066.png"
                  alt="Platform Overview"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex gap-4 items-start">
                <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
                  <img
                    src="/assets/image_1742811943052.png"
                    alt="Jack"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg rounded-tl-none">
                  <p className="mb-2">
                    <span className="font-medium">Jack says:</span> "The SGH ASIA EU AI Act Compliance Platform provides 
                    a comprehensive toolkit for navigating the complexities of the European Union's 
                    AI Act. Our intuitive dashboard gives you a complete overview of your compliance 
                    status at a glance."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="inventory" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="inventory">AI System Inventory</TabsTrigger>
              <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-video relative overflow-hidden mb-6 rounded-lg border">
                    <img
                      src="/assets/image_1742742686806.png"
                      alt="AI System Inventory"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
                      <img
                        src="/assets/image_1742811943052.png"
                        alt="Jack"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg rounded-tl-none">
                      <p>
                        <span className="font-medium">Jack says:</span> "Our AI System Inventory module allows you to 
                        register and catalog all AI systems in your organization. You can track ownership, 
                        risk levels, and compliance status for each system in one centralized location."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="risk" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-video relative overflow-hidden mb-6 rounded-lg border">
                    <img
                      src="/assets/image_1742724779830.png"
                      alt="Risk Assessment"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
                      <img
                        src="/assets/image_1742811943052.png"
                        alt="Jack"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg rounded-tl-none">
                      <p>
                        <span className="font-medium">Jack says:</span> "The Risk Assessment module features our 
                        advanced SGH AI Risk Analyzer that automatically evaluates your AI systems against 
                        EU AI Act criteria. It identifies risk categories, relevant articles, and provides 
                        compliance recommendations."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documentation" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-video relative overflow-hidden mb-6 rounded-lg border">
                    <img
                      src="/assets/image_1742743911900.png"
                      alt="Documentation"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
                      <img
                        src="/assets/image_1742811943052.png"
                        alt="Jack"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg rounded-tl-none">
                      <p>
                        <span className="font-medium">Jack says:</span> "Our Documentation Management system 
                        helps you generate all required compliance documents with easy-to-use templates. 
                        Track document completeness, maintain version control, and export 
                        everything you need for audits."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Key Features</h3>
              <ul className="space-y-4">
                <li>
                  <div className="font-medium flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">1</div>
                    AI System Registration
                  </div>
                  <p className="text-sm text-gray-600 mt-1 ml-8">
                    Register and catalog all AI systems in use or development
                  </p>
                </li>
                <li>
                  <div className="font-medium flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">2</div>
                    Risk Assessment
                  </div>
                  <p className="text-sm text-gray-600 mt-1 ml-8">
                    Evaluate AI systems against EU AI Act risk criteria
                  </p>
                </li>
                <li>
                  <div className="font-medium flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">3</div>
                    Documentation Management
                  </div>
                  <p className="text-sm text-gray-600 mt-1 ml-8">
                    Generate and maintain all required compliance documents
                  </p>
                </li>
                <li>
                  <div className="font-medium flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">4</div>
                    Training & Education
                  </div>
                  <p className="text-sm text-gray-600 mt-1 ml-8">
                    Access role-specific training on EU AI Act requirements
                  </p>
                </li>
                <li>
                  <div className="font-medium flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">5</div>
                    Compliance Dashboard
                  </div>
                  <p className="text-sm text-gray-600 mt-1 ml-8">
                    Monitor compliance status across your organization
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Compliance Standards</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                  <span>EU AI Act</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                  <span>ISO 42001</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                  <span>ISO 27001</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                  <span>DORA</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Regulatory Intelligence */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Regulatory Intelligence</h2>
          <div className="aspect-video relative overflow-hidden mb-6 rounded-lg border">
            <img
              src="/assets/image_1742751189607.png"
              alt="Knowledge Center"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex gap-4 items-start">
            <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
              <img
                src="/assets/image_1742811943052.png"
                alt="Jack"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg rounded-tl-none">
              <p>
                <span className="font-medium">Jack says:</span> "Our Knowledge Center provides comprehensive 
                information on all regulatory frameworks, including the EU AI Act, DORA, ISO 27001, and 
                ISO 42001. Stay updated with the latest regulatory changes and access implementation 
                guides tailored to your industry."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Training Module */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Training & Education</h2>
          <div className="aspect-video relative overflow-hidden mb-6 rounded-lg border">
            <img
              src="/assets/image_1742667276702.png"
              alt="Training Module"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex gap-4 items-start">
            <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
              <img
                src="/assets/image_1742811943052.png"
                alt="Jack"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg rounded-tl-none">
              <p>
                <span className="font-medium">Jack says:</span> "Our Training Module offers role-specific 
                content tailored to decision-makers, developers, and operators. Track progress, 
                earn certifications, and ensure your team has the knowledge needed for effective 
                compliance implementation."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Enterprise Decision Platform */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Enterprise AI Decision Platform</h2>
          <div className="aspect-video relative overflow-hidden mb-6 rounded-lg border">
            <img
              src="/assets/image_1742656568251.png"
              alt="Enterprise Decision Platform"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex gap-4 items-start">
            <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
              <img
                src="/assets/image_1742811943052.png"
                alt="Jack"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg rounded-tl-none">
              <p>
                <span className="font-medium">Jack says:</span> "Our Enterprise AI Decision Platform 
                transforms regulatory compliance from a burden into a strategic advantage. It 
                provides decision-makers with actionable insights and tools for strategic planning, 
                risk management, and compliance optimization."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Business Value */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Business Value</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 bg-green-50">
              <h3 className="font-medium mb-2 text-green-800">Reduced Compliance Costs</h3>
              <p className="text-sm text-gray-600">
                Streamlined workflows and automation reduce the time and resources needed for compliance activities by up to 40%.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="font-medium mb-2 text-blue-800">Minimized Risk</h3>
              <p className="text-sm text-gray-600">
                Early identification of compliance gaps and prohibited use cases prevents costly regulatory penalties.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-purple-50">
              <h3 className="font-medium mb-2 text-purple-800">Accelerated Time-to-Market</h3>
              <p className="text-sm text-gray-600">
                Clear guidance on compliance requirements allows for faster development and deployment of AI initiatives.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-amber-50">
              <h3 className="font-medium mb-2 text-amber-800">Competitive Advantage</h3>
              <p className="text-sm text-gray-600">
                Demonstrate your commitment to ethical and responsible AI, building trust with customers and partners.
              </p>
            </div>
          </div>
          <div className="mt-6 flex gap-4 items-start">
            <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
              <img
                src="/assets/image_1742811943052.png"
                alt="Jack"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg rounded-tl-none">
              <p>
                <span className="font-medium">Jack says:</span> "Our platform delivers tangible 
                business value by transforming compliance from a cost center into a strategic advantage. 
                Organizations using our platform report an average 35% reduction in compliance-related 
                costs and a 25% faster time-to-market for AI initiatives."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Implementation Timeline */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Implementation Timeline</h2>
          <div className="relative pb-12">
            <div className="absolute h-full w-0.5 bg-blue-200 left-0 ml-3.5"></div>
            <div className="relative mb-8">
              <div className="flex items-center">
                <div className="z-10 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div className="flex-grow ml-4">
                  <h3 className="font-bold text-lg">August 2025</h3>
                  <p className="text-gray-600">Prohibitions on unacceptable risk AI systems</p>
                </div>
              </div>
            </div>
            <div className="relative mb-8">
              <div className="flex items-center">
                <div className="z-10 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div className="flex-grow ml-4">
                  <h3 className="font-bold text-lg">February 2026</h3>
                  <p className="text-gray-600">Obligations for high-risk AI systems</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center">
                <div className="z-10 flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div className="flex-grow ml-4">
                  <h3 className="font-bold text-lg">August 2026</h3>
                  <p className="text-gray-600">Complete application of all remaining provisions</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-4 items-start">
            <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
              <img
                src="/assets/image_1742811943052.png"
                alt="Jack"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg rounded-tl-none">
              <p>
                <span className="font-medium">Jack says:</span> "Our platform is designed to help you 
                meet these critical EU AI Act deadlines. We provide a structured approach to 
                implementation, ensuring you're prepared at each stage of the regulatory rollout."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to Start Your Compliance Journey?</h2>
              <p className="text-blue-100">
                Schedule a personalized demo with our team to see how SGH ASIA can transform 
                your approach to EU AI Act compliance.
              </p>
            </div>
            <div className="shrink-0">
              <Button className="bg-white text-blue-800 hover:bg-blue-50">
                Request a Demo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
