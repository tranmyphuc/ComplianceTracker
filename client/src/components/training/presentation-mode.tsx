
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Download, Copy, Certificate, List } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PresentationProps {
  moduleId: string;
  role?: string;
  onComplete?: () => void;
}

const TrainingPresentation: React.FC<PresentationProps> = ({ moduleId, role = 'technical', onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'slides' | 'outline'>('slides');

  useEffect(() => {
    // Fetch module content
    const fetchModule = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/training/modules/${moduleId}?role=${role}`);
        const data = await response.json();
        
        // Format data into slides
        const formattedSlides = [
          { type: 'title', title: data.title, subtitle: 'EU AI Act Compliance Training' },
          ...data.sections.map((section: any) => ({ 
            type: 'content', 
            title: section.title, 
            content: section.content 
          })),
          { type: 'assessment', assessments: data.assessments, title: 'Knowledge Check' },
          { type: 'certificate', title: 'Module Complete', content: 'You have completed this module' }
        ];
        
        setSlides(formattedSlides);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching module:', error);
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId, role]);

  useEffect(() => {
    if (slides.length > 0) {
      setProgress(Math.min(((currentSlide + 1) / slides.length) * 100, 100));
    }
  }, [currentSlide, slides.length]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const jumpToSlide = (index: number) => {
    setCurrentSlide(index);
    setViewMode('slides');
  };

  const downloadSlides = () => {
    // Generate markdown version of slides
    let markdown = `# ${slides[0]?.title || 'EU AI Act Training'}\n\n`;
    
    slides.forEach(slide => {
      if (slide.type === 'content') {
        markdown += `## ${slide.title}\n\n`;
        // Strip HTML tags for basic markdown conversion
        const content = slide.content.replace(/<[^>]*>?/gm, '');
        markdown += `${content}\n\n`;
      }
    });
    
    // Create and download file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eu-ai-act-training-${moduleId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyContent = () => {
    // Generate text version of slides
    let content = `EU AI Act Training: ${slides[0]?.title || 'Module'}\n\n`;
    
    slides.forEach(slide => {
      if (slide.type === 'content') {
        content += `${slide.title}\n\n`;
        // Strip HTML tags for plain text
        const slideContent = slide.content.replace(/<[^>]*>?/gm, '');
        content += `${slideContent}\n\n`;
      }
    });
    
    navigator.clipboard.writeText(content)
      .then(() => {
        alert('Content copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const renderSlide = (slide: any) => {
    switch (slide.type) {
      case 'title':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h1 className="text-3xl font-bold mb-4">{slide.title}</h1>
            <p className="text-xl text-neutral-600">{slide.subtitle}</p>
            <div className="mt-8">
              <Button size="lg" onClick={nextSlide}>Begin Training</Button>
            </div>
          </div>
        );
      
      case 'content':
        return (
          <div className="h-full overflow-y-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">{slide.title}</h2>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: slide.content }} />
          </div>
        );
      
      case 'assessment':
        return (
          <div className="h-full overflow-y-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">{slide.title}</h2>
            <div className="space-y-6">
              {slide.assessments.map((assessment: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <p className="font-medium mb-3">{assessment.question}</p>
                  <div className="space-y-2">
                    {assessment.options.map((option: string, optIndex: number) => (
                      <div key={optIndex} className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          name={`question-${index}`} 
                          id={`question-${index}-option-${optIndex}`} 
                          className="h-4 w-4"
                        />
                        <label htmlFor={`question-${index}-option-${optIndex}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Button className="mt-4" onClick={nextSlide}>Submit Answers</Button>
            </div>
          </div>
        );
      
      case 'certificate':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Certificate size={64} className="text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Training Complete!</h2>
            <p className="text-lg mb-6">You have successfully completed this training module.</p>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={downloadSlides}>
                <Download className="h-4 w-4 mr-2" />
                Download Materials
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/training'}>
                Continue Learning
              </Button>
            </div>
          </div>
        );
      
      default:
        return <div>Unknown slide type</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading training module...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Progress bar */}
      <div className="px-4 py-2 border-b">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm">{currentSlide + 1} of {slides.length}</span>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setViewMode(viewMode === 'slides' ? 'outline' : 'slides')}>
              <List className="h-4 w-4 mr-1" />
              {viewMode === 'slides' ? 'Show Outline' : 'Show Slides'}
            </Button>
            <Button variant="ghost" size="sm" onClick={copyContent}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button variant="ghost" size="sm" onClick={downloadSlides}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'outline' ? (
          <div className="p-4 h-full overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Module Outline</h3>
            <ul className="space-y-2">
              {slides.map((slide, index) => (
                <li key={index}>
                  <Button
                    variant={currentSlide === index ? "default" : "ghost"}
                    className="w-full justify-start text-left"
                    onClick={() => jumpToSlide(index)}
                  >
                    {index + 1}. {slide.title || (slide.type === 'assessment' ? 'Assessment' : 'Slide')}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <Card className="h-full border-none shadow-none">
            <CardContent className="p-0 h-full">
              {slides.length > 0 && renderSlide(slides[currentSlide])}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation controls */}
      {viewMode === 'slides' && (
        <div className="p-4 border-t flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevSlide} 
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <Button 
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1 && !onComplete}
          >
            {currentSlide === slides.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TrainingPresentation;
