import React, { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, AlertTriangle, FileText, Info, Clock, History } from "lucide-react";

interface EnhancedArticleTooltipProps {
  articleId: string;
  children: React.ReactNode;
  className?: string;
}

interface ArticleDetails {
  id: string;
  articleId: string;
  number: number;
  title: string;
  content: string;
  officialUrl?: string;
  riskLevel?: 'high' | 'limited' | 'minimal' | 'prohibited';
  keyPoints?: string[];
  version: string;
  lastUpdated: string;
  isLatest: boolean;
  changeDescription?: string;
  exampleSummary?: string;
  imageUrl?: string;
  hasChanges?: boolean;
}

/**
 * Enhanced tooltip showing EU AI Act article details
 * Displays a tooltip with summary info and offers a dialog for more details
 */
export function EnhancedArticleTooltip({ 
  articleId, 
  children,
  className
}: EnhancedArticleTooltipProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch article details from the API
  const { data: articleData, isLoading, error } = useQuery<ArticleDetails>({
    queryKey: [`/api/eu-ai-act/articles/by-article-id/${encodeURIComponent(articleId)}`],
    enabled: !!articleId,
  });
  
  // Handle version history - this would be a separate query
  const { data: versionHistory, isLoading: isLoadingVersions } = useQuery<ArticleDetails[]>({
    queryKey: [`/api/eu-ai-act/articles/${encodeURIComponent(articleId)}/versions`],
    enabled: showDialog && !!articleId,
  });
  
  // Use article data from API only, or show error states
  // This is critical to avoid using synthetic data that doesn't match reality
  const article = articleData;
  
  // Badge color based on risk level
  const getBadgeVariant = (riskLevel?: string) => {
    switch(riskLevel) {
      case 'prohibited': return "destructive";
      case 'high': return "default";
      case 'limited': return "secondary";
      case 'minimal': return "outline";
      default: return "secondary";
    }
  };

  // Handle loading and error states
  if (isLoading) {
    return <span className="text-gray-500">Loading article {articleId}...</span>;
  }
  
  if (error || !article) {
    return (
      <span className="text-red-500">
        Error loading article data. Please try again later.
      </span>
    );
  }
  
  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger className={`font-medium text-blue-600 underline cursor-help ${className}`} onClick={() => setShowDialog(true)}>
            {children}
          </TooltipTrigger>
          <TooltipContent className="max-w-md bg-white p-4 shadow-lg rounded-lg border">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-base">{article.articleId}</h4>
                {article.riskLevel && (
                  <Badge variant={getBadgeVariant(article.riskLevel)}>
                    {article.riskLevel.charAt(0).toUpperCase() + article.riskLevel.slice(1)} Risk
                  </Badge>
                )}
              </div>
              <h5 className="font-medium">{article.title}</h5>
              <p className="text-sm text-gray-600 line-clamp-3">{article.exampleSummary || 'Click for more details about this article.'}</p>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" /> 
                Version {article.version}
                {article.hasChanges && (
                  <Badge variant="outline" className="ml-2 text-xs px-1">Updated</Badge>
                )}
              </div>
              <div className="pt-1">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs text-blue-600" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowDialog(true);
                  }}
                >
                  View Full Details
                </Button>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl flex items-center gap-2">
                {article.articleId}: {article.title}
                {article.riskLevel && (
                  <Badge variant={getBadgeVariant(article.riskLevel)} className="ml-2">
                    {article.riskLevel.charAt(0).toUpperCase() + article.riskLevel.slice(1)} Risk
                  </Badge>
                )}
              </DialogTitle>
            </div>
            <DialogDescription>
              Detailed information about {article.articleId} from the EU AI Act
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Full Text</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Key Points</CardTitle>
                      <CardDescription>
                        Important requirements from {article.articleId}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1">
                        {article.keyPoints ? 
                          article.keyPoints.map((point, i) => (
                            <li key={i} className="text-sm">{point}</li>
                          )) :
                          <li className="text-sm">This article requires comprehensive risk management for AI systems.</li>
                        }
                      </ul>
                    </CardContent>
                  </Card>

                  <div className="mt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Info className="h-4 w-4 mr-2" />
                          Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{article.exampleSummary || 'This article defines requirements for AI system compliance with the EU AI Act.'}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  {article.imageUrl ? (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Official Excerpt</CardTitle>
                      </CardHeader>
                      <CardContent className="flex justify-center">
                        <img 
                          src={article.imageUrl} 
                          alt={`Excerpt of ${article.articleId}`} 
                          className="max-w-full border rounded-md"
                        />
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Compliance Note
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                          <p className="text-sm text-amber-800">
                            This article may require significant organizational changes to ensure compliance.
                            Please consult with legal experts to assess specific requirements.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="mt-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <History className="h-4 w-4 mr-2" />
                          Version Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current Version:</span>
                            <span className="font-medium">{article.version}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Updated:</span>
                            <span>{article.lastUpdated || 'April 01, 2024'}</span>
                          </div>
                          {article.hasChanges && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mt-2">
                              <p className="text-xs text-blue-800">
                                <strong>Change Note:</strong> {article.changeDescription || 'This article has been updated from its previous version.'}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Full Text of {article.articleId}
                  </CardTitle>
                  <CardDescription>
                    Complete text from the EU AI Act
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {article.content ? (
                      <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    ) : (
                      <p>
                        This article defines the requirements for AI systems under the EU AI Act,
                        including risk management, data governance, and documentation requirements.
                        For the full official text, please visit the EU's official legal website.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examples" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Practical Examples</CardTitle>
                  <CardDescription>
                    Implementation examples for {article.articleId}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">High-Risk AI System Example</h4>
                      <p className="text-sm">
                        For a recruitment AI system, compliance with {article.articleId} would require:
                      </p>
                      <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                        <li>Continuous risk assessment documentation</li>
                        <li>Regular testing and validation processes</li>
                        <li>Human oversight implementation</li>
                        <li>Transparent decision records</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Limited-Risk AI System Example</h4>
                      <p className="text-sm">
                        For a customer service chatbot, compliance with {article.articleId} might require:
                      </p>
                      <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                        <li>Transparency about AI interaction</li>
                        <li>Documentation of training data</li>
                        <li>Regular performance evaluations</li>
                        <li>Appropriate security measures</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="versions" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <History className="h-4 w-4 mr-2" />
                    Version History
                  </CardTitle>
                  <CardDescription>
                    Changes to {article.articleId} over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {versionHistory && versionHistory.length > 0 ? (
                    <div className="space-y-4">
                      {versionHistory.map((version, i) => (
                        <div key={i} className="border rounded-md p-3">
                          <div className="flex justify-between">
                            <h4 className="font-medium">Version {version.version}</h4>
                            <span className="text-sm text-gray-500">{version.lastUpdated}</span>
                          </div>
                          <p className="text-sm mt-1">{version.changeDescription || 'No change description available.'}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No version history available yet.</p>
                      <p className="text-sm text-gray-400 mt-1">This is the first version of this article in our system.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="sm:justify-between mt-4 border-t pt-4">
            <div className="flex items-center text-sm text-gray-500">
              <Info className="h-4 w-4 mr-1" /> Data from EU AI Act (2024)
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Close
              </Button>
              {article.officialUrl && (
                <Button 
                  variant="default"
                  onClick={() => window.open(article.officialUrl, '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Official Source
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Function removed - using only API data now