
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, BarChart3, LucideIcon, PlayCircleIcon, ChevronRight, ChevronLeft, Lightbulb, Sliders, Clock, TrendingUp, LineChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TourStep } from '@/types/wizard';

interface EnterpriseTourWizardProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export function EnterpriseTourWizard({ onComplete, onSkip }: EnterpriseTourWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      id: "overview",
      title: "🚀 Enterprise AI Decision Platform",
      subtitle: "Revolutionize your EU AI Act compliance strategy",
      content: "Our AI-powered decision platform helps you make informed strategic choices about your AI systems, compliance priorities, and resource allocation.",
      mascotMood: "friendly",
      mascotMessage: "I'm your AI assistant! Let me show you around our platform! 🎯",
      icon: BarChart3,
      imageSrc: "/assets/images/tour/platform-overview.png",
      features: [
        "✅ AI-powered decision support",
        "✅ Strategic compliance planning",
        "✅ Resource optimization tools"
      ]
    },
    {
      id: "risk-analysis",
      title: "⚖️ Compliance Risk Analysis",
      subtitle: "Identify and prioritize your compliance risks",
      content: "Our advanced analytics help you identify high-risk AI systems, prioritize compliance efforts, and allocate resources effectively.",
      mascotMood: "analytical",
      mascotMessage: "Let's analyze your risks together and find the best approach! 📊",
      icon: Sliders,
      imageSrc: "/assets/images/tour/risk-analysis.png",
      features: [
        "✅ Automated risk scoring",
        "✅ Compliance gap analysis",
        "✅ Priority recommendations"
      ]
    },
    {
      id: "decision-timeline",
      title: "⏱️ Strategic Timeline Planning",
      subtitle: "Plan your compliance journey with confidence",
      content: "Our timeline tools help you create realistic implementation schedules, track progress, and adjust your strategy as regulatory requirements evolve.",
      mascotMood: "organized",
      mascotMessage: "Stay on track with our interactive timeline tools! 📅",
      icon: Clock,
      imageSrc: "/assets/images/tour/timeline.png",
      features: [
        "✅ Interactive Gantt charts",
        "✅ Milestone tracking",
        "✅ Regulatory deadline alerts"
      ]
    },
    {
      id: "investment-optimization",
      title: "💰 Compliance Investment Optimization",
      subtitle: "Maximize the return on your compliance investments",
      content: "Our optimization tools help you allocate your compliance budget effectively, focusing on high-impact areas and avoiding unnecessary expenditures.",
      mascotMood: "thoughtful",
      mascotMessage: "Let me help you make the most of your compliance budget! 💸",
      icon: LineChart,
      imageSrc: "/assets/images/tour/investment.png",
      features: [
        "✅ Budget allocation models",
        "✅ ROI analysis for compliance measures",
        "✅ Cost-benefit comparisons"
      ]
    },
    {
      id: "market-advantage",
      title: "🏆 Competitive Advantage Analysis",
      subtitle: "Transform compliance into a competitive edge",
      content: "Our AI algorithms analyze market trends, customer preferences, and industry data to help you leverage your compliance efforts for business growth and innovation.",
      mascotMood: "excited",
      mascotMessage: "Let's discover hidden opportunities in your compliance data! 🔍",
      icon: TrendingUp,
      imageSrc: "/assets/images/tour/competitive-edge.png",
      features: [
        "✅ Market positioning analysis",
        "✅ Customer trust projections",
        "✅ Innovation opportunity mapping"
      ]
    },
    {
      id: "completion",
      title: "🎉 Ready to Transform Your Decision-Making",
      subtitle: "You've completed the overview of our Enterprise AI Decision Platform!",
      content: "Dive into our platform's features and start leveraging the power of AI to enhance your strategic decision-making processes for EU AI Act compliance.",
      mascotMood: "happy",
      mascotMessage: "I'm excited to help you get started with your AI compliance journey! 🚀",
      icon: Award,
      imageSrc: "/assets/images/tour/placeholder.png",
      features: [
        "✅ Personalized dashboard",
        "✅ AI-powered recommendations",
        "✅ Continuous compliance support"
      ]
    },
  ];

  const nextStep = () => {
    if (currentStep === steps.length - 1) {
      onComplete && onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const isLastStep = currentStep === steps.length - 1;
  const step = steps[currentStep];

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStep]);

  return (
    <Card className="border-2 border-primary/20 shadow-lg" ref={cardRef}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-900">
            {currentStep + 1}/{steps.length}: {step.title}
          </CardTitle>
          <step.icon className="h-6 w-6 text-primary" />
        </div>
        <p className="text-blue-700 font-medium">{step.subtitle}</p>
      </CardHeader>

      <CardContent className="pt-6 pb-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl">
                  {currentStep + 1}
                </div>
                <p className="text-blue-800">{step.content}</p>
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
              <h4 className="font-semibold mb-2 text-blue-900">✨ Key Features:</h4>
              <ul className="space-y-2">
                {step.features && step.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-blue-800">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100 shadow-sm">
              <h3 className="font-bold text-lg text-indigo-900 mb-3">💡 Why This Matters</h3>
              <p className="text-indigo-800">
                The Enterprise AI Decision Platform helps you navigate the complexities of the EU AI Act with confidence.
                By using data-driven insights, you can make strategic decisions that ensure compliance while optimizing costs.
              </p>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg border-2 border-blue-100 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xl">
                  🤖
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">AI Assistant Says:</h4>
                  <p className="text-blue-800">
                    {step.mascotMessage}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100 shadow-sm">
              <h3 className="font-bold text-lg text-green-900 mb-3">🔑 Benefits</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-green-800">
                  ✅ Reduce compliance risks
                </li>
                <li className="flex items-center gap-2 text-green-800">
                  ✅ Optimize resource allocation
                </li>
                <li className="flex items-center gap-2 text-green-800">
                  ✅ Stay ahead of regulatory changes
                </li>
                <li className="flex items-center gap-2 text-green-800">
                  ✅ Turn compliance into competitive advantage
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4 border-t bg-gradient-to-r from-gray-50 to-slate-50">
        <div>
          {currentStep === 0 && onSkip && (
            <Button variant="ghost" onClick={onSkip} className="text-gray-600">
              Skip Tour 🏃
            </Button>
          )}
          
          {currentStep > 0 && (
            <Button variant="outline" onClick={prevStep} className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          )}
        </div>
        
        <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1">
          {isLastStep ? '🎉 Complete Tour' : 'Next Step'}
          {!isLastStep && <ChevronRight className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Export alias for backward compatibility
export const EnterpriseWizard = EnterpriseTourWizard;
