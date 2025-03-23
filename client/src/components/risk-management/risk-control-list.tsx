
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  CircleAlert, 
  Edit, 
  MoreHorizontal, 
  Play, 
  Shield, 
  ThumbsUp, 
  X 
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { UpdateControlDialog } from './update-control-dialog';

interface RiskControlListProps {
  controls: any[];
  onControlUpdated: () => void;
  userId: string;
}

export const RiskControlList: React.FC<RiskControlListProps> = ({ 
  controls, 
  onControlUpdated,
  userId
}) => {
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedControl, setSelectedControl] = useState<any>(null);
  
  const handleUpdateStatus = async (controlId: string, newStatus: string) => {
    try {
      await api.put(`/api/risk-controls/${controlId}`, {
        updates: { implementationStatus: newStatus },
        userId
      });
      
      toast({
        title: 'Success',
        description: 'Control status updated',
      });
      
      onControlUpdated();
    } catch (error) {
      console.error('Error updating control status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update control status',
        variant: 'destructive',
      });
    }
  };
  
  const handleOpenUpdate = (control: any) => {
    setSelectedControl(control);
    setUpdateDialogOpen(true);
  };
  
  const handleControlUpdated = () => {
    setUpdateDialogOpen(false);
    onControlUpdated();
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge className="bg-blue-100 text-blue-800">Planned</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'implemented':
        return <Badge className="bg-green-100 text-green-800">Implemented</Badge>;
      case 'verified':
        return <Badge className="bg-purple-100 text-purple-800">Verified</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getEffectivenessBadge = (effectiveness: string) => {
    switch (effectiveness) {
      case 'very_effective':
        return <Badge className="bg-green-100 text-green-800">Very Effective</Badge>;
      case 'effective':
        return <Badge className="bg-green-100 text-green-800">Effective</Badge>;
      case 'partially_effective':
        return <Badge className="bg-yellow-100 text-yellow-800">Partially Effective</Badge>;
      case 'ineffective':
        return <Badge className="bg-red-100 text-red-800">Ineffective</Badge>;
      case 'not_implemented':
        return <Badge className="bg-gray-100 text-gray-800">Not Implemented</Badge>;
      case 'not_tested':
        return <Badge className="bg-blue-100 text-blue-800">Not Tested</Badge>;
      default:
        return <Badge>{effectiveness}</Badge>;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'technical':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'procedural':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'organizational':
        return <CircleAlert className="h-4 w-4 text-purple-500" />;
      case 'contractual':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };
  
  if (!controls || controls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-md bg-gray-50">
        <Shield className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Risk Controls</h3>
        <p className="text-gray-500 text-center mb-4">
          No risk controls have been defined for this system yet.
          Create controls to manage and mitigate identified risks.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Control</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Effectiveness</TableHead>
            <TableHead>Implementation Date</TableHead>
            <TableHead>Next Review</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {controls.map((control) => (
            <TableRow key={control.controlId}>
              <TableCell>
                <div>
                  <div className="font-medium">{control.name}</div>
                  <div className="text-sm text-gray-500">
                    {control.description.length > 50 
                      ? control.description.substring(0, 50) + '...'
                      : control.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  {getTypeIcon(control.controlType)}
                  <span className="capitalize">{control.controlType}</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(control.implementationStatus)}</TableCell>
              <TableCell>{getEffectivenessBadge(control.effectiveness)}</TableCell>
              <TableCell>{formatDate(control.implementationDate)}</TableCell>
              <TableCell>{formatDate(control.nextReviewDate)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleOpenUpdate(control)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    {control.implementationStatus !== 'in_progress' && (
                      <DropdownMenuItem onClick={() => handleUpdateStatus(control.controlId, 'in_progress')}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Implementation
                      </DropdownMenuItem>
                    )}
                    {(control.implementationStatus === 'in_progress' || control.implementationStatus === 'planned') && (
                      <DropdownMenuItem onClick={() => handleUpdateStatus(control.controlId, 'implemented')}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Implemented
                      </DropdownMenuItem>
                    )}
                    {control.implementationStatus === 'implemented' && (
                      <DropdownMenuItem onClick={() => handleUpdateStatus(control.controlId, 'verified')}>
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Mark as Verified
                      </DropdownMenuItem>
                    )}
                    {(control.implementationStatus === 'in_progress' || control.implementationStatus === 'planned') && (
                      <DropdownMenuItem onClick={() => handleUpdateStatus(control.controlId, 'failed')}>
                        <X className="h-4 w-4 mr-2" />
                        Mark as Failed
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {updateDialogOpen && selectedControl && (
        <UpdateControlDialog
          open={updateDialogOpen}
          onClose={() => setUpdateDialogOpen(false)}
          onControlUpdated={handleControlUpdated}
          control={selectedControl}
          userId={userId}
        />
      )}
    </div>
  );
};
