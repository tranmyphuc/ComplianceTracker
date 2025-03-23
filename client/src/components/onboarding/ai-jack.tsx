import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainIcon, BotIcon, CheckCircleIcon, AlertCircleIcon, HelpCircleIcon, InfoIcon } from "lucide-react";

type MascotMood = "happy" | "thinking" | "celebrating" | "explaining" | "warning" | "question";

interface AIJackProps {
  mood?: MascotMood;
  message?: string;
  animate?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AIJack({ 
  mood = "happy", 
  message, 
  animate = true,
  size = "md",
  className = "" 
}: AIJackProps) {
  const [currentMood, setCurrentMood] = useState<MascotMood>(mood);
  const [blinking, setBlinking] = useState(false);

  // Random blinking effect
  useEffect(() => {
    if (animate) {
      const blinkInterval = setInterval(() => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 200);
      }, Math.random() * 3000 + 2000);
      
      return () => clearInterval(blinkInterval);
    }
  }, [animate]);

  // Change mood occasionally if animate is true
  useEffect(() => {
    if (animate) {
      const moodChangeInterval = setInterval(() => {
        const moods: MascotMood[] = ["happy", "thinking", "explaining"];
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        setCurrentMood(randomMood);
        
        // Return to original mood after a short time
        setTimeout(() => {
          setCurrentMood(mood);
        }, 2000);
      }, Math.random() * 15000 + 10000);
      
      return () => clearInterval(moodChangeInterval);
    } else {
      setCurrentMood(mood);
    }
  }, [animate, mood]);

  // Size classes for the mascot
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32"
  };
  
  // Eye expressions based on mood
  const renderEyes = () => {
    // Base eye style
    const baseEyeStyle = "absolute bg-white rounded-full";
    const eyeSize = size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-6 h-6";
    const leftEyePosition = size === "sm" ? "left-3 top-3" : size === "md" ? "left-5 top-6" : "left-8 top-9";
    const rightEyePosition = size === "sm" ? "right-3 top-3" : size === "md" ? "right-5 top-6" : "right-8 top-9";
    
    // Pupil style
    const basePupilStyle = "absolute bg-black rounded-full";
    const pupilSize = size === "sm" ? "w-1.5 h-1.5" : size === "md" ? "w-2 h-2" : "w-3 h-3";
    const pupilPosition = "inset-0 m-auto";
    
    // Blinking animation
    if (blinking) {
      return (
        <>
          <div className={`${baseEyeStyle} ${eyeSize} ${leftEyePosition} h-px`}></div>
          <div className={`${baseEyeStyle} ${eyeSize} ${rightEyePosition} h-px`}></div>
        </>
      );
    }

    // Different eye expressions based on mood
    switch (currentMood) {
      case "thinking":
        return (
          <>
            <div className={`${baseEyeStyle} ${eyeSize} ${leftEyePosition}`}>
              <div className={`${basePupilStyle} ${pupilSize} ${pupilPosition} -translate-y-1/4 translate-x-1/4`}></div>
            </div>
            <div className={`${baseEyeStyle} ${eyeSize} ${rightEyePosition}`}>
              <div className={`${basePupilStyle} ${pupilSize} ${pupilPosition} -translate-y-1/4 translate-x-1/4`}></div>
            </div>
          </>
        );

      case "celebrating":
        return (
          <>
            <div className={`${baseEyeStyle} ${eyeSize} ${leftEyePosition}`}>
              <div className={`${basePupilStyle} ${pupilSize} ${pupilPosition} star-shape`}></div>
            </div>
            <div className={`${baseEyeStyle} ${eyeSize} ${rightEyePosition}`}>
              <div className={`${basePupilStyle} ${pupilSize} ${pupilPosition} star-shape`}></div>
            </div>
          </>
        );

      case "warning":
        return (
          <>
            <div className={`${baseEyeStyle} ${eyeSize} ${leftEyePosition}`}>
              <div className={`${basePupilStyle} ${pupilSize} ${pupilPosition} scale-y-125`}></div>
            </div>
            <div className={`${baseEyeStyle} ${eyeSize} ${rightEyePosition}`}>
              <div className={`${basePupilStyle} ${pupilSize} ${pupilPosition} scale-y-125`}></div>
            </div>
          </>
        );

      case "question":
        return (
          <>
            <div className={`${baseEyeStyle} ${eyeSize} ${leftEyePosition}`}>
              <div className={`${basePupilStyle} ${pupilSize} ${pupilPosition}`}></div>
            </div>
            <div className={`${baseEyeStyle} ${eyeSize} ${rightEyePosition}`}>
              <div className={`font-bold text-black ${size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"} absolute inset-0 flex items-center justify-center`}>?</div>
            </div>
          </>
        );

      case "explaining":
        return (
          <>
            <div className={`${baseEyeStyle} ${eyeSize} ${leftEyePosition}`}>
              <div className={`${basePupilStyle} ${pupilSize} ${pupilPosition}`}></div>
            </div>
            <div className={`${baseEyeStyle} ${eyeSize} ${rightEyePosition}`}>
              <div className={`${basePupilStyle} ${pupilSize} ${pupilPosition}`}></div>
            </div>
            <div className={`absolute ${size === "sm" ? "w-5 h-3" : size === "md" ? "w-8 h-5" : "w-12 h-7"} ${size === "sm" ? "top-7" : size === "md" ? "top-12" : "top-16"} rounded-full mx-auto left-0 right-0 bg-purple-100 flex items-center justify-center`}>
              <div className={`${size === "sm" ? "w-0.5 h-0.5" : size === "md" ? "w-1 h-1" : "w-1.5 h-1.5"} rounded-full bg-purple-500 mx-0.5`}></div>
              <div className={`${size === "sm" ? "w-0.5 h-0.5" : size === "md" ? "w-1 h-1" : "w-1.5 h-1.5"} rounded-full bg-purple-500 mx-0.5`}></div>
              <div className={`${size === "sm" ? "w-0.5 h-0.5" : size === "md" ? "w-1 h-1" : "w-1.5 h-1.5"} rounded-full bg-purple-500 mx-0.5`}></div>
            </div>
          </>
        );

      case "happy":
      default:
        return (
          <>
            <div className={`${baseEyeStyle} ${eyeSize} ${leftEyePosition}`}>
              <div className={`${basePupilStyle} ${pupilSize} ${pupilPosition}`}></div>
            </div>
            <div className={`${baseEyeStyle} ${eyeSize} ${rightEyePosition}`}>
              <div className={`${basePupilStyle} ${pupilSize} ${pupilPosition}`}></div>
            </div>
          </>
        );
    }
  };

  // Mouth expressions based on mood
  const renderMouth = () => {
    // Base mouth position
    const mouthPosition = size === "sm" ? "bottom-3" : size === "md" ? "bottom-5" : "bottom-8";
    
    // Different mouth expressions based on mood
    switch (currentMood) {
      case "thinking":
        return (
          <div className={`absolute ${mouthPosition} left-1/2 transform -translate-x-1/2 ${size === "sm" ? "w-3" : size === "md" ? "w-5" : "w-8"} ${size === "sm" ? "h-0.5" : size === "md" ? "h-0.5" : "h-1"} bg-black rounded`}></div>
        );

      case "celebrating":
        return (
          <div className={`absolute ${mouthPosition} left-1/2 transform -translate-x-1/2 ${size === "sm" ? "w-4" : size === "md" ? "w-7" : "w-10"} ${size === "sm" ? "h-2" : size === "md" ? "h-3" : "h-4"} bg-red-400 rounded-full flex items-center justify-center overflow-hidden`}>
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-pink-300 rounded-t-full"></div>
          </div>
        );

      case "warning":
        return (
          <div className={`absolute ${mouthPosition} left-1/2 transform -translate-x-1/2 ${size === "sm" ? "w-3" : size === "md" ? "w-5" : "w-7"} ${size === "sm" ? "h-1" : size === "md" ? "h-1.5" : "h-2"} border-2 border-black rounded-full bg-white`}></div>
        );

      case "question":
        return (
          <div className={`absolute ${mouthPosition} left-1/2 transform -translate-x-1/2 ${size === "sm" ? "w-2" : size === "md" ? "w-3" : "w-4"} ${size === "sm" ? "h-2" : size === "md" ? "h-3" : "h-4"} border-2 border-black rounded-full bg-white`}></div>
        );

      case "explaining":
        return (
          <div className={`absolute ${mouthPosition} left-1/2 transform -translate-x-1/2 ${size === "sm" ? "w-3" : size === "md" ? "w-5" : "w-8"} ${size === "sm" ? "h-1" : size === "md" ? "h-2" : "h-3"} bg-black rounded-full`}>
            <div className={`absolute left-1/2 transform -translate-x-1/2 ${size === "sm" ? "w-2" : size === "md" ? "w-3" : "w-5"} ${size === "sm" ? "h-0.5" : size === "md" ? "h-1" : "h-1.5"} bg-red-400 rounded-full top-1/4`}></div>
          </div>
        );

      case "happy":
      default:
        return (
          <div className={`absolute ${mouthPosition} left-1/2 transform -translate-x-1/2 ${size === "sm" ? "w-4" : size === "md" ? "w-6" : "w-9"} ${size === "sm" ? "h-2" : size === "md" ? "h-3" : "h-4"} bg-black rounded-full overflow-hidden`}>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-red-400 rounded-b-full"></div>
          </div>
        );
    }
  };

  // Icon based on mood for the antenna
  const renderAntennaIcon = () => {
    const iconSize = size === "sm" ? "h-3 w-3" : size === "md" ? "h-5 w-5" : "h-7 w-7";
    const iconPosition = "absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-full";
    
    switch (currentMood) {
      case "thinking":
        return <BrainIcon className={`${iconSize} ${iconPosition} text-blue-400`} />;
      case "celebrating":
        return <CheckCircleIcon className={`${iconSize} ${iconPosition} text-green-400`} />;
      case "warning":
        return <AlertCircleIcon className={`${iconSize} ${iconPosition} text-yellow-400`} />;
      case "question":
        return <HelpCircleIcon className={`${iconSize} ${iconPosition} text-purple-400`} />;
      case "explaining":
        return <InfoIcon className={`${iconSize} ${iconPosition} text-blue-400`} />;
      case "happy":
      default:
        return <BotIcon className={`${iconSize} ${iconPosition} text-purple-400`} />;
    }
  };

  // Animation variants for the mascot
  const mascotVariants = {
    idle: {
      y: [0, -5, 0],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      }
    },
    thinking: {
      rotate: [0, -5, 5, -5, 0],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut"
      }
    },
    celebrating: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 5, 0],
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "easeInOut"
      }
    },
    explaining: {
      x: [0, -3, 3, -3, 0],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut"
      }
    },
    warning: {
      y: [0, -3, 0, -3, 0],
      transition: {
        repeat: Infinity,
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    question: {
      rotate: [0, 10, 0, -10, 0],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  // Get the current animation variant based on mood
  const getCurrentVariant = () => {
    if (!animate) return undefined;
    
    switch (currentMood) {
      case "thinking": return mascotVariants.thinking;
      case "celebrating": return mascotVariants.celebrating;
      case "explaining": return mascotVariants.explaining;
      case "warning": return mascotVariants.warning;
      case "question": return mascotVariants.question;
      case "happy":
      default: return mascotVariants.idle;
    }
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <motion.div 
        className={`relative ${sizeClasses[size]} bg-blue-500 rounded-full overflow-hidden`}
        animate={getCurrentVariant()}
      >
        {/* Antenna */}
        <div className={`absolute left-1/2 transform -translate-x-1/2 ${size === "sm" ? "w-1" : size === "md" ? "w-1.5" : "w-2"} ${size === "sm" ? "h-3" : size === "md" ? "h-4" : "h-6"} bg-gray-700 -top-0.5`}>
          {renderAntennaIcon()}
        </div>
        
        {/* Face elements */}
        {renderEyes()}
        {renderMouth()}
        
        {/* Ears/Side protrusions */}
        <div className={`absolute ${size === "sm" ? "w-1.5 h-3" : size === "md" ? "w-2 h-5" : "w-3 h-8"} bg-blue-600 rounded-l-full -left-0.5 top-1/2 transform -translate-y-1/2`}></div>
        <div className={`absolute ${size === "sm" ? "w-1.5 h-3" : size === "md" ? "w-2 h-5" : "w-3 h-8"} bg-blue-600 rounded-r-full -right-0.5 top-1/2 transform -translate-y-1/2`}></div>
      </motion.div>
      
      {/* Speech bubble message */}
      {message && (
        <AnimatePresence>
          <motion.div 
            className={`mt-2 bg-white rounded-xl border border-gray-200 shadow-sm p-3 ${size === "sm" ? "max-w-[150px]" : size === "md" ? "max-w-[250px]" : "max-w-[350px]"}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
            <p className={`text-center ${size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"}`}>{message}</p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}