import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertTriangle, 
  ShieldCheck, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Edit,
  Trash2,
  Save,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define interfaces for risk controls
interface RiskControl {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in_progress' | 'implemented' | 'verified';
  type: 'technical' | 'procedural' | 'organizational' | 'legal';
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetDate?: string;
  assignedTo?: string;
  effectiveness?: number; // 0-100
  riskLevel: 'minimal' | 'limited' | 'high' | 'unacceptable';
  mitigatesRisks: string[]; // List of risk IDs this control mitigates
}

interface WeakPoint {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  category: string;
}

interface RiskControlsProps {
  assessmentId: string;
  weakPoints: WeakPoint[];
  existingControls?: RiskControl[];
  onAddControl?: (control: Omit<RiskControl, 'id'>) => void;
  onUpdateControl?: (id: string, control: Partial<RiskControl>) => void;
  onDeleteControl?: (id: string) => void;
}

const defaultControls: RiskControl[] = [
  {
    id: 'ctrl-1',
    title: 'Implement transparency documentation',
    description: 'Create detailed documentation describing how the AI system works, its limitations, and potential risks.',
    status: 'in_progress',
    type: 'procedural',
    priority: 'high',
    targetDate: '2025-06-30',
    assignedTo: 'Documentation Team',
    effectiveness: 75,
    riskLevel: 'limited',
    mitigatesRisks: ['risk-1', 'risk-3']
  },
  {
    id: 'ctrl-2',
    title: 'Implement human oversight mechanism',
    description: 'Design and implement a human oversight mechanism that allows for human intervention when needed.',
    status: 'planned',
    type: 'technical',
    priority: 'critical',
    targetDate: '2025-07-15',
    assignedTo: 'Development Team',
    effectiveness: 0, // Not implemented yet
    riskLevel: 'high',
    mitigatesRisks: ['risk-2', 'risk-4']
  },
  {
    id: 'ctrl-3',
    title: 'Conduct regular data quality audits',
    description: 'Establish a process for regular data quality audits to identify and address biases.',
    status: 'implemented',
    type: 'organizational',
    priority: 'medium',
    targetDate: '2025-05-15',
    assignedTo: 'Data Science Team',
    effectiveness: 85,
    riskLevel: 'limited',
    mitigatesRisks: ['risk-1', 'risk-5']
  }
];

const defaultWeakPoints: WeakPoint[] = [
  { 
    id: 'risk-1', 
    description: 'Insufficient transparency in AI decision-making process', 
    severity: 'high',
    type: 'Transparency',
    category: 'Article 13'
  },
  { 
    id: 'risk-2', 
    description: 'Lack of human oversight in critical decisions', 
    severity: 'critical',
    type: 'Human Oversight',
    category: 'Article 14'
  },
  { 
    id: 'risk-3', 
    description: 'Inadequate technical documentation', 
    severity: 'medium',
    type: 'Documentation',
    category: 'Article 11'
  },
  { 
    id: 'risk-4', 
    description: 'Potential for discriminatory outcomes', 
    severity: 'high',
    type: 'Non-Discrimination',
    category: 'Article 5'
  },
  { 
    id: 'risk-5', 
    description: 'Data quality issues in training data', 
    severity: 'medium',
    type: 'Data Quality',
    category: 'Article 10'
  }
];

export const RiskControls: React.FC<RiskControlsProps> = ({
  assessmentId,
  weakPoints = defaultWeakPoints,
  existingControls,
  onAddControl,
  onUpdateControl,
  onDeleteControl
}) => {
  const { toast } = useToast();
  const [controls, setControls] = useState<RiskControl[]>(existingControls || defaultControls);
  const [isAddingControl, setIsAddingControl] = useState(false);
  const [newControl, setNewControl] = useState<Omit<RiskControl, 'id'>>({
    title: '',
    description: '',
    status: 'planned',
    type: 'technical',
    priority: 'medium',
    targetDate: new Date().toISOString().split('T')[0],
    riskLevel: 'limited',
    mitigatesRisks: [],
    effectiveness: 0
  });

  // Function to get severity color classes
  const getSeverityColorClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Function to get status color classes
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'implemented':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'verified':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'planned':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'verified':
        return <ShieldCheck className="h-4 w-4 text-blue-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'planned':
        return <FileText className="h-4 w-4 text-gray-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  // Add a new control
  const handleAddControl = () => {
    const controlId = `ctrl-${Date.now()}`;
    const control = {
      id: controlId,
      ...newControl
    };
    
    // Update local state
    setControls([...controls, control]);
    
    // Call the parent callback if provided
    if (onAddControl) {
      onAddControl(newControl);
    }
    
    // Reset form and close dialog
    setNewControl({
      title: '',
      description: '',
      status: 'planned',
      type: 'technical',
      priority: 'medium',
      targetDate: new Date().toISOString().split('T')[0],
      riskLevel: 'limited',
      mitigatesRisks: [],
      effectiveness: 0
    });
    setIsAddingControl(false);
    
    // Show success toast
    toast({
      title: 'Risk Control Added',
      description: 'The new risk control has been added successfully.',
    });
  };

  // Delete a control
  const handleDeleteControl = (id: string) => {
    setControls(controls.filter(control => control.id !== id));
    
    if (onDeleteControl) {
      onDeleteControl(id);
    }
    
    toast({
      title: 'Risk Control Deleted',
      description: 'The risk control has been removed successfully.',
    });
  };

  // Toggle if a risk is mitigated by a control
  const toggleRiskMitigation = (controlId: string, riskId: string) => {
    setControls(controls.map(control => {
      if (control.id === controlId) {
        const mitigatesRisks = [...control.mitigatesRisks];
        const index = mitigatesRisks.indexOf(riskId);
        
        if (index >= 0) {
          mitigatesRisks.splice(index, 1);
        } else {
          mitigatesRisks.push(riskId);
        }
        
        const updatedControl = {
          ...control,
          mitigatesRisks
        };
        
        // Call the parent callback if provided
        if (onUpdateControl) {
          onUpdateControl(controlId, { mitigatesRisks });
        }
        
        return updatedControl;
      }
      return control;
    }));
  };

  // Update a control's status
  const updateControlStatus = (controlId: string, status: RiskControl['status']) => {
    setControls(controls.map(control => {
      if (control.id === controlId) {
        const updatedControl = {
          ...control,
          status
        };
        
        // Call the parent callback if provided
        if (onUpdateControl) {
          onUpdateControl(controlId, { status });
        }
        
        return updatedControl;
      }
      return control;
    }));
    
    toast({
      title: 'Status Updated',
      description: `Control status has been updated to ${status.replace(/_/g, ' ')}.`,
    });
  };

  // Calculate the percentage of risks mitigated
  const calculateMitigationPercentage = () => {
    const allRiskIds = weakPoints.map(wp => wp.id);
    const uniqueMitigatedRisks = new Set<string>();
    
    controls.forEach(control => {
      control.mitigatesRisks.forEach(riskId => {
        if (allRiskIds.includes(riskId)) {
          uniqueMitigatedRisks.add(riskId);
        }
      });
    });
    
    return Math.round((uniqueMitigatedRisks.size / allRiskIds.length) * 100);
  };

  // Calculate the percentage of controls implemented
  const calculateImplementationPercentage = () => {
    const implementedCount = controls.filter(c => 
      c.status === 'implemented' || c.status === 'verified'
    ).length;
    
    return controls.length > 0 ? Math.round((implementedCount / controls.length) * 100) : 0;
  };

  // Get weak points that are not yet mitigated by any control
  const getUnmitigatedRisks = () => {
    const mitigatedRiskIds = new Set<string>();
    
    controls.forEach(control => {
      control.mitigatesRisks.forEach(riskId => {
        mitigatedRiskIds.add(riskId);
      });
    });
    
    return weakPoints.filter(wp => !mitigatedRiskIds.has(wp.id));
  };
  
  const mitigationPercentage = calculateMitigationPercentage();
  const implementationPercentage = calculateImplementationPercentage();
  const unmitigatedRisks = getUnmitigatedRisks();

  return (
    <div className="space-y-6">
      {/* Summary cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="mb-2 text-sm font-medium text-muted-foreground">Risk Mitigation Coverage</div>
              <div className="text-3xl font-bold mb-2">{mitigationPercentage}%</div>
              <Progress value={mitigationPercentage} className="w-full h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {mitigationPercentage < 50 
                  ? 'Many risks remain unaddressed' 
                  : mitigationPercentage < 80
                    ? 'Good progress, but gaps remain'
                    : 'Most risks have controls in place'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="mb-2 text-sm font-medium text-muted-foreground">Control Implementation</div>
              <div className="text-3xl font-bold mb-2">{implementationPercentage}%</div>
              <Progress value={implementationPercentage} className="w-full h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {controls.length} controls, {controls.filter(c => c.status === 'implemented' || c.status === 'verified').length} implemented
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="mb-2 text-sm font-medium text-muted-foreground">Unmitigated Risks</div>
              <div className="text-3xl font-bold mb-2 flex items-center">
                {unmitigatedRisks.length}
                {unmitigatedRisks.length > 0 && (
                  <AlertTriangle className="ml-2 h-5 w-5 text-amber-500" />
                )}
              </div>
              <div className="mt-1 flex flex-wrap gap-1 justify-center">
                {unmitigatedRisks.length > 0 ? (
                  unmitigatedRisks.slice(0, 2).map(risk => (
                    <Badge 
                      key={risk.id} 
                      variant="outline" 
                      className={getSeverityColorClass(risk.severity)}
                    >
                      {risk.severity}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    All Mitigated
                  </Badge>
                )}
                {unmitigatedRisks.length > 2 && (
                  <Badge variant="outline">+{unmitigatedRisks.length - 2} more</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content */}
      <Tabs defaultValue="controls" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="controls">Risk Controls</TabsTrigger>
          <TabsTrigger value="weakpoints">Weak Points</TabsTrigger>
        </TabsList>
        
        <TabsContent value="controls" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Implemented Controls</h3>
            <Dialog open={isAddingControl} onOpenChange={setIsAddingControl}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Control
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Risk Control</DialogTitle>
                  <DialogDescription>
                    Define a new control to mitigate identified risks
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="title" className="text-right text-sm font-medium">
                      Title
                    </label>
                    <Input
                      id="title"
                      value={newControl.title}
                      onChange={(e) => setNewControl({...newControl, title: e.target.value})}
                      className="col-span-3"
                      placeholder="Enter control title"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="description" className="text-right text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      value={newControl.description}
                      onChange={(e) => setNewControl({...newControl, description: e.target.value})}
                      className="col-span-3"
                      placeholder="Describe how this control mitigates risks"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="type" className="text-right text-sm font-medium">
                      Type
                    </label>
                    <Select
                      value={newControl.type}
                      onValueChange={(value: any) => setNewControl({...newControl, type: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select control type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="procedural">Procedural</SelectItem>
                        <SelectItem value="organizational">Organizational</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="priority" className="text-right text-sm font-medium">
                      Priority
                    </label>
                    <Select
                      value={newControl.priority}
                      onValueChange={(value: any) => setNewControl({...newControl, priority: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="target-date" className="text-right text-sm font-medium">
                      Target Date
                    </label>
                    <Input
                      id="target-date"
                      type="date"
                      value={newControl.targetDate}
                      onChange={(e) => setNewControl({...newControl, targetDate: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="assigned-to" className="text-right text-sm font-medium">
                      Assigned To
                    </label>
                    <Input
                      id="assigned-to"
                      value={newControl.assignedTo || ''}
                      onChange={(e) => setNewControl({...newControl, assignedTo: e.target.value})}
                      className="col-span-3"
                      placeholder="Person or team responsible"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <label className="text-right text-sm font-medium pt-2">
                      Mitigates Risks
                    </label>
                    <div className="col-span-3 space-y-2">
                      {weakPoints.map(risk => (
                        <div key={risk.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`risk-${risk.id}`}
                            checked={newControl.mitigatesRisks.includes(risk.id)}
                            onCheckedChange={(checked) => {
                              const mitigatesRisks = [...newControl.mitigatesRisks];
                              if (checked) {
                                mitigatesRisks.push(risk.id);
                              } else {
                                const index = mitigatesRisks.indexOf(risk.id);
                                if (index >= 0) mitigatesRisks.splice(index, 1);
                              }
                              setNewControl({...newControl, mitigatesRisks});
                            }}
                          />
                          <label
                            htmlFor={`risk-${risk.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                          >
                            <span className={`inline-block px-2 py-1 rounded-full text-xs mr-2 ${getSeverityColorClass(risk.severity)}`}>
                              {risk.severity}
                            </span>
                            {risk.description}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddingControl(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleAddControl}
                    disabled={!newControl.title || !newControl.description || newControl.mitigatesRisks.length === 0}
                  >
                    Add Control
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-4">
            {controls.length === 0 ? (
              <Card>
                <CardContent className="pt-6 pb-6 flex flex-col items-center">
                  <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
                  <p className="text-center text-muted-foreground">
                    No risk controls defined yet. Add controls to mitigate identified risks.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => setIsAddingControl(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add First Control
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="h-[450px] pr-4">
                <div className="space-y-4">
                  {controls.map(control => (
                    <Card key={control.id} className="relative">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              {control.title}
                              <Badge variant="outline" className={getStatusColorClass(control.status)}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(control.status)}
                                  {control.status.replace('_', ' ')}
                                </span>
                              </Badge>
                            </CardTitle>
                            <CardDescription>{control.description}</CardDescription>
                          </div>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteControl(control.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Type</p>
                            <p className="text-sm">{control.type.charAt(0).toUpperCase() + control.type.slice(1)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Priority</p>
                            <Badge variant="outline" className={getSeverityColorClass(control.priority)}>
                              {control.priority}
                            </Badge>
                          </div>
                          {control.targetDate && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Target Date</p>
                              <p className="text-sm">{new Date(control.targetDate).toLocaleDateString()}</p>
                            </div>
                          )}
                          {control.assignedTo && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Assigned To</p>
                              <p className="text-sm">{control.assignedTo}</p>
                            </div>
                          )}
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Mitigates Risks</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {weakPoints.map(risk => (
                              <button
                                key={risk.id}
                                className={`px-2 py-1 text-xs font-medium rounded-full border transition-colors
                                  ${control.mitigatesRisks.includes(risk.id) 
                                    ? getSeverityColorClass(risk.severity)
                                    : 'bg-gray-100 text-gray-500 border-gray-200'
                                  }`}
                                onClick={() => toggleRiskMitigation(control.id, risk.id)}
                              >
                                {risk.category}: {risk.description.length > 30
                                  ? risk.description.substring(0, 30) + '...'
                                  : risk.description
                                }
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {(control.status === 'planned' || control.status === 'in_progress' || control.status === 'implemented') && (
                          <div className="mt-4">
                            <p className="text-xs text-muted-foreground mb-1">Implementation Status</p>
                            <div className="flex space-x-2 mt-1">
                              {control.status !== 'planned' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updateControlStatus(control.id, 'planned')}
                                >
                                  <FileText className="h-3.5 w-3.5 mr-1" />
                                  Planned
                                </Button>
                              )}
                              {control.status !== 'in_progress' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updateControlStatus(control.id, 'in_progress')}
                                >
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  In Progress
                                </Button>
                              )}
                              {control.status !== 'implemented' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updateControlStatus(control.id, 'implemented')}
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                  Implemented
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updateControlStatus(control.id, 'verified')}
                              >
                                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                                Verified
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="weakpoints" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Identified Weak Points</h3>
            <Badge variant="outline" className="ml-auto">
              {weakPoints.length} Issues
            </Badge>
          </div>
          
          <ScrollArea className="h-[450px] pr-4">
            <div className="space-y-4">
              {weakPoints.map(risk => {
                const isMitigated = controls.some(control => 
                  control.mitigatesRisks.includes(risk.id) && 
                  (control.status === 'implemented' || control.status === 'verified')
                );
                
                const isPartiallyMitigated = !isMitigated && controls.some(control => 
                  control.mitigatesRisks.includes(risk.id)
                );
                
                return (
                  <Card key={risk.id} className={`relative border-l-4 
                    ${isMitigated 
                      ? 'border-l-green-500' 
                      : isPartiallyMitigated 
                        ? 'border-l-yellow-500' 
                        : 'border-l-red-500'}`
                    }
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {risk.description}
                            <Badge 
                              variant="outline" 
                              className={getSeverityColorClass(risk.severity)}
                            >
                              {risk.severity}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {risk.category} • {risk.type}
                          </CardDescription>
                        </div>
                        <div>
                          {isMitigated ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              Mitigated
                            </Badge>
                          ) : isPartiallyMitigated ? (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              In Progress
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                              Not Mitigated
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground mb-1">Associated Controls</p>
                      
                      {controls.filter(control => control.mitigatesRisks.includes(risk.id)).length > 0 ? (
                        <div className="space-y-2 mt-1">
                          {controls
                            .filter(control => control.mitigatesRisks.includes(risk.id))
                            .map(control => (
                              <div 
                                key={control.id} 
                                className="flex items-center justify-between p-2 rounded-md bg-gray-50"
                              >
                                <div className="flex items-center">
                                  {getStatusIcon(control.status)}
                                  <span className="ml-2 text-sm">{control.title}</span>
                                </div>
                                <Badge variant="outline" className={getStatusColorClass(control.status)}>
                                  {control.status}
                                </Badge>
                              </div>
                            ))
                          }
                        </div>
                      ) : (
                        <div className="mt-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setNewControl({
                                ...newControl,
                                mitigatesRisks: [risk.id]
                              });
                              setIsAddingControl(true);
                            }}
                          >
                            <PlusCircle className="h-3.5 w-3.5 mr-1" />
                            Add Control
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskControls;