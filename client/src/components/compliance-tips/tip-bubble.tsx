import { useState, useEffect } from 'react';
import { 
  LightbulbIcon, 
  X as XIcon, 
  ChevronRight as ChevronRightIcon,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown as ThumbsDownIcon
} from 'lucide-react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface ComplianceTip {
  id: string;
  title: string;
  content: string;
  contentGerman?: string; // German translation of the content
  category: 'risk' | 'documentation' | 'governance' | 'implementation' | 'audit' | 'general';
  relevantArticles?: string[];
  articleLinks?: {[key: string]: string}; // Map of article numbers to specific URLs
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  dismissible?: boolean;
  learnMoreLink?: string;
  officialSourceUrl?: string; // URL to the official EU AI Act source
  lastUpdated?: string; // Date when the tip was last updated
}

interface TipBubbleProps {
  tip: ComplianceTip;
  position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left' | 'center';
  onDismiss?: (tipId: string) => void;
  onFeedback?: (tipId: string, isHelpful: boolean) => void;
  animate?: boolean;
  autoDismiss?: boolean;
  autoDismissDelay?: number;
  jackStyle?: boolean;
}

// Category to color mapping
const categoryColors = {
  risk: 'bg-red-100 text-red-800',
  documentation: 'bg-blue-100 text-blue-800',
  governance: 'bg-purple-100 text-purple-800',
  implementation: 'bg-green-100 text-green-800',
  audit: 'bg-amber-100 text-amber-800',
  general: 'bg-gray-100 text-gray-800',
};

const getCategoryColor = (category: ComplianceTip['category']) => {
  return categoryColors[category] || categoryColors.general;
};

export function TipBubble({
  tip,
  position = 'bottom-right',
  onDismiss,
  onFeedback,
  animate = true,
  autoDismiss = false,
  autoDismissDelay = 15000,
  jackStyle = false,
}: TipBubbleProps) {
  const [visible, setVisible] = useState<boolean>(true);
  const [feedbackGiven, setFeedbackGiven] = useState<boolean>(false);
  
  // Handle auto-dismiss
  useEffect(() => {
    if (autoDismiss && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) {
          onDismiss(tip.id);
        }
      }, autoDismissDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, autoDismissDelay, visible, tip.id, onDismiss]);
  
  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) {
      onDismiss(tip.id);
    }
  };
  
  const handleFeedback = (isHelpful: boolean) => {
    if (onFeedback && !feedbackGiven) {
      onFeedback(tip.id, isHelpful);
      setFeedbackGiven(true);
    }
  };
  
  if (!visible) return null;
  
  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-left': 'bottom-4 left-4',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
  };
  
  const animationClass = animate 
    ? 'animate-fade-in-up transition-all duration-300 ease-in-out' 
    : '';
  
  return (
    <div 
      className={`fixed ${positionClasses[position]} z-50 max-w-sm ${animationClass}`}
      style={{ maxWidth: '350px' }}
    >
      <Card className={`shadow-lg border overflow-hidden ${jackStyle ? 'border-primary' : ''}`}>
        <div className="relative">
          {/* Header */}
          <div className={`p-3 flex items-center justify-between ${jackStyle ? 'bg-primary/10' : 'bg-muted/30'}`}>
            <div className="flex items-center gap-2">
              {jackStyle ? (
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-primary">
                  <img 
                    src="/assets/1000048340-modified.png" 
                    alt="Jack from SGH ASIA" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <LightbulbIcon className={`h-5 w-5 ${jackStyle ? 'text-primary' : 'text-amber-500'}`} />
              )}
              <span className="font-medium text-sm">
                {jackStyle ? 'Jack\'s Compliance Tip' : 'Compliance Tip'}
              </span>
            </div>
            
            <Badge className={`text-xs ${getCategoryColor(tip.category)}`}>
              {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
            </Badge>
            
            {tip.dismissible !== false && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 absolute top-2 right-2 rounded-full"
                onClick={handleDismiss}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Content */}
          <CardContent className="p-4">
            <h4 className="font-semibold text-sm mb-3 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md">{tip.title}</h4>
            
            {/* English Content with Highlighting */}
            <div className="px-2 py-1.5 bg-yellow-50 border-l-2 border-yellow-300 mb-3 rounded-sm">
              <p className="text-sm mb-1">{tip.content}</p>
            </div>
            
            {/* German Translation if available */}
            {tip.contentGerman && (
              <div className="mb-3 px-2 py-1.5 bg-blue-50 border-l-2 border-blue-300 rounded-sm">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Deutsche Übersetzung:</p>
                <p className="text-sm">{tip.contentGerman}</p>
              </div>
            )}
            
            {/* Relevant Articles with Links */}
            {tip.relevantArticles && tip.relevantArticles.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground font-medium mb-1">Relevant Articles:</p>
                <div className="flex flex-wrap gap-1">
                  {tip.relevantArticles.map((article) => {
                    // If we have a specific article link, use it; otherwise use the general article link
                    const articleUrl = tip.articleLinks?.[article] || 
                                      `https://artificialintelligenceact.eu/the-act/${article.toLowerCase().replace(/\s+/g, '-')}/`;
                    
                    return (
                      <a 
                        key={article}
                        href={articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline"
                      >
                        <Badge variant="outline" className="text-xs hover:bg-primary-50 cursor-pointer transition-colors">
                          {article}
                        </Badge>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Official Source and Last Updated */}
            {(tip.officialSourceUrl || tip.lastUpdated) && (
              <div className="mb-3 text-xs">
                {tip.lastUpdated && (
                  <p className="text-muted-foreground mb-1">
                    <span className="font-medium">Last Updated:</span> {tip.lastUpdated}
                  </p>
                )}
                {tip.officialSourceUrl && (
                  <a 
                    href={tip.officialSourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    <span>Official EU AI Act Source</span>
                    <ChevronRightIcon className="ml-1 h-3 w-3" />
                  </a>
                )}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex justify-between items-center mt-2">
              {tip.learnMoreLink && (
                <Button variant="link" size="sm" className="p-0 h-8" asChild>
                  <a href={tip.learnMoreLink} target="_blank" rel="noopener noreferrer">
                    <span>Learn more</span>
                    <ChevronRightIcon className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              )}
              
              {onFeedback && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground mr-1">
                    {feedbackGiven ? 'Thanks for your feedback!' : 'Was this helpful?'}
                  </span>
                  {!feedbackGiven && (
                    <>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-green-600 hover:bg-green-50"
                              onClick={() => handleFeedback(true)}
                            >
                              <ThumbsUpIcon className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Yes, this was helpful</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleFeedback(false)}
                            >
                              <ThumbsDownIcon className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>No, this wasn't helpful</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}