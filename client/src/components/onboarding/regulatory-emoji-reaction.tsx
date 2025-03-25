import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AIJack } from "./ai-jack";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Search, 
  AlertTriangle, 
  XCircle,
  Send
} from "lucide-react";

// Keep original interface for backward compatibility
interface RegulatoryEmojiReactionProps {
  sentiment?: 'excellent' | 'good' | 'neutral' | 'warning' | 'critical';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
  
  // Extended props for new functionality
  articleTitle?: string;
  articleText?: string;
  onReactionSubmit?: (reaction: string, comment: string) => void;
}

export function RegulatoryEmojiReaction({
  sentiment = 'neutral',
  size = 'md',
  animate = true,
  className = '',
  articleTitle,
  articleText,
  onReactionSubmit
}: RegulatoryEmojiReactionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  
  // Map sentiment to AIJack mood
  const getMascotMood = () => {
    switch (sentiment) {
      case 'excellent': return 'celebrating';
      case 'good': return 'happy';
      case 'neutral': return 'neutral';
      case 'warning': return 'thinking';
      case 'critical': return 'surprised';
      default: return 'neutral';
    }
  };

  // If we're using the legacy emoji-only version
  if (!articleTitle && !articleText) {
    // Set base size for AIJack based on emoji size
    const jackSizes = {
      sm: 'sm',
      md: 'sm',
      lg: 'md'
    };
    
    return (
      <div className={className}>
        <AIJack 
          mood={getMascotMood() as any} 
          size={jackSizes[size] as any} 
          animate={animate}
        />
      </div>
    );
  }
  
  // Otherwise use the new expanded article reaction UI
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className={`w-full border rounded-lg overflow-hidden shadow-sm ${className}`}
      >
        <Card className="border-0">
          <CardHeader className="pb-3 pt-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              {articleTitle || "EU AI Act Regulation"}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pb-3">
            <div className="text-sm text-muted-foreground">
              {articleText || "Key regulatory information about EU AI Act compliance."}
            </div>
            
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="text-sm font-medium mb-2">How useful was this information?</div>
                    <div className="flex gap-2">
                      {[
                        { value: 'very-useful', icon: <ThumbsUp className="h-4 w-4" />, label: 'Very Useful', color: 'bg-green-100 text-green-700 border-green-200' },
                        { value: 'somewhat-useful', icon: <Search className="h-4 w-4" />, label: 'Need More Info', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                        { value: 'not-useful', icon: <ThumbsDown className="h-4 w-4" />, label: 'Not Useful', color: 'bg-red-100 text-red-700 border-red-200' },
                        { value: 'confusing', icon: <AlertTriangle className="h-4 w-4" />, label: 'Confusing', color: 'bg-amber-100 text-amber-700 border-amber-200' }
                      ].map(option => (
                        <Button
                          key={option.value}
                          type="button"
                          size="sm"
                          variant="outline"
                          className={`${selectedReaction === option.value ? option.color : ''}`}
                          onClick={() => setSelectedReaction(option.value)}
                        >
                          <span className="flex items-center gap-1 text-xs">
                            {option.icon}
                            {option.label}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Additional feedback (optional)</div>
                    <Textarea
                      placeholder="Share your thoughts or questions about this regulation..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="resize-none h-20"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
          
          <CardFooter className="pt-0 flex justify-between">
            {!isExpanded ? (
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs"
                onClick={() => setIsExpanded(true)}
              >
                Provide Feedback
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs"
                  onClick={() => setIsExpanded(false)}
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="text-xs"
                  disabled={!selectedReaction}
                  onClick={() => {
                    if (onReactionSubmit && selectedReaction) {
                      onReactionSubmit(selectedReaction, comment);
                      setIsExpanded(false);
                      setSelectedReaction(null);
                      setComment('');
                    }
                  }}
                >
                  <Send className="h-3 w-3 mr-1" />
                  Submit Feedback
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
        
        {/* Jack character appears based on reaction */}
        {selectedReaction && (
          <div className="mt-4 flex justify-center">
            <AIJack 
              mood={
                selectedReaction === 'very-useful' ? 'celebrating' :
                selectedReaction === 'somewhat-useful' ? 'thinking' :
                selectedReaction === 'not-useful' ? 'neutral' :
                'surprised'
              }
              message={
                selectedReaction === 'very-useful' ? "I'm glad this information was helpful! The more you understand the regulations, the easier compliance becomes." :
                selectedReaction === 'somewhat-useful' ? "Still have questions? That's okay! The EU AI Act is complex - check the Knowledge Center for more details." :
                selectedReaction === 'not-useful' ? "I'm sorry this wasn't useful. Let me know how I can improve the explanations!" :
                "I understand this might be confusing. Let's break it down further in the Knowledge Center."
              }
              size="md"
              animate={true}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}