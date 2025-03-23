
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

interface UpdateControlDialogProps {
  open: boolean;
  onClose: () => void;
  onControlUpdated: () => void;
  control: any;
  userId: string;
}

export const UpdateControlDialog: React.FC<UpdateControlDialogProps> = ({
  open,
  onClose,
  onControlUpdated,
  control,
  userId
}) => {
  const [controlName, setControlName] = useState(control.name);
  const [controlDescription, setControlDescription] = useState(control.description);
  const [controlType, setControlType] = useState(control.controlType);
  const [implementationStatus, setImplementationStatus] = useState(control.implementationStatus);
  const [effectiveness, setEffectiveness] = useState(control.effectiveness);
  const [notes, setNotes] = useState(control.notes || '');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!controlName || !controlDescription || !controlType) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const updates = {
        name: controlName,
        description: controlDescription,
        controlType,
        implementationStatus,
        effectiveness,
        notes,
        // If we're marking it as implemented now, set the implementation date
        ...(implementationStatus === 'implemented' && control.implementationStatus !== 'implemented' 
          ? { implementationDate: new Date() } 
          : {})
      };
      
      await api.put(`/api/risk-controls/${control.controlId}`, {
        updates,
        userId
      });
      
      toast({
        title: 'Success',
        description: 'Risk control updated successfully',
      });
      
      onControlUpdated();
    } catch (error) {
      console.error('Error updating control:', error);
      toast({
        title: 'Error',
        description: 'Failed to update risk control',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Risk Control</DialogTitle>
          <DialogDescription>
            Update control details and implementation status
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Control Name</Label>
              <Input
                id="name"
                value={controlName}
                onChange={(e) => setControlName(e.target.value)}
                placeholder="Enter control name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={controlDescription}
                onChange={(e) => setControlDescription(e.target.value)}
                placeholder="Describe the control and how it mitigates risk"
                rows={3}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Control Type</Label>
              <Select 
                value={controlType} 
                onValueChange={setControlType}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select control type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="procedural">Procedural</SelectItem>
                  <SelectItem value="organizational">Organizational</SelectItem>
                  <SelectItem value="contractual">Contractual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Implementation Status</Label>
              <Select 
                value={implementationStatus} 
                onValueChange={setImplementationStatus}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="implemented">Implemented</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="effectiveness">Effectiveness</Label>
              <Select 
                value={effectiveness} 
                onValueChange={setEffectiveness}
              >
                <SelectTrigger id="effectiveness">
                  <SelectValue placeholder="Select effectiveness" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_implemented">Not Implemented</SelectItem>
                  <SelectItem value="not_tested">Not Tested</SelectItem>
                  <SelectItem value="ineffective">Ineffective</SelectItem>
                  <SelectItem value="partially_effective">Partially Effective</SelectItem>
                  <SelectItem value="effective">Effective</SelectItem>
                  <SelectItem value="very_effective">Very Effective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes about this control"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Control'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
