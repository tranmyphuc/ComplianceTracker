import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  BookIcon, 
  BookOpenIcon, 
  CheckCircleIcon, 
  ClipboardListIcon, 
  DownloadIcon, 
  ExternalLinkIcon, 
  FileTextIcon, 
  GavelIcon, 
  InfoIcon, 
  LightbulbIcon, 
  ListChecksIcon, 
  SearchIcon,
  StarIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from "lucide-react";

export function KnowledgeBase() {
  const [activeCategory, setActiveCategory] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  
  const categories = [
    { id: "overview", name: "Overview", icon: InfoIcon },
    { id: "articles", name: "Articles & Provisions", icon: GavelIcon },
    { id: "risk-categories", name: "Risk Categories", icon: ListChecksIcon },
    { id: "compliance", name: "Compliance Requirements", icon: CheckCircleIcon },
    { id: "checklists", name: "Checklists & Templates", icon: ClipboardListIcon },
    { id: "faq", name: "FAQ", icon: LightbulbIcon },
    { id: "resources", name: "Additional Resources", icon: BookOpenIcon },
  ];
  
  const popularArticles = [
    {
      id: "article-6",
      title: "Article 6: Classification of AI Systems",
      description: "Understanding the different risk categories and how systems are classified",
      tag: "Key Concept",
      date: "Updated: March 5, 2024"
    },
    {
      id: "article-13",
      title: "Article.13: Transparency and Information Provision",
      description: "Requirements for making AI systems transparent to users",
      tag: "Required",
      date: "Updated: February 28, 2024"
    },
    {
      id: "article-14",
      title: "Article 14: Human Oversight",
      description: "Guidelines for maintaining meaningful human oversight of AI systems",
      tag: "Required",
      date: "Updated: February 20, 2024"
    },
    {
      id: "article-9",
      title: "Article 9: Risk Management System",
      description: "Requirements for implementing a continuous risk management process",
      tag: "High-Risk Systems",
      date: "Updated: March 1, 2024"
    },
  ];
  
  const faqItems = [
    {
      question: "What is the EU AI Act?",
      answer: "The EU AI Act is a comprehensive legislative framework designed to regulate artificial intelligence systems within the European Union. It aims to ensure that AI systems used in the EU are safe, transparent, traceable, non-discriminatory and environmentally friendly. The regulation categorizes AI systems based on their risk level and imposes different requirements depending on the classification."
    },
    {
      question: "When does the EU AI Act come into effect?",
      answer: "The EU AI Act has a phased implementation timeline. Once officially adopted, there will be a transition period before it becomes fully applicable. Certain provisions, particularly those related to prohibited AI practices, will come into effect earlier than others. High-risk system requirements will generally have a longer adaptation period. The specific enforcement dates can be found in the implementation timeline section of this knowledge center."
    },
    {
      question: "How are AI systems classified under the EU AI Act?",
      answer: "The EU AI Act classifies AI systems into four risk categories: (1) Unacceptable Risk: Systems that pose a clear threat to people's safety, livelihoods, or rights are prohibited; (2) High Risk: Systems that have significant potential to harm health, safety, or fundamental rights are subject to strict obligations; (3) Limited Risk: Systems with specific transparency obligations; (4) Minimal Risk: Systems with minimal regulation and voluntary codes of conduct."
    },
    {
      question: "What documentation is required for high-risk AI systems?",
      answer: "High-risk AI systems require comprehensive technical documentation, including: detailed system description and design specifications, information about the development process, data governance procedures, risk assessment and management measures, human oversight mechanisms, performance metrics and accuracy information, and detailed monitoring and updating plans. This documentation must be maintained throughout the system's lifecycle."
    },
    {
      question: "Do I need to register my AI system?",
      answer: "High-risk AI systems must be registered in the EU database before being placed on the market or put into service. The registration requires providing specific information about the system, its intended purpose, and the organization responsible for it. Systems not classified as high-risk do not require registration, but maintaining internal documentation of compliance efforts is still recommended."
    },
  ];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Here you would implement the actual search functionality
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
      {/* Category Navigation (Hidden on Mobile) */}
      <Card className="border-neutral-200 shadow-sm hidden lg:block lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="p-2">
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <Button 
                    key={category.id}
                    variant={activeCategory === category.id ? "secondary" : "ghost"} 
                    className="w-full justify-start mb-1 h-auto py-2"
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <Icon className="h-4 w-4 mr-2 text-neutral-500" />
                    <span className="text-sm">{category.name}</span>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Main Content */}
      <div className="space-y-5 lg:col-span-5">
        {/* Search Bar */}
        <Card className="border-neutral-200 shadow-sm">
          <CardContent className="py-4">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input 
                  placeholder="Search the knowledge base..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-neutral-200 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <GavelIcon className="h-7 w-7 text-primary mb-2" />
              <h3 className="text-sm font-medium">EU AI Act Text</h3>
              <p className="text-xs text-neutral-500 mt-1">Full legislative text</p>
            </CardContent>
          </Card>
          
          <Card className="border-neutral-200 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50 hover:from-amber-100/50 hover:to-amber-100 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <ListChecksIcon className="h-7 w-7 text-amber-600 mb-2" />
              <h3 className="text-sm font-medium">Risk Assessment</h3>
              <p className="text-xs text-neutral-500 mt-1">Guidelines & tools</p>
            </CardContent>
          </Card>
          
          <Card className="border-neutral-200 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100/50 hover:to-blue-100 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <ClipboardListIcon className="h-7 w-7 text-blue-600 mb-2" />
              <h3 className="text-sm font-medium">Checklists</h3>
              <p className="text-xs text-neutral-500 mt-1">Compliance checklists</p>
            </CardContent>
          </Card>
          
          <Card className="border-neutral-200 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50 hover:from-green-100/50 hover:to-green-100 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <BookOpenIcon className="h-7 w-7 text-green-600 mb-2" />
              <h3 className="text-sm font-medium">Guidelines</h3>
              <p className="text-xs text-neutral-500 mt-1">Implementation guides</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Tab Content */}
        <Tabs defaultValue="popular" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="popular">Popular Articles</TabsTrigger>
            <TabsTrigger value="recent">Recently Updated</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="popular">
            <div className="space-y-3">
              {popularArticles.map(article => (
                <Card key={article.id} className="border-neutral-200 shadow-sm hover:bg-neutral-50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <FileTextIcon className="h-4 w-4 text-neutral-400 mr-2" />
                          <h3 className="text-sm font-medium">{article.title}</h3>
                        </div>
                        <p className="text-xs text-neutral-500">{article.description}</p>
                        <div className="flex items-center mt-2">
                          <Badge variant="outline" className="mr-2 text-xs">
                            {article.tag}
                          </Badge>
                          <span className="text-xs text-neutral-400">{article.date}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recent">
            <div className="p-8 text-center text-neutral-500">
              <BookIcon className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
              <p>Recently updated articles will appear here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="faq">
            <Card className="border-neutral-200 shadow-sm">
              <CardContent className="p-4">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-sm font-medium text-left hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-neutral-600">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Implementation Timeline */}
        <Card className="border-neutral-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">EU AI Act Implementation Timeline</CardTitle>
            <CardDescription>Key dates and deadlines for compliance</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200"></div>
              
              <div className="relative pl-12 pb-6">
                <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                </div>
                <div className="absolute left-12 top-3 w-3 h-0.5 bg-neutral-200"></div>
                <div>
                  <h3 className="text-sm font-medium">Official Publication</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Following formal adoption, the EU AI Act was published in the Official Journal of the European Union
                  </p>
                </div>
              </div>
              
              <div className="relative pl-12 pb-6">
                <div className="absolute left-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                </div>
                <div className="absolute left-12 top-3 w-3 h-0.5 bg-neutral-200"></div>
                <div>
                  <h3 className="text-sm font-medium">Initial Provisions (6 months)</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Prohibitions on unacceptable risk AI practices come into effect
                  </p>
                </div>
              </div>
              
              <div className="relative pl-12 pb-6">
                <div className="absolute left-0 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-neutral-400"></div>
                </div>
                <div className="absolute left-12 top-3 w-3 h-0.5 bg-neutral-200"></div>
                <div>
                  <h3 className="text-sm font-medium">Governance Structure (12 months)</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    AI Office and Scientific Panel are established
                  </p>
                </div>
              </div>
              
              <div className="relative pl-12 pb-6">
                <div className="absolute left-0 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-neutral-400"></div>
                </div>
                <div className="absolute left-12 top-3 w-3 h-0.5 bg-neutral-200"></div>
                <div>
                  <h3 className="text-sm font-medium">Codes of Practice (24 months)</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Development of codes of practice for high-risk AI systems
                  </p>
                </div>
              </div>
              
              <div className="relative pl-12">
                <div className="absolute left-0 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-neutral-400"></div>
                </div>
                <div className="absolute left-12 top-3 w-3 h-0.5 bg-neutral-200"></div>
                <div>
                  <h3 className="text-sm font-medium">Full Application (36 months)</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    All remaining provisions of the EU AI Act apply in full
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Right Sidebar */}
      <Card className="border-neutral-200 shadow-sm hidden lg:block lg:col-span-3">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <StarIcon className="h-4 w-4 mr-2 text-amber-500" />
            Featured Resources
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="p-4 space-y-4">
              <div className="rounded-md border overflow-hidden">
                <div className="bg-blue-50 p-4">
                  <h3 className="text-sm font-medium flex items-center">
                    <GavelIcon className="h-4 w-4 text-blue-600 mr-2" />
                    Official EU AI Act Documentation
                  </h3>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-start">
                    <FileTextIcon className="h-4 w-4 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium">EU AI Act Full Text</p>
                      <div className="flex items-center mt-1">
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <ExternalLinkIcon className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <DownloadIcon className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FileTextIcon className="h-4 w-4 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium">Official Implementation Guide</p>
                      <div className="flex items-center mt-1">
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <ExternalLinkIcon className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <DownloadIcon className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <div className="bg-green-50 p-4">
                  <h3 className="text-sm font-medium flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                    Compliance Toolkits
                  </h3>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-start">
                    <ClipboardListIcon className="h-4 w-4 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium">High-Risk System Checklist</p>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs mt-1">
                        <DownloadIcon className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <ClipboardListIcon className="h-4 w-4 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium">Technical Documentation Template</p>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs mt-1">
                        <DownloadIcon className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <ClipboardListIcon className="h-4 w-4 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium">Risk Assessment Template</p>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs mt-1">
                        <DownloadIcon className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <div className="bg-amber-50 p-4">
                  <h3 className="text-sm font-medium flex items-center">
                    <BookOpenIcon className="h-4 w-4 text-amber-600 mr-2" />
                    Educational Resources
                  </h3>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-start">
                    <FileTextIcon className="h-4 w-4 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium">EU AI Act Summary Whitepaper</p>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs mt-1">
                        <DownloadIcon className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FileTextIcon className="h-4 w-4 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium">Implementation Case Studies</p>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs mt-1">
                        <ExternalLinkIcon className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}