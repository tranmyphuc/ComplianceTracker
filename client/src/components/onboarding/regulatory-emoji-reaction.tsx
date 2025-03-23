import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Define emoji reactions and their meanings
const emojiReactions = [
  { emoji: "😊", label: "Clear", description: "This regulation is easy to understand" },
  { emoji: "🤔", label: "Confusing", description: "I'm not sure what this means" },
  { emoji: "😰", label: "Concerned", description: "This requirement seems challenging" },
  { emoji: "💡", label: "Insightful", description: "This gives me a good idea" },
  { emoji: "⚠️", label: "Important", description: "I should pay attention to this" }
];

interface RegulatoryEmojiReactionProps {
  articleTitle: string;
  articleText: string;
  onReactionSubmit?: (reaction: string, comment: string) => void;
}

export function RegulatoryEmojiReaction({
  articleTitle,
  articleText,
  onReactionSubmit
}: RegulatoryEmojiReactionProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  
  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
  };
  
  // Handle comment submission
  const handleSubmit = () => {
    if (selectedEmoji && onReactionSubmit) {
      onReactionSubmit(selectedEmoji, comment);
    }
    setShowThankYou(true);
    
    // Reset after a delay
    setTimeout(() => {
      setSelectedEmoji(null);
      setComment("");
      setShowThankYou(false);
    }, 3000);
  };

  return (
    <Card className="w-full max-w-xl mx-auto overflow-hidden border-0 shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
        <CardTitle className="text-xl">Regulation Feedback</CardTitle>
        <CardDescription className="text-white/80">
          How do you feel about this article?
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="font-medium text-sm text-gray-900">{articleTitle}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-3">{articleText}</p>
        </div>
        
        <div className="my-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Your reaction:</h4>
          
          <AnimatePresence mode="wait">
            {!showThankYou ? (
              <motion.div 
                className="grid grid-cols-5 gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {emojiReactions.map((reaction) => (
                  <motion.div
                    key={reaction.emoji}
                    className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-colors
                      ${selectedEmoji === reaction.emoji 
                        ? 'bg-purple-100 border-2 border-purple-400' 
                        : 'hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    onClick={() => handleEmojiSelect(reaction.emoji)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl">{reaction.emoji}</span>
                    <span className="text-xs mt-1 text-center">{reaction.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="flex flex-col items-center justify-center py-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <span className="text-4xl mb-2">🙏</span>
                <h3 className="text-lg font-medium text-gray-900">Thank you for your feedback!</h3>
                <p className="text-sm text-gray-600 text-center mt-1">
                  Your input helps us improve the regulatory guidance.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {selectedEmoji && !showThankYou && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional comments (optional):
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              rows={3}
              placeholder="Share your thoughts about this regulation..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </motion.div>
        )}
      </CardContent>
      
      {selectedEmoji && !showThankYou && (
        <CardFooter className="border-t p-4 bg-gray-50">
          <Button 
            onClick={handleSubmit}
            className="ml-auto bg-purple-600 hover:bg-purple-700 text-white"
          >
            Submit Feedback
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}