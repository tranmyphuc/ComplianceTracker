import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AIJackProps {
  mood: 'neutral' | 'happy' | 'thinking' | 'explaining' | 'celebrating' | 'surprised';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

export function AIJack({ 
  mood = 'neutral',
  size = 'md',
  animate = false,
  className = ''
}: AIJackProps) {
  const [isAnimating, setIsAnimating] = useState(animate);
  
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
  
  // Get expression based on mood
  const getExpression = () => {
    switch (mood) {
      case 'happy':
        return (
          <>
            <path d="M20,20 C20,24 24,28 30,28 C36,28 40,24 40,20" className="stroke-current stroke-2 fill-none" />
            <circle cx="22" cy="14" r="2.5" className="fill-current" />
            <circle cx="38" cy="14" r="2.5" className="fill-current" />
          </>
        );
      case 'thinking':
        return (
          <>
            <path d="M20,27 L40,27" className="stroke-current stroke-2 fill-none" />
            <circle cx="22" cy="14" r="2.5" className="fill-current" />
            <circle cx="38" cy="14" r="2.5" className="fill-current" />
            <circle cx="46" cy="20" r="3" className="fill-current opacity-80" /> 
          </>
        );
      case 'explaining':
        return (
          <>
            <path d="M20,25 C20,29 24,30 30,30 C36,30 40,29 40,25" className="stroke-current stroke-2 fill-none" />
            <circle cx="22" cy="14" r="2.5" className="fill-current" />
            <circle cx="38" cy="14" r="2.5" className="fill-current" />
            <path d="M42,20 L48,18 L46,24" className="stroke-current stroke-2 fill-none" />
          </>
        );
      case 'celebrating':
        return (
          <>
            <path d="M20,18 C20,24 24,30 30,30 C36,30 40,24 40,18" className="stroke-current stroke-2 fill-none" />
            <path d="M22,13 C22,11 23,11 23,13" className="stroke-current stroke-2 fill-none" />
            <path d="M38,13 C38,11 39,11 39,13" className="stroke-current stroke-2 fill-none" />
            <path d="M15,10 L19,14" className="stroke-current stroke-2 fill-none" />
            <path d="M45,10 L41,14" className="stroke-current stroke-2 fill-none" />
          </>
        );
      case 'surprised':
        return (
          <>
            <circle cx="30" cy="26" r="4" className="stroke-current stroke-2 fill-none" />
            <circle cx="22" cy="14" r="3" className="stroke-current stroke-2 fill-none" />
            <circle cx="38" cy="14" r="3" className="stroke-current stroke-2 fill-none" />
          </>
        );
      case 'neutral':
      default:
        return (
          <>
            <path d="M20,26 L40,26" className="stroke-current stroke-2 fill-none" />
            <circle cx="22" cy="14" r="2.5" className="fill-current" />
            <circle cx="38" cy="14" r="2.5" className="fill-current" />
          </>
        );
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={isAnimating ? { y: [0, -5, 0, -5, 0] } : { y: 0 }}
        transition={{ duration: 1 }}
        className={`${dimensions} relative`}
      >
        <svg viewBox="0 0 60 60" className="w-full h-full text-primary">
          {/* Head */}
          <motion.circle 
            cx="30" 
            cy="30" 
            r="24" 
            className="fill-primary/10 stroke-primary stroke-2"
            animate={isAnimating ? { scale: [1, 1.03, 1, 1.03, 1] } : { scale: 1 }}
            transition={{ duration: 1 }}
          />
          
          {/* Antenna */}
          <motion.path 
            d="M30,6 L30,1" 
            className="stroke-current stroke-2"
            animate={isAnimating ? { rotate: [-5, 5, -5, 5, 0] } : { rotate: 0 }}
            transition={{ duration: 1 }}
            style={{ transformOrigin: '30px 6px' }}
          />
          <circle cx="30" cy="1" r="1" className="fill-current" />
          
          {/* Face expression based on mood */}
          {getExpression()}
          
          {/* Additional decorative elements */}
          <path d="M12,25 L14,25" className="stroke-current stroke-2 opacity-70" />
          <path d="M46,25 L48,25" className="stroke-current stroke-2 opacity-70" />
          <path d="M21,42 C22,46 38,46 39,42" className="stroke-current stroke-1 opacity-50 fill-none" />
        </svg>
        
        {/* Animated accent elements */}
        <AnimatePresence>
          {isAnimating && mood === 'thinking' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/6"
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M5,10 L15,10 M10,5 L10,15" className="stroke-primary stroke-2" />
              </svg>
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
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M8,0 L9,6 L16,8 L9,10 L8,16 L7,10 L0,8 L7,6 Z" className="fill-yellow-400" />
                </svg>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute -top-2 -left-2"
              >
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path d="M7,0 L8,5 L14,7 L8,9 L7,14 L6,9 L0,7 L6,5 Z" className="fill-green-400" />
                </svg>
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
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M0,12 L16,12 M11,6 L17,12 L11,18" className="stroke-primary stroke-2 fill-none" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}