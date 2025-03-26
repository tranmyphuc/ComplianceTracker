import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, Languages, Lightbulb, HelpCircle, Globe } from "lucide-react";

interface AIJackProps {
  mood: 'neutral' | 'happy' | 'thinking' | 'explaining' | 'celebrating' | 'surprised';
  message?: string;
  germanMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
  showPracticePrompt?: boolean;
  onPracticeClick?: () => void;
  language?: 'en' | 'de';
  allowLanguageSwitch?: boolean;
  onLanguageChange?: (lang: 'en' | 'de') => void;
}

export function AIJack({ 
  mood = 'neutral',
  message,
  germanMessage,
  size = 'md',
  animate = false,
  className = '',
  showPracticePrompt = false,
  onPracticeClick,
  language = 'en',
  allowLanguageSwitch = false,
  onLanguageChange
}: AIJackProps) {
  const [isAnimating, setIsAnimating] = useState(animate);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'de'>(language);
  
  // Translations for UI elements
  const translations = {
    en: {
      practiceHeading: "Practice This Concept",
      practiceDescription: "Apply your knowledge with interactive practice exercises",
      tryNow: "Try Now",
      learnMore: "Learn More",
      excellent: "Excellent!"
    },
    de: {
      practiceHeading: "Üben Sie dieses Konzept",
      practiceDescription: "Wenden Sie Ihr Wissen mit interaktiven Übungen an",
      tryNow: "Jetzt versuchen",
      learnMore: "Mehr erfahren",
      excellent: "Ausgezeichnet!"
    }
  };
  
  // Reset animation state periodically if animation is enabled
  useEffect(() => {
    if (!animate) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [animate]);
  
  // Determine size dimensions
  const dimensions = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }[size];

  // Handle language change
  const handleLanguageChange = (lang: 'en' | 'de') => {
    setCurrentLanguage(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };
  
  // Use Jack's image instead of SVG expressions
  return (
    <div className={`${className}`}>
      <div className="flex flex-col items-center">
        {/* Language selector */}
        {allowLanguageSwitch && (
          <div className="mb-2 flex items-center justify-center gap-2">
            <button 
              onClick={() => handleLanguageChange('en')}
              className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${currentLanguage === 'en' ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'}`}
            >
              <Globe className="h-3 w-3" /> EN
            </button>
            <button 
              onClick={() => handleLanguageChange('de')}
              className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${currentLanguage === 'de' ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'}`}
            >
              <Globe className="h-3 w-3" /> DE
            </button>
          </div>
        )}
        
        {/* AI Jack character */}
        <motion.div
          animate={isAnimating ? { y: [0, -5, 0, -5, 0] } : { y: 0 }}
          transition={{ duration: 1 }}
          className={`${dimensions} relative`}
        >
          <div className={`w-full h-full rounded-full overflow-hidden border-2 border-primary bg-primary/5 flex items-center justify-center relative`}>
            <motion.img
              src="/assets/1000048340-modified.png"
              alt={`Jack with ${mood} expression`}
              className="w-full h-full object-cover"
              animate={isAnimating ? { scale: [1, 1.03, 1, 1.03, 1] } : { scale: 1 }}
              transition={{ duration: 1 }}
            />
            
            {/* Animated expression overlays based on mood */}
            <AnimatePresence>
              {mood === 'thinking' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-0 right-0 p-1 bg-primary/30 rounded-full"
                >
                  <Lightbulb className="h-4 w-4 text-white" />
                </motion.div>
              )}
              
              {mood === 'celebrating' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-0 left-0 right-0 flex justify-center"
                >
                  <div className="px-2 py-0.5 bg-yellow-500/80 text-white text-xs rounded-full">
                    {translations[currentLanguage].excellent}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Animated accent elements */}
          <AnimatePresence>
            {isAnimating && mood === 'thinking' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute -top-2 right-0"
              >
                <div className="p-1 bg-white rounded-full shadow-md">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                </div>
              </motion.div>
            )}
            
            {isAnimating && mood === 'celebrating' && (
              <>
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute -top-1 -right-1"
                >
                  <div className="p-1 bg-yellow-500 rounded-full text-white text-xs">✨</div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute -top-2 -left-2"
                >
                  <div className="p-1 bg-green-500 rounded-full text-white text-xs">🎉</div>
                </motion.div>
              </>
            )}
            
            {isAnimating && mood === 'explaining' && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="absolute top-1/4 right-0 transform translate-x-full"
              >
                <div className="p-1 bg-primary/80 rounded-full shadow-md">
                  <svg width="12" height="12" viewBox="0 0 24 24" className="text-white">
                    <path d="M0,12 L16,12 M11,6 L17,12 L11,18" className="stroke-current stroke-2 fill-none" />
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Message speech bubble */}
        {(message || germanMessage) && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 bg-white/90 border border-primary/20 rounded-lg p-4 relative w-full max-w-md text-center text-sm md:text-base shadow-sm"
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-white border-t border-l border-primary/20"></div>
            {currentLanguage === 'en' ? message : (germanMessage || message)}
          </motion.div>
        )}
        
        {/* Practice prompt */}
        {showPracticePrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 w-full max-w-md"
          >
            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium mb-1">Practice This Concept</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Apply your knowledge with interactive practice exercises
                    </p>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="text-xs flex items-center gap-1"
                        onClick={onPracticeClick}
                      >
                        Try Now <Lightbulb className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-xs flex items-center gap-1"
                      >
                        Learn More <HelpCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}