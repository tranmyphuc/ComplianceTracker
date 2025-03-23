import React, { useState } from 'react';
import { 
  EmojiComplexityMeter, 
  ArticleComplexity, 
  RegulatoryRiskMeter,
  ComplianceEmojiBoard
} from '@/components/risk-assessment/emoji-complexity-meter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

// EU AI Act article data with complexity ratings
const articleData = [
  { 
    id: '5', 
    title: 'Prohibited AI Practices', 
    description: 'Defines AI systems that are prohibited in the EU due to their unacceptable risks', 
    complexity: 'extreme' as const,
    requirementCount: 4
  },
  { 
    id: '6', 
    title: 'Classification Rules for High-Risk AI Systems', 
    description: 'Defines the criteria for classifying AI systems as high-risk', 
    complexity: 'complex' as const,
    requirementCount: 2
  },
  { 
    id: '7', 
    title: 'Amendment to Annex III (High-Risk Areas)', 
    description: 'Process for updating the list of high-risk AI application areas', 
    complexity: 'moderate' as const,
    requirementCount: 3
  },
  { 
    id: '8', 
    title: 'Compliance with Requirements for High-Risk AI', 
    description: 'General obligation for high-risk AI systems to comply with requirements', 
    complexity: 'simple' as const,
    requirementCount: 1
  },
  { 
    id: '9', 
    title: 'Risk Management System', 
    description: 'Requirements for implementing a risk management system for high-risk AI', 
    complexity: 'very-complex' as const,
    requirementCount: 7
  },
  { 
    id: '10', 
    title: 'Data and Data Governance', 
    description: 'Requirements for data quality and data governance for training and validation', 
    complexity: 'very-complex' as const,
    requirementCount: 5
  },
  { 
    id: '11', 
    title: 'Technical Documentation', 
    description: 'Requirements for detailed technical documentation to be maintained', 
    complexity: 'complex' as const,
    requirementCount: 2
  },
  { 
    id: '12', 
    title: 'Record-Keeping', 
    description: 'Requirements for automatic recording of events while operating high-risk AI', 
    complexity: 'complex' as const,
    requirementCount: 4
  },
  { 
    id: '13', 
    title: 'Transparency and Provision of Information', 
    description: 'Requirements for transparency and information to be provided to users', 
    complexity: 'moderate' as const,
    requirementCount: 3
  },
  { 
    id: '14', 
    title: 'Human Oversight', 
    description: 'Requirements for human oversight of high-risk AI systems', 
    complexity: 'complex' as const,
    requirementCount: 4
  },
  { 
    id: '15', 
    title: 'Accuracy, Robustness and Cybersecurity', 
    description: 'Requirements for performance, robustness and security', 
    complexity: 'very-complex' as const,
    requirementCount: 6
  },
  { 
    id: '16', 
    title: 'General Purpose AI Systems', 
    description: 'Additional requirements for general purpose AI systems', 
    complexity: 'extreme' as const,
    requirementCount: 5
  },
  { 
    id: '17', 
    title: 'Conformity Assessment for High-Risk AI', 
    description: 'Process for conformity assessment and certification', 
    complexity: 'complex' as const,
    requirementCount: 3
  },
  { 
    id: '18', 
    title: 'Harmonized Standards', 
    description: 'Use of harmonized standards for demonstrating compliance', 
    complexity: 'simple' as const,
    requirementCount: 1
  }
];

// Sample compliance data for demonstration
const sampleComplianceData = articleData.map(article => ({
  articleId: article.id,
  title: article.title,
  complexity: article.complexity,
  status: ['compliant', 'in-progress', 'non-compliant', 'not-applicable'][Math.floor(Math.random() * 4)] as 'compliant' | 'in-progress' | 'non-compliant' | 'not-applicable'
}));

// Define the risk profile type
type RiskProfile = {
  name: string;
  riskLevel: 'minimal' | 'limited' | 'high' | 'unacceptable';
  articles: string[];
  description: string;
};

type RiskProfileKey = 'medical_diagnostic' | 'recruitment' | 'chatbot' | 'social_scoring' | 'recommendation';

// Risk profiles for different system types
const riskProfiles: Record<RiskProfileKey, RiskProfile> = {
  'medical_diagnostic': {
    name: 'Medical Diagnostic AI',
    riskLevel: 'high',
    articles: ['6', '9', '10', '11', '12', '13', '14', '15', '17'],
    description: 'AI systems used for medical diagnostics are classified as high-risk under the EU AI Act'
  },
  'recruitment': {
    name: 'AI Recruitment Tool',
    riskLevel: 'high',
    articles: ['6', '9', '10', '11', '13', '14', '15', '17'],
    description: 'AI systems used for recruitment and employment decisions are classified as high-risk'
  },
  'chatbot': {
    name: 'Customer Service Chatbot',
    riskLevel: 'limited',
    articles: ['13', '15'],
    description: 'Basic chatbots for customer service typically fall under limited risk category with transparency requirements'
  },
  'social_scoring': {
    name: 'Social Scoring System',
    riskLevel: 'unacceptable',
    articles: ['5'],
    description: 'Social scoring systems are prohibited under Article 5 of the EU AI Act'
  },
  'recommendation': {
    name: 'Content Recommendation',
    riskLevel: 'minimal',
    articles: [],
    description: 'Simple content recommendation systems typically fall under minimal risk with voluntary codes of conduct'
  }
};

export default function RegulatoryComplexity() {
  const [selectedTab, setSelectedTab] = useState('complexity-meter');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskProfile, setSelectedRiskProfile] = useState<RiskProfileKey>('medical_diagnostic');
  
  // Filter articles based on search term
  const filteredArticles = articleData.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    article.id.includes(searchTerm)
  );
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Regulatory Complexity Visualization</h1>
        <p className="text-muted-foreground">
          Visualize the complexity of EU AI Act requirements using emoji indicators
        </p>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="complexity-meter">Complexity Meter</TabsTrigger>
          <TabsTrigger value="article-complexity">Article Complexity</TabsTrigger>
          <TabsTrigger value="risk-profiles">Risk Profiles</TabsTrigger>
          <TabsTrigger value="compliance-board">Compliance Board</TabsTrigger>
        </TabsList>
        
        {/* Complexity Meter Showcase Tab */}
        <TabsContent value="complexity-meter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emoji Complexity Meter</CardTitle>
              <CardDescription>
                Easily visualize regulatory complexity levels with intuitive emoji indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="flex flex-col items-center p-4 border rounded-lg bg-background space-y-2">
                  <EmojiComplexityMeter level="simple" size="xl" />
                  <span className="text-sm font-medium">Simple</span>
                  <p className="text-xs text-center text-muted-foreground">Basic requirements with minimal documentation</p>
                </div>
                
                <div className="flex flex-col items-center p-4 border rounded-lg bg-background space-y-2">
                  <EmojiComplexityMeter level="moderate" size="xl" />
                  <span className="text-sm font-medium">Moderate</span>
                  <p className="text-xs text-center text-muted-foreground">Standard requirements with reasonable documentation</p>
                </div>
                
                <div className="flex flex-col items-center p-4 border rounded-lg bg-background space-y-2">
                  <EmojiComplexityMeter level="complex" size="xl" />
                  <span className="text-sm font-medium">Complex</span>
                  <p className="text-xs text-center text-muted-foreground">Detailed requirements with significant changes</p>
                </div>
                
                <div className="flex flex-col items-center p-4 border rounded-lg bg-background space-y-2">
                  <EmojiComplexityMeter level="very-complex" size="xl" />
                  <span className="text-sm font-medium">Very Complex</span>
                  <p className="text-xs text-center text-muted-foreground">Extensive requirements with substantial changes</p>
                </div>
                
                <div className="flex flex-col items-center p-4 border rounded-lg bg-background space-y-2">
                  <EmojiComplexityMeter level="extreme" size="xl" />
                  <span className="text-sm font-medium">Extreme</span>
                  <p className="text-xs text-center text-muted-foreground">Most demanding requirements with continuous monitoring</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Usage Examples</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-6">
                    <div className="w-40 text-sm font-medium">With Label:</div>
                    <EmojiComplexityMeter level="complex" showLabel={true} />
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="w-40 text-sm font-medium">Different Sizes:</div>
                    <div className="flex items-center gap-3">
                      <EmojiComplexityMeter level="very-complex" size="sm" />
                      <EmojiComplexityMeter level="very-complex" size="md" />
                      <EmojiComplexityMeter level="very-complex" size="lg" />
                      <EmojiComplexityMeter level="very-complex" size="xl" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="w-40 text-sm font-medium">In Context:</div>
                    <div className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">Article 15: Accuracy & Robustness</span>
                        <EmojiComplexityMeter level="very-complex" />
                      </div>
                      <p className="text-xs text-muted-foreground">Requirements for ensuring accuracy, robustness, and cybersecurity of high-risk AI systems</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Article Complexity Tab */}
        <TabsContent value="article-complexity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>EU AI Act Article Complexity</CardTitle>
              <CardDescription>
                Explore the complexity of different EU AI Act articles with emoji indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="search-articles">Search Articles</Label>
                <Input 
                  id="search-articles" 
                  placeholder="Search by article number or title..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {filteredArticles.map((article) => (
                  <ArticleComplexity 
                    key={article.id}
                    article={article.id}
                    title={article.title}
                    description={article.description}
                    complexity={article.complexity}
                    requirementCount={article.requirementCount}
                  />
                ))}
                
                {filteredArticles.length === 0 && (
                  <div className="col-span-full p-8 text-center text-muted-foreground">
                    No articles found matching "{searchTerm}"
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Risk Profiles Tab */}
        <TabsContent value="risk-profiles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI System Risk Profiles</CardTitle>
              <CardDescription>
                Explore how different AI systems are classified under the EU AI Act
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="risk-profile">Select AI System Type</Label>
                <Select 
                  value={selectedRiskProfile} 
                  onValueChange={(value: string) => setSelectedRiskProfile(value as RiskProfileKey)}
                >
                  <SelectTrigger className="max-w-md">
                    <SelectValue placeholder="Select a system type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(riskProfiles) as [RiskProfileKey, RiskProfile][]).map(([key, profile]) => (
                      <SelectItem key={key} value={key}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-6 border rounded-lg bg-card">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">{riskProfiles[selectedRiskProfile].name}</h3>
                  <p className="text-muted-foreground">{riskProfiles[selectedRiskProfile].description}</p>
                </div>
                
                <div className="mb-6">
                  <RegulatoryRiskMeter 
                    riskLevel={riskProfiles[selectedRiskProfile].riskLevel}
                    articles={riskProfiles[selectedRiskProfile].articles}
                    size="lg"
                  />
                </div>
                
                {riskProfiles[selectedRiskProfile].articles.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-medium mb-3">Applicable Articles</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {riskProfiles[selectedRiskProfile].articles.map((articleId: string) => {
                        const article = articleData.find(a => a.id === articleId);
                        if (!article) return null;
                        return (
                          <div key={articleId} className="p-3 border rounded-md flex items-start gap-3">
                            <EmojiComplexityMeter level={article.complexity} />
                            <div>
                              <div className="text-sm font-medium">Article {article.id}</div>
                              <div className="text-xs text-muted-foreground">{article.title}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    This system type has minimal or no specific article requirements under the EU AI Act.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Compliance Board Tab */}
        <TabsContent value="compliance-board" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Emoji Board</CardTitle>
              <CardDescription>
                Visualize your compliance status across all applicable articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-1 text-xs">
                  <span>✅</span>
                  <span>Compliant</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span>⏳</span>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span>❌</span>
                  <span>Non-Compliant</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span>⚪</span>
                  <span>Not Applicable</span>
                </div>
              </div>
              
              <ScrollArea className="h-[400px] pr-4">
                <ComplianceEmojiBoard complianceData={sampleComplianceData} />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}