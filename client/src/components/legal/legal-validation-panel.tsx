import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardCheckIcon, AlertTriangleIcon, FileTextIcon, UserIcon, BotIcon, ArrowRightIcon, ShieldIcon } from 'lucide-react';
import { ValidationResult } from './validation-result';
import { ExpertReviewPanel } from './expert-review-panel';
import { ConfidenceLevel, ReviewStatus } from '@/lib/types/legal-validation';
import { validateText, requestExpertReview } from '@/lib/services/legal-validation-service';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LegalValidationPanelProps {
  textToValidate: string;
  type: 'risk_assessment' | 'documentation' | 'conformity_declaration' | 'other';
  context?: Record<string, string>;
}

export function LegalValidationPanel({ textToValidate, type, context }: LegalValidationPanelProps) {
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [reviewRequested, setReviewRequested] = useState(false);
  const [reviewId, setReviewId] = useState<string | null>(null);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const result = await validateText(textToValidate, type, context);
      setValidationResult(result);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRequestExpertReview = async () => {
    try {
      const response = await requestExpertReview(textToValidate, type, context);
      if (response.success) {
        setReviewRequested(true);
        setReviewId(response.reviewId);
      }
    } catch (error) {
      console.error('Error requesting expert review:', error);
    }
  };

  return (
    <Tabs defaultValue="automated" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="automated" className="flex items-center gap-2">
          <BotIcon className="h-4 w-4" />
          <span>AI Validation</span>
        </TabsTrigger>
        <TabsTrigger value="expert" className="flex items-center gap-2">
          <UserIcon className="h-4 w-4" />
          <span>Expert Review</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="automated" className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <BotIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">AI Analysis</h3>
              <p className="text-xs text-muted-foreground">
                Automated validation using AI
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <ShieldIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Legal Compliance</h3>
              <p className="text-xs text-muted-foreground">
                Checks against EU AI Act
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <AlertTriangleIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Issue Detection</h3>
              <p className="text-xs text-muted-foreground">
                Identifies potential problems
              </p>
            </div>
          </div>
        </div>

        <Card className="border-2 shadow-sm">
          <CardHeader className="bg-muted/30 pb-3">
            <CardTitle className="flex items-center">
              <BotIcon className="h-5 w-5 mr-2 text-primary" />
              AI Validation
            </CardTitle>
            <CardDescription>
              Analyze the legal validity of this document using artificial intelligence
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {validationResult ? (
              <ValidationResult 
                isValid={validationResult.isValid} 
                confidenceLevel={validationResult.confidenceLevel as ConfidenceLevel}
                reviewStatus={validationResult.reviewStatus as ReviewStatus}
                issues={validationResult.issues || []}
                warnings={validationResult.warnings || []}
                reviewRequired={validationResult.reviewRequired || false}
                timestamp={new Date(validationResult.timestamp) || new Date()}
                validator="ai"
                validationNotes={validationResult.validationNotes}
                onRequestReview={handleRequestExpertReview}
              />
            ) : (
              <div className="flex flex-col items-center py-6">
                <div className="mb-4 text-center">
                  <p className="text-muted-foreground mb-2">Click below to start AI-powered validation</p>
                  <div className="flex justify-center">
                    <ArrowRightIcon className="h-5 w-5 text-primary animate-bounce" />
                  </div>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={handleValidate} 
                        disabled={isValidating}
                        size="lg"
                        className="gap-2 px-8 py-6 h-auto transition-all hover:scale-105"
                      >
                        {isValidating ? (
                          <>
                            <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                            Validating...
                          </>
                        ) : (
                          <>
                            <BotIcon className="h-5 w-5 mr-1" />
                            Start AI Validation
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Uses AI to analyze legal compliance with EU AI Act</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between bg-muted/10">
            <p className="text-xs text-muted-foreground">
              <BotIcon className="h-3 w-3 inline mr-1" />
              Validation results are based on current understanding of EU AI Act requirements
            </p>

            {validationResult && (
              <Button variant="outline" size="sm" onClick={() => setValidationResult(null)}>
                Reset Validation
              </Button>
            )}
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="expert" className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <UserIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Human Expert</h3>
              <p className="text-xs text-muted-foreground">
                Review by legal professionals
              </p>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <ClipboardCheckIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Detailed Analysis</h3>
              <p className="text-xs text-muted-foreground">
                Thorough legal review
              </p>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <FileTextIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Recommendations</h3>
              <p className="text-xs text-muted-foreground">
                Personalized guidance
              </p>
            </div>
          </div>
        </div>

        <Card className="border-2 shadow-sm">
          <CardHeader className="bg-muted/30 pb-3">
            <CardTitle className="flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-primary" />
              Expert Legal Review
            </CardTitle>
            <CardDescription>
              Request a review from a legal compliance expert for thorough analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ExpertReviewPanel 
              textToReview={textToValidate}
              type={type}
              context={context}
              reviewRequested={reviewRequested}
              reviewId={reviewId}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}