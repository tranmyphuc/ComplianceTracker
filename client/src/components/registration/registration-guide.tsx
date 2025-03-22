import React from 'react';
import { Card } from '@/components/ui/card';
import { Bot, BrainCircuit, ClipboardList, Database, Upload } from 'lucide-react';

interface StepProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ icon, title, children }) => (
  <div className="flex gap-3 mb-4">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
      {icon}
    </div>
    <div>
      <h4 className="font-medium text-blue-800">{title}</h4>
      <p className="text-sm text-blue-600">{children}</p>
    </div>
  </div>
);

const RegistrationGuide: React.FC = () => {
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
      <h3 className="text-lg font-semibold mb-4 text-blue-800">AI-Powered Registration Guide</h3>

      <div className="mb-6">
        <Step icon={<BrainCircuit className="h-5 w-5" />} title="System Information">
          Enter your AI system's basic details or let our AI suggest classifications
        </Step>
        <Step icon={<Bot className="h-5 w-5" />} title="AI Analysis">
          Our DeepSeek-powered analysis will categorize your system according to EU AI Act requirements
        </Step>
        <Step icon={<Database className="h-5 w-5" />} title="Smart Suggestions">
          Receive tailored recommendations for compliance documentation and requirements
        </Step>
        <Step icon={<ClipboardList className="h-5 w-5" />} title="Review & Submit">
          Verify the AI-generated information and submit your registration
        </Step>
      </div>

      <div className="bg-white p-4 rounded-md border border-blue-100 text-sm text-blue-800">
        <p className="font-medium mb-2">💡 Pro Tip: Enhance AI Accuracy</p>
        <p>For the most accurate AI recommendations, provide detailed information about your system's:</p>
        <ul className="list-disc list-inside mt-1 space-y-1 text-blue-600">
          <li>Primary purpose and functionality</li>
          <li>Technologies and algorithms used</li>
          <li>Data sources and processing methods</li>
          <li>Target users and application context</li>
        </ul>
      </div>
    </Card>
  );
};

export default RegistrationGuide;