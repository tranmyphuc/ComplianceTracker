import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Download, RefreshCw, Clock } from 'lucide-react';
import { useComplianceUpdates } from '@/hooks/use-compliance-updates';
import { formatDistanceToNow } from 'date-fns';

export function ComplianceUpdates() {
  const {
    availableUpdates,
    tipUpdates,
    loading,
    lastChecked,
    checkForUpdates,
    fetchUpdates,
    applyUpdates,
  } = useComplianceUpdates();
  
  const [expanded, setExpanded] = useState<boolean>(false);
  
  const handleCheckForUpdates = async () => {
    await checkForUpdates();
    // Fetch updates to show preview if available
    if (availableUpdates > 0) {
      await fetchUpdates();
      setExpanded(true);
    }
  };
  
  const handleApplyUpdates = async () => {
    const success = await applyUpdates();
    if (success) {
      setExpanded(false);
    }
  };
  
  const formatLastChecked = () => {
    if (!lastChecked) return 'Never';
    
    try {
      const date = new Date(lastChecked);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Compliance Documentation Updates</span>
          {availableUpdates > 0 && (
            <Badge variant="destructive" className="ml-2">
              {availableUpdates} update{availableUpdates !== 1 ? 's' : ''} available
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Keep EU AI Act compliance information current with the latest updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last checked: {formatLastChecked()}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheckForUpdates}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Check for updates
            </Button>
          </div>
          
          {availableUpdates > 0 && (
            <>
              <div className="flex items-center space-x-2 mt-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">
                  {availableUpdates} update{availableUpdates !== 1 ? 's' : ''} available for EU AI Act compliance documentation
                </span>
              </div>
              
              {expanded && tipUpdates.length > 0 && (
                <div className="mt-4 space-y-4">
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Available Updates:</h4>
                    {tipUpdates.map((update) => (
                      <div 
                        key={update.id} 
                        className="p-3 bg-muted/50 rounded-lg text-sm"
                      >
                        <div className="font-medium mb-1">{update.title}</div>
                        <p className="text-muted-foreground">{update.content}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {update.relevantArticles.map((article) => (
                            <Badge key={article} variant="outline" className="text-xs">
                              {article}
                            </Badge>
                          ))}
                        </div>
                        {update.officialSourceUrl && (
                          <div className="mt-2">
                            <a 
                              href={update.officialSourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              View Official Source
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          
          {availableUpdates === 0 && !loading && (
            <div className="py-4 text-center text-muted-foreground">
              All compliance information is up-to-date
            </div>
          )}
        </div>
      </CardContent>
      {availableUpdates > 0 && (
        <CardFooter className="flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
            disabled={loading || tipUpdates.length === 0}
          >
            {expanded ? 'Hide details' : 'View details'}
          </Button>
          <Button
            onClick={handleApplyUpdates}
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Apply Updates
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}