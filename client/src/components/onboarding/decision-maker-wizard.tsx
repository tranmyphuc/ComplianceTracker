import React from "react";
import { EnterpriseWizard, WizardStep } from "../wizards/enterprise-wizard";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  BarChart3, 
  Lightbulb, 
  Sparkles, 
  Network, 
  Award
} from "lucide-react";

interface DecisionMakerWizardProps {
  onComplete: () => void;
}

export function DecisionMakerWizard({ onComplete }: DecisionMakerWizardProps) {
  // Define strategic planning specific steps
  const strategicPlanningSteps: WizardStep[] = [
    {
      id: "welcome",
      title: "Welcome to the Enterprise AI Decision Platform",
      subtitle: "Discover how our advanced AI-powered platform can transform your strategic decision-making processes",
      mascotMood: "happy",
      mascotMessage: "Hi there! I'm AI Jack, your guide to making smarter, data-driven decisions with cutting-edge AI!",
      icon: Brain
    },
    {
      id: "insights",
      title: "AI-Powered Market Insights",
      subtitle: "Access real-time market intelligence and predictive analytics to stay ahead of industry trends",
      mascotMood: "explaining",
      mascotMessage: "Our AI analyzes vast amounts of market data to identify patterns that humans might miss, giving you a competitive edge.",
      icon: TrendingUp
    },
    {
      id: "strategic-planning",
      title: "Strategic Planning Tools",
      subtitle: "Leverage AI-driven scenario planning and resource optimization algorithms for better strategic decisions",
      mascotMood: "thinking",
      mascotMessage: "Strategic planning becomes easier with our AI models that can simulate thousands of business scenarios in seconds.",
      icon: Target
    },
    {
      id: "risk-intelligence",
      title: "Risk Intelligence Dashboard",
      subtitle: "Identify, quantify and mitigate business risks with predictive analytics and early warning systems",
      mascotMood: "explaining",
      mascotMessage: "Our risk intelligence system detects potential threats before they materialize, allowing proactive management.",
      icon: AlertTriangle
    },
    {
      id: "executive-dashboard",
      title: "Executive Decision Dashboard",
      subtitle: "Access a customizable dashboard with key performance indicators and decision-critical metrics",
      mascotMood: "explaining",
      mascotMessage: "Your personalized executive dashboard highlights the most important information for your decision-making needs.",
      icon: BarChart3
    },
    {
      id: "opportunity-detection",
      title: "AI Opportunity Detection",
      subtitle: "Automatically identify new business opportunities and growth areas using advanced pattern recognition",
      mascotMood: "happy",
      mascotMessage: "Our AI can spot emerging opportunities that align with your business strategy and resource capabilities.",
      icon: Lightbulb
    },
    {
      id: "generative-insights",
      title: "Generative AI Insights",
      subtitle: "Generate creative solutions to complex business challenges with our advanced generative AI models",
      mascotMood: "thinking",
      mascotMessage: "Tackle your toughest business problems with AI that can suggest innovative approaches you might not have considered.",
      icon: Sparkles
    },
    {
      id: "integration",
      title: "Seamless Data Integration",
      subtitle: "Connect all your business systems and data sources for a unified view of your enterprise",
      mascotMood: "explaining",
      mascotMessage: "No more siloed data! Our platform integrates information from across your organization for holistic insights.",
      icon: Network
    },
    {
      id: "complete",
      title: "Ready to Transform Your Decision-Making",
      subtitle: "You're now equipped to harness the power of AI for smarter, faster, and more effective business decisions",
      mascotMood: "happy",
      mascotMessage: "Congratulations! You're all set to revolutionize your strategic decision-making process with AI. Let's get started!",
      icon: Award
    }
  ];

  return (
    <EnterpriseWizard
      steps={strategicPlanningSteps}
      onComplete={onComplete}
      variant="centered"
      initialStep={1}
      title="Strategic Planning Tools"
      description="Optimize your strategic decision-making with AI"
    />
  );
}