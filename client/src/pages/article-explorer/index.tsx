
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Book, Bookmark, Copy, ExternalLink } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/language-switcher";

// Sample article data structure
const articles = [
  {
    id: 'article-5',
    number: '5',
    title: 'Prohibited Artificial Intelligence Practices',
    content: `
      <p>The following artificial intelligence practices shall be prohibited:</p>
      <p>(a) the placing on the market, putting into service or use of an AI system that deploys subliminal techniques beyond a person's consciousness in order to materially distort a person's behaviour in a manner that causes or is likely to cause that person or another person physical or psychological harm;</p>
      <p>(b) the placing on the market, putting into service or use of an AI system that exploits any of the vulnerabilities of a specific group of persons due to their age, physical or mental disability, in order to materially distort the behaviour of a person pertaining to that group in a manner that causes or is likely to cause that person or another person physical or psychological harm;</p>
      <p>(c) the placing on the market, putting into service or use of an AI system by public authorities or on their behalf for the evaluation or classification of the trustworthiness of natural persons over a certain period of time based on their social behaviour or known or predicted personal or personality characteristics, with the social score leading to either or both of the following:</p>
      <p>(i) detrimental or unfavourable treatment of certain natural persons or whole groups thereof in social contexts which are unrelated to the contexts in which the data was originally generated or collected;</p>
      <p>(ii) detrimental or unfavourable treatment of certain natural persons or whole groups thereof that is unjustified or disproportionate to their social behaviour or its gravity;</p>
      <p>(d) the use of real-time remote biometric identification systems in publicly accessible spaces for the purpose of law enforcement, unless and in as far as such use is strictly necessary for one of the following objectives:</p>
      <p>(i) the targeted search for specific potential victims of crime, including missing children;</p>
      <p>(ii) the prevention of a specific, substantial and imminent threat to the life or physical safety of natural persons or of a terrorist attack;</p>
      <p>(iii) the detection, localisation, identification or prosecution of a perpetrator or suspect of a criminal offence referred to in Article 2(2) of Framework Decision 2002/584/JHA and punishable in the Member State concerned by a custodial sentence or a detention order for a maximum period of at least three years, as determined by the law of that Member State.</p>
    `,
    keywords: ['prohibited', 'biometric', 'social scoring', 'subliminal techniques', 'vulnerability exploitation'],
    interpretation: 'Article 5 defines the AI practices that are completely prohibited under the EU AI Act. These include harmful subliminal techniques, exploitation of vulnerabilities, social scoring by public authorities, and most uses of real-time biometric identification in public spaces.',
    examples: [
      'A social media app that uses subliminal techniques to increase addiction',
      'An AI system exploiting cognitive disabilities to manipulate purchasing behavior',
      'Government-run social credit systems that rank citizens based on behavior',
      'Real-time facial recognition in public areas (with limited exceptions)'
    ],
    implementation: `
      <h4>Implementation Guidance:</h4>
      <ul>
        <li>Conduct a comprehensive review of existing systems to ensure none fall into prohibited categories</li>
        <li>Implement robust design review processes to prevent development of prohibited systems</li>
        <li>For organizations using biometric systems, carefully review use cases against the strictly limited exceptions</li>
        <li>Maintain detailed documentation of system design decisions to demonstrate compliance</li>
      </ul>
    `,
    faqs: [
      {
        question: 'What counts as "subliminal techniques"?',
        answer: 'Techniques that operate below the threshold of a person\'s consciousness with the intention to materially change behavior in a harmful way.'
      },
      {
        question: 'Does the prohibition on social scoring apply to private companies?',
        answer: 'The prohibition specifically applies to public authorities or systems used on their behalf, not to private sector scoring systems (though these may be regulated under other provisions).'
      },
      {
        question: 'Are there any exceptions to the prohibition on real-time biometric identification?',
        answer: 'Yes, there are limited exceptions for law enforcement purposes such as finding crime victims, preventing substantial threats to life, and identifying serious criminal suspects.'
      }
    ]
  },
  {
    id: 'article-6',
    number: '6',
    title: 'Classification Rules for High-Risk AI Systems',
    content: `
      <p>1. Irrespective of whether an AI system is placed on the market or put into service independently from the products referred to in points (a) and (b), that AI system shall be considered high-risk where both of the following conditions are fulfilled:</p>
      <p>(a) the AI system is intended to be used as a safety component of a product, or is itself a product, covered by the Union harmonisation legislation listed in Annex I;</p>
      <p>(b) the product whose safety component is the AI system, or the AI system itself as a product, is required to undergo a third-party conformity assessment with a view to the placing on the market or putting into service of that product pursuant to the Union harmonisation legislation listed in Annex I.</p>
      <p>2. In addition to the high-risk AI systems referred to in paragraph 1, AI systems referred to in Annex II shall also be considered high-risk.</p>
    `,
    keywords: ['high-risk', 'classification', 'safety component', 'conformity assessment'],
    interpretation: 'Article 6 establishes the rules for determining whether an AI system falls into the high-risk category. There are two pathways: AI serving as a safety component for products under existing EU safety laws, or AI systems explicitly listed in Annex II of the Act.',
    examples: [
      'AI used in medical devices that require CE marking',
      'AI systems for recruitment and employee management',
      'AI used in critical infrastructure management',
      'AI systems for educational or vocational training'
    ],
    implementation: `
      <h4>Implementation Guidance:</h4>
      <ul>
        <li>Review AI inventory against both classification pathways (safety component and Annex II)</li>
        <li>For product-related AI systems, determine if they fall under Union harmonisation legislation in Annex I</li>
        <li>For standalone AI systems, verify against the specific use cases in Annex II</li>
        <li>Establish a process for regular review of AI classifications as systems evolve</li>
      </ul>
    `,
    faqs: [
      {
        question: 'What is a "safety component"?',
        answer: 'A component that performs a safety function for a product, whose failure or malfunction endangers the health and safety of persons.'
      },
      {
        question: 'What types of systems are listed in Annex II?',
        answer: 'Annex II includes systems in areas such as education, employment, essential services, law enforcement, migration, and administration of justice.'
      },
      {
        question: 'If my AI system is high-risk, what does that mean?',
        answer: 'High-risk AI systems must comply with stringent requirements including risk management, data governance, technical documentation, record-keeping, transparency, human oversight, and more.'
      }
    ]
  },
  {
    id: 'article-9',
    number: '9',
    title: 'Risk Management System',
    content: `
      <p>1. A risk management system shall be established, implemented, documented and maintained in relation to high-risk AI systems.</p>
      <p>2. The risk management system shall consist of a continuous iterative process run throughout the entire lifecycle of a high-risk AI system, requiring regular systematic updating. It shall comprise the following steps:</p>
      <p>(a) identification and analysis of the known and foreseeable risks associated with each high-risk AI system;</p>
      <p>(b) estimation and evaluation of the risks that may emerge when the high-risk AI system is used in accordance with its intended purpose and under conditions of reasonably foreseeable misuse;</p>
      <p>(c) evaluation of other possibly arising risks based on the analysis of data gathered from the post-market monitoring system referred to in Article 61;</p>
      <p>(d) adoption of suitable risk management measures in accordance with the provisions of the following paragraphs.</p>
      <p>3. The risk management measures referred to in paragraph 2, point (d), shall give due consideration to the effects and possible interactions resulting from the combined application of the requirements set out in this Chapter 2. They shall take into account the generally acknowledged state of the art, including as reflected in relevant harmonised standards or common specifications.</p>
      <p>4. The risk management measures referred to in paragraph 2, point (d) shall be such that any residual risk associated with each hazard as well as the overall residual risk of the high-risk AI systems is judged acceptable, provided that the high-risk AI system is used in accordance with its intended purpose or under conditions of reasonably foreseeable misuse. Those residual risks shall be communicated to the user.</p>
      <p>5. High-risk AI systems shall be tested for the purposes of identifying the most appropriate risk management measures. Testing shall ensure that high-risk AI systems perform consistently for their intended purpose and they are in compliance with the requirements set out in this Chapter.</p>
      <p>6. Testing procedures shall be suitable to achieve the intended purpose of the AI system and do not need to go beyond what is necessary to achieve that purpose.</p>
      <p>7. The testing of the high-risk AI systems shall be performed, as appropriate, at any point in time throughout the development process, and, in any event, prior to the placing on the market or the putting into service. Testing shall be made against preliminarily defined metrics and probabilistic thresholds that are appropriate to the intended purpose of the high-risk AI system.</p>
      <p>8. When implementing the risk management system described in paragraphs 1 to 7, specific consideration shall be given to whether the high-risk AI system is likely to be accessed by or have an impact on children.</p>
      <p>9. For credit institutions regulated by Directive 2013/36/EU, the aspects described in paragraphs 1 to 8 shall be part of the risk management procedures established by those institutions pursuant to Article 74 of that Directive.</p>
    `,
    keywords: ['risk management', 'lifecycle', 'high-risk', 'testing', 'monitoring'],
    interpretation: 'Article 9 establishes the requirement for a comprehensive risk management system for high-risk AI systems. This system must operate throughout the entire lifecycle of the AI system, requiring continuous monitoring, assessment, and mitigation of risks.',
    examples: [
      'Implementing formal risk assessment protocols before deployment',
      'Continuous monitoring of a recruitment AI system for emerging biases',
      'Regular testing of medical diagnostic AI against evolving clinical standards',
      'Special risk considerations for educational AI systems used by children'
    ],
    implementation: `
      <h4>Implementation Guidance:</h4>
      <ul>
        <li>Document a structured risk management methodology covering the entire AI lifecycle</li>
        <li>Conduct initial risk assessments during development and before deployment</li>
        <li>Establish metrics and thresholds appropriate to the system's purpose</li>
        <li>Implement continuous monitoring processes to identify emerging risks</li>
        <li>Regularly test systems against defined metrics and document results</li>
        <li>Pay particular attention to risks when systems may impact children</li>
      </ul>
    `,
    faqs: [
      {
        question: 'Is a risk management system required for all AI systems?',
        answer: 'No, it is specifically required for high-risk AI systems as defined in Article 6 and Annex II.'
      },
      {
        question: 'What constitutes "reasonably foreseeable misuse"?',
        answer: 'Uses of the system that are not intended by the provider but may result from reasonably predictable human behavior, including improper use, overreliance, or workarounds.'
      },
      {
        question: 'How often should risk assessments be updated?',
        answer: 'The regulation requires a "continuous iterative process" with "regular systematic updating" throughout the system\'s lifecycle, suggesting assessments should be updated whenever relevant changes occur and at regular intervals.'
      }
    ]
  },
  {
    id: 'article-10',
    number: '10',
    title: 'Data and Data Governance',
    content: `
      <p>1. High-risk AI systems which make use of techniques involving the training of models with data shall be developed on the basis of training, validation and testing data sets that meet the quality criteria referred to in paragraphs 2 to 5.</p>
      <p>2. Training, validation and testing data sets shall be subject to appropriate data governance and management practices. Those practices shall concern in particular,</p>
      <p>(a) the relevant design choices;</p>
      <p>(b) data collection;</p>
      <p>(c) relevant data preparation processing operations, such as annotation, labelling, cleaning, enrichment and aggregation;</p>
      <p>(d) the formulation of relevant assumptions, notably with respect to the information that the data are supposed to measure and represent;</p>
      <p>(e) a prior assessment of the availability, quantity and suitability of the data sets that are needed;</p>
      <p>(f) examination in view of possible biases;</p>
      <p>(g) the identification of any possible data gaps or shortcomings, and how those gaps and shortcomings can be addressed.</p>
      <p>3. Training, validation and testing data sets shall be relevant, representative, free of errors and complete. They shall have the appropriate statistical properties, including, where applicable, as regards the persons or groups of persons in relation to whom the high-risk AI system is intended to be used. These characteristics of the data sets may be met at the level of individual data sets or a combination thereof.</p>
      <p>4. Training, validation and testing data sets shall take into account, to the extent required by the intended purpose, the characteristics or elements that are particular to the specific geographical, behavioural or functional setting within which the high-risk AI system is intended to be used.</p>
      <p>5. To the extent that it is strictly necessary for the purposes of ensuring bias monitoring, detection and correction in relation to the high-risk AI systems, the providers of such systems may process special categories of personal data referred to in Article 9(1) of Regulation (EU) 2016/679, Article 10 of Directive (EU) 2016/680 and Article 10(1) of Regulation (EU) 2018/1725, subject to appropriate safeguards for the fundamental rights and freedoms of natural persons, including technical limitations on the re-use and use of state-of-the-art security and privacy-preserving measures, such as pseudonymisation, or encryption where anonymisation may significantly affect the purpose pursued.</p>
      <p>6. Appropriate data governance and management practices shall apply for the development of high-risk AI systems other than those which make use of techniques involving the training of models in order to ensure that those high-risk AI systems comply with paragraph 2.</p>
    `,
    keywords: ['data governance', 'training data', 'validation', 'testing', 'bias', 'representativeness'],
    interpretation: 'Article 10 mandates quality standards for data used in high-risk AI systems. It requires appropriate data governance throughout the AI development process, ensuring data is relevant, representative, and appropriate for the intended use context.',
    examples: [
      'Implementing data quality checks for a healthcare diagnostic AI',
      'Ensuring demographic representativeness in facial recognition training data',
      'Documenting data collection methodology for employment screening AI',
      'Applying data governance controls to HR analytics tools'
    ],
    implementation: `
      <h4>Implementation Guidance:</h4>
      <ul>
        <li>Document complete data governance practices covering collection, preparation, and processing</li>
        <li>Evaluate data for potential biases before using for training AI systems</li>
        <li>Ensure training data is representative of the population where the system will be used</li>
        <li>Consider geographical, behavioral, and functional contexts in data selection</li>
        <li>Implement technical safeguards when processing sensitive personal data</li>
        <li>Establish data quality metrics and validation processes</li>
      </ul>
    `,
    faqs: [
      {
        question: 'What makes data "representative"?',
        answer: 'Data that accurately reflects the population, environment, and situations in which the AI system will be deployed, including appropriate diversity and coverage of relevant variables.'
      },
      {
        question: 'Can special categories of personal data (e.g., race, health) be used?',
        answer: 'Yes, but only when strictly necessary for bias monitoring, detection, and correction, and with appropriate safeguards including technical limitations on reuse and security measures.'
      },
      {
        question: 'Does this apply to AI systems that don\'t use machine learning?',
        answer: 'Yes, paragraph 6 states that appropriate data governance practices apply to all high-risk AI systems, even those not using techniques involving model training.'
      }
    ]
  }
];

const ArticleExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(articles);
  const [selectedTab, setSelectedTab] = useState('all');
  const { t } = useLanguage();
  
  // Filter articles based on search term
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredArticles(articles);
      return;
    }
    
    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = articles.filter(article => {
      return (
        article.title.toLowerCase().includes(lowercaseSearch) ||
        article.content.toLowerCase().includes(lowercaseSearch) ||
        article.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseSearch)) ||
        article.number.includes(lowercaseSearch)
      );
    });
    
    setFilteredArticles(filtered);
  };
  
  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter based on tabs
  const filterByCategory = (category: string) => {
    setSelectedTab(category);
    
    if (category === 'all') {
      setFilteredArticles(articles);
      return;
    }
    
    const categoryMapping: {[key: string]: string[]} = {
      'prohibited': ['prohibited', 'biometric', 'social scoring'],
      'high-risk': ['high-risk', 'classification', 'safety'],
      'requirements': ['risk management', 'data governance', 'documentation', 'transparency'],
    };
    
    const relevantKeywords = categoryMapping[category] || [];
    const filtered = articles.filter(article => 
      article.keywords.some(keyword => 
        relevantKeywords.some(relevantKeyword => 
          keyword.toLowerCase().includes(relevantKeyword.toLowerCase())
        )
      )
    );
    
    setFilteredArticles(filtered);
  };
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold">EU AI Act Article Explorer</h1>
        <p className="text-muted-foreground">
          Explore articles of the EU AI Act with detailed explanations, implementation guidance, and practical examples.
        </p>
      </div>
      
      {/* Search and filter */}
      <div className="mb-8">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by article number, title, or keyword..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>
        
        <Tabs defaultValue="all" value={selectedTab} onValueChange={filterByCategory}>
          <TabsList>
            <TabsTrigger value="all">All Articles</TabsTrigger>
            <TabsTrigger value="prohibited">Prohibited Practices</TabsTrigger>
            <TabsTrigger value="high-risk">High-Risk Classification</TabsTrigger>
            <TabsTrigger value="requirements">Compliance Requirements</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Articles Display */}
      <div className="grid grid-cols-1 gap-6">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <Card key={article.id} className="shadow-sm hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-primary" />
                  Article {article.number}: {article.title}
                </CardTitle>
                <CardDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {article.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">{keyword}</Badge>
                    ))}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="interpretation">
                  <TabsList className="w-full">
                    <TabsTrigger value="text">Article Text</TabsTrigger>
                    <TabsTrigger value="interpretation">Interpretation</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                    <TabsTrigger value="implementation">Implementation</TabsTrigger>
                    <TabsTrigger value="faqs">FAQs</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="mt-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3">Article {article.number}: {article.title}</h3>
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-2" dangerouslySetInnerHTML={{ __html: article.content }} />
                      </ScrollArea>
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
                          <Copy className="h-3 w-3" />
                          Copy to clipboard
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="interpretation" className="mt-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3">Interpretation & Analysis</h3>
                      <p>{article.interpretation}</p>
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm" className="text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View official guidance
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="examples" className="mt-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3">Practical Examples</h3>
                      <ul className="space-y-2 list-disc pl-5">
                        {article.examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="implementation" className="mt-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div dangerouslySetInnerHTML={{ __html: article.implementation }} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="faqs" className="mt-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3">Frequently Asked Questions</h3>
                      <div className="space-y-4">
                        {article.faqs.map((faq, index) => (
                          <div key={index} className="space-y-1">
                            <h4 className="font-medium">{faq.question}</h4>
                            <p className="text-muted-foreground">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No articles found matching your search criteria.</p>
            <Button variant="outline" className="mt-2" onClick={() => setFilteredArticles(articles)}>
              Reset search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleExplorer;
