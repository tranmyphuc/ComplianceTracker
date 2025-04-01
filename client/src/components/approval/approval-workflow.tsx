import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

// Define types based on database schema
interface ApprovalItem {
  id: number;
  itemId: string; // Used for API endpoints, uniquely identifies the item
  workflowId: string;
  moduleType: string;
  moduleId: string;
  title: string;
  description: string;
  status: "pending" | "in_review" | "approved" | "rejected" | "cancelled";
  priority: "high" | "medium" | "low";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | null;
  metadata: any;
}

interface ApprovalAssignment {
  id: number;
  workflowId: string;
  assignedTo: string;
  assignedAt: Date;
  role: string;
  isActive: boolean;
  assignedBy: string;
}

interface ApprovalHistory {
  id: number;
  workflowId: string;
  action: string;
  performedBy: string;
  timestamp: Date;
  comments: string;
  metadata: any;
}

interface ApprovalNotification {
  id: number;
  userId: string;
  workflowId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  readAt: Date | null;
  type: string;
  priority: string;
  relatedAction: string | null;
  language: string;
}

interface ApprovalSettings {
  id: number;
  userId: string;
  notificationFrequency: string;
  autoAssignEnabled: boolean;
  defaultPriority: string;
  language: string;
  emailNotificationsEnabled: boolean;
}

export const ApprovalWorkflow = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const queryClient = useQueryClient();

  // Form for assignment
  const assignForm = useForm({
    defaultValues: {
      assignee: "",
      role: "reviewer",
    },
  });

  // Form for review
  const reviewForm = useForm({
    defaultValues: {
      decision: "",
      comments: "",
    },
  });

  // Fetch approval items with filters
  const { data: approvalItems, isLoading } = useQuery({
    queryKey: [
      "/api/approval/items",
      activeTab,
      currentPage,
      pageSize,
      searchTerm,
    ],
    queryFn: () =>
      apiRequest("/api/approval/items", {
        params: {
          status: activeTab !== "all" ? activeTab : undefined,
          page: currentPage.toString(),
          limit: pageSize.toString(),
          search: searchTerm || undefined,
        },
      }),
  });

  // Fetch assignments for a selected item
  const { data: assignments, isLoading: isLoadingAssignments } = useQuery({
    queryKey: ["/api/approval/items", selectedItem?.itemId, "assignments"],
    queryFn: () =>
      selectedItem
        ? apiRequest(`/api/approval/items/${selectedItem.itemId}`).then(data => data.assignments)
        : Promise.resolve([]),
    enabled: !!selectedItem,
  });

  // Fetch history for a selected item
  const { data: history, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["/api/approval/items", selectedItem?.itemId, "history"],
    queryFn: () =>
      selectedItem
        ? apiRequest(`/api/approval/items/${selectedItem.itemId}/history`)
        : Promise.resolve([]),
    enabled: !!selectedItem,
  });

  // Fetch user settings
  const { data: settings } = useQuery({
    queryKey: ["/api/approval/settings"],
    queryFn: () => apiRequest("/api/approval/settings"),
  });

  // Mutation for assigning a workflow
  const assignMutation = useMutation({
    mutationFn: (data: {
      itemId: string;
      assignedTo: string;
      role: string;
    }) => apiRequest("/api/approval/assignments", { method: "POST", body: data }),
    onSuccess: () => {
      toast({
        title: "Item assigned",
        description: "The approval item has been assigned successfully.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/approval/items", selectedItem?.itemId, "assignments"],
      });
      setAssignDialogOpen(false);
      assignForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Assignment failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to assign approval item. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mutation for updating a workflow status
  const updateStatusMutation = useMutation({
    mutationFn: (data: {
      itemId: string;
      status: string;
      comments: string;
    }) =>
      apiRequest(`/api/approval/items/${data.itemId}`, {
        method: "PUT",
        body: data,
      }),
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The approval item status has been updated successfully.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/approval/items"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/approval/items", selectedItem?.itemId, "history"],
      });
      setReviewDialogOpen(false);
      setDetailsOpen(false);
      reviewForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update approval status. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission for assignment
  const handleAssignSubmit = (data: { assignee: string; role: string }) => {
    if (selectedItem) {
      assignMutation.mutate({
        itemId: selectedItem.itemId,
        assignedTo: data.assignee,
        role: data.role,
      });
    }
  };

  // Handle form submission for review
  const handleReviewSubmit = (data: { decision: string; comments: string }) => {
    if (selectedItem) {
      updateStatusMutation.mutate({
        itemId: selectedItem.itemId,
        status: data.decision,
        comments: data.comments,
      });
    }
  };

  // Handle view details
  const handleViewDetails = (item: ApprovalItem) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };

  // Handle assign workflow
  const handleAssign = (item: ApprovalItem) => {
    setSelectedItem(item);
    setAssignDialogOpen(true);
  };

  // Handle review workflow
  const handleReview = (item: ApprovalItem) => {
    setSelectedItem(item);
    setReviewDialogOpen(true);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "in_review":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            In Review
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Priority badge component
  const PriorityBadge = ({ priority }: { priority: string }) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Low
          </Badge>
        );
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  // Module type friendly names
  const getModuleTypeName = (type: string) => {
    switch (type) {
      case "risk_assessment":
        return "Risk Assessment";
      case "system_registration":
        return "System Registration";
      case "document":
        return "Document";
      case "training":
        return "Training";
      default:
        return type;
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Approval Workflows</h1>
          <p className="text-gray-500 mt-1">
            Manage and review approval workflows for various modules
          </p>
        </div>
        <div className="flex space-x-2">
          <Input
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in_review">In Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="w-full">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : approvalItems && approvalItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Module Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvalItems.map((item: ApprovalItem) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{getModuleTypeName(item.moduleType)}</TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                        </TableCell>
                        <TableCell>
                          <PriorityBadge priority={item.priority} />
                        </TableCell>
                        <TableCell>{item.createdBy}</TableCell>
                        <TableCell>
                          {item.dueDate ? formatDate(item.dueDate) : "No deadline"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(item)}
                            >
                              Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAssign(item)}
                            >
                              Assign
                            </Button>
                            {item.status !== "approved" && item.status !== "rejected" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReview(item)}
                              >
                                Review
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500">No approval workflows found</p>
                </div>
              )}
            </CardContent>
            {approvalItems && approvalItems.length > 0 && (
              <CardFooter className="flex justify-between py-4">
                <div>
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, approvalItems.length)} of {approvalItems.length} workflows
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage * pageSize >= approvalItems.length}
                  >
                    Next
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Workflow Details</DialogTitle>
            <DialogDescription>
              View detailed information about this approval workflow
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Title</h3>
                    <p>{selectedItem.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Status</h3>
                    <StatusBadge status={selectedItem.status} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Module Type</h3>
                    <p>{getModuleTypeName(selectedItem.moduleType)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Priority</h3>
                    <PriorityBadge priority={selectedItem.priority} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Created By</h3>
                    <p>{selectedItem.createdBy}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Created At</h3>
                    <p>{formatDate(selectedItem.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Module ID</h3>
                    <p>{selectedItem.moduleId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Due Date</h3>
                    <p>
                      {selectedItem.dueDate
                        ? formatDate(selectedItem.dueDate)
                        : "No deadline"}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Description</h3>
                  <p className="mt-1">{selectedItem.description}</p>
                </div>
              </TabsContent>

              <TabsContent value="assignments">
                {isLoadingAssignments ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : assignments && assignments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Assigned By</TableHead>
                        <TableHead>Assigned At</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.map((assignment: ApprovalAssignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell>{assignment.assignedTo}</TableCell>
                          <TableCell>{assignment.role}</TableCell>
                          <TableCell>{assignment.assignedBy}</TableCell>
                          <TableCell>{formatDate(assignment.assignedAt)}</TableCell>
                          <TableCell>
                            {assignment.isActive ? (
                              <Badge className="bg-green-50 text-green-700 border-green-200">
                                Active
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-50 text-gray-700 border-gray-200">
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex justify-center items-center h-32">
                    <p className="text-gray-500">No assignments found</p>
                  </div>
                )}
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => setAssignDialogOpen(true)}>
                    Assign Workflow
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="history">
                {isLoadingHistory ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : history && history.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Performed By</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Comments</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((item: ApprovalHistory) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.action}</TableCell>
                          <TableCell>{item.performedBy}</TableCell>
                          <TableCell>{formatDate(item.timestamp)}</TableCell>
                          <TableCell>{item.comments || "No comments"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex justify-center items-center h-32">
                    <p className="text-gray-500">No history found</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Workflow</DialogTitle>
            <DialogDescription>
              Assign this workflow to a team member for review
            </DialogDescription>
          </DialogHeader>

          <Form {...assignForm}>
            <form
              onSubmit={assignForm.handleSubmit(handleAssignSubmit)}
              className="space-y-4"
            >
              <FormField
                control={assignForm.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter user ID or email" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the user ID or email of the assignee
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={assignForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="reviewer">Reviewer</SelectItem>
                        <SelectItem value="approver">Approver</SelectItem>
                        <SelectItem value="validator">Validator</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the role for this assignment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAssignDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={assignMutation.isPending}>
                  {assignMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Assign
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Workflow</DialogTitle>
            <DialogDescription>
              Review and update the status of this workflow
            </DialogDescription>
          </DialogHeader>

          <Form {...reviewForm}>
            <form
              onSubmit={reviewForm.handleSubmit(handleReviewSubmit)}
              className="space-y-4"
            >
              <FormField
                control={reviewForm.control}
                name="decision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Decision</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a decision" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="in_review">In Review</SelectItem>
                        <SelectItem value="approved">Approve</SelectItem>
                        <SelectItem value="rejected">Reject</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Select your decision</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={reviewForm.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add your review comments here..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide any feedback or comments about your decision
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setReviewDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateStatusMutation.isPending}>
                  {updateStatusMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Review
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};