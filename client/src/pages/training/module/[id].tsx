
import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookOpen } from "lucide-react";
import { TrainingContent } from "@/components/training/training-content";
import axios from 'axios';

export default function ModuleView() {
  const [, params] = useRoute('/training/module/:id');
  const [, navigate] = useLocation();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [moduleData, setModuleData] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        setLoading(true);
        // Fetch module content
        const response = await axios.get(`/api/training/modules/${id}`);
        setModuleData(response.data);
        
        // Fetch user progress for this module
        const progressResponse = await axios.get(`/api/training/progress?moduleId=${id}`);
        if (progressResponse.data && progressResponse.data.completion) {
          setProgress(progressResponse.data.completion);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching module data:', error);
        setLoading(false);
      }
    };
    
    if (id) {
      fetchModuleData();
    }
  }, [id]);
  
  const handleComplete = async (score: number) => {
    try {
      // Update progress to 100% when assessment is passed
      await axios.post('/api/training/progress', {
        moduleId: id,
        completion: 100,
        assessmentScore: score
      });
      
      setProgress(100);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/training')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Training
          </Button>
        </div>
        
        <Skeleton className="h-12 w-2/3 mb-4" />
        <Skeleton className="h-4 w-full mb-8" />
        
        <Card>
          <Skeleton className="h-[600px] w-full" />
        </Card>
      </div>
    );
  }
  
  if (!moduleData) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/training')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Training
          </Button>
        </div>
        
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-2">Module Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The training module you're looking for doesn't exist or is unavailable.
          </p>
          <Button onClick={() => navigate('/training')}>
            <BookOpen className="h-4 w-4 mr-2" />
            View Available Modules
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/training')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Training
        </Button>
      </div>
      
      <TrainingContent
        moduleId={id || ''}
        title={moduleData.title}
        content={moduleData.content}
        onComplete={handleComplete}
        progress={progress}
      />
    </div>
  );
}
