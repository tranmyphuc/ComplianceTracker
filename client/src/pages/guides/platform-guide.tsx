import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  MessageCircle 
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface GuideSlide {
  title: string;
  image: string;
  description: string;
  jackMessage?: string;
}

export default function PlatformGuide() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
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
                          <div className="absolute bottom-0 right-0 left-0 bg-black/60 p-4 flex items-start gap-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-primary bg-white">
                              <img 
                                src="/assets/1000048340-modified.png" 
                                alt="Jack from SGH ASIA" 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">Jack from SGH ASIA</p>
                              <p className="text-white text-sm mt-1">{slide.jackMessage}</p>
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