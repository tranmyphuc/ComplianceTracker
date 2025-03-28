import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircleIcon, 
  AlertTriangleIcon, 
  XCircleIcon, 
  InfoIcon, 
  UserIcon, 
  ClockIcon,
  FileTextIcon
} from "lucide-react";
import { ConfidenceLevel, ReviewStatus } from './legal-disclaimer';

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

export const ValidationResult: React.FC<ValidationResultProps> = ({
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
  className = ''
}) => {
  // Determine status icon and color
  const getStatusDetails = () => {
    if (isValid && confidenceLevel === ConfidenceLevel.HIGH) {
      return {
        icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
        title: "Valid Assessment",
        color: "text-green-500",
        description: "This assessment has been validated and has a high confidence level."
      };
    } else if (isValid && confidenceLevel === ConfidenceLevel.MEDIUM) {
      return {
        icon: <CheckCircleIcon className="h-6 w-6 text-blue-500" />,
        title: "Valid Assessment",
        color: "text-blue-500",
        description: "This assessment has been validated with a medium confidence level."
      };
    } else if (!isValid || confidenceLevel === ConfidenceLevel.LOW) {
      return {
        icon: <AlertTriangleIcon className="h-6 w-6 text-amber-500" />,
        title: "Requires Review",
        color: "text-amber-500",
        description: "This assessment requires further review due to validation issues or low confidence."
      };
    } else if (reviewStatus === ReviewStatus.OUTDATED) {
      return {
        icon: <XCircleIcon className="h-6 w-6 text-red-500" />,
        title: "Outdated Assessment",
        color: "text-red-500",
        description: "This assessment may be outdated due to regulatory changes."
      };
    } else {
      return {
        icon: <InfoIcon className="h-6 w-6 text-gray-500" />,
        title: "Assessment Information",
        color: "text-gray-500",
        description: "Review the validation results for this assessment."
      };
    }
  };

  const statusDetails = getStatusDetails();
  
  // Get validator icon
  const getValidatorIcon = () => {
    switch (validator) {
      case 'expert':
        return <UserIcon className="h-4 w-4 mr-1" />;
      case 'ai':
        return <FileTextIcon className="h-4 w-4 mr-1" />;
      case 'system':
      default:
        return <InfoIcon className="h-4 w-4 mr-1" />;
    }
  };
  
  // Get confidence badge color
  const getConfidenceBadgeColor = () => {
    switch (confidenceLevel) {
      case ConfidenceLevel.HIGH:
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case ConfidenceLevel.MEDIUM:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case ConfidenceLevel.LOW:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case ConfidenceLevel.UNCERTAIN:
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };
  
  return (
    <Card className={`shadow-sm ${className}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {statusDetails.icon}
            <div>
              <CardTitle className={statusDetails.color}>{statusDetails.title}</CardTitle>
              <CardDescription>{statusDetails.description}</CardDescription>
            </div>
          </div>
          <Badge className={getConfidenceBadgeColor()}>
            {confidenceLevel.charAt(0).toUpperCase() + confidenceLevel.slice(1)} Confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {(issues.length > 0 || warnings.length > 0) && (
          <div className="space-y-4">
            {issues.length > 0 && (
              <div>
                <h4 className="font-medium text-red-600 mb-2">Validation Issues</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {issues.map((issue, index) => (
                    <li key={`issue-${index}`} className="text-red-600">{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {warnings.length > 0 && (
              <div>
                <h4 className="font-medium text-amber-600 mb-2">Validation Warnings</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={`warning-${index}`} className="text-amber-600">{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {validationNotes && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Validation Notes</h4>
            <p className="text-gray-700">{validationNotes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center text-sm text-gray-500">
          <span className="flex items-center mr-4">
            {getValidatorIcon()}
            Validated by {validator.charAt(0).toUpperCase() + validator.slice(1)}
          </span>
          <span className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            {timestamp.toLocaleDateString()}
          </span>
        </div>
        
        {reviewRequired && onRequestReview && (
          <Button variant="outline" onClick={onRequestReview}>
            Request Expert Review
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ValidationResult;