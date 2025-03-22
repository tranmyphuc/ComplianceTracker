import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SparklesIcon } from "lucide-react";
import { AiAssistantDialog } from "./assistant-dialog";

export function AiAssistantButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  return (
    <>
      <Button
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        onClick={() => setDialogOpen(true)}
      >
        <SparklesIcon className="h-5 w-5" />
        <span className="sr-only">Open AI Assistant</span>
      </Button>
      
      <AiAssistantDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}