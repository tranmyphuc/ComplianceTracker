import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Lock, Play, CheckCircle } from "lucide-react";

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
  progress: Record<string, number>;
  isLoading: boolean;
  onSelectModule: (moduleId: string) => void;
  isModuleLocked: (moduleId: string, index: number) => boolean;
}

export function TrainingModules({
  modules,
  progress,
  isLoading,
  onSelectModule,
  isModuleLocked,
}: TrainingModulesProps) {
  // Function to get the badge variant based on relevance level
  const getRelevanceBadgeVariant = (level: string) => {
    switch (level) {
      case "High":
        return "default";
      case "Medium":
        return "secondary";
      case "Low":
        return "outline";
      default:
        return "outline";
    }
  };

  // Function to determine the user's role for display purposes
  // In a real implementation, this would come from the auth context
  const getUserRole = () => "developer";

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="opacity-70">
            <CardHeader className="pb-2 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
            </CardHeader>
            <CardContent className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mt-2"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6 mt-2"></div>
            </CardContent>
            <CardFooter className="animate-pulse">
              <div className="h-9 bg-gray-200 rounded w-1/3"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {modules.map((module, index) => {
        const isLocked = isModuleLocked(module.id, index);
        const isCompleted = (progress[module.id] || 0) === 100;
        const role = getUserRole();
        const relevance = module.role_relevance[role as keyof typeof module.role_relevance] || "Medium";

        return (
          <Card 
            key={module.id} 
            className={`relative transition-all ${isLocked ? 'opacity-60' : 'hover:shadow-md'}`}
          >
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px] rounded-lg z-10">
                <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                  <Lock className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
                  <p className="font-medium">Complete previous module first</p>
                  <p className="text-sm text-gray-500">80% completion required</p>
                </div>
              </div>
            )}

            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    {module.title}
                    {isCompleted && (
                      <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Module {module.id} of {modules.length}
                  </CardDescription>
                </div>
                <Badge variant={getRelevanceBadgeVariant(relevance)}>
                  {relevance} Relevance
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{module.description}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Clock className="mr-2 h-4 w-4" />
                <span>{module.estimated_time}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {module.topics.map((topic, i) => (
                  <Badge key={i} variant="outline" className="bg-gray-50">
                    {topic}
                  </Badge>
                ))}
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{progress[module.id] || 0}%</span>
                </div>
                <Progress value={progress[module.id] || 0} />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={isLocked}
                onClick={() => onSelectModule(module.id)}
              >
                {progress[module.id] ? (
                  progress[module.id] === 100 ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" /> Review Module
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Continue Module
                    </>
                  )
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Start Module
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}