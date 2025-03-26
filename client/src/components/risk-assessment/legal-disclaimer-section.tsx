import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, InfoIcon, MoreHorizontalIcon, AlertCircle, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LegalDisclaimer } from '@/components/legal';
import { ConfidenceLevel, ReviewStatus } from '@/components/legal/legal-disclaimer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LegalDisclaimerSectionProps {
  riskLevel?: 'high' | 'limited' | 'minimal' | 'unacceptable' | string;
  confidenceLevel?: ConfidenceLevel;
  className?: string;
}

const LegalDisclaimerSection: React.FC<LegalDisclaimerSectionProps> = ({
  riskLevel = 'limited',
  confidenceLevel = ConfidenceLevel.MEDIUM,
  className = ''
}) => {
  // Determine appropriate review status based on risk level
  const getReviewStatus = (): ReviewStatus => {
    if (riskLevel === 'high' || riskLevel === 'unacceptable') {
      return ReviewStatus.REQUIRES_LEGAL_REVIEW;
    } else if (riskLevel === 'limited') {
      return confidenceLevel === ConfidenceLevel.HIGH 
        ? ReviewStatus.VALIDATED 
        : ReviewStatus.PENDING_REVIEW;
    } else {
      return ReviewStatus.VALIDATED;
    }
  };
  
  const reviewStatus = getReviewStatus();
  
  // Get appropriate warning items based on risk level
  const getWarningItems = (): string[] => {
    if (riskLevel === 'high' || riskLevel === 'unacceptable') {
      return [
        'High-risk AI systems require formal conformity assessment procedures.',
        'Expert legal review is mandatory before implementation.'
      ];
    } else if (riskLevel === 'limited') {
      return ['Limited-risk AI systems require transparency measures.'];
    } else {
      return [];
    }
  };
  
  return (
    <Card className={`shadow-sm ${className}`}>
      <CardHeader className="space-y-0 pb-2">
        <div className="flex justify-between">
          <div className="flex items-center">
            <InfoIcon className="h-5 w-5 mr-2 text-blue-500" />
            <CardTitle className="text-lg">Legal Notice</CardTitle>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download disclaimer
              </DropdownMenuItem>
              <DropdownMenuItem>
                <AlertCircle className="mr-2 h-4 w-4" />
                Request expert review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>
          This disclaimer is provided in accordance with EU AI Act requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LegalDisclaimer 
          confidenceLevel={confidenceLevel}
          reviewStatus={reviewStatus}
          showTimestamp={true}
          isAssessment={true}
          warnings={getWarningItems()}
          generatedDate={new Date()}
        />
        
        {(riskLevel === 'high' || riskLevel === 'unacceptable') && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">High Risk Classification</h4>
              <p className="text-sm text-yellow-700 mt-1">
                This system has been classified as {riskLevel} risk under the EU AI Act. 
                You must comply with stringent requirements including conformity 
                assessment, technical documentation, and human oversight measures.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-muted-foreground">
                <InfoIcon className="h-4 w-4 mr-1" />
                <span>
                  {reviewStatus === ReviewStatus.VALIDATED ? (
                    'Legally validated'
                  ) : reviewStatus === ReviewStatus.PENDING_REVIEW ? (
                    'Pending legal review'
                  ) : (
                    'Requires legal review'
                  )}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>This legal notice has been {reviewStatus === ReviewStatus.VALIDATED ? 'validated by our legal team' : 'automatically generated and requires expert review'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button variant="outline" size="sm">
          Learn More About Compliance
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LegalDisclaimerSection;