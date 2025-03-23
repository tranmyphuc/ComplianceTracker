
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

interface CreateControlDialogProps {
  open: boolean;
  onClose: () => void;
  onControlCreated: () => void;
  systemId: string;
  userId: string;
}

export const CreateControlDialog: React.FC<CreateControlDialogProps> = ({
  open,
  onClose,
  onControlCreated,
  systemId,
  userId
}) => {
  const [controlName, setControlName] = useState('');
  const [controlDescription, setControlDescription] = useState('');
  const [controlType, setControlType] = useState('');
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
      const control = {
        systemId,
        name: controlName,
        description: controlDescription,
        controlType,
        implementationStatus: 'planned',
      };
      
      await api.post('/api/risk-controls', {
        control,
        userId
      });
      
      toast({
        title: 'Success',
        description: 'Risk control created successfully',
      });
      
      onControlCreated();
    } catch (error) {
      console.error('Error creating control:', error);
      toast({
        title: 'Error',
        description: 'Failed to create risk control',
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
          <DialogTitle>Create Risk Control</DialogTitle>
          <DialogDescription>
            Add a new control to manage and mitigate risks
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Control'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
