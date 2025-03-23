import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronRight, Brain, TrendingUp, Target, BarChart3, Lightbulb, Sparkles, AlertTriangle, Network, Award } from 'lucide-react';
import { Wizard, WizardStep } from '@/components/ui/wizard';
import { Separator } from '@/components/ui/separator';


interface EnterpriseTourWizardProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const defaultSteps: WizardStep[] = [
  {
    id: "welcome",
    title: "👋 Welcome to the Enterprise AI Decision Platform",
    subtitle: "Discover how our advanced AI-powered platform can transform your strategic decision-making processes",
    content: "Our platform integrates cutting-edge AI technology with your business expertise to provide actionable insights and recommendations for better decision-making.",
    mascotMood: "happy",
    mascotMessage: "Hi there! I'm your AI assistant, ready to help you make smarter, data-driven decisions! 😊",
    icon: Brain,
    imageSrc: "/assets/images/tour/welcome-dashboard.png"
  },
  {
    id: "insights",
    title: "📈 AI-Powered Market Insights",
    subtitle: "Access real-time market intelligence and predictive analytics",
    content: "Our AI analyzes vast amounts of market data to identify patterns and trends that might be missed by human analysis, giving you a competitive edge in your industry.",
    mascotMood: "explaining",
    mascotMessage: "I can analyze industry trends and market conditions to help you stay ahead of the competition! 🚀",
    icon: TrendingUp,
    imageSrc: "/assets/images/tour/market-insights.png"
  },
  {
    id: "strategic-planning",
    title: "🎯 Strategic Planning Tools",
    subtitle: "Leverage AI-driven scenario planning and resource optimization",
    content: "Use our advanced modeling tools to simulate various business scenarios and optimize resource allocation for maximum efficiency and profitability.",
    mascotMood: "thinking",
    mascotMessage: "Strategic planning becomes easier with models that can simulate thousands of business scenarios in seconds. 🧠",
    icon: Target,
    imageSrc: "/assets/images/tour/strategic-planning.png"
  },
  {
    id: "risk-assessment",
    title: "⚠️ Risk Intelligence & Compliance",
    subtitle: "Identify and mitigate potential risks while ensuring compliance with EU AI Act requirements",
    content: "Our risk assessment tools help you identify, quantify, and mitigate various business risks, ensuring your operations remain resilient in challenging environments.",
    mascotMood: "alert",
    mascotMessage: "I'll help you identify potential risks and develop strategies to mitigate them effectively. 🛡️",
    icon: AlertTriangle,
    imageSrc: "/assets/images/tour/risk-dashboard.png"
  },
  {
    id: "executive-dashboard",
    title: "📊 Executive Dashboards",
    subtitle: "Gain a holistic view of your organization with customizable, AI-enhanced dashboards",
    content: "These dashboards filter out the noise to highlight what matters most for your key business decisions.",
    mascotMood: "explaining",
    mascotMessage: "These dashboards provide a holistic view of your organization, highlighting key performance indicators for better decision-making. 📱",
    icon: BarChart3,
    imageSrc: "/assets/images/tour/executive-dashboard.png"
  },
  {
    id: "opportunity-discovery",
    title: "💡 Opportunity Discovery",
    subtitle: "Uncover hidden opportunities and gain a competitive advantage",
    content: "Our AI algorithms analyze market trends, customer behavior, and industry data to identify new opportunities for growth and innovation.",
    mascotMood: "excited",
    mascotMessage: "Let me help you discover new opportunities that might be hidden in your data! 🔍",
    icon: Lightbulb,
    imageSrc: "/assets/images/tour/integration.png"
  },
  {
    id: "completion",
    title: "🏆 Ready to Transform Your Decision-Making",
    subtitle: "You've completed the overview of our Enterprise AI Decision Platform. Now it's time to experience the power of AI-driven decision-making!",
    content: "Dive into our platform's features and start leveraging the power of AI to enhance your strategic decision-making processes and drive business growth.",
    mascotMood: "happy",
    mascotMessage: "I'm excited to help you get started with your first AI-assisted decision journey! 🚀",
    icon: Award,
    imageSrc: "/assets/images/tour/completion.png"
  }
];

export function EnterpriseTourWizard({ onComplete, onSkip }: EnterpriseTourWizardProps) {
  return (
    <Wizard 
      steps={defaultSteps} 
      onComplete={onComplete}
      showSkip={true}
      onSkip={onSkip}
    />
  );
}


export function EnterpriseTourContent() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < defaultSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = defaultSteps[currentStep];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <span className="text-3xl">{currentStep === 0 ? "👋" : 
                 currentStep === 1 ? "📈" : 
                 currentStep === 2 ? "🎯" : 
                 currentStep === 3 ? "⚠️" : 
                 currentStep === 4 ? "📊" :
                 currentStep === 5 ? "💡" : "🏆"}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg overflow-hidden">
            <img 
              src={step.imageSrc} 
              alt={step.title} 
              className="w-full h-64 object-cover object-center"
              onError={(e) => {
                // Fallback if image doesn't load
                const target = e.target as HTMLImageElement;
                target.src = "/assets/images/tour/placeholder.png";
              }}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-2">✨ Key Features:</h4>
            <ul className="space-y-2">
              {step.features && step.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 0}
            >
              ← Previous
            </Button>
            <div className="flex items-center gap-1">
              {defaultSteps.map((_, i) => (
                <span 
                  key={i} 
                  className={`block w-2 h-2 rounded-full ${i === currentStep ? 'bg-primary' : 'bg-muted'}`}
                />
              ))}
            </div>
            <Button 
              onClick={nextStep} 
              disabled={currentStep === defaultSteps.length - 1}
            >
              Next →
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}