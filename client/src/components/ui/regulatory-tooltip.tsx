import { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { RegulatoryTerm, getRegulatoryTermByName } from '@/lib/queries/regulatoryTerms';

interface RegulatoryTooltipProps {
  term: string;
  children: React.ReactNode;
  inline?: boolean;
  hideIfNotFound?: boolean;
  language?: string;
}

export function RegulatoryTooltip({
  term,
  children,
  inline = false,
  hideIfNotFound = false,
  language: propLanguage,
}: RegulatoryTooltipProps) {
  const [termData, setTermData] = useState<RegulatoryTerm | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Use the language from props if provided, otherwise default to English
  const language = propLanguage || 'en';

  useEffect(() => {
    const fetchTermData = async () => {
      if (!term) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getRegulatoryTermByName(term, language);
        setTermData(data);
        if (!data && !hideIfNotFound) {
          setError(`Term not found: ${term}`);
        }
      } catch (err) {
        console.error('Error fetching term data:', err);
        setError(`Failed to load term data`);
        toast({
          title: 'Error',
          description: 'Could not load regulatory term information',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTermData();
  }, [term, language, hideIfNotFound, toast]);

  // If we should hide when not found and we didn't find the term
  if (hideIfNotFound && !termData && !loading) {
    return <>{children}</>;
  }

  // If inline, use Tooltip, otherwise use HoverCard
  if (inline) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <span className="border-b border-dotted border-primary/50 cursor-help">
              {children}
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-md p-4">
            {renderTooltipContent(termData, loading, error, language)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // Use HoverCard for block-level elements
  return (
    <HoverCard openDelay={300} closeDelay={200}>
      <HoverCardTrigger asChild>
        <span className="border-b border-dotted border-primary/50 cursor-help">
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        {renderTooltipContent(termData, loading, error, language)}
      </HoverCardContent>
    </HoverCard>
  );
}

function renderTooltipContent(
  termData: RegulatoryTerm | null,
  loading: boolean,
  error: string | null,
  language: string
) {
  if (loading) {
    return <div className="text-sm py-2">Loading...</div>;
  }
  
  if (error) {
    return <div className="text-sm text-destructive py-2">{error}</div>;
  }
  
  if (!termData) {
    return <div className="text-sm py-2">No information available</div>;
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-primary">{termData.term}</h4>
        {termData.importance && (
          <Badge variant={termData.importance === 'high' ? 'destructive' : 'secondary'}>
            {termData.importance === 'high' ? 'Critical' : 'Important'}
          </Badge>
        )}
      </div>
      
      <div className="text-sm">{termData.definition}</div>
      
      {termData.contextExample && (
        <div className="text-sm italic text-muted-foreground mt-2">
          Example: {termData.contextExample}
        </div>
      )}
      
      <div className="flex flex-wrap gap-1 mt-2">
        {termData.source && (
          <Badge variant="outline" className="text-xs">
            {termData.source}
          </Badge>
        )}
        {termData.articleReference && (
          <Badge variant="outline" className="text-xs">
            {termData.articleReference}
          </Badge>
        )}
        {termData.category && (
          <Badge variant="outline" className="text-xs">
            {termData.category}
          </Badge>
        )}
      </div>
      
      {termData.relatedTerms && termData.relatedTerms.length > 0 && (
        <div className="mt-2">
          <span className="text-xs text-muted-foreground">Related:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {termData.relatedTerms.map((relatedTerm) => (
              <Button key={relatedTerm} variant="link" size="sm" className="h-auto p-0 text-xs">
                {relatedTerm}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}