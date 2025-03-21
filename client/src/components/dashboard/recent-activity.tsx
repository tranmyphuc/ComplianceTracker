import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HistoryIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

export function RecentActivity() {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ["/api/activities/recent"],
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-neutral-800 flex items-center">
          <HistoryIcon className="h-4 w-4 text-neutral-600 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="ml-3 space-y-1 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="p-4 text-center text-red-500">Failed to load activities</div>
          ) : activities?.length === 0 ? (
            <div className="p-4 text-center text-neutral-500">No recent activity</div>
          ) : (
            activities?.map((activity: any) => (
              <div key={activity.id} className="flex">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-neutral-200 text-xs font-medium text-neutral-700">
                    {getInitials(activity.user?.displayName || "User")}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm text-neutral-700">
                    <span className="font-medium">
                      {activity.user?.displayName || "A user"}
                    </span>{" "}
                    {formatActivityDescription(activity)}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {activity.timestamp 
                      ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true }) 
                      : "Recently"
                    }
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <Link href="/activities">
          <Button variant="link" size="sm" className="w-full mt-3 text-primary font-medium">
            View All Activity
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

function formatActivityDescription(activity: any): string {
  const systemName = activity.metadata?.systemName || activity.systemId || "a system";
  
  switch (activity.type) {
    case "system_created":
      return `registered a new system ${formatSystemName(systemName)}`;
    case "system_updated":
      return `updated ${formatSystemName(systemName)}`;
    case "document_created":
      return `created documentation for ${formatSystemName(systemName)}`;
    case "assessment_completed":
      return `completed risk assessment for ${formatSystemName(systemName)}`;
    case "training_created":
      return `updated training materials for ${formatSystemName(systemName)}`;
    case "report_generated":
      return `generated a compliance report for ${activity.metadata?.departmentName || "a department"}`;
    default:
      return `performed an action on ${formatSystemName(systemName)}`;
  }
}

function formatSystemName(name: string): string {
  return `<span class="font-medium">${name}</span>`;
}
