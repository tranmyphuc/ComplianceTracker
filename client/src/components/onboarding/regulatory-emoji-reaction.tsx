import { motion, AnimatePresence } from "framer-motion";

interface RegulatoryEmojiReactionProps {
  sentiment: 'excellent' | 'good' | 'neutral' | 'warning' | 'critical';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

export function RegulatoryEmojiReaction({
  sentiment,
  size = 'md',
  animate = true,
  className = ''
}: RegulatoryEmojiReactionProps) {
  // Determine the emoji based on sentiment
  const getEmoji = () => {
    switch (sentiment) {
      case 'excellent':
        return { emoji: '🌟', bg: 'bg-green-100', text: 'text-green-700' };
      case 'good':
        return { emoji: '👍', bg: 'bg-blue-100', text: 'text-blue-700' };
      case 'neutral':
        return { emoji: '👀', bg: 'bg-amber-100', text: 'text-amber-700' };
      case 'warning':
        return { emoji: '⚠️', bg: 'bg-orange-100', text: 'text-orange-700' };
      case 'critical':
        return { emoji: '🔴', bg: 'bg-red-100', text: 'text-red-700' };
      default:
        return { emoji: '👀', bg: 'bg-amber-100', text: 'text-amber-700' };
    }
  };
  
  // Determine size dimensions
  const dimensions = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  }[size];
  
  const { emoji, bg, text } = getEmoji();
  
  return (
    <AnimatePresence>
      <motion.div
        initial={animate ? { scale: 0, rotate: -45 } : { scale: 1, rotate: 0 }}
        animate={animate ? { scale: [0, 1.2, 1], rotate: [-45, 15, 0] } : { scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.2 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
        className={`${dimensions} ${bg} ${text} rounded-full flex items-center justify-center font-bold ${className} shadow-sm border`}
      >
        <span role="img" aria-label={sentiment}>{emoji}</span>
      </motion.div>
    </AnimatePresence>
  );
}