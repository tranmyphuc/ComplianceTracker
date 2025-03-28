import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface ValidationResultProps {
  result: {
    isValid: boolean;
    confidenceLevel: 'high' | 'medium' | 'low' | 'uncertain';
    reviewStatus: 'validated' | 'pending_review' | 'requires_legal_review' | 'outdated';
    issues: string[];
    warnings: string[];
    reviewRequired: boolean;
    validator: string;
    validationNotes?: string;
  };
}

export const ValidationResult: React.FC<ValidationResultProps> = ({ result }) => {
  const getConfidenceBadge = () => {
    switch (result.confidenceLevel) {
      case 'high':
        return <Badge className="bg-green-600">High Confidence</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">Medium Confidence</Badge>;
      case 'low':
        return <Badge className="bg-red-500">Low Confidence</Badge>;
      default:
        return <Badge className="bg-slate-500">Uncertain</Badge>;
    }
  };

  const getStatusBadge = () => {
    switch (result.reviewStatus) {
      case 'validated':
        return <Badge className="bg-green-600">Validated</Badge>;
      case 'pending_review':
        return <Badge className="bg-amber-500">Pending Review</Badge>;
      case 'requires_legal_review':
        return <Badge className="bg-red-500">Requires Legal Review</Badge>;
      case 'outdated':
        return <Badge className="bg-slate-500">Outdated</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-slate-800">Validation Result</h3>
            {getConfidenceBadge()}
            {getStatusBadge()}
            <Badge className={result.isValid ? "bg-green-600" : "bg-red-500"}>
              {result.isValid ? 'Valid' : 'Invalid'}
            </Badge>
          </div>

          {result.validationNotes && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-800">
              <p className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{result.validationNotes}</span>
              </p>
            </div>
          )}

          {result.issues.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-semibold flex items-center gap-1 mb-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                Issues Found ({result.issues.length})
              </h4>
              <ul className="pl-6 list-disc text-sm space-y-1 text-red-700">
                {result.issues.map((issue, index) => (
                  <li key={`issue-${index}`}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {result.warnings.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-semibold flex items-center gap-1 mb-2 text-amber-700">
                <AlertTriangle className="h-4 w-4" />
                Warnings ({result.warnings.length})
              </h4>
              <ul className="pl-6 list-disc text-sm space-y-1 text-amber-700">
                {result.warnings.map((warning, index) => (
                  <li key={`warning-${index}`}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            <span>
              Validated by: <span className="font-semibold capitalize">{result.validator}</span>
              {result.reviewRequired && " • Expert review recommended"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};