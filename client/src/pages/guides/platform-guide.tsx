import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  MessageCircle,
  PanelRight,
  LightbulbIcon 
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AIJack } from "@/components/onboarding/ai-jack";

interface GuideSlide {
  title: string;
  image: string;
  description: string;
  jackMessage?: string;
}

export default function PlatformGuide() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSideTip, setShowSideTip] = useState(false);
  const [tipContent, setTipContent] = useState('');
  
  // Map slide index to Jack's mood
  const getJackMood = (index: number) => {
    switch (index) {
      case 0: return 'happy';
      case 1: return 'neutral';
      case 2: return 'explaining';
      case 3: return 'thinking';
      case 4: return 'explaining';
      case 5: return 'happy';
      case 6: return 'explaining';
      case 7: return 'thinking';
      case 8: return 'celebrating';
      default: return 'neutral';
    }
  };
  
  // Show contextual tips when slides change
  useEffect(() => {
    const tips = [
      "Click on the Dashboard link in the sidebar to quickly return to your overview at any time.",
      "You can search for AI systems in the inventory using keywords, risk levels, or departments.",
      "The risk assessment wizard will guide you step-by-step through the entire evaluation process.",
      "All documentation is version-controlled, so you can track changes over time.",
      "The Knowledge Center is regularly updated with the latest EU AI Act information.",
      "Training certificates can be exported to PDF for your compliance records.",
      "Configure notification preferences in the Approval Workflow settings.",
      "The Enterprise Decision Platform integrates with your existing business data."
    ];
    
    // Don't show tip for the first slide (welcome slide)
    if (currentSlide > 0 && currentSlide < tips.length + 1) {
      setTipContent(tips[currentSlide - 1]);
      setShowSideTip(true);
      
      const timer = setTimeout(() => {
        setShowSideTip(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);
  
  const slides: GuideSlide[] = [
    {
      title: "Welcome to the EU AI Act Compliance Platform",
      image: "/assets/image_1742743429066.png",
      description: "The platform helps organizations comply with EU AI Act requirements through comprehensive tools and guidance.",
      jackMessage: "Hi there! I'm Jack from SGH ASIA. I'll be your guide through the EU AI Act Compliance Platform. Let's get started!"
    },
    {
      title: "Dashboard Overview",
      image: "/assets/image_1742743497917.png",
      description: "The dashboard provides a quick overview of your AI systems, compliance status, and upcoming deadlines.",
      jackMessage: "The dashboard is your home base - from here you can see your compliance status at a glance and access all key features."
    },
    {
      title: "AI System Inventory",
      image: "/assets/image_1742743876462.png",
      description: "Register and manage all your AI systems in one place with detailed information and categorization.",
      jackMessage: "Keep track of all your AI systems in the inventory. You can add new systems, view details, and monitor their compliance status."
    },
    {
      title: "Risk Assessment",
      image: "/assets/image_1742743911900.png",
      description: "Assess your AI systems against EU AI Act risk criteria to determine compliance requirements.",
      jackMessage: "The risk assessment module helps you evaluate your AI systems against EU AI Act requirements and determine their risk level."
    },
    {
      title: "Documentation Management",
      image: "/assets/image_1742744055101.png",
      description: "Generate and manage required documentation for your AI systems based on their risk level.",
      jackMessage: "All your compliance documentation is managed here. You can generate new documents, update existing ones, and track versions."
    },
    {
      title: "Knowledge Center",
      image: "/assets/image_1742744290973.png",
      description: "Access comprehensive resources about the EU AI Act and compliance requirements.",
      jackMessage: "Need information about EU AI Act requirements? The Knowledge Center has all the resources you need!"
    },
    {
      title: "Training Modules",
      image: "/assets/image_1742744340585.png",
      description: "Access role-specific training modules to educate your team about EU AI Act compliance.",
      jackMessage: "Keep your team up-to-date with our training modules. They're tailored to different roles within your organization."
    },
    {
      title: "Approval Workflow",
      image: "/assets/image_1742744388676.png",
      description: "Manage compliance approvals with structured workflows and notifications.",
      jackMessage: "The approval workflow ensures proper oversight of your compliance activities with structured processes and notifications."
    },
    {
      title: "Enterprise Decision Platform",
      image: "/assets/image_1742744524028.png",
      description: "Strategic planning tools to incorporate AI compliance into your business strategy.",
      jackMessage: "The Enterprise Decision Platform helps you integrate AI compliance into your broader business strategy with powerful analytics."
    }
  ];
  
  const handlePrevious = () => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/guides">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Guides
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">EU AI Act Compliance Platform Guide</h1>
        <p className="text-muted-foreground">
          A visual tour of the SGH ASIA EU AI Act Compliance Platform with Jack
        </p>
      </div>
      
      <div className="mb-8">
        <Carousel 
          className="w-full"
          setApi={(api) => {
            api?.on("select", () => {
              setCurrentSlide(api.selectedScrollSnap());
            });
            // Initial slide setup
            if (api && currentSlide > 0) {
              api.scrollTo(currentSlide);
            }
          }}
        >
          <CarouselContent className="-ml-1">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="pl-1 md:basis-full lg:basis-full">
                <div className="p-1">
                  <Card className="overflow-hidden">
                    <CardHeader className="p-4 bg-muted/30">
                      <CardTitle className="text-xl">{slide.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="aspect-video bg-muted">
                          <img 
                            src={slide.image} 
                            alt={slide.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        {slide.jackMessage && (
                          <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/90 to-black/30 p-4 flex items-start gap-3">
                            <div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-primary bg-white">
                              <img 
                                src="/assets/1000048340-modified.png" 
                                alt="Jack from SGH ASIA" 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-white">Jack from SGH ASIA</p>
                                <span className="px-2 py-0.5 bg-primary/80 text-white text-xs rounded-full">Guide</span>
                              </div>
                              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mt-2 text-white text-sm">
                                {slide.jackMessage}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <p className="text-muted-foreground">{slide.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentSlide + 1} of {slides.length}
            </span>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="hidden">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
        
        {/* Floating contextual tip with Jack */}
        <AnimatePresence>
          {showSideTip && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="fixed right-8 top-1/3 max-w-sm z-50"
            >
              <Card className="border-primary/30 shadow-lg relative overflow-visible">
                <div className="absolute -left-6 top-8">
                  <AIJack 
                    mood={getJackMood(currentSlide) as any}
                    size="md"
                    animate={true}
                  />
                </div>
                <CardContent className="p-4 pl-12">
                  <div className="flex items-center gap-2 mb-2">
                    <LightbulbIcon className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Pro Tip</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tipContent}</p>
                  <div className="mt-3 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => setShowSideTip(false)}
                    >
                      Got it
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Maximize2 className="h-5 w-5 text-primary" />
              Explore Specific Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Want to learn more about specific features of the platform? Check out these detailed guides:
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" asChild className="w-full justify-start">
                <Link href="/guides/risk-assessment-guide">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Risk Assessment Guide
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="w-full justify-start">
                <Link href="/guides/registration-guide">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  System Registration Guide
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="w-full justify-start">
                <Link href="/guides/documentation-guide">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Documentation Guide
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="w-full justify-start">
                <Link href="/guides/approval-workflow">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Approval Workflow Guide
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you have questions or need assistance with the platform, our support team is here to help:
            </p>
            <div className="space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium">Use the AI Assistant</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click the AI Assistant button in the bottom right corner to ask questions about the platform or EU AI Act compliance.
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium">Try Voice Commands</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Use the Voice Assistant to navigate the platform and get information using voice commands.
                </p>
              </div>
              <Button className="w-full">Contact Support</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/guides">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Guides
          </Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard">
            Start Using the Platform
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}