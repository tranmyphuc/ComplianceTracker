import React, { useState } from "react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Check, 
  Clipboard, 
  ClipboardCheck, 
  HelpCircle, 
  Lightbulb, 
  RotateCw, 
  Search,
  Sparkles,
  AlignJustify
} from "lucide-react";
import { ArticleReference } from "./article-reference";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ComplianceTooltipWizardProps {
  systemId?: string;
  systemName?: string;
  assessmentId?: string;
  children?: React.ReactNode;
  mode?: 'inline' | 'button' | 'icon';
  buttonText?: string;
  className?: string;
}

interface SuggestionResult {
  relevantArticles: Array<{
    articleId: string;
    title: string;
    relevance: string;
    excerpt: string;
  }>;
  complianceScore: number;
  suggestedRemediation: string[];
  gaps: string[];
}

/**
 * Interactive wizard for exploring AI compliance requirements
 * Provides EU AI Act article suggestions based on system information
 */
export function ComplianceTooltipWizard({
  systemId,
  systemName,
  assessmentId,
  children,
  mode = 'button',
  buttonText = 'Compliance Guide',
  className
}: ComplianceTooltipWizardProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [systemDesc, setSystemDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Handle form submission and API call to get suggestions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    setSuggestions(null);
    
    try {
      const payload = {
        systemId,
        systemDesc: systemDesc || undefined,
        searchQuery: searchQuery || undefined
      };
      
      const response = await fetch('/api/suggest/system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setSuggestions(data);
      setActiveTab('results');
    } catch (err) {
      console.error('Error fetching compliance suggestions:', err);
      setError(`Failed to get compliance suggestions: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to render the appropriate trigger element based on mode
  const renderTrigger = () => {
    switch (mode) {
      case 'inline':
        return (
          <span className="underline decoration-dotted cursor-help text-primary">
            {children || buttonText}
          </span>
        );
      case 'icon':
        return (
          <Button variant="ghost" size="icon" className={className}>
            <Lightbulb className="h-4 w-4" />
            <span className="sr-only">{buttonText}</span>
          </Button>
        );
      case 'button':
      default:
        return (
          <Button 
            variant="outline" 
            size="sm"
            className={cn("flex items-center gap-1", className)}
          >
            <Lightbulb className="h-4 w-4" />
            {children || buttonText}
          </Button>
        );
    }
  };
  
  // Function to copy suggestion text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };
  
  // Function to render the suggestion results
  const renderSuggestions = () => {
    if (!suggestions) return null;
    
    return (
      <div className="space-y-4">
        {suggestions.relevantArticles.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">Relevant Articles</h3>
                <Badge variant="outline" className="text-xs">
                  {suggestions.relevantArticles.length} found
                </Badge>
              </div>
              <Badge 
                className={cn(
                  "text-xs",
                  suggestions.complianceScore >= 80 ? "bg-green-100 text-green-800" :
                  suggestions.complianceScore >= 50 ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                )}
              >
                Score: {suggestions.complianceScore}%
              </Badge>
            </div>
            
            <div className="space-y-3">
              {suggestions.relevantArticles.map((article, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <CardHeader className="p-3 pb-0">
                    <div className="flex items-center justify-between">
                      <ArticleReference articleId={article.articleId}>
                        {article.articleId}: {article.title}
                      </ArticleReference>
                      <Badge variant="outline" className="text-xs">
                        {article.relevance}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-2">
                    <p className="text-xs text-muted-foreground">{article.excerpt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {suggestions.gaps.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Compliance Gaps</h3>
                <ul className="text-xs space-y-1">
                  {suggestions.gaps.map((gap, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {suggestions.suggestedRemediation.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Suggested Actions</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(suggestions.suggestedRemediation.join('\n'))}
                  >
                    <Clipboard className="h-3.5 w-3.5" />
                    <span className="sr-only">Copy to clipboard</span>
                  </Button>
                </div>
                <ul className="text-xs space-y-1 mt-1">
                  {suggestions.suggestedRemediation.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <HelpCircle className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
            <p className="mt-2 text-sm text-muted-foreground">
              No relevant articles found. Try a different search query or provide more details.
            </p>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {renderTrigger()}
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="search">
              <Search className="h-3.5 w-3.5 mr-1" />
              Search
            </TabsTrigger>
            <TabsTrigger value="analyze">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Analyze
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!suggestions}>
              <AlignJustify className="h-3.5 w-3.5 mr-1" />
              Results
            </TabsTrigger>
          </TabsList>
          
          {/* Search Tab */}
          <TabsContent value="search" className="p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="search-query">Search by keyword</Label>
                <Input 
                  id="search-query"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., facial recognition, data protection"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={loading || (!searchQuery && !systemDesc)}
                >
                  {loading ? (
                    <>
                      <RotateCw className="h-3.5 w-3.5 mr-1 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-3.5 w-3.5 mr-1" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          {/* Analysis Tab */}
          <TabsContent value="analyze" className="p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="system-desc">Describe your AI system</Label>
                <Textarea 
                  id="system-desc"
                  value={systemDesc}
                  onChange={(e) => setSystemDesc(e.target.value)}
                  placeholder="Provide details about the capabilities, purpose, and context of your AI system..."
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  Provide detailed information for more accurate compliance guidance
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={loading || (!systemDesc && !searchQuery)}
                >
                  {loading ? (
                    <>
                      <RotateCw className="h-3.5 w-3.5 mr-1 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 mr-1" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          {/* Results Tab */}
          <TabsContent value="results" className="p-4">
            {loading ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-[100px]" />
                  <Skeleton className="h-5 w-[60px]" />
                </div>
                
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="p-3 pb-0">
                      <Skeleton className="h-5 w-full" />
                    </CardHeader>
                    <CardContent className="p-3 pt-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3 mt-1" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-sm text-red-500">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setActiveTab('search')}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-3">
                {renderSuggestions()}
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}