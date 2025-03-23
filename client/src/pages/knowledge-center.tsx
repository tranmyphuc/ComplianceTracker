import { useState } from "react";
import { KnowledgeBase } from "@/components/knowledge/knowledge-base";
import { EUAIActText } from "@/components/knowledge/regulatory-content/eu-ai-act-text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpenIcon, BookIcon, GavelIcon, HelpCircleIcon } from "lucide-react";

export default function KnowledgeCenter() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800">Knowledge Center</h1>
        <p className="text-neutral-500 mt-1">Comprehensive resources and guidance for EU AI Act compliance</p>
      </div>
      
      <Card className="mb-6 border-neutral-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">EU AI Act Knowledge Center</CardTitle>
          <CardDescription>Interactive resources to help you understand and comply with EU AI regulations</CardDescription>
        </CardHeader>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">
                <BookOpenIcon className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="regulatory-text">
                <GavelIcon className="h-4 w-4 mr-2" />
                Regulatory Text
              </TabsTrigger>
              <TabsTrigger value="resources">
                <BookIcon className="h-4 w-4 mr-2" />
                Resources
              </TabsTrigger>
              <TabsTrigger value="faq">
                <HelpCircleIcon className="h-4 w-4 mr-2" />
                FAQ
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="mt-0">
            <KnowledgeBase />
          </TabsContent>
          
          <TabsContent value="regulatory-text" className="mt-0 px-6 py-4">
            <EUAIActText />
          </TabsContent>
          
          <TabsContent value="resources" className="mt-0 px-6 py-4">
            <div className="p-8 text-center text-neutral-500">
              <BookOpenIcon className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <p>Additional resources and implementation guides coming soon</p>
            </div>
          </TabsContent>
          
          <TabsContent value="faq" className="mt-0 px-6 py-4">
            <div className="p-8 text-center text-neutral-500">
              <HelpCircleIcon className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <p>Frequently asked questions and answers coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}