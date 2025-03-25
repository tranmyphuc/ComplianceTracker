import { ReactNode } from 'react';
import { LightbulbIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ComplianceTip } from './tip-bubble';
import { cn } from '@/lib/utils';

interface InlineTipProps {
  tip: Omit<ComplianceTip, 'id' | 'dismissible'>;
  className?: string;
  compact?: boolean;
  children?: ReactNode;
  jackStyle?: boolean;
}

// Category to color mapping (same as in TipBubble)
const categoryColors = {
  risk: 'bg-red-100 text-red-800 border-red-200',
  documentation: 'bg-blue-100 text-blue-800 border-blue-200',
  governance: 'bg-purple-100 text-purple-800 border-purple-200',
  implementation: 'bg-green-100 text-green-800 border-green-200',
  audit: 'bg-amber-100 text-amber-800 border-amber-200',
  general: 'bg-gray-100 text-gray-800 border-gray-200',
};

const getCategoryColor = (category: ComplianceTip['category']) => {
  return categoryColors[category] || categoryColors.general;
};

export function InlineTip({
  tip,
  className,
  compact = false,
  children,
  jackStyle = false,
}: InlineTipProps) {
  return (
    <Card 
      className={cn(
        'border',
        jackStyle ? 'border-primary/50' : getCategoryColor(tip.category),
        className
      )}
    >
      <CardContent className={cn(
        'p-4', 
        compact ? 'py-2' : '',
        jackStyle ? 'bg-primary/5' : ''
      )}>
        <div className="flex gap-3">
          {jackStyle ? (
            <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border border-primary">
              <img 
                src="/assets/1000048340-modified.png" 
                alt="Jack from SGH ASIA" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <LightbulbIcon className="h-4 w-4 text-amber-700" />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-sm flex items-center">
                {jackStyle ? "Jack's Tip: " : ""}{tip.title}
              </h4>
              <Badge 
                variant="outline" 
                className={`text-xs ${jackStyle ? '' : getCategoryColor(tip.category)}`}
              >
                {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {tip.content}
            </p>
            
            {tip.relevantArticles && tip.relevantArticles.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground font-medium mb-1">Relevant Articles:</p>
                <div className="flex flex-wrap gap-1">
                  {tip.relevantArticles.map((article, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {article}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {children && (
              <div className="mt-2">
                {children}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}