
import React, { useState } from "react";
import { ChevronDownIcon, BookOpenIcon, CheckIcon, InfoIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

const registrationSteps = [
  {
    id: "step1",
    title: "Basic Information",
    description: "Enter essential information about your AI system",
    tips: [
      "Name - Use a clear, descriptive name that reflects the system's purpose",
      "Vendor - Specify the company or team that developed the system",
      "Description - Provide a comprehensive overview of what the system does",
      "Purpose - Explain why this system was developed and how it's intended to be used"
    ]
  },
  {
    id: "step2",
    title: "Technical Details",
    description: "Provide specific technical information about your AI system",
    tips: [
      "AI Capabilities - List the AI technologies and methods used (NLP, Computer Vision, etc.)",
      "Training Datasets - Describe the data used to train the system",
      "Output Types - Specify what kind of outputs the system produces",
      "System Architecture - Include information about components and integrations"
    ]
  },
  {
    id: "step3",
    title: "Risk Assessment",
    description: "Evaluate potential risks and compliance requirements",
    tips: [
      "Risk Level - Classify according to EU AI Act categories: Unacceptable, High, Limited, or Minimal",
      "Potential Impact - Assess how the system might affect individuals and society",
      "Mitigation Measures - Document steps taken to mitigate identified risks",
      "Use the AI Analysis button to get assistance with risk classification"
    ]
  },
  {
    id: "step4",
    title: "Documentation & Compliance",
    description: "Prepare necessary documentation for regulatory compliance",
    tips: [
      "Technical Documentation - Prepare detailed documentation as required by EU AI Act",
      "Data Governance - Document how data is managed throughout the system lifecycle",
      "Human Oversight - Explain measures for human supervision and intervention",
      "Required documentation varies based on risk level - High-risk systems need more comprehensive documentation"
    ]
  }
];

const euAiActInfo = [
  {
    id: "unacceptable",
    title: "Unacceptable Risk Systems",
    description: "Systems explicitly prohibited under the EU AI Act",
    examples: [
      "Social scoring systems used by public authorities",
      "Certain real-time biometric identification systems in public spaces",
      "Emotion recognition in workplace/educational settings",
      "AI for manipulating human behavior to circumvent free will"
    ]
  },
  {
    id: "high",
    title: "High Risk Systems",
    description: "Systems in critical areas with significant impact potential",
    examples: [
      "AI in critical infrastructure (transport, water, gas, electricity, etc.)",
      "Educational or vocational training systems",
      "Employment, worker management, and access to self-employment",
      "Law enforcement, migration, asylum, and border control",
      "Administration of justice and democratic processes"
    ]
  },
  {
    id: "limited",
    title: "Limited Risk Systems",
    description: "Systems with transparency requirements",
    examples: [
      "Chatbots and virtual assistants",
      "Emotion recognition systems",
      "Biometric categorization systems",
      "AI-generated or manipulated image, audio, or video content (deepfakes)"
    ]
  },
  {
    id: "minimal",
    title: "Minimal Risk Systems",
    description: "Systems with minimal regulatory requirements",
    examples: [
      "AI-enabled video games",
      "Spam filters",
      "AI for inventory management",
      "Manufacturing optimization systems"
    ]
  }
];

export const RegistrationGuide: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border-neutral-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <BookOpenIcon className="h-5 w-5 mr-2 text-primary" />
            Registration Guide
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 px-2"
          >
            {isExpanded ? "Hide Guide" : "Show Guide"}
            <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </Button>
        </div>
        <CardDescription>
          Follow these steps to accurately register your AI system in accordance with EU AI Act requirements
        </CardDescription>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {registrationSteps.map((step) => (
                <div
                  key={step.id}
                  className="bg-neutral-50 rounded-lg p-4 border border-neutral-200"
                >
                  <h3 className="text-sm font-medium mb-1 flex items-center">
                    <CheckIcon className="h-4 w-4 mr-1 text-primary" />
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-600 mb-2">{step.description}</p>
                  <ul className="text-xs space-y-1">
                    {step.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block h-1 w-1 rounded-full bg-neutral-400 mt-1.5 mr-1.5"></span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <InfoIcon className="h-4 w-4 mr-1 text-primary" />
                EU AI Act Risk Categories
              </h3>
              
              <Accordion type="single" collapsible>
                {euAiActInfo.map((info) => (
                  <AccordionItem key={info.id} value={info.id} className="border-b border-neutral-200">
                    <AccordionTrigger className="text-sm py-2">
                      <span className="flex items-center">
                        <span className={`h-2 w-2 rounded-full mr-2 ${
                          info.id === "unacceptable" ? "bg-red-500" :
                          info.id === "high" ? "bg-amber-500" :
                          info.id === "limited" ? "bg-blue-500" :
                          "bg-green-500"
                        }`}></span>
                        {info.title}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-xs pb-4">
                      <p className="mb-2 text-neutral-600">{info.description}</p>
                      <div className="pl-4">
                        <p className="font-medium mb-1">Examples:</p>
                        <ul className="space-y-1">
                          {info.examples.map((example, i) => (
                            <li key={i} className="flex items-start">
                              <span className="inline-block h-1 w-1 rounded-full bg-neutral-400 mt-1.5 mr-1.5"></span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="text-sm font-medium mb-1 text-blue-800">Using AI Assistance</h3>
              <p className="text-xs text-blue-700">
                The SGH ASIA platform provides AI-powered assistance to help you accurately classify and 
                register your AI systems. Click the "Generate with AI" or "Analyze with SGH AI" buttons to:
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1">
                <li className="flex items-start">
                  <span className="inline-block h-1 w-1 rounded-full bg-blue-400 mt-1.5 mr-1.5"></span>
                  <span>Automatically extract system details from documentation</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-1 w-1 rounded-full bg-blue-400 mt-1.5 mr-1.5"></span>
                  <span>Generate suggestions based on system description</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-1 w-1 rounded-full bg-blue-400 mt-1.5 mr-1.5"></span>
                  <span>Determine appropriate risk classification</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block h-1 w-1 rounded-full bg-blue-400 mt-1.5 mr-1.5"></span>
                  <span>Identify relevant EU AI Act articles</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
