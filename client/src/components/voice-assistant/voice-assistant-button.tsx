import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { VoiceAssistant } from './voice-assistant';

export function VoiceAssistantButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="icon"
        className="fixed bottom-24 right-6 rounded-full h-12 w-12 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 z-50"
        aria-label="Voice Assistant"
      >
        <Mic className="h-5 w-5" />
      </Button>
      
      {isOpen && <VoiceAssistant />}
    </>
  );
}