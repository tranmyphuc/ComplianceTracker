import { ConfidenceLevel, ReviewStatus } from '@/lib/types/legal-validation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  AlertTriangleIcon, 
  CheckCircleIcon, 
  InfoIcon, 
  UserIcon, 
  AlertCircleIcon, 
  XCircleIcon, 
  BotIcon, 
  ShieldIcon 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ValidationResultProps {
  isValid: boolean;
  confidenceLevel: ConfidenceLevel;
  reviewStatus: ReviewStatus;
  issues: string[];
  warnings: string[];
  reviewRequired: boolean;
  timestamp: Date;
  validator: 'ai' | 'expert' | 'system';
  validationNotes?: string;
  onRequestReview?: () => void;
  className?: string;
}

export function ValidationResult({
  isValid,
  confidenceLevel,
  reviewStatus,
  issues,
  warnings,
  reviewRequired,
  timestamp,
  validator,
  validationNotes,
  onRequestReview,
  className
}: ValidationResultProps) {
  const getConfidenceBadge = () => {
    switch (confidenceLevel) {
      case 'high':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">High Confidence</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Medium Confidence</Badge>;
      case 'low':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Low Confidence</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Uncertain</Badge>;
    }
  };

  const getStatusBadge = () => {
    switch (reviewStatus) {
      case 'validated':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Validated</Badge>;
      case 'pending_review':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Pending Review</Badge>;
      case 'requires_legal_review':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Requires Legal Review</Badge>;
      case 'outdated':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Outdated</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Unknown</Badge>;
    }
  };

  const getConfidenceScore = () => {
    switch (confidenceLevel) {
      case 'high': return 90;
      case 'medium': return 65;
      case 'low': return 35;
      default: return 20;
    }
  };

  const getProgressColor = () => {
    switch (confidenceLevel) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={className}>
      <div className="border-2 rounded-xl overflow-hidden mb-6 shadow-sm">
        <div className={`p-4 ${isValid ? 'bg-green-50' : 'bg-amber-50'}`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${isValid ? 'bg-green-100' : 'bg-amber-100'}`}>
                {isValid ? (
                  <CheckCircleIcon className="text-green-600 h-5 w-5" />
                ) : (
                  <AlertTriangleIcon className="text-amber-600 h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium">{isValid ? 'Validation Passed' : 'Validation Issues Found'}</h3>
                <p className="text-sm text-muted-foreground">
                  {isValid 
                    ? 'This assessment appears to be legally compliant'
                    : 'Some issues were detected that require attention'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {getConfidenceBadge()}
              {getStatusBadge()}
            </div>
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <BotIcon className="h-4 w-4 text-primary" />
              AI Confidence Level
            </h4>
            <span className="text-sm font-medium">{getConfidenceScore()}%</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <Progress 
                    value={getConfidenceScore()} 
                    className="h-2" 
                    indicatorClassName={getProgressColor()} 
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI's confidence in its assessment: {confidenceLevel}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {validationNotes && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            Validation Notes
          </h4>
          <p className="text-sm">{validationNotes}</p>
        </div>
      )}

      {issues.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <AlertCircleIcon className="h-4 w-4 text-red-500" />
            Issues Found
          </h4>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
            {issues.map((issue, index) => (
              <div key={index} className="flex gap-3 text-sm p-3 bg-red-50 rounded-lg border border-red-100">
                <XCircleIcon className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <span>{issue}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <AlertTriangleIcon className="h-4 w-4 text-amber-500" />
            Warnings
          </h4>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
            {warnings.map((warning, index) => (
              <div key={index} className="flex gap-3 text-sm p-3 bg-amber-50 rounded-lg border border-amber-100">
                <AlertTriangleIcon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isValid && (
        <div className="mb-4">
          <div className="flex gap-3 text-sm p-3 bg-green-50 rounded-lg border border-green-100">
            <CheckCircleIcon className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <span>This assessment meets the basic legal requirements for AI compliance documentation.</span>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-full">
            {validator === 'ai' ? (
              <BotIcon className="h-3.5 w-3.5 text-primary" />
            ) : validator === 'expert' ? (
              <UserIcon className="h-3.5 w-3.5 text-primary" />
            ) : (
              <ShieldIcon className="h-3.5 w-3.5 text-primary" />
            )}
          </div>
          <span>
            Validated by <span className="font-medium">{validator === 'ai' ? 'AI System' : validator === 'expert' ? 'Legal Expert' : 'System Check'}</span>
            <span className="mx-1">•</span>
            {timestamp.toLocaleString()}
          </span>
        </div>

        {reviewRequired && onRequestReview && (
          <Button onClick={onRequestReview} className="gap-2">
            <UserIcon className="h-4 w-4" />
            Request Expert Review
          </Button>
        )}
      </div>
    </div>
  );
}