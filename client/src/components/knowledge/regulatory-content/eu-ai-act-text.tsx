import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  BookmarkIcon, 
  FileTextIcon, 
  BookIcon, 
  GavelIcon, 
  ExternalLinkIcon, 
  SearchIcon,
  InfoIcon,
  DownloadIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ClipboardIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  HelpCircleIcon
} from "lucide-react";

// EU AI Act structure
interface AIActSection {
  id: string;
  title: string;
  articles: AIActArticle[];
}

interface AIActArticle {
  id: string;
  number: number;
  title: string;
  content: string;
  riskLevel?: 'high' | 'limited' | 'minimal' | 'prohibited';
  keyPoints?: string[];
}

interface ArticleAnnotation {
  articleId: string;
  notes: string;
  tags: string[];
  createdAt: Date;
}

export function EUAIActText() {
  const [activeArticle, setActiveArticle] = useState<AIActArticle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<AIActArticle[]>([]);
  const [activeTab, setActiveTab] = useState("text");
  const [userAnnotations, setUserAnnotations] = useState<ArticleAnnotation[]>([]);
  const [newNote, setNewNote] = useState("");
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([]);
  const [showRiskLevelFilter, setShowRiskLevelFilter] = useState(false);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string | null>(null);
  
  // This would be fetched from API in a real implementation
  const actSections: AIActSection[] = [
    {
      id: "section-1",
      title: "General Provisions",
      articles: [
        {
          id: "article-1",
          number: 1,
          title: "Subject Matter",
          content: `
This Regulation lays down:

(a) harmonised rules for the placing on the market, the putting into service and the use of artificial intelligence systems ('AI systems') in the Union;

(b) prohibitions of certain artificial intelligence practices;

(c) specific requirements for high-risk AI systems and obligations for operators of such systems;

(d) harmonised transparency rules for certain AI systems;

(e) rules on market monitoring, market surveillance and governance;

(f) rules on the protection of natural persons with regard to the processing of personal data within the scope of or by AI systems;

(g) rules on the protection of natural persons with regard to the assessment and use of the output of AI systems.
          `,
          keyPoints: [
            "Establishes harmonized rules for AI systems in the EU",
            "Defines prohibitions, requirements, and obligations",
            "Sets transparency rules and governance framework"
          ]
        },
        {
          id: "article-2",
          number: 2,
          title: "Scope",
          content: `
1. This Regulation applies to:

(a) providers placing on the market or putting into service AI systems in the Union, irrespective of whether those providers are established within the Union or in a third country;

(b) users of AI systems located within the Union;

(c) providers and users of AI systems that are located in a third country, where the output produced by the system is used in the Union.

2. For high-risk AI systems that are safety components of products or systems, or which are themselves products or systems, falling within the scope of the following legal acts, only Article 84 of this Regulation shall apply:

(a) Regulation (EC) 300/2008;
(b) Regulation (EU) No 167/2013;
(c) Regulation (EU) No 168/2013;
(d) Directive 2014/90/EU;
(e) Directive (EU) 2016/797;
(f) Regulation (EU) 2018/858;
(g) Regulation (EU) 2018/1139;
(h) Regulation (EU) 2019/2144.

3. This Regulation shall not apply to AI systems developed or used exclusively for military, defence or national security purposes.

4. This Regulation shall not apply to public authorities in a third country nor to international organisations falling within the scope of this Regulation pursuant to paragraph 1, where those authorities or organisations use AI systems in the framework of international agreements for law enforcement and judicial cooperation with the Union or with one or more Member States.
          `,
          keyPoints: [
            "Applies to all providers of AI systems in the EU market",
            "Includes users in the EU and third-country providers whose output is used in the EU",
            "Military and defense applications are excluded"
          ]
        }
      ]
    },
    {
      id: "section-2",
      title: "Prohibited Artificial Intelligence Practices",
      articles: [
        {
          id: "article-5",
          number: 5,
          title: "Prohibited Artificial Intelligence Practices",
          content: `
The following artificial intelligence practices shall be prohibited:

(a) the placing on the market, putting into service or use of an AI system that deploys subliminal techniques beyond a person's consciousness in order to materially distort a person's behaviour in a manner that causes or is likely to cause that person or another person physical or psychological harm;

(b) the placing on the market, putting into service or use of an AI system that exploits any of the vulnerabilities of a specific group of persons due to their age, disability, race, sexual orientation, or other social or personal characteristics in order to materially distort the behaviour of a person in that group in a manner that causes or is likely to cause that person or another person physical or psychological harm;

(c) the placing on the market, putting into service or use of AI systems by public authorities or on their behalf for the evaluation or classification of the trustworthiness of natural persons for a certain period of time based on their social behaviour in multiple contexts or known or predicted personal or personality characteristics, where the social score leads to either or both of the following:
(i) more severe treatment of persons by public authorities or on their behalf, or the denial of access to certain services or opportunities, without a legitimate reason;
(ii) treatment of certain persons as a group, without an objective and legitimate justification, that is more severe than the treatment of other persons or the denial of access to certain services or opportunities.
          `,
          riskLevel: 'prohibited',
          keyPoints: [
            "Prohibits AI systems using subliminal techniques to manipulate behavior",
            "Bans exploitation of vulnerabilities of specific groups",
            "Forbids social scoring systems by public authorities"
          ]
        }
      ]
    },
    {
      id: "section-3",
      title: "Classification of AI Systems as High-Risk",
      articles: [
        {
          id: "article-6",
          number: 6,
          title: "Classification Rules for High-Risk AI Systems",
          content: `
1. Irrespective of whether an AI system is placed on the market or put into service independently from the products referred to in points (a) and (b), that AI system shall be considered high-risk where both of the following conditions are fulfilled:

(a) the AI system is intended to be used as a safety component of a product, or is itself a product, covered by the Union harmonisation legislation listed in Annex I;

(b) the product whose safety component is the AI system, or the AI system itself as a product, is required to undergo a third-party conformity assessment with a view to the placing on the market or putting into service of that product pursuant to the Union harmonisation legislation listed in Annex I.

2. In addition to the high-risk AI systems referred to in paragraph 1, AI systems referred to in Annex III shall also be considered high-risk.
          `,
          riskLevel: 'high',
          keyPoints: [
            "Defines two conditions for high-risk classification",
            "Includes safety components of products under EU harmonization legislation",
            "References Annex I and Annex III for additional classifications"
          ]
        },
        {
          id: "article-7",
          number: 7,
          title: "Amendments to Annex III",
          content: `
1. The Commission is empowered to adopt delegated acts in accordance with Article 73 to update the list in Annex III by adding high-risk AI systems where both of the following conditions are fulfilled:

(a) the AI systems are intended to be used in any of the areas listed in points 1 to 8 of Annex III;

(b) those AI systems pose a risk of harm to the health and safety, or a risk of adverse impact on fundamental rights, that is, in respect of its severity and probability of occurrence, equivalent to or greater than the risk of harm or of adverse impact posed by the high-risk AI systems already referred to in Annex III.

2. When assessing for the purposes of paragraph 1 whether an AI system poses a risk of harm to the health and safety or a risk of adverse impact on fundamental rights that is equivalent to or greater than the risk of harm posed by the high-risk AI systems already referred to in Annex III, the Commission shall take into account the following criteria:

(a) the intended purpose of the AI system;
(b) the extent to which an AI system has been used or is likely to be used;
(c) the extent to which the use of an AI system has already caused harm to the health and safety or adverse impact on the fundamental rights or has given rise to significant concerns in relation to the materialisation of such harm or adverse impact, as demonstrated by reports or documented allegations submitted to national competent authorities;
(d) the potential extent of such harm or such adverse impact, in particular in terms of its intensity and its ability to affect a plurality of persons;
(e) the extent to which potentially harmed or adversely impacted persons are dependent on the outcome produced with an AI system, in particular because for practical or legal reasons it is not reasonably possible to opt-out from that outcome;
(f) the extent to which potentially harmed or adversely impacted persons are in a vulnerable position in relation to the user of an AI system, in particular due to an imbalance of power, knowledge, economic or social circumstances, or age;
(g) the extent to which the outcome produced with an AI system is easily reversible, whereby outcomes having an impact on the health or safety of persons shall not be considered as easily reversible;
(h) the extent to which existing Union legislation provides for:
(i) effective measures of redress in relation to the risks posed by an AI system, with the exclusion of claims for damages;
(ii) effective measures to prevent or substantially minimise those risks.
          `,
          riskLevel: 'high',
          keyPoints: [
            "Empowers Commission to update high-risk systems list",
            "Lists criteria for assessing risk level",
            "Considers factors like intended purpose, usage extent, and potential harm"
          ]
        }
      ]
    },
    {
      id: "section-4",
      title: "Requirements for High-Risk AI Systems",
      articles: [
        {
          id: "article-9",
          number: 9,
          title: "Risk Management System",
          content: `
1. A risk management system shall be established, implemented, documented and maintained in relation to high-risk AI systems.

2. The risk management system shall consist of a continuous iterative process run throughout the entire lifecycle of a high-risk AI system, requiring regular systematic updating. It shall comprise the following steps:

(a) identification and analysis of the known and foreseeable risks associated with each high-risk AI system;

(b) estimation and evaluation of the risks that may emerge when the high-risk AI system is used in accordance with its intended purpose and under conditions of reasonably foreseeable misuse;

(c) evaluation of other possibly arising risks based on the analysis of data gathered from the post-market monitoring system referred to in Article 61;

(d) adoption of suitable risk management measures in accordance with the provisions of the following paragraphs.

3. The risk management measures referred to in paragraph 2, point (d), shall give due consideration to the effects and possible interactions resulting from the combined application of the requirements set out in this Chapter 2. They shall take into account the generally acknowledged state of the art, including as reflected in relevant harmonised standards or common specifications.
          `,
          riskLevel: 'high',
          keyPoints: [
            "Requires continuous risk management throughout AI system lifecycle",
            "Mandates identification, analysis, and evaluation of risks",
            "Requires adoption of risk management measures"
          ]
        },
        {
          id: "article-10",
          number: 10,
          title: "Data and Data Governance",
          content: `
1. High-risk AI systems which make use of techniques involving the training of models with data shall be developed on the basis of training, validation and testing data sets that meet the quality criteria referred to in paragraphs 2 to 5.

2. Training, validation and testing data sets shall be subject to appropriate data governance and management practices. Those practices shall concern in particular:

(a) the relevant design choices;
(b) data collection;
(c) relevant data preparation processing operations, such as annotation, labelling, cleaning, enrichment and aggregation;
(d) the formulation of relevant assumptions, notably with respect to the information that the data are supposed to measure and represent;
(e) a prior assessment of the availability, quantity and suitability of the data sets that are needed;
(f) examination in view of possible biases;
(g) the identification of any possible data gaps or shortcomings, and how those gaps and shortcomings can be addressed.

3. Training, validation and testing data sets shall be relevant, representative, free of errors and complete. They shall have the appropriate statistical properties, including, where applicable, as regards the persons or groups of persons in relation to whom the high-risk AI system is intended to be used. These characteristics of the data sets may be met at the level of individual data sets or a combination thereof.

4. Training, validation and testing data sets shall take into account, to the extent required by the intended purpose, the characteristics or elements that are particular to the specific geographical, behavioural or functional setting within which the high-risk AI system is intended to be used.
          `,
          riskLevel: 'high',
          keyPoints: [
            "Sets quality criteria for training, validation, and testing datasets",
            "Mandates data governance practices, including bias examination",
            "Requires datasets to be relevant, representative, and appropriate for intended use"
          ]
        }
      ]
    },
    {
      id: "section-5",
      title: "Transparency Obligations",
      articles: [
        {
          id: "article-13",
          number: 13,
          title: "Transparency and Provision of Information to Users",
          content: `
1. High-risk AI systems shall be designed and developed in such a way to ensure that their operation is sufficiently transparent to enable users to interpret the system's output and use it appropriately. An appropriate type and degree of transparency shall be ensured, with a view to achieving compliance with the relevant obligations of the user and of the provider set out in Chapter 3 of this Title.

2. High-risk AI systems shall be accompanied by instructions for use in an appropriate digital format or otherwise that include concise, complete, correct and clear information that is relevant, accessible and comprehensible to users.

3. The information referred to in paragraph 2 shall specify:

(a) the identity and the contact details of the provider and, where applicable, of its authorised representative;

(b) the characteristics, capabilities and limitations of performance of the high-risk AI system, including:
(i) its intended purpose;
(ii) the level of accuracy, robustness and cybersecurity referred to in Article 15 against which the high-risk AI system has been tested and validated and which can be expected, and any known and foreseeable circumstances that may have an impact on that expected level of accuracy, robustness and cybersecurity;
(iii) any known or foreseeable circumstance, related to the use of the high-risk AI system in accordance with its intended purpose or under conditions of reasonably foreseeable misuse, which may lead to risks to the health and safety or fundamental rights;
(iv) its performance as regards the persons or groups of persons on which the system is intended to be used;
(v) when appropriate, specifications for the input data, or any other relevant information in terms of the training, validation and testing data sets used, taking into account the intended purpose of the AI system.

(c) the changes to the high-risk AI system and its performance which have been pre-determined by the provider at the moment of the initial conformity assessment, if any;

(d) the human oversight measures referred to in Article 14, including the technical measures put in place to facilitate the interpretation of the outputs of AI systems by the users;

(e) the expected lifetime of the high-risk AI system and any necessary maintenance and care measures to ensure the proper functioning of that AI system, including as regards software updates.
          `,
          riskLevel: 'high',
          keyPoints: [
            "Requires high-risk systems to be sufficiently transparent for users",
            "Mandates clear instructions with specific information about limitations",
            "Requires disclosure of performance characteristics and human oversight measures"
          ]
        }
      ]
    },
    {
      id: "section-6",
      title: "Limited Risk AI Systems",
      articles: [
        {
          id: "article-52",
          number: 52,
          title: "Transparency Obligations for Certain AI Systems",
          content: `
1. Providers shall ensure that AI systems intended to interact with natural persons are designed and developed in such a way that natural persons are informed that they are interacting with an AI system, unless this is obvious from the circumstances and the context of use. This obligation shall not apply to AI systems authorised by law to detect, prevent, investigate and prosecute criminal offences, unless those systems are available for the public to report a criminal offence.

2. Users of an emotion recognition system shall inform of the operation of the system the natural persons exposed thereto. This obligation shall not apply to AI systems used for emotion recognition that are permitted by law to detect, prevent and investigate criminal offences.

3. Users of an AI system that generates or manipulates image, audio or video content that appreciably resembles existing persons, objects, places or other entities or events and would falsely appear to a person to be authentic or truthful ('deep fake'), shall disclose that the content has been artificially generated or manipulated.

However, the first subparagraph shall not apply where the use is authorised by law to detect, prevent, investigate and prosecute criminal offences or it is necessary for the exercise of the right to freedom of expression and the right to freedom of the arts and sciences guaranteed in the Charter of Fundamental Rights of the EU, and subject to appropriate safeguards for the rights and freedoms of third parties.
          `,
          riskLevel: 'limited',
          keyPoints: [
            "Requires disclosure when interacting with AI systems",
            "Mandates notification for emotion recognition systems use",
            "Requires disclosure for AI-generated 'deep fake' content"
          ]
        }
      ]
    }
  ];
  
  // Filter articles by risk level
  const filterArticlesByRiskLevel = (riskLevel: string | null) => {
    if (!riskLevel) {
      return getAllArticles();
    }
    
    return getAllArticles().filter(article => article.riskLevel === riskLevel);
  };
  
  // Get all articles from all sections
  const getAllArticles = (): AIActArticle[] => {
    return actSections.flatMap(section => section.articles);
  };
  
  // Initialize with first article
  useEffect(() => {
    if (actSections.length > 0 && actSections[0].articles.length > 0) {
      setActiveArticle(actSections[0].articles[0]);
    }
  }, []);
  
  // Search function
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = getAllArticles().filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(results);
    setActiveTab("search");
  };
  
  // Toggle bookmark
  const toggleBookmark = (articleId: string) => {
    setBookmarkedArticles(prev => {
      if (prev.includes(articleId)) {
        return prev.filter(id => id !== articleId);
      } else {
        return [...prev, articleId];
      }
    });
  };
  
  // Save annotation
  const handleSaveAnnotation = () => {
    if (!activeArticle || !newNote.trim()) return;
    
    const annotation: ArticleAnnotation = {
      articleId: activeArticle.id,
      notes: newNote,
      tags: [], // Could add tag functionality
      createdAt: new Date()
    };
    
    setUserAnnotations(prev => [...prev, annotation]);
    setNewNote("");
  };
  
  // Get annotations for current article
  const getCurrentArticleAnnotations = () => {
    if (!activeArticle) return [];
    return userAnnotations.filter(note => note.articleId === activeArticle.id);
  };
  
  // Get next/previous article
  const navigateArticle = (direction: 'next' | 'prev') => {
    if (!activeArticle) return;
    
    const allArticles = getAllArticles();
    const currentIndex = allArticles.findIndex(a => a.id === activeArticle.id);
    
    if (direction === 'next' && currentIndex < allArticles.length - 1) {
      setActiveArticle(allArticles[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      setActiveArticle(allArticles[currentIndex - 1]);
    }
  };
  
  // Generate a citation
  const generateCitation = () => {
    if (!activeArticle) return "";
    
    return `European Union. (2024). EU AI Act, Article ${activeArticle.number}: ${activeArticle.title}.`;
  };
  
  // Copy citation to clipboard
  const copyCitation = () => {
    const citation = generateCitation();
    navigator.clipboard.writeText(citation);
    // Show toast notification (would be implemented with the toast system)
  };
  
  // Display risk level badge
  const RiskLevelBadge = ({ level }: { level?: string }) => {
    if (!level) return null;
    
    const badgeStyles = {
      'high': "bg-red-100 text-red-800 border-red-200",
      'limited': "bg-yellow-100 text-yellow-800 border-yellow-200",
      'minimal': "bg-green-100 text-green-800 border-green-200",
      'prohibited': "bg-purple-100 text-purple-800 border-purple-200"
    };
    
    const levelDisplay = {
      'high': "High Risk",
      'limited': "Limited Risk",
      'minimal': "Minimal Risk",
      'prohibited': "Prohibited"
    };
    
    return (
      <Badge variant="outline" className={badgeStyles[level as keyof typeof badgeStyles]}>
        {levelDisplay[level as keyof typeof levelDisplay]}
      </Badge>
    );
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Navigation Sidebar */}
      <Card className="md:col-span-1 border-neutral-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>EU AI Act</span>
            <div className="flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowRiskLevelFilter(!showRiskLevelFilter)}>
                      <FilterIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter by risk level</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setActiveTab("bookmarks")}>
                      <BookmarkIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View bookmarks</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardTitle>
          
          <form onSubmit={handleSearch} className="mt-2">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input 
                placeholder="Search articles..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </form>
          
          {showRiskLevelFilter && (
            <div className="mt-2 flex flex-wrap gap-1">
              <Badge 
                variant="outline" 
                className={`cursor-pointer ${selectedRiskLevel === null ? 'bg-primary/10' : ''}`}
                onClick={() => setSelectedRiskLevel(null)}
              >
                All
              </Badge>
              <Badge 
                variant="outline" 
                className={`cursor-pointer bg-red-50 text-red-800 border-red-200 ${selectedRiskLevel === 'high' ? 'ring-1 ring-red-500' : ''}`}
                onClick={() => setSelectedRiskLevel('high')}
              >
                High Risk
              </Badge>
              <Badge 
                variant="outline" 
                className={`cursor-pointer bg-yellow-50 text-yellow-800 border-yellow-200 ${selectedRiskLevel === 'limited' ? 'ring-1 ring-yellow-500' : ''}`}
                onClick={() => setSelectedRiskLevel('limited')}
              >
                Limited Risk
              </Badge>
              <Badge 
                variant="outline" 
                className={`cursor-pointer bg-purple-50 text-purple-800 border-purple-200 ${selectedRiskLevel === 'prohibited' ? 'ring-1 ring-purple-500' : ''}`}
                onClick={() => setSelectedRiskLevel('prohibited')}
              >
                Prohibited
              </Badge>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-24rem)]">
            <Accordion type="multiple" className="w-full">
              {actSections.map(section => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="px-4 py-2 text-sm font-medium">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 pb-1">
                    <div className="space-y-1 px-1">
                      {section.articles
                        .filter(article => !selectedRiskLevel || article.riskLevel === selectedRiskLevel)
                        .map(article => (
                          <Button
                            key={article.id}
                            variant={activeArticle?.id === article.id ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start text-xs font-normal py-1 h-auto"
                            onClick={() => setActiveArticle(article)}
                          >
                            <div className="flex items-center w-full">
                              <span className="truncate">Art. {article.number}: {article.title}</span>
                              {article.riskLevel && (
                                <div className="ml-auto flex-shrink-0">
                                  <div 
                                    className={`w-2 h-2 rounded-full ${
                                      article.riskLevel === 'high' ? 'bg-red-500' : 
                                      article.riskLevel === 'limited' ? 'bg-yellow-500' :
                                      article.riskLevel === 'prohibited' ? 'bg-purple-500' : 'bg-green-500'
                                    }`}
                                  />
                                </div>
                              )}
                            </div>
                          </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Main Content Area */}
      <Card className="md:col-span-2 border-neutral-200 shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="related" disabled={!activeArticle}>Related</TabsTrigger>
                <TabsTrigger value="search" disabled={searchResults.length === 0}>Search Results</TabsTrigger>
                <TabsTrigger value="bookmarks" disabled={bookmarkedArticles.length === 0}>Bookmarks</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={!activeArticle}
                        onClick={() => toggleBookmark(activeArticle?.id || '')}
                        className="h-8 w-8"
                      >
                        <BookmarkIcon 
                          className={`h-4 w-4 ${activeArticle && bookmarkedArticles.includes(activeArticle.id) ? 'fill-primary text-primary' : ''}`} 
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{activeArticle && bookmarkedArticles.includes(activeArticle.id) ? 'Remove bookmark' : 'Add bookmark'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={!activeArticle}
                        onClick={copyCitation}
                        className="h-8 w-8"
                      >
                        <ClipboardIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy citation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={!activeArticle}
                        className="h-8 w-8"
                        asChild
                      >
                        <a href="#" download={`EU-AI-Act-Article-${activeArticle?.number}.pdf`}>
                          <DownloadIcon className="h-4 w-4" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Download as PDF</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          
          <TabsContent value="text">
            {activeArticle ? (
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">
                        Article {activeArticle.number}: {activeArticle.title}
                      </h2>
                      {activeArticle.riskLevel && (
                        <RiskLevelBadge level={activeArticle.riskLevel} />
                      )}
                    </div>
                    
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigateArticle('prev')}
                        disabled={getAllArticles().findIndex(a => a.id === activeArticle.id) === 0}
                      >
                        <ChevronLeftIcon className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigateArticle('next')}
                        disabled={getAllArticles().findIndex(a => a.id === activeArticle.id) === getAllArticles().length - 1}
                      >
                        Next
                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-50 p-4 rounded-md whitespace-pre-line text-sm">
                    {activeArticle.content}
                  </div>
                  
                  {activeArticle.keyPoints && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <CheckCircleIcon className="h-4 w-4 mr-1 text-green-600" />
                        Key Points
                      </h3>
                      <ul className="space-y-1 pl-5 list-disc text-sm text-neutral-700">
                        {activeArticle.keyPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-2 pt-2 border-t border-neutral-200">
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>Citation: {generateCitation()}</span>
                      <Button variant="ghost" size="sm" onClick={copyCitation} className="h-7 py-0">
                        <ClipboardIcon className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            ) : (
              <CardContent className="py-8 text-center text-neutral-500">
                <FileTextIcon className="h-10 w-10 mx-auto mb-3 text-neutral-300" />
                <p>Select an article to view its content</p>
              </CardContent>
            )}
          </TabsContent>
          
          <TabsContent value="notes">
            <CardContent>
              {activeArticle ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Add Notes for Article {activeArticle.number}</h3>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add your notes here..." 
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <Button onClick={handleSaveAnnotation} disabled={!newNote.trim()}>Save</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Your Notes</h3>
                    {getCurrentArticleAnnotations().length > 0 ? (
                      <div className="space-y-3">
                        {getCurrentArticleAnnotations().map((annotation, index) => (
                          <Card key={index} className="border-neutral-200">
                            <CardContent className="p-3">
                              <div className="text-sm">{annotation.notes}</div>
                              <div className="text-xs text-neutral-500 mt-2">
                                {annotation.createdAt.toLocaleDateString()}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-neutral-500 bg-neutral-50 rounded-md">
                        <BookIcon className="h-8 w-8 mx-auto mb-2 text-neutral-300" />
                        <p>No notes yet for this article</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-neutral-500">
                  <FileTextIcon className="h-10 w-10 mx-auto mb-3 text-neutral-300" />
                  <p>Select an article to add or view notes</p>
                </div>
              )}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="search">
            <CardContent>
              <h3 className="text-sm font-medium mb-3">Search Results for "{searchTerm}"</h3>
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map(article => (
                    <Button
                      key={article.id}
                      variant="outline"
                      className="w-full justify-start h-auto py-3 px-4"
                      onClick={() => {
                        setActiveArticle(article);
                        setActiveTab("text");
                      }}
                    >
                      <div className="text-left">
                        <div className="flex items-center">
                          <span className="font-medium">Article {article.number}: {article.title}</span>
                          {article.riskLevel && (
                            <RiskLevelBadge level={article.riskLevel} />
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mt-1 truncate">
                          {article.content.substring(0, 100)}...
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-neutral-500 bg-neutral-50 rounded-md">
                  <SearchIcon className="h-8 w-8 mx-auto mb-2 text-neutral-300" />
                  <p>No search results found</p>
                </div>
              )}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="bookmarks">
            <CardContent>
              <h3 className="text-sm font-medium mb-3">Your Bookmarked Articles</h3>
              {bookmarkedArticles.length > 0 ? (
                <div className="space-y-3">
                  {getAllArticles()
                    .filter(article => bookmarkedArticles.includes(article.id))
                    .map(article => (
                      <Button
                        key={article.id}
                        variant="outline"
                        className="w-full justify-start h-auto py-3 px-4"
                        onClick={() => {
                          setActiveArticle(article);
                          setActiveTab("text");
                        }}
                      >
                        <div className="text-left">
                          <div className="flex items-center">
                            <span className="font-medium">Article {article.number}: {article.title}</span>
                            {article.riskLevel && (
                              <RiskLevelBadge level={article.riskLevel} />
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 mt-1 truncate">
                            {article.content.substring(0, 100)}...
                          </p>
                        </div>
                      </Button>
                    ))}
                </div>
              ) : (
                <div className="py-8 text-center text-neutral-500 bg-neutral-50 rounded-md">
                  <BookmarkIcon className="h-8 w-8 mx-auto mb-2 text-neutral-300" />
                  <p>No bookmarked articles yet</p>
                </div>
              )}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="related">
            <CardContent>
              {activeArticle ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Related Resources</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Card className="border-neutral-200 shadow-sm hover:bg-neutral-50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <FileTextIcon className="h-5 w-5 text-neutral-400 mr-2" />
                            <div>
                              <h4 className="text-sm font-medium">Implementation Guide</h4>
                              <p className="text-xs text-neutral-500">Practical steps for compliance</p>
                            </div>
                            <ExternalLinkIcon className="h-4 w-4 ml-auto text-neutral-400" />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-neutral-200 shadow-sm hover:bg-neutral-50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <GavelIcon className="h-5 w-5 text-neutral-400 mr-2" />
                            <div>
                              <h4 className="text-sm font-medium">Legal Commentary</h4>
                              <p className="text-xs text-neutral-500">Expert analysis</p>
                            </div>
                            <ExternalLinkIcon className="h-4 w-4 ml-auto text-neutral-400" />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-neutral-200 shadow-sm hover:bg-neutral-50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <HelpCircleIcon className="h-5 w-5 text-neutral-400 mr-2" />
                            <div>
                              <h4 className="text-sm font-medium">FAQ</h4>
                              <p className="text-xs text-neutral-500">Common questions</p>
                            </div>
                            <ExternalLinkIcon className="h-4 w-4 ml-auto text-neutral-400" />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-neutral-200 shadow-sm hover:bg-neutral-50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <AlertTriangleIcon className="h-5 w-5 text-neutral-400 mr-2" />
                            <div>
                              <h4 className="text-sm font-medium">Risk Assessment</h4>
                              <p className="text-xs text-neutral-500">Evaluation tools</p>
                            </div>
                            <ExternalLinkIcon className="h-4 w-4 ml-auto text-neutral-400" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-neutral-500">
                  <FileTextIcon className="h-10 w-10 mx-auto mb-3 text-neutral-300" />
                  <p>Select an article to view related resources</p>
                </div>
              )}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

// Missing FilterIcon component declaration
function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}