import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Clock, CheckCircle, ChevronRight, Lock } from "lucide-react";
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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-2/3 mt-2" />
                <div className="flex flex-wrap gap-2 mt-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <div className="border-t px-6 py-4">
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No training modules available</h3>
        <p className="text-muted-foreground">
          Training modules will appear here when they are available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {modules.map((module, index) => {
        const moduleProgress = progress && progress[module.id] ? progress[module.id].completion : 0;
        const isLocked = isModuleLocked(module.id, index);

        return (
          <Card 
            key={module.id} 
            className={`overflow-hidden transition-colors ${isLocked ? 'opacity-75' : 'hover:bg-accent/5'}`}
          >
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{module.title}</h3>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{module.estimated_time}</span>
                  </div>
                </div>
                <p className="text-muted-foreground mt-1">{module.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {module.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="font-normal">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="border-t px-6 py-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span>{moduleProgress < 100 ? 'Progress' : 'Completed'}</span>
                  <span>{moduleProgress}%</span>
                </div>
                <Progress value={moduleProgress} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 px-6 py-3 justify-between">
              <div className="flex items-center">
                {moduleProgress >= 100 ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : isLocked ? (
                  <Lock className="h-5 w-5 text-amber-500 mr-2" />
                ) : (
                  <BookOpen className="h-5 w-5 text-primary/80 mr-2" />
                )}
                <span>
                  {moduleProgress >= 100 
                    ? 'Completed' 
                    : isLocked 
                      ? 'Locked' 
                      : moduleProgress > 0 
                        ? 'Continue' 
                        : 'Start'}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onSelectModule(module.id)}
                disabled={isLocked}
                className="gap-1"
              >
                {moduleProgress >= 100 ? 'Review' : moduleProgress > 0 ? 'Continue' : 'Start'} 
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}