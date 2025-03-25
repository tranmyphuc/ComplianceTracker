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
  category: 'risk' | 'documentation' | 'governance' | 'implementation' | 'audit' | 'general';
  relevantArticles?: string[];
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  dismissible?: boolean;
  learnMoreLink?: string;
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
            <h4 className="font-semibold text-sm mb-2">{tip.title}</h4>
            <p className="text-sm text-muted-foreground mb-3">{tip.content}</p>
            
            {/* Relevant Articles */}
            {tip.relevantArticles && tip.relevantArticles.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground font-medium mb-1">Relevant Articles:</p>
                <div className="flex flex-wrap gap-1">
                  {tip.relevantArticles.map((article) => (
                    <Badge key={article} variant="outline" className="text-xs">
                      {article}
                    </Badge>
                  ))}
                </div>
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