import { useState, useEffect } from 'react';
import { 
  LightbulbIcon, 
  X as XIcon, 
  ChevronRight as ChevronRightIcon,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown as ThumbsDownIcon,
  Minimize2 as MinimizeIcon,
  Maximize2 as MaximizeIcon,
  Clock as ClockIcon
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
  contentVietnamese?: string; // Vietnamese translation of the content
  category: 'risk' | 'documentation' | 'governance' | 'implementation' | 'audit' | 'general';
  relevantArticles?: string[];
  articleLinks?: {[key: string]: string}; // Map of article numbers to specific URLs
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  dismissible?: boolean;
  learnMoreLink?: string;
  officialSourceUrl?: string; // URL to the official EU AI Act source
  lastUpdated?: string; // Date when the tip was last updated
  autoCloseTimeout?: number; // Auto-close timeout in seconds
  jackStyle?: boolean; // Apply Jack's style
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
  autoDismissDelay = 20000, // Changed to 20 seconds as requested
  jackStyle = false,
}: TipBubbleProps) {
  const [visible, setVisible] = useState<boolean>(true);
  const [feedbackGiven, setFeedbackGiven] = useState<boolean>(false);
  const [minimized, setMinimized] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState(tip.autoCloseTimeout || 0);
  const [language, setLanguage] = useState<'en' | 'de' | 'vi'>('en');
  const [animated, setAnimated] = useState(false);


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

  useEffect(() => {
    if (animate) {
      // Add entrance animation delay
      const timer = setTimeout(() => {
        setAnimated(true);
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setAnimated(true);
    }
  }, [animate]);

  // Auto-close timer effect
  useEffect(() => {
    if (tip.autoCloseTimeout && secondsLeft > 0 && !minimized) {
      const timer = setTimeout(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);

      if (secondsLeft === 1 && onDismiss) {
        onDismiss(tip.id);
      }

      return () => clearTimeout(timer);
    }
  }, [secondsLeft, minimized, onDismiss, tip.id, tip.autoCloseTimeout]);
  
  // Force auto-close after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (visible && onDismiss) {
        setVisible(false);
        onDismiss(tip.id);
      }
    }, 3000); // 3 seconds
    
    return () => clearTimeout(timer);
  }, [visible, onDismiss, tip.id]);

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) {
      onDismiss(tip.id);
    }
  };

  const handleMinimize = () => {
    setMinimized(true);
  };

  const handleMaximize = () => {
    setMinimized(false);
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

  // Function to get content based on selected language
  const getContent = () => {
    switch (language) {
      case 'de':
        return tip.contentGerman || tip.content;
      case 'vi':
        return tip.contentVietnamese || tip.content;
      default:
        return tip.content;
    }
  };

  // Apply Jack's style
  const cardStyle = (jackStyle || tip.jackStyle)
    ? "overflow-hidden shadow-lg border-amber-300 border-2"
    : "overflow-hidden shadow-lg border-primary/20";

  const headerStyle = (jackStyle || tip.jackStyle)
    ? "bg-gradient-to-r from-amber-100 to-amber-50 px-4 py-3 flex items-center justify-between"
    : "bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 flex items-center justify-between";

  const iconStyle = (jackStyle || tip.jackStyle)
    ? "h-5 w-5 text-amber-500"
    : "h-5 w-5 text-primary";

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-50 max-w-sm ${animationClass} ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ maxWidth: '350px' }}
    >
      <Card className={cardStyle}>
        <div className="relative">
          {/* Header */}
          <div className={headerStyle}>
            <div className="flex items-center gap-2">
              {jackStyle || tip.jackStyle ? (
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-amber-300">
                  <img 
                    src="/assets/1000048340-modified.png" 
                    alt="Jack from SGH ASIA" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <LightbulbIcon className={iconStyle} />
              )}
              <span className="font-medium text-sm">
                {jackStyle || tip.jackStyle ? 'Jack\'s Compliance Tip' : 'Compliance Tip'}
              </span>
            </div>

            <Badge className={`text-xs ${getCategoryColor(tip.category)}`}>
              {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
            </Badge>

            <div className="absolute top-2 right-2 flex">
              {/* Minimize/Maximize Button */}
              {tip.autoCloseTimeout && secondsLeft > 0 && (
                <div className="flex items-center mr-1">
                  <ClockIcon className="h-3 w-3 mr-1 opacity-70" />
                  <span className="text-xs opacity-70">{secondsLeft}s</span>
                </div>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full mr-1"
                      onClick={minimized ? handleMaximize : handleMinimize}
                    >
                      {minimized ? (
                        <MaximizeIcon className="h-3.5 w-3.5" />
                      ) : (
                        <MinimizeIcon className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{minimized ? 'Maximize' : 'Minimize'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Close Button */}
              {tip.dismissible !== false && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={handleDismiss}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Content - Show full or minimized version */}
          {minimized ? (
            <CardContent className="p-2">
              {/* Minimized view - just show title and relevant articles */}
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-xs text-amber-800 truncate max-w-[180px]">{tip.title}</h4>
                
                {/* Relevant Articles (condensed) */}
                {tip.relevantArticles && tip.relevantArticles.length > 0 && (
                  <div className="flex flex-wrap gap-1 ml-2">
                    {tip.relevantArticles.slice(0, 3).map((article) => {
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
                    {tip.relevantArticles.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{tip.relevantArticles.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          ) : (
            <CardContent className="p-4">
              <div className="flex gap-2 mb-2">
                <Button 
                  variant={language === 'en' ? "default" : "outline"} 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={() => setLanguage('en')}
                >
                  EN
                </Button>
                <Button 
                  variant={language === 'de' ? "default" : "outline"} 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={() => setLanguage('de')}
                  disabled={!tip.contentGerman}
                >
                  DE
                </Button>
                <Button 
                  variant={language === 'vi' ? "default" : "outline"} 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={() => setLanguage('vi')}
                  disabled={!tip.contentVietnamese}
                >
                  VI
                </Button>
              </div>
              <h4 className="font-semibold text-sm mb-3 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md">{tip.title}</h4>

              {/* Content with Highlighting */}
              <div className="px-2 py-1.5 bg-yellow-50 border-l-2 border-yellow-300 mb-3 rounded-sm">
                <p className="text-sm mb-1">{getContent()}</p>
              </div>


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
          )}
        </div>
      </Card>
    </div>
  );
}