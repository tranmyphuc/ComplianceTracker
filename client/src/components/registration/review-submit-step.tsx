
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ReviewSubmitStepProps {
  formData: any;
  errors: Record<string, string>;
}

export const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ formData, errors }) => {
  const renderSection = (title: string, fields: { label: string; key: string }[]) => (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <Card>
        <CardContent className="pt-4">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(({ label, key }) => (
              <div key={key} className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">{label}</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData[key] || 'Not provided'}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Review & Submit</h2>
        <p className="text-gray-500">
          Please review all information before submitting your AI system registration.
        </p>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        {renderSection('Basic Information', [
          { label: 'System Name', key: 'name' },
          { label: 'Vendor/Provider', key: 'vendor' },
          { label: 'Department', key: 'department' },
          { label: 'Version', key: 'version' },
          { label: 'Description', key: 'description' },
          { label: 'Purpose', key: 'purpose' },
        ])}

        <Separator className="my-4" />

        {renderSection('Technical Details', [
          { label: 'AI Capabilities', key: 'aiCapabilities' },
          { label: 'Training Datasets', key: 'trainingDatasets' },
          { label: 'Usage Context', key: 'usageContext' },
          { label: 'Potential Impact', key: 'potentialImpact' },
        ])}

        <Separator className="my-4" />

        {renderSection('Risk Assessment', [
          { label: 'Risk Level', key: 'riskLevel' },
          { label: 'Initial Risk Classification', key: 'initialRiskClassification' },
          { label: 'System Category', key: 'systemCategory' },
          { label: 'Applicable EU AI Act Articles', key: 'applicableArticles' },
        ])}

        {Object.keys(errors).length > 0 && (
          <div className="mt-6 p-4 border border-red-300 bg-red-50 rounded-md">
            <h4 className="text-red-800 font-medium mb-2">Please correct the following errors:</h4>
            <ul className="list-disc pl-5 text-red-700">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ReviewSubmitStep;
