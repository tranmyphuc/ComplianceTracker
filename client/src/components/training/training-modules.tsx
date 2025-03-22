import { useState } from "react";
import { Card, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ChevronRight, Lock, Clock, ListChecks, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  estimated_time: string;
  topics: string[];
  role_relevance: {
    decision_maker: string;
    developer: string;
    operator: string;
    user: string;
  };
}

interface TrainingModulesProps {
  modules: TrainingModule[];
  progress: Record<string, { completion: number }>;
  isLoading: boolean;
  onSelectModule: (moduleId: string) => void;
  isModuleLocked: (moduleId: string, index: number) => boolean;
}

export function TrainingModules({
  modules,
  progress,
  isLoading,
  onSelectModule,
  isModuleLocked
}: TrainingModulesProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="py-6">
              <Skeleton className="h-7 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex flex-wrap gap-2 mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-full mt-4" />
              <div className="flex justify-between items-center mt-6">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center p-6">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No training modules available</h3>
            <p className="text-muted-foreground">
              Training modules will be added soon. Please check back later.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {modules.map((module, index) => {
        const moduleProgress = progress[module.id]?.completion || 0;
        const isLocked = isModuleLocked(module.id, index);
        
        return (
          <Card key={module.id} className={`relative overflow-hidden ${isLocked ? 'opacity-75' : ''}`}>
            {moduleProgress >= 100 && (
              <div className="absolute right-0 top-0 bg-green-500 text-white px-3 py-1 text-xs font-medium rounded-bl-md">
                Completed
              </div>
            )}
            
            <CardContent className="py-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-1 flex items-center">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 h-8 w-8 text-primary mr-2">
                      {module.id}
                    </span>
                    {module.title}
                    {isLocked && <Lock className="h-4 w-4 ml-2 text-muted-foreground" />}
                  </h3>
                  <p className="text-muted-foreground">{module.description}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {module.topics.slice(0, 3).map((topic, i) => (
                  <Badge key={i} variant="outline" className="bg-primary/5">
                    {topic}
                  </Badge>
                ))}
                {module.topics.length > 3 && (
                  <Badge variant="outline" className="bg-primary/5">
                    +{module.topics.length - 3} more
                  </Badge>
                )}
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  Estimated time: {module.estimated_time}
                </div>
                
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{moduleProgress}%</span>
                </div>
                <Progress value={moduleProgress} className="h-2" />
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <Button
                  onClick={() => onSelectModule(module.id)}
                  disabled={isLocked}
                  className="flex items-center"
                >
                  {moduleProgress > 0 && moduleProgress < 100 ? 'Continue' : 'Start'} 
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                
                {isLocked && (
                  <span className="text-xs text-muted-foreground">
                    Complete previous module first
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}