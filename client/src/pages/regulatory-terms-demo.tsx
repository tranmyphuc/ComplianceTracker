import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RegulatoryTooltip } from '@/components/ui/regulatory-tooltip';

export default function RegulatoryTermsDemo() {
  const [language, setLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <Helmet>
        <title>Regulatory Terms Demo - EU AI Act Compliance</title>
      </Helmet>

      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Regulatory Terms Interactive Demo</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Language Settings</CardTitle>
              <CardDescription>Select the language for regulatory terms</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={language}
                onValueChange={setLanguage}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en" id="en" />
                  <Label htmlFor="en">English</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="de" id="de" />
                  <Label htmlFor="de">German (Deutsch)</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Search for a Term</CardTitle>
              <CardDescription>Enter a regulatory term to display its information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="e.g., AI System, High-Risk, General Purpose AI"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button disabled={!searchTerm}>Search</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="example" className="mb-10">
          <TabsList>
            <TabsTrigger value="example">Example Usage</TabsTrigger>
            <TabsTrigger value="inline">Inline Demo</TabsTrigger>
            <TabsTrigger value="block">Block Demo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="example" className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-4">Interactive Tooltip Example</h2>
            <p className="mb-4">
              The EU AI Act establishes a comprehensive framework for regulating{' '}
              <RegulatoryTooltip term="AI System" language={language} inline>artificial intelligence systems</RegulatoryTooltip>{' '}
              based on their risk levels. Systems categorized as{' '}
              <RegulatoryTooltip term="High-Risk AI System" language={language} inline>high-risk</RegulatoryTooltip>{' '}
              must comply with strict requirements, while{' '}
              <RegulatoryTooltip term="General Purpose AI" language={language} inline>general purpose AI models</RegulatoryTooltip>{' '}
              have their own set of obligations.
            </p>
            
            <div className="bg-muted p-4 rounded-md mt-6">
              <h3 className="font-medium mb-2">How It Works:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Hover over the underlined terms above to see their definitions</li>
                <li>The tooltip content is fetched from the database in real-time</li>
                <li>Try changing the language to see translations</li>
              </ol>
            </div>
          </TabsContent>
          
          <TabsContent value="inline" className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-4">Inline Tooltips</h2>
            <p className="mb-4">
              Inline tooltips appear directly above the text and are ideal for reading flow:
            </p>
            
            <div className="space-y-2">
              <div>
                <RegulatoryTooltip term="AI System" language={language} inline>AI System</RegulatoryTooltip>
              </div>
              <div>
                <RegulatoryTooltip term="General Purpose AI" language={language} inline>General Purpose AI</RegulatoryTooltip>
              </div>
              <div>
                <RegulatoryTooltip term="High-Risk AI System" language={language} inline>High-Risk AI System</RegulatoryTooltip>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="block" className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-4">Block Tooltips</h2>
            <p className="mb-4">
              Block tooltips use hover cards for more detailed information:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    <RegulatoryTooltip term="AI System" language={language}>AI System</RegulatoryTooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    The foundation of the EU AI Act regulatory framework.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    <RegulatoryTooltip term="General Purpose AI" language={language}>General Purpose AI</RegulatoryTooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Models designed for multiple use cases across different domains.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    <RegulatoryTooltip term="High-Risk AI System" language={language}>High-Risk AI System</RegulatoryTooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Systems requiring the most stringent compliance measures.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Implementation Instructions</CardTitle>
            <CardDescription>How to add regulatory tooltips to your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Basic Usage:</h3>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                  {`<RegulatoryTooltip term="AI System" language="en" inline>
  artificial intelligence system
</RegulatoryTooltip>`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Block Level Usage:</h3>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                  {`<RegulatoryTooltip term="High-Risk AI System" language="en">
  High-Risk AI System
</RegulatoryTooltip>`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">With Language Override:</h3>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                  {`<RegulatoryTooltip term="General Purpose AI" language="de" inline>
  Allzweck-KI
</RegulatoryTooltip>`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}