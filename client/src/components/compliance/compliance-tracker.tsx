import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, FileText, CheckSquare, Clock, Shield, Calendar, Bell } from "lucide-react";

interface ComplianceTask {
  id: string;
  title: string;
  category: 'documentation' | 'assessment' | 'monitoring' | 'training';
  dueDate: string;
  status: 'completed' | 'in-progress' | 'pending' | 'overdue';
  importance: 'critical' | 'high' | 'medium' | 'low';
  completionPercentage: number;
}

interface ComplianceCategory {
  name: string;
  score: number;
  tasks: number;
  tasksCompleted: number;
}

export function ComplianceTracker() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Sample compliance data - In a real implementation, this would come from an API
  const [complianceTasks, setComplianceTasks] = useState<ComplianceTask[]>([
    {
      id: "task-1",
      title: "Complete Technical Documentation",
      category: 'documentation',
      dueDate: "2025-04-10",
      status: 'in-progress',
      importance: 'high',
      completionPercentage: 65
    },
    {
      id: "task-2",
      title: "Conduct Risk Assessment",
      category: 'assessment',
      dueDate: "2025-04-15",
      status: 'pending',
      importance: 'critical',
      completionPercentage: 0
    },
    {
      id: "task-3",
      title: "Develop Monitoring Plan",
      category: 'monitoring',
      dueDate: "2025-04-20",
      status: 'pending',
      importance: 'medium',
      completionPercentage: 0
    },
    {
      id: "task-4",
      title: "Complete Training Module 1",
      category: 'training',
      dueDate: "2025-04-05",
      status: 'completed',
      importance: 'high',
      completionPercentage: 100
    },
    {
      id: "task-5",
      title: "Prepare Compliance Statement",
      category: 'documentation',
      dueDate: "2025-03-25",
      status: 'overdue',
      importance: 'critical',
      completionPercentage: 30
    },
    {
      id: "task-6",
      title: "Review Data Governance Policy",
      category: 'documentation',
      dueDate: "2025-04-30",
      status: 'pending',
      importance: 'medium',
      completionPercentage: 0
    },
    {
      id: "task-7",
      title: "Complete Training Module 2",
      category: 'training',
      dueDate: "2025-04-12",
      status: 'in-progress',
      importance: 'medium',
      completionPercentage: 45
    },
    {
      id: "task-8",
      title: "Schedule Conformity Assessment",
      category: 'assessment',
      dueDate: "2025-05-10",
      status: 'pending',
      importance: 'high',
      completionPercentage: 0
    }
  ]);
  
  // Calculate compliance categories data
  const complianceCategories: ComplianceCategory[] = [
    {
      name: 'Documentation',
      score: calculateCategoryScore('documentation'),
      tasks: complianceTasks.filter(t => t.category === 'documentation').length,
      tasksCompleted: complianceTasks.filter(t => t.category === 'documentation' && t.status === 'completed').length
    },
    {
      name: 'Risk Assessment',
      score: calculateCategoryScore('assessment'),
      tasks: complianceTasks.filter(t => t.category === 'assessment').length,
      tasksCompleted: complianceTasks.filter(t => t.category === 'assessment' && t.status === 'completed').length
    },
    {
      name: 'Monitoring',
      score: calculateCategoryScore('monitoring'),
      tasks: complianceTasks.filter(t => t.category === 'monitoring').length,
      tasksCompleted: complianceTasks.filter(t => t.category === 'monitoring' && t.status === 'completed').length
    },
    {
      name: 'Training',
      score: calculateCategoryScore('training'),
      tasks: complianceTasks.filter(t => t.category === 'training').length,
      tasksCompleted: complianceTasks.filter(t => t.category === 'training' && t.status === 'completed').length
    }
  ];
  
  // Calculate overall compliance score
  const overallScore = complianceCategories.reduce((acc, cat) => acc + cat.score, 0) / complianceCategories.length;
  
  // Calculate score for a specific category
  function calculateCategoryScore(category: string): number {
    const categoryTasks = complianceTasks.filter(t => t.category === category);
    if (categoryTasks.length === 0) return 0;
    
    return categoryTasks.reduce((acc, task) => acc + task.completionPercentage, 0) / categoryTasks.length;
  }
  
  // Toggle task completion status
  const toggleTaskStatus = (taskId: string) => {
    setComplianceTasks(tasks => tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'in-progress' : 'completed';
        const newPercentage = newStatus === 'completed' ? 100 : 50;
        return { ...task, status: newStatus, completionPercentage: newPercentage };
      }
      return task;
    }));
  };

  // Get task variant based on importance
  const getTaskVariant = (importance: string) => {
    switch (importance) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };
  
  // Get task icon based on category
  const getTaskIcon = (category: string) => {
    switch (category) {
      case 'documentation': return <FileText className="h-4 w-4" />;
      case 'assessment': return <Shield className="h-4 w-4" />;
      case 'monitoring': return <Bell className="h-4 w-4" />;
      case 'training': return <CheckSquare className="h-4 w-4" />;
      default: return <CheckSquare className="h-4 w-4" />;
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Check if a task is overdue
  const isTaskOverdue = (task: ComplianceTask) => {
    return task.status !== 'completed' && 
           new Date(task.dueDate) < new Date() && 
           task.dueDate !== '';
  };
  
  // Get upcoming tasks
  const getUpcomingTasks = () => {
    return complianceTasks
      .filter(task => task.status !== 'completed' && !isTaskOverdue(task))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3);
  };
  
  // Get overdue tasks
  const getOverdueTasks = () => {
    return complianceTasks
      .filter(task => isTaskOverdue(task))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>EU AI Act Compliance Tracker</CardTitle>
          <CardDescription>
            Track your compliance progress and manage required tasks
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">
                <Shield className="mr-2 h-4 w-4" /> Dashboard
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <CheckSquare className="mr-2 h-4 w-4" /> Tasks
              </TabsTrigger>
              <TabsTrigger value="calendar">
                <Calendar className="mr-2 h-4 w-4" /> Calendar
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="p-4 pt-6">
              <div className="space-y-6">
                {/* Overall compliance score */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Overall Compliance</h3>
                    <span className="text-sm font-bold">{Math.round(overallScore)}%</span>
                  </div>
                  <Progress value={overallScore} className="h-2" />
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {/* Compliance status indicators */}
                    <Badge variant={overallScore >= 80 ? "default" : overallScore >= 50 ? "outline" : "destructive"} 
                           className={overallScore >= 80 ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                      {overallScore >= 80 ? "Compliant" : overallScore >= 50 ? "In Progress" : "Action Required"}
                    </Badge>
                    
                    {getOverdueTasks().length > 0 && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" /> {getOverdueTasks().length} Overdue
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Category compliance scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {complianceCategories.map((category, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="p-3 pb-0">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                          <span className="text-xs">{category.tasksCompleted}/{category.tasks} Tasks</span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-2">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span>Progress</span>
                            <span className="font-medium">{Math.round(category.score)}%</span>
                          </div>
                          <Progress value={category.score} className="h-1.5" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Upcoming tasks summary */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Upcoming Tasks</h3>
                    <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs" onClick={() => setActiveTab("tasks")}>
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {getUpcomingTasks().length > 0 ? getUpcomingTasks().map((task) => (
                      <div key={task.id} className="flex items-start p-2 border rounded-md bg-card">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center">
                            {getTaskIcon(task.category)}
                            <span className="ml-2 text-sm font-medium truncate">{task.title}</span>
                          </div>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Due {formatDate(task.dueDate)}</span>
                          </div>
                        </div>
                        
                        <Badge variant={getTaskVariant(task.importance)} className="ml-2 capitalize">
                          {task.importance}
                        </Badge>
                      </div>
                    )) : (
                      <div className="text-center py-4 text-sm text-gray-500">
                        All caught up! No upcoming tasks.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tasks" className="p-4 pt-6">
              {/* Task filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary">All</Badge>
                <Badge variant="secondary" className="cursor-pointer">Pending</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary">In Progress</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Completed</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Overdue</Badge>
              </div>
              
              {/* Tasks list */}
              <div className="space-y-3 mt-4">
                {complianceTasks.map((task) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border rounded-md p-3 bg-card"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            task.status === 'completed' ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'
                          }`}
                        >
                          {task.status === 'completed' && <CheckCircle className="h-4 w-4 text-white" />}
                        </button>
                      </div>
                      
                      <div className="ml-3 min-w-0 flex-1">
                        <div className="flex justify-between">
                          <span className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </span>
                          <Badge variant={getTaskVariant(task.importance)}>
                            {task.importance}
                          </Badge>
                        </div>
                        
                        <div className="mt-1">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span className={isTaskOverdue(task) ? 'text-red-500 font-medium' : ''}>
                                  Due {formatDate(task.dueDate)}
                                  {isTaskOverdue(task) ? ' (Overdue)' : ''}
                                </span>
                              </span>
                              <span>{task.completionPercentage}%</span>
                            </div>
                            <Progress value={task.completionPercentage} className="h-1.5" />
                          </div>
                          
                          <div className="flex items-center mt-2 gap-2">
                            <Badge variant="outline" className="text-xs capitalize">
                              {getTaskIcon(task.category)} {task.category}
                            </Badge>
                            <Badge variant="outline" className={`text-xs capitalize ${
                              task.status === 'completed' ? 'bg-green-50 text-green-700 hover:bg-green-50' :
                              task.status === 'in-progress' ? 'bg-blue-50 text-blue-700 hover:bg-blue-50' :
                              task.status === 'overdue' ? 'bg-red-50 text-red-700 hover:bg-red-50' :
                              'bg-amber-50 text-amber-700 hover:bg-amber-50'
                            }`}>
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="calendar" className="p-4 pt-6">
              <div className="bg-gray-50 rounded-md p-4 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-700">Calendar View Coming Soon</h3>
                <p className="text-sm text-gray-500 mt-1">
                  We're working on a calendar view to help you visualize your compliance deadlines.
                </p>
              </div>
              
              {/* Timeline of upcoming deadlines */}
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Upcoming Deadlines</h3>
                
                <div className="relative border-l border-gray-200 pl-4 ml-2 space-y-6">
                  {complianceTasks
                    .filter(task => task.status !== 'completed')
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .slice(0, 5)
                    .map((task, index) => (
                      <div key={task.id} className="relative">
                        <div className="absolute -left-[21px] h-4 w-4 rounded-full bg-primary border-2 border-white"></div>
                        <div className="mb-1 text-sm font-semibold">{formatDate(task.dueDate)}</div>
                        <div className="p-3 bg-white rounded-md border shadow-sm">
                          <div className="flex justify-between items-start">
                            <div className="min-w-0">
                              <div className="font-medium">{task.title}</div>
                              <div className="mt-1 flex items-center text-xs text-gray-500">
                                {getTaskIcon(task.category)}
                                <span className="ml-1 capitalize">{task.category}</span>
                              </div>
                            </div>
                            <Badge variant={getTaskVariant(task.importance)}>
                              {task.importance}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}