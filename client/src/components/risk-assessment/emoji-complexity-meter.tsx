import React from 'react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

export interface ComplexityLevel {
  level: 'simple' | 'moderate' | 'complex' | 'very-complex' | 'extreme';
  emoji: string;
  label: string;
  description: string;
  color: string;
}

const complexityLevels: Record<ComplexityLevel['level'], ComplexityLevel> = {
  'simple': {
    level: 'simple',
    emoji: '😊',
    label: 'Simple',
    description: 'Easy to implement requirements with minimal documentation',
    color: 'text-green-500'
  },
  'moderate': {
    level: 'moderate',
    emoji: '🙂',
    label: 'Moderate',
    description: 'Standard requirements with reasonable documentation needs',
    color: 'text-emerald-500'
  },
  'complex': {
    level: 'complex',
    emoji: '😐',
    label: 'Complex',
    description: 'Detailed requirements with significant documentation and process changes',
    color: 'text-amber-500'
  },
  'very-complex': {
    level: 'very-complex',
    emoji: '😟',
    label: 'Very Complex',
    description: 'Extensive requirements with substantial documentation, process changes, and oversight',
    color: 'text-orange-500'
  },
  'extreme': {
    level: 'extreme',
    emoji: '😰',
    label: 'Extreme',
    description: 'Most demanding requirements with comprehensive documentation, significant process changes, and continuous monitoring',
    color: 'text-red-500'
  }
};

interface EmojiComplexityMeterProps {
  level: ComplexityLevel['level'];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
}

export const EmojiComplexityMeter: React.FC<EmojiComplexityMeterProps> = ({
  level,
  size = 'md',
  showLabel = false,
  className
}) => {
  const complexityInfo = complexityLevels[level];
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex items-center gap-2', className)}>
            <span className={cn(sizeClasses[size], complexityInfo.color)}>
              {complexityInfo.emoji}
            </span>
            {showLabel && (
              <span className={cn('font-medium', complexityInfo.color)}>
                {complexityInfo.label}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">{complexityInfo.label} Complexity</p>
          <p className="text-sm text-muted-foreground max-w-xs">{complexityInfo.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface ArticleComplexityProps {
  article: string;
  title?: string;
  description?: string;
  complexity: ComplexityLevel['level'];
  requirementCount?: number;
  className?: string;
}

export const ArticleComplexity: React.FC<ArticleComplexityProps> = ({
  article,
  title,
  description,
  complexity,
  requirementCount,
  className
}) => {
  return (
    <div className={cn('rounded-lg border p-4 shadow-sm', className)}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-base font-semibold">Article {article}</h3>
          {title && <p className="text-sm font-medium">{title}</p>}
        </div>
        <EmojiComplexityMeter level={complexity} size="lg" />
      </div>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
      )}
      
      {requirementCount !== undefined && (
        <div className="text-xs font-medium text-muted-foreground">
          {requirementCount} specific requirements
        </div>
      )}
    </div>
  );
};

interface RegulatoryRiskMeterProps {
  riskLevel: 'minimal' | 'limited' | 'high' | 'unacceptable';
  articles: string[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RegulatoryRiskMeter: React.FC<RegulatoryRiskMeterProps> = ({
  riskLevel,
  articles,
  size = 'md',
  className
}) => {
  const riskEmojis = {
    minimal: '🟢',
    limited: '🟡',
    high: '🟠',
    unacceptable: '🔴'
  };
  
  const riskLabels = {
    minimal: 'Minimal Risk',
    limited: 'Limited Risk',
    high: 'High Risk',
    unacceptable: 'Unacceptable Risk'
  };
  
  const riskDescriptions = {
    minimal: 'Few compliance requirements. Minimal oversight needed.',
    limited: 'Some compliance requirements. Self-assessment usually sufficient.',
    high: 'Extensive compliance requirements. Conformity assessment mandatory.',
    unacceptable: 'Prohibited use case under the EU AI Act.'
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('flex items-center gap-2', sizeClasses[size])}>
        <span className="text-2xl">{riskEmojis[riskLevel]}</span>
        <span className="font-semibold">{riskLabels[riskLevel]}</span>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="rounded-full bg-muted px-2 py-1 text-xs cursor-help">
              {articles.length} articles apply
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-semibold">{riskLabels[riskLevel]}</p>
            <p className="text-sm mb-2">{riskDescriptions[riskLevel]}</p>
            <div className="text-xs">
              <span className="font-medium">Applicable Articles:</span> {articles.join(', ')}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

interface ComplianceEmojiBoardProps {
  complianceData: {
    articleId: string;
    title: string;
    complexity: ComplexityLevel['level'];
    status: 'compliant' | 'in-progress' | 'non-compliant' | 'not-applicable';
  }[];
  className?: string;
}

export const ComplianceEmojiBoard: React.FC<ComplianceEmojiBoardProps> = ({
  complianceData,
  className
}) => {
  const statusEmojis = {
    'compliant': '✅',
    'in-progress': '⏳',
    'non-compliant': '❌',
    'not-applicable': '⚪'
  };
  
  const statusLabels = {
    'compliant': 'Compliant',
    'in-progress': 'In Progress',
    'non-compliant': 'Non-Compliant',
    'not-applicable': 'Not Applicable'
  };

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3', className)}>
      {complianceData.map((item) => (
        <TooltipProvider key={item.articleId}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 p-2 rounded-md border hover:bg-accent/50 cursor-help">
                <div className="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-muted">
                  <span className="text-xl">{complexityLevels[item.complexity].emoji}</span>
                </div>
                <div>
                  <div className="text-sm font-medium">Article {item.articleId}</div>
                  <div className="flex items-center text-xs">
                    <span className="mr-1">{statusEmojis[item.status]}</span>
                    <span className="text-muted-foreground">{statusLabels[item.status]}</span>
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">Article {item.articleId}</p>
              <p className="text-sm mb-1">{item.title}</p>
              <div className="flex items-center gap-2 text-sm">
                <span>{complexityLevels[item.complexity].emoji}</span>
                <span>{complexityLevels[item.complexity].label} Complexity</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <span>{statusEmojis[item.status]}</span>
                <span>{statusLabels[item.status]}</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};