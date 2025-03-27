import React from 'react';
import { Link } from 'wouter';

interface ScenarioCard {
  id: string;
  title: string;
  description: string;
  industry: string;
  path: string;
}

const scenarios: ScenarioCard[] = [
  {
    id: 'healthcare',
    title: 'Healthcare AI Diagnostics',
    description: 'Advanced AI diagnostic tools for medical imaging and patient data analysis.',
    industry: 'Healthcare',
    path: '/demo-scenarios/healthcare-ai-diagnostics'
  },
  {
    id: 'sgh-service',
    title: 'SGH Asia AI Compliance Consulting',
    description: 'Expert consulting services for AI compliance and risk management.',
    industry: 'Professional Services',
    path: '/demo-scenarios/sgh-service-consulting'
  },
  {
    id: 'fintech',
    title: 'Fintech Fraud Detection',
    description: 'Real-time fraud detection systems for financial institutions.',
    industry: 'Financial Services',
    path: '/demo-scenarios/fintech-fraud-detection'
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing Predictive Maintenance',
    description: 'AI-powered predictive maintenance for manufacturing equipment.',
    industry: 'Manufacturing',
    path: '/demo-scenarios/manufacturing-predictive-maintenance'
  }
];

const DemoScenarios: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">EU AI Act Compliance Demonstration Scenarios</h1>
        <p className="text-lg text-muted-foreground">
          Explore real-world examples of how organizations achieve EU AI Act compliance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <Link key={scenario.id} href={scenario.path}>
            <a className="block p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-card">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
                  {scenario.industry}
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-2">{scenario.title}</h2>
              <p className="text-muted-foreground mb-4">{scenario.description}</p>
              <span className="text-primary font-medium">View Case Study →</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DemoScenarios;