import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import AIJackImage from "../../assets/ai-jack-image.png";
import { SmileIcon, BrainCircuit, ClipboardList, ZapIcon, PartyPopper } from "lucide-react";

type AIJackMood = "happy" | "thinking" | "explaining" | "surprised" | "celebrating";

interface AIJackProps {
  mood?: AIJackMood;
  message?: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export function AIJack({ 
  mood = "happy", 
  message, 
  size = "md",
  animate = true 
}: AIJackProps) {
  const [typedMessage, setTypedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Size classes
  const sizeClasses = {
    sm: "w-28 h-28",
    md: "w-40 h-40",
    lg: "w-52 h-52"
  };
  
  // Message bubble size
  const messageBubbleSize = {
    sm: "max-w-[180px]",
    md: "max-w-[250px]",
    lg: "max-w-[320px]"
  };
  
  // Typing effect for the message
  useEffect(() => {
    if (!message) return;
    
    setTypedMessage("");
    setIsTyping(true);
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < message.length) {
        setTypedMessage((prev) => prev + message[index]);
        index++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 30);
    
    return () => clearInterval(timer);
  }, [message]);
  
  // Motion variants for animations
  const containerVariants = {
    idle: {},
    animate: {
      y: [0, -10, 0],
      transition: {
        y: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }
      }
    }
  };
  
  const messageVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      {/* Message bubble */}
      {message && (
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            className={`relative mb-4 ${messageBubbleSize[size]}`}
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Card className="bg-white p-3 rounded-lg shadow-md border-0">
              <p className="text-sm">
                {animate ? typedMessage : message}
                {animate && isTyping && (
                  <span className="inline-block animate-pulse">▋</span>
                )}
              </p>
            </Card>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-md z-0"></div>
          </motion.div>
        </AnimatePresence>
      )}
      
      {/* AI Jack character */}
      <motion.div
        className="relative"
        variants={containerVariants}
        animate={animate ? "animate" : "idle"}
      >
        <div className={`rounded-full overflow-hidden ${sizeClasses[size]}`}>
          <img 
            src={AIJackImage} 
            alt="AI Jack"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Mood indicator */}
        <div className="absolute bottom-0 right-0 rounded-full p-1.5 bg-white shadow-md">
          {mood === "happy" && (
            <SmileIcon className="w-5 h-5 text-green-500" />
          )}
          {mood === "thinking" && (
            <BrainCircuit className="w-5 h-5 text-blue-500" />
          )}
          {mood === "explaining" && (
            <ClipboardList className="w-5 h-5 text-purple-500" />
          )}
          {mood === "surprised" && (
            <ZapIcon className="w-5 h-5 text-amber-500" />
          )}
          {mood === "celebrating" && (
            <PartyPopper className="w-5 h-5 text-pink-500" />
          )}
        </div>
      </motion.div>
      
      {/* AI Jack label */}
      <div className="mt-2 text-center">
        <p className="font-medium text-sm">AI JACK</p>
        <p className="text-xs text-gray-500">Your compliance guide</p>
      </div>
    </div>
  );
}