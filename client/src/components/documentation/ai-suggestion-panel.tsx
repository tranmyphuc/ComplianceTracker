import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, SparklesIcon, Send, Check, XCircle, AlertTriangle, Info, Plus, Lightbulb, RefreshCw } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface AISuggestionPanelProps {
  documentType: string;
  documentContent?: string;
  section?: string;
  onInsertSuggestion?: (text: string) => void;
  className?: string;
}

type SuggestionType = 'content' | 'improvement' | 'compliance';
type SuggestionStatus = 'pending' | 'generated' | 'error';

interface Suggestion {
  id: string;
  type: SuggestionType;
  content: string;
  rationale?: string;
  source?: string;
  articleReference?: string;
  status: SuggestionStatus;
}

export function AISuggestionPanel({
  documentType,
  documentContent = '',
  section = '',
  onInsertSuggestion,
  className = ''
}: AISuggestionPanelProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('suggestions');
  const [expandedSuggestions, setExpandedSuggestions] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const { toast } = useToast();
  
  // Mock suggestions - in production, these would come from the API
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: '1',
      type: 'content',
      content: 'The system conducts regular automated tests to identify and mitigate potential biases in decision-making processes. These tests analyze data patterns to ensure that protected characteristics do not disproportionately influence outcomes.',
      rationale: 'Robust bias testing is essential for high-risk AI systems used in employment contexts.',
      articleReference: 'Article 10',
      status: 'generated'
    },
    {
      id: '2',
      type: 'improvement',
      content: 'Consider strengthening your risk assessment section by adding quantitative metrics for measuring bias, such as disparate impact ratios across different demographic groups.',
      status: 'generated'
    },
    {
      id: '3',
      type: 'compliance',
      content: 'You should specify the qualifications and training required for human overseers, as required by Article 14(4).',
      source: 'EU AI Act, Article 14',
      status: 'generated'
    }
  ]);

  const toggleSuggestionExpanded = (id: string) => {
    setExpandedSuggestions(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  const handleInsertSuggestion = (text: string) => {
    if (onInsertSuggestion) {
      onInsertSuggestion(text);
      toast({
        title: "Suggestion inserted",
        description: "The suggestion has been added to your document."
      });
    }
  };
  
  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call the API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add a new suggestion to the top of the list
      const newSuggestion: Suggestion = {
        id: `new-${Date.now()}`,
        type: 'content',
        content: 'Implement a comprehensive documentation system to track all human decisions overriding or modifying AI recommendations. This system should record the justification for each intervention, enabling retrospective analysis of override patterns.',
        rationale: 'Documentation of human interventions helps identify systemic issues and improves transparency.',
        articleReference: 'Article 14',
        status: 'generated'
      };
      
      setSuggestions(prev => [newSuggestion, ...prev]);
      setExpandedSuggestions(prev => [...prev, newSuggestion.id]);
      
      toast({
        title: "New suggestions generated",
        description: "AI has provided new content recommendations based on your document."
      });
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Generation failed",
        description: "There was an error generating suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuerySubmit = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call the API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add a new suggestion based on the query
      const newSuggestion: Suggestion = {
        id: `query-${Date.now()}`,
        type: 'content',
        content: `Based on your query about "${query}", we recommend adding: The system includes configurable confidence thresholds that determine when human review is required, with lower confidence predictions automatically escalated to human experts.`,
        rationale: 'Confidence thresholds are an effective way to implement appropriate levels of human oversight.',
        status: 'generated'
      };
      
      setSuggestions(prev => [newSuggestion, ...prev]);
      setExpandedSuggestions(prev => [...prev, newSuggestion.id]);
      setQuery('');
      
      toast({
        title: "Query processed",
        description: "AI has responded to your query with relevant suggestions."
      });
    } catch (error) {
      console.error('Error processing query:', error);
      toast({
        title: "Query failed",
        description: "There was an error processing your query. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateFromPrompt = async () => {
    if (!customPrompt.trim()) return;
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call the API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add a new suggestion based on the custom prompt
      const newSuggestion: Suggestion = {
        id: `prompt-${Date.now()}`,
        type: 'content',
        content: `In response to your prompt: "${customPrompt.slice(0, 30)}...", we recommend:\n\nThe system maintains detailed logging of all interactions between AI and human reviewers, including timestamps, user IDs, action types, and decision outcomes. These logs are encrypted, access-controlled, and retained in accordance with organizational data retention policies.`,
        rationale: 'Custom-generated content based on your specific requirements.',
        status: 'generated'
      };
      
      setSuggestions(prev => [newSuggestion, ...prev]);
      setExpandedSuggestions(prev => [...prev, newSuggestion.id]);
      setCustomPrompt('');
      
      toast({
        title: "Custom content generated",
        description: "AI has generated content based on your specific prompt."
      });
    } catch (error) {
      console.error('Error generating from prompt:', error);
      toast({
        title: "Generation failed",
        description: "There was an error processing your custom prompt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className={`border shadow-sm ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-blue-500" />
              AI Document Assistant
            </div>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGenerateSuggestions}
            disabled={isLoading}
            className="h-8"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="h-3.5 w-3.5 mr-1.5" />
                Generate
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="suggestions" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6 pt-1 pb-2">
          <TabsList className="w-full">
            <TabsTrigger value="suggestions" className="flex-1">Suggestions</TabsTrigger>
            <TabsTrigger value="custom" className="flex-1">Custom Prompt</TabsTrigger>
            <TabsTrigger value="reference" className="flex-1">Reference</TabsTrigger>
          </TabsList>
        </div>
        
        <Separator />
        
        <TabsContent value="suggestions" className="m-0">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="relative mb-4">
                <Input
                  placeholder="Ask for specific suggestions..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pr-10"
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuerySubmit()}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={handleQuerySubmit}
                  disabled={!query.trim() || isLoading}
                >
                  <Send className="h-4 w-4 text-primary" />
                </Button>
              </div>
              
              <ScrollArea className="h-[calc(100vh-22rem)]">
                <div className="space-y-3">
                  {suggestions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-neutral-500">
                      <SparklesIcon className="h-8 w-8 mb-2 text-neutral-300" />
                      <p>No suggestions yet. Generate some by clicking the "Generate" button.</p>
                    </div>
                  ) : (
                    suggestions.map((suggestion) => (
                      <div 
                        key={suggestion.id} 
                        className="rounded-md border overflow-hidden bg-card"
                      >
                        <div 
                          className="flex items-start justify-between p-3 cursor-pointer hover:bg-neutral-50"
                          onClick={() => toggleSuggestionExpanded(suggestion.id)}
                        >
                          <div className="flex items-start gap-2">
                            {suggestion.type === 'content' && (
                              <Plus className="h-4 w-4 text-green-500 mt-0.5" />
                            )}
                            {suggestion.type === 'improvement' && (
                              <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5" />
                            )}
                            {suggestion.type === 'compliance' && (
                              <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                            )}
                            <div>
                              <div className="font-medium text-sm">
                                {suggestion.content.substring(0, 60)}...
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {suggestion.type === 'content' && (
                                  <Badge variant="outline" className="text-green-600 bg-green-50">Content</Badge>
                                )}
                                {suggestion.type === 'improvement' && (
                                  <Badge variant="outline" className="text-amber-600 bg-amber-50">Improvement</Badge>
                                )}
                                {suggestion.type === 'compliance' && (
                                  <Badge variant="outline" className="text-blue-600 bg-blue-50">Compliance</Badge>
                                )}
                                {suggestion.articleReference && (
                                  <span className="text-xs text-neutral-500">{suggestion.articleReference}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {expandedSuggestions.includes(suggestion.id) && (
                          <div className="p-3 border-t">
                            <div className="text-sm mb-3 whitespace-pre-wrap">
                              {suggestion.content}
                            </div>
                            
                            {suggestion.rationale && (
                              <div className="mb-3 p-2 bg-neutral-50 rounded text-xs text-neutral-700">
                                <strong>Rationale:</strong> {suggestion.rationale}
                              </div>
                            )}
                            
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                className="h-8"
                                onClick={() => handleInsertSuggestion(suggestion.content)}
                              >
                                <Check className="h-3.5 w-3.5 mr-1.5" />
                                Insert
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8"
                                onClick={() => {
                                  // In a real implementation, this would modify the suggestion
                                  toast({
                                    title: "Edit mode",
                                    description: "You can edit this suggestion before inserting."
                                  });
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 ml-auto"
                                onClick={() => {
                                  setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
                                  toast({
                                    title: "Suggestion dismissed",
                                    description: "The suggestion has been removed from the list."
                                  });
                                }}
                              >
                                <XCircle className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="custom" className="m-0">
          <CardContent className="p-4">
            <div className="mb-4">
              <p className="text-sm text-neutral-600 mb-2">
                Provide a custom prompt to generate specific document content:
              </p>
              <Textarea
                placeholder="Example: Generate a paragraph about human oversight training protocols for AI operators..."
                className="min-h-[120px]"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <Button
              onClick={handleGenerateFromPrompt}
              disabled={!customPrompt.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Generate From Prompt
                </>
              )}
            </Button>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Prompt Templates:</p>
              
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start h-auto py-2 px-3 text-left"
                  onClick={() => setCustomPrompt("Generate a detailed section on how our system maintains audit logs of all human interventions, including what information is recorded and how long it's retained.")}
                >
                  <div className="text-xs">
                    Human intervention audit logging procedures...
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start h-auto py-2 px-3 text-left"
                  onClick={() => setCustomPrompt("Write a paragraph explaining our approach to training the human operators who oversee this AI system, including required qualifications and ongoing education.")}
                >
                  <div className="text-xs">
                    Human overseer training protocols...
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start h-auto py-2 px-3 text-left"
                  onClick={() => setCustomPrompt("Draft content that describes the process for human overseers to challenge or override system decisions, including the escalation workflow and documentation requirements.")}
                >
                  <div className="text-xs">
                    Override procedures and escalation...
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="reference" className="m-0">
          <CardContent className="p-4">
            <ScrollArea className="h-[calc(100vh-22rem)]">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="article-14">
                  <AccordionTrigger className="text-sm font-medium">
                    Article 14: Human Oversight
                  </AccordionTrigger>
                  <AccordionContent className="text-xs space-y-2">
                    <p>
                      High-risk AI systems shall be designed and developed in such a way, including with appropriate human-machine interface tools, that they can be effectively overseen by natural persons during the period in which the AI system is in use.
                    </p>
                    <p>
                      Human oversight shall aim at preventing or minimizing the risks to health, safety or fundamental rights that may emerge when a high-risk AI system is used in accordance with its intended purpose or under conditions of reasonably foreseeable misuse.
                    </p>
                    <p>
                      Human oversight shall be ensured through either one or all of the following measures:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>Identified and built into the high-risk AI system by the provider before it is placed on the market or put into service</li>
                      <li>Identified by the provider before placing the system on the market or putting it into service and that are appropriate for the intended user</li>
                      <li>Implemented by the user</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                {documentType === 'technical_documentation' && (
                  <AccordionItem value="article-11">
                    <AccordionTrigger className="text-sm font-medium">
                      Article 11: Technical Documentation
                    </AccordionTrigger>
                    <AccordionContent className="text-xs space-y-2">
                      <p>
                        The technical documentation shall be drawn up before the high-risk AI system is placed on the market or put into service and shall be kept up-to date.
                      </p>
                      <p>
                        The technical documentation shall contain at least the information set out in Annex IV. It shall be drafted in such a way to demonstrate that the high-risk AI system complies with the requirements of this chapter.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                )}
                
                {documentType === 'risk_assessment' && (
                  <AccordionItem value="article-9">
                    <AccordionTrigger className="text-sm font-medium">
                      Article 9: Risk Management System
                    </AccordionTrigger>
                    <AccordionContent className="text-xs space-y-2">
                      <p>
                        A risk management system shall be established, implemented, documented and maintained for high-risk AI systems.
                      </p>
                      <p>
                        The risk management system shall consist of a continuous iterative process run throughout the entire lifecycle of a high-risk AI system, requiring regular systematic updating.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                )}
                
                <AccordionItem value="article-13">
                  <AccordionTrigger className="text-sm font-medium">
                    Article 13: Transparency and User Information
                  </AccordionTrigger>
                  <AccordionContent className="text-xs space-y-2">
                    <p>
                      High-risk AI systems shall be designed and developed in such a way to ensure that their operation is sufficiently transparent to enable users to interpret the system's output and use it appropriately.
                    </p>
                    <p>
                      High-risk AI systems shall be accompanied by instructions for use in an appropriate digital format or otherwise that include the following information:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li>Identity and contact details of the provider</li>
                      <li>The characteristics, capabilities and limitations of performance</li>
                      <li>Human oversight measures</li>
                      <li>Expected lifetime of the system and maintenance measures</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="mt-4 bg-blue-50 p-3 rounded-md">
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-xs text-blue-700">
                    <p className="font-medium mb-1">Documentation Best Practices:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Be specific and concrete rather than general</li>
                      <li>Include quantitative metrics where possible</li>
                      <li>Cite relevant standards and methodologies</li>
                      <li>Document both technological and organizational measures</li>
                      <li>Maintain version control of all documentation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <div className="px-4 py-3 bg-neutral-50 border-t text-xs text-neutral-500 flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
          <span>Review AI suggestions before adding to documents</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 text-xs"
          onClick={() => {
            setActiveTab('reference');
            toast({
              title: "EU AI Act Reference",
              description: "View key articles related to this document type."
            });
          }}
        >
          View EU AI Act
        </Button>
      </div>
    </Card>
  );
}