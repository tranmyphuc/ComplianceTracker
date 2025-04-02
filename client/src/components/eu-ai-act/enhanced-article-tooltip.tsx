import React, { useState, useEffect } from "react";
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { AlertTriangle, Info, History, Lightbulb, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Define the interface for article data
interface ArticleData {
  articleId: string;
  title: string;
  content: string;
  riskLevel?: "prohibited" | "high" | "limited" | "minimal" | "unknown";
  keyPoints?: string[];
  officialUrl?: string;
  version?: string;
  lastUpdated?: string;
  changeDescription?: string;
  exampleSummary?: string;
  exampleDetails?: string;
  imageUrl?: string;
}

interface EnhancedArticleTooltipProps {
  articleId: string;
  children: React.ReactNode;
  showExamples?: boolean;
  showVersions?: boolean;
}

/**
 * Enhanced tooltip for EU AI Act articles with tabs for details, examples and version history
 */
export function EnhancedArticleTooltip({
  articleId,
  children,
  showExamples = true,
  showVersions = true
}: EnhancedArticleTooltipProps) {
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!articleId) return;

    const fetchArticleData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/knowledge/articles/by-article-id/${encodeURIComponent(articleId)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch article data: ${response.statusText}`);
        }
        
        const data = await response.json();
        setArticleData(data);
      } catch (err) {
        console.error("Error fetching article data:", err);
        setError("Failed to load article information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [articleId]);

  // Helper function to render risk level badge
  const renderRiskLevelBadge = (riskLevel?: string) => {
    if (!riskLevel) return null;
    
    const variants: Record<string, { color: string, icon: React.ReactNode }> = {
      prohibited: { color: "bg-red-500 hover:bg-red-600", icon: <AlertTriangle className="h-3 w-3 mr-1" /> },
      high: { color: "bg-orange-500 hover:bg-orange-600", icon: <AlertTriangle className="h-3 w-3 mr-1" /> },
      limited: { color: "bg-yellow-500 hover:bg-yellow-600", icon: <Info className="h-3 w-3 mr-1" /> },
      minimal: { color: "bg-green-500 hover:bg-green-600", icon: <Info className="h-3 w-3 mr-1" /> },
      unknown: { color: "bg-gray-500 hover:bg-gray-600", icon: <Info className="h-3 w-3 mr-1" /> }
    };
    
    const { color, icon } = variants[riskLevel.toLowerCase()] || variants.unknown;
    
    return (
      <Badge className={`${color} text-white flex items-center text-xs font-medium ml-2`}>
        {icon}
        {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
      </Badge>
    );
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="underline decoration-dotted cursor-help text-primary">
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-[400px] p-0">
        <Tabs defaultValue="overview">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {showExamples && <TabsTrigger value="examples">Examples</TabsTrigger>}
            {showVersions && <TabsTrigger value="versions">Versions</TabsTrigger>}
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="p-4">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : error ? (
              <div className="text-red-500 p-4">{error}</div>
            ) : articleData ? (
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold">{articleData.title || articleData.articleId}</h3>
                  {renderRiskLevelBadge(articleData.riskLevel)}
                </div>
                
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: articleData.content }} 
                />
                
                {articleData.keyPoints && articleData.keyPoints.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-medium text-sm mb-1">Key Points:</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {articleData.keyPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {articleData.officialUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 text-xs"
                    onClick={() => window.open(articleData.officialUrl, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Official Text
                  </Button>
                )}
              </div>
            ) : (
              <div className="p-4 text-muted-foreground">No article information available.</div>
            )}
          </TabsContent>
          
          {/* Examples Tab */}
          {showExamples && (
            <TabsContent value="examples" className="p-4">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : error ? (
                <div className="text-red-500 p-4">{error}</div>
              ) : articleData ? (
                <div>
                  {articleData.exampleSummary || articleData.exampleDetails ? (
                    <>
                      <div className="flex items-center mb-3">
                        <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                        <h3 className="text-md font-semibold">Practical Examples</h3>
                      </div>
                      
                      {articleData.exampleSummary && (
                        <p className="text-sm mb-2">{articleData.exampleSummary}</p>
                      )}
                      
                      {articleData.exampleDetails && (
                        <Card className="mt-2">
                          <CardHeader className="p-3 pb-1">
                            <CardTitle className="text-sm">Detailed Example</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0 text-sm">
                            <div 
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: articleData.exampleDetails }} 
                            />
                          </CardContent>
                        </Card>
                      )}
                      
                      {articleData.imageUrl && (
                        <div className="mt-3">
                          <img 
                            src={articleData.imageUrl} 
                            alt={`Example for ${articleData.articleId}`} 
                            className="w-full rounded-md border border-border"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-4 text-muted-foreground">No examples available for this article.</div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-muted-foreground">No examples available.</div>
              )}
            </TabsContent>
          )}
          
          {/* Versions Tab */}
          {showVersions && (
            <TabsContent value="versions" className="p-4">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : error ? (
                <div className="text-red-500 p-4">{error}</div>
              ) : articleData ? (
                <div>
                  <div className="flex items-center mb-3">
                    <History className="h-4 w-4 mr-2 text-blue-500" />
                    <h3 className="text-md font-semibold">Version History</h3>
                  </div>
                  
                  <div className="text-sm">
                    <div className="border rounded-md p-3 mb-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Current Version:</span>
                        <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-0.5">
                          {articleData.version || '1.0'}
                        </span>
                      </div>
                      {articleData.lastUpdated && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Last updated: {new Date(articleData.lastUpdated).toLocaleDateString()}
                        </div>
                      )}
                      {articleData.changeDescription && (
                        <div className="mt-2 text-xs border-t pt-2">
                          <div className="font-medium mb-1">Changes:</div>
                          <p>{articleData.changeDescription}</p>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      The EU AI Act is a living document and may be updated. Always refer to the official 
                      source for the most current information.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-muted-foreground">No version history available.</div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </HoverCardContent>
    </HoverCard>
  );
}