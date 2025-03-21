import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export function CriticalAlerts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: alerts, isLoading, error } = useQuery({
    queryKey: ["/api/alerts/critical"],
  });
  
  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: number) => {
      await apiRequest("PUT", `/api/alerts/${alertId}/resolve`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts/critical"] });
      toast({
        title: "Alert resolved",
        description: "The alert has been marked as resolved",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to resolve alert",
        variant: "destructive",
      });
    },
  });
  
  const getAlertIcon = (severity: string) => {
    if (severity === "high") {
      return (
        <div className="h-5 w-5 rounded-full bg-[#dc2626]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertTriangleIcon className="h-3 w-3 text-[#dc2626]" />
        </div>
      );
    } 
    return (
      <div className="h-5 w-5 rounded-full bg-[#f59e0b]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <AlertTriangleIcon className="h-3 w-3 text-[#f59e0b]" />
      </div>
    );
  };
  
  const getAlertBgClass = (severity: string) => {
    if (severity === "high") return "bg-[#dc2626]/10 border-[#dc2626]/20";
    return "bg-[#f59e0b]/10 border-[#f59e0b]/20";
  };
  
  const handleResolve = (id: number) => {
    resolveAlertMutation.mutate(id);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-neutral-800 flex items-center">
          <AlertTriangleIcon className="h-4 w-4 text-[#dc2626] mr-2" />
          Critical Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-3 border rounded-md">
                <div className="flex">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="ml-2 space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="p-4 text-center text-red-500">Failed to load alerts</div>
          ) : alerts?.length === 0 ? (
            <div className="p-4 text-center text-neutral-500">No critical alerts</div>
          ) : (
            alerts?.map((alert: any) => (
              <div 
                key={alert.id} 
                className={`p-3 ${getAlertBgClass(alert.severity)} border rounded-md`}
              >
                <div className="flex items-start">
                  {getAlertIcon(alert.severity)}
                  <div className="ml-2">
                    <p className="text-sm font-medium text-neutral-800">{alert.title}</p>
                    <p className="text-xs text-neutral-600 mt-0.5">{alert.description}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-neutral-500">
                        {alert.createdAt && formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                      </span>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="ml-auto py-0 h-auto text-xs text-primary font-medium"
                        onClick={() => handleResolve(alert.id)}
                        disabled={resolveAlertMutation.isPending}
                      >
                        {resolveAlertMutation.isPending ? "Resolving..." : "Resolve"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
