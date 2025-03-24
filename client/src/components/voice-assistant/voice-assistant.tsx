import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, VolumeX, Volume2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

// Command types and mapping
interface Command {
  action: string;
  phrases: string[];
  handler: () => void;
}

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Initialize speech recognition and synthesis on component mount
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Speech Recognition Not Available',
        description: 'Your browser does not support speech recognition.',
        variant: 'destructive'
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript;
      setTranscript(result);
      handleCommand(result);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast({
        title: 'Recognition Error',
        description: `Error: ${event.error}`,
        variant: 'destructive'
      });
      setIsListening(false);
    };

    // Initialize speech synthesis
    synthesisRef.current = new SpeechSynthesisUtterance();
    synthesisRef.current.lang = 'en-US';
    synthesisRef.current.rate = 1.0;
    synthesisRef.current.pitch = 1.0;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [toast]);

  // Define commands and their handlers
  const commands: Command[] = [
    {
      action: 'navigate',
      phrases: ['go to dashboard', 'open dashboard', 'show dashboard'],
      handler: () => navigateTo('/')
    },
    {
      action: 'navigate',
      phrases: ['go to risk assessment', 'open risk assessment', 'show risk assessment'],
      handler: () => navigateTo('/risk-assessment')
    },
    {
      action: 'navigate',
      phrases: ['go to inventory', 'open inventory', 'show inventory', 'show ai systems'],
      handler: () => navigateTo('/inventory')
    },
    {
      action: 'navigate',
      phrases: ['go to knowledge center', 'open knowledge center', 'show knowledge center'],
      handler: () => navigateTo('/knowledge-center')
    },
    {
      action: 'navigate',
      phrases: ['go to training', 'open training', 'show training'],
      handler: () => navigateTo('/training')
    },
    {
      action: 'navigate',
      phrases: ['go to documentation', 'open documentation', 'show documentation'],
      handler: () => navigateTo('/documentation')
    },
    {
      action: 'navigate',
      phrases: ['go to risk management', 'open risk management', 'show risk management'],
      handler: () => navigateTo('/risk-management')
    },
    {
      action: 'assistant',
      phrases: ['help me', 'what can you do', 'assistant help'],
      handler: () => speak('I can help you navigate to different sections of the platform. For example, try saying "go to risk assessment" or "show inventory".')
    },
    {
      action: 'close',
      phrases: ['close assistant', 'stop listening', 'turn off', 'goodbye'],
      handler: () => {
        speak('Goodbye');
        stopListening();
        setIsDialogOpen(false);
      }
    }
  ];

  // Parse and handle voice commands
  const handleCommand = (text: string) => {
    if (!text) return;
    
    const lowerText = text.toLowerCase().trim();
    
    for (const command of commands) {
      for (const phrase of command.phrases) {
        if (lowerText.includes(phrase)) {
          speak(`Executing: ${phrase}`);
          setTimeout(() => {
            command.handler();
          }, 1000);
          return;
        }
      }
    }
  };

  // Navigation helper
  const navigateTo = (path: string) => {
    setLocation(path);
    toast({
      title: 'Navigation',
      description: `Navigating to ${path}`,
    });
  };

  // Toggle speech recognition
  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Start speech recognition
  const startListening = () => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
      setIsDialogOpen(true);
      speak('Voice assistant activated. How can I help you?');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: 'Error',
        description: 'Could not start voice recognition',
        variant: 'destructive'
      });
    }
  };

  // Stop speech recognition
  const stopListening = () => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  // Text-to-speech function
  const speak = (text: string) => {
    if (!synthesisRef.current || isMuted) return;
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      synthesisRef.current.text = text;
      window.speechSynthesis.speak(synthesisRef.current);
    }
  };

  // Toggle mute for speech synthesis
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <>
      <Button
        onClick={toggleListening}
        variant="outline"
        size="icon"
        className="fixed bottom-24 right-6 rounded-full h-12 w-12 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 z-50"
        aria-label={isListening ? "Stop listening" : "Start voice assistant"}
      >
        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Voice Compliance Assistant</DialogTitle>
            <DialogDescription>
              Speak commands to navigate and interact with the platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 bg-muted/50 rounded-md my-2 min-h-20 relative">
            <div className="absolute top-2 right-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMute} 
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-1">I heard:</p>
            <p className="font-medium">{transcript || "Waiting for command..."}</p>
            
            {isListening && (
              <div className="flex justify-center mt-4 space-x-1">
                <div className="w-1 h-6 bg-primary animate-pulse rounded-full" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-8 bg-primary animate-pulse rounded-full" style={{ animationDelay: '100ms' }}></div>
                <div className="w-1 h-10 bg-primary animate-pulse rounded-full" style={{ animationDelay: '200ms' }}></div>
                <div className="w-1 h-8 bg-primary animate-pulse rounded-full" style={{ animationDelay: '300ms' }}></div>
                <div className="w-1 h-6 bg-primary animate-pulse rounded-full" style={{ animationDelay: '400ms' }}></div>
              </div>
            )}
          </div>
          
          <div className="bg-muted/30 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-2">Try saying:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>"Go to risk assessment"</li>
              <li>"Show inventory"</li>
              <li>"Open knowledge center"</li>
              <li>"What can you do?"</li>
              <li>"Close assistant"</li>
            </ul>
          </div>
          
          <DialogFooter className="flex sm:justify-between">
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button 
              variant={isListening ? "destructive" : "default"} 
              onClick={toggleListening}
            >
              {isListening ? "Stop Listening" : "Start Listening"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Type declarations to fix TypeScript errors
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}