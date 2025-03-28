import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ValidationResult } from './validation-result';
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface LegalValidationPanelProps {
  assessmentText: string;
  onValidationComplete?: (result: any) => void;
}

export const LegalValidationPanel: React.FC<LegalValidationPanelProps> = ({ 
  assessmentText,
  onValidationComplete 
}) => {
  const [text, setText] = useState(assessmentText || '');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async () => {
    if (!text.trim()) {
      setError('Please enter or load assessment text to validate');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const response = await fetch('/api/legal/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          type: 'assessment',
          context: {
            assessmentId: new URLSearchParams(window.location.search).get('assessmentId'),
            systemId: new URLSearchParams(window.location.search).get('systemId')
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        setValidationResult(data.result);
        if (onValidationComplete) {
          onValidationComplete(data.result);
        }
      } else {
        setError(data.error || 'Validation failed');
      }
    } catch (err) {
      console.error('Validation error:', err);
      setError('Failed to complete validation. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card className="w-full shadow-md border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          Legal Validation
          {validationResult && (
            <Badge 
              variant={validationResult.isValid ? "success" : "destructive"}
              className="ml-2"
            >
              {validationResult.isValid ? 'Valid' : 'Issues Found'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4 pb-0">
        <div className="space-y-4">
          <Textarea
            placeholder="Enter or load assessment text to validate..."
            className="min-h-[200px] font-mono text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {error && (
            <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded border border-red-200">
              {error}
            </div>
          )}

          {validationResult && (
            <ValidationResult result={validationResult} />
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center border-t border-slate-200 bg-slate-50 mt-4">
        <div className="text-sm text-slate-500">
          {validationResult ? (
            <span className="flex items-center">
              {validationResult.isValid ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <Clock className="h-4 w-4 text-amber-500 mr-1" />
              )}
              {validationResult.reviewStatus === 'validated' 
                ? 'Validation complete' 
                : 'Review recommended'}
            </span>
          ) : (
            'Validate compliance with EU AI Act requirements'
          )}
        </div>

        <Button 
          onClick={handleValidate}
          disabled={isValidating || !text.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isValidating ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Validating...
            </>
          ) : (
            'Validate with AI'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};