
import React from 'react';
import { EnterpriseWizard } from '../wizards/enterprise-wizard';

interface EnterpriseDecisionPlatformProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function EnterpriseDecisionPlatform({ onComplete, onSkip }: EnterpriseDecisionPlatformProps) {
  // Define custom steps with images and detailed content
  const platformTourSteps = [
    {
      id: "welcome",
      title: "Welcome to the Enterprise AI Decision Platform",
      subtitle: "Discover how our advanced AI-powered platform can transform your business",
      content: "Our platform integrates cutting-edge AI technology with your business expertise to provide actionable insights and recommendations for better decision-making.",
      mascotMood: "happy",
      mascotMessage: "Hi there! I'm your AI assistant, ready to help you make smarter, data-driven decisions!",
      icon: undefined,
      imageSrc: "/assets/images/tour/welcome-dashboard.png"
    },
    {
      id: "insights",
      title: "AI-Powered Market Insights",
      subtitle: "Access real-time market intelligence and predictive analytics",
      content: "Our AI analyzes vast amounts of market data to identify patterns and trends that might be missed by human analysis, giving you a competitive edge in your industry.",
      mascotMood: "explaining",
      mascotMessage: "I can analyze industry trends and market conditions to help you stay ahead of the competition!",
      icon: undefined,
      imageSrc: "/assets/images/tour/market-insights.png"
    },
    {
      id: "strategic-planning",
      title: "Strategic Planning Tools",
      subtitle: "Leverage AI-driven scenario planning and resource optimization",
      content: "Use our advanced modeling tools to simulate various business scenarios and optimize resource allocation for maximum efficiency and profitability.",
      mascotMood: "thinking",
      mascotMessage: "Strategic planning becomes easier with models that can simulate thousands of business scenarios in seconds.",
      icon: undefined,
      imageSrc: "/assets/images/tour/strategic-planning.png"
    },
    {
      id: "risk-assessment",
      title: "Risk Intelligence Dashboard",
      subtitle: "Identify and mitigate potential risks before they impact your business",
      content: "Our risk assessment tools help you identify, quantify, and mitigate various business risks, ensuring your operations remain resilient in challenging environments.",
      mascotMood: "alert",
      mascotMessage: "I'll help you identify potential risks and develop strategies to mitigate them effectively.",
      icon: undefined,
      imageSrc: "/assets/images/tour/risk-dashboard.png"
    },
    {
      id: "decision-support",
      title: "AI Decision Support System",
      subtitle: "Get personalized recommendations based on your business goals",
      content: "Our AI analyzes your specific business context and provides tailored recommendations to help you achieve your strategic objectives more effectively.",
      mascotMood: "confident",
      mascotMessage: "By analyzing your business data, I can provide personalized recommendations aligned with your strategic goals.",
      icon: undefined,
      imageSrc: "/assets/images/tour/decision-support.png"
    },
    {
      id: "get-started",
      title: "Ready to Transform Your Decision-Making?",
      subtitle: "Start exploring the platform to discover its full potential",
      content: "Dive into our platform's features and start leveraging the power of AI to enhance your strategic decision-making processes and drive business growth.",
      mascotMood: "excited",
      mascotMessage: "You're all set! Start exploring the platform to see how AI can revolutionize your decision-making processes.",
      icon: undefined,
      imageSrc: "/assets/images/tour/get-started.png"
    }
  ];

  return (
    <EnterpriseWizard
      steps={platformTourSteps}
      onComplete={onComplete}
      onSkip={onSkip}
      variant="default"
      title="Enterprise AI Decision Platform"
      description="Transform your decision-making with AI-powered insights"
    />
  );
}
