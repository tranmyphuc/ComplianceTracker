import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, FileText, GraduationCap, Lock, Unlock } from "lucide-react";
import { motion } from "framer-motion";
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
  // Ensure progress is a valid object
  const safeProgress = progress && typeof progress === 'object' ? progress : {};

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-gray-200">
            <CardHeader className="pb-2">
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded w-full animate-pulse mt-4"></div>
            </CardContent>
            <CardFooter className="pt-2">
              <div className="h-9 bg-gray-200 rounded w-full animate-pulse"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!Array.isArray(modules) || modules.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p>No training modules available for your role. Please check back later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {modules.map((module, index) => {
        const isLocked = isModuleLocked(module.id, index);
        const currentProgress = safeProgress[module.id]?.completion || 0;
        const isCompleted = currentProgress === 100;
        
        return (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`border ${isLocked ? 'border-gray-200 bg-gray-50' : 'border-primary/20'}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {isLocked ? (
                      <span className="flex items-center text-gray-500">
                        <Lock className="mr-2 h-4 w-4" /> {module.title}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <GraduationCap className="mr-2 h-5 w-5" /> {module.title}
                      </span>
                    )}
                  </CardTitle>
                  {isCompleted && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Completed
                    </Badge>
                  )}
                </div>
                <CardDescription className={isLocked ? 'text-gray-400' : ''}>
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {module.topics.map((topic, i) => (
                    <Badge 
                      key={i} 
                      variant="secondary" 
                      className={isLocked ? 'bg-gray-100 text-gray-400' : ''}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 opacity-70" />
                    <span className={isLocked ? 'text-gray-400' : 'text-gray-600'}>
                      {module.estimated_time}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1 opacity-70" />
                    <span className={isLocked ? 'text-gray-400' : 'text-gray-600'}>
                      {isCompleted ? 'All sections completed' : 'Multiple sections'}
                    </span>
                  </div>
                </div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className={isLocked ? 'text-gray-400' : ''}>Progress</span>
                  <span className={isLocked ? 'text-gray-400' : ''}>
                    {currentProgress}%
                  </span>
                </div>
                <Progress 
                  value={currentProgress} 
                  className={isLocked ? 'bg-gray-200' : ''} 
                />
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  className="w-full"
                  variant={isLocked ? "outline" : "default"}
                  disabled={isLocked}
                  onClick={() => onSelectModule(module.id)}
                >
                  {isLocked ? (
                    <>
                      <Lock className="mr-2 h-4 w-4" /> 
                      Complete Previous Module
                    </>
                  ) : isCompleted ? (
                    <>
                      <GraduationCap className="mr-2 h-4 w-4" /> 
                      Review Module
                    </>
                  ) : currentProgress > 0 ? (
                    <>
                      <GraduationCap className="mr-2 h-4 w-4" /> 
                      Continue Module
                    </>
                  ) : (
                    <>
                      <Unlock className="mr-2 h-4 w-4" /> 
                      Start Module
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}