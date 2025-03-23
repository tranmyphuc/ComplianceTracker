
import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  Edit, 
  MoreHorizontal, 
  Search 
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

interface RiskEventListProps {
  events: any[];
  onEventUpdated: () => void;
  userId: string;
}

export const RiskEventList: React.FC<RiskEventListProps> = ({ 
  events, 
  onEventUpdated,
  userId
}) => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [resolution, setResolution] = useState('');
  
  const handleViewEvent = (event: any) => {
    setSelectedEvent(event);
    setViewDialogOpen(true);
  };
  
  const handleOpenResolve = (event: any) => {
    setSelectedEvent(event);
    setResolution('');
    setResolveDialogOpen(true);
  };
  
  const handleResolveEvent = async () => {
    try {
      await api.put(`/api/risk-events/${selectedEvent.eventId}`, {
        updates: { 
          status: 'resolved', 
          rootCause: resolution,
          closureDate: new Date()
        },
        userId
      });
      
      toast({
        title: 'Success',
        description: 'Event marked as resolved',
      });
      
      setResolveDialogOpen(false);
      onEventUpdated();
    } catch (error) {
      console.error('Error resolving event:', error);
      toast({
        title: 'Error',
        description: 'Failed to resolve event',
        variant: 'destructive',
      });
    }
  };
  
  const handleCloseEvent = async (eventId: string) => {
    try {
      await api.put(`/api/risk-events/${eventId}`, {
        updates: { 
          status: 'closed',
          closureDate: new Date()
        },
        userId
      });
      
      toast({
        title: 'Success',
        description: 'Event closed',
      });
      
      onEventUpdated();
    } catch (error) {
      console.error('Error closing event:', error);
      toast({
        title: 'Error',
        description: 'Failed to close event',
        variant: 'destructive',
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800">New</Badge>;
      case 'under_investigation':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Investigation</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };
  
  const getEventTypeDisplay = (type: string) => {
    switch (type) {
      case 'incident':
        return 'Incident';
      case 'near_miss':
        return 'Near Miss';
      case 'performance_deviation':
        return 'Performance Deviation';
      case 'external_factor':
        return 'External Factor';
      case 'user_feedback':
        return 'User Feedback';
      default:
        return type.replace(/_/g, ' ');
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };
  
  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-md bg-gray-50">
        <Search className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Risk Events</h3>
        <p className="text-gray-500 text-center mb-4">
          No risk events have been recorded for this system yet.
          Record events when incidents, near-misses, or other risk-related events occur.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Type</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Detection Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.eventId}>
              <TableCell>{getEventTypeDisplay(event.eventType)}</TableCell>
              <TableCell>{getSeverityBadge(event.severity)}</TableCell>
              <TableCell>
                {event.description.length > 50 
                  ? event.description.substring(0, 50) + '...'
                  : event.description}
              </TableCell>
              <TableCell>{getStatusBadge(event.status)}</TableCell>
              <TableCell>{formatDate(event.detectionDate)}</TableCell>
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
                    <DropdownMenuItem onClick={() => handleViewEvent(event)}>
                      <Search className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {(event.status === 'new' || event.status === 'under_investigation') && (
                      <DropdownMenuItem onClick={() => handleOpenResolve(event)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Resolve Event
                      </DropdownMenuItem>
                    )}
                    {event.status === 'resolved' && (
                      <DropdownMenuItem onClick={() => handleCloseEvent(event.eventId)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Close Event
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* View Event Dialog */}
      {viewDialogOpen && selectedEvent && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Event Details</DialogTitle>
              <DialogDescription>
                {getEventTypeDisplay(selectedEvent.eventType)} | {selectedEvent.severity}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm">{selectedEvent.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Status</h4>
                  <p className="text-sm">{getStatusBadge(selectedEvent.status)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Reported By</h4>
                  <p className="text-sm">{selectedEvent.reportedBy}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Detection Date</h4>
                  <p className="text-sm">{formatDate(selectedEvent.detectionDate)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Closure Date</h4>
                  <p className="text-sm">{formatDate(selectedEvent.closureDate)}</p>
                </div>
              </div>
              
              {selectedEvent.impact && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Impact</h4>
                  <p className="text-sm">{selectedEvent.impact}</p>
                </div>
              )}
              
              {selectedEvent.rootCause && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Root Cause</h4>
                  <p className="text-sm">{selectedEvent.rootCause}</p>
                </div>
              )}
              
              {selectedEvent.mitigationActions && selectedEvent.mitigationActions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Mitigation Actions</h4>
                  <ul className="text-sm list-disc pl-5">
                    {selectedEvent.mitigationActions.map((action: string, i: number) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Resolve Event Dialog */}
      {resolveDialogOpen && selectedEvent && (
        <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Resolve Risk Event</DialogTitle>
              <DialogDescription>
                Provide resolution details for this event
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Event Description</h4>
                <p className="text-sm">{selectedEvent.description}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Resolution Details / Root Cause
                </label>
                <Textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Describe how this event was resolved and its root cause..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setResolveDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleResolveEvent} disabled={!resolution.trim()}>
                Mark as Resolved
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
