import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export function UpcomingDeadlines() {
  const { data: deadlines, isLoading, error } = useQuery({
    queryKey: ["/api/deadlines/upcoming"],
  });

  // Format month abbreviation
  const formatMonth = (date: Date) => {
    return format(date, "MMM").toUpperCase();
  };

  // Format day number
  const formatDay = (date: Date) => {
    return format(date, "d");
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-neutral-800 flex items-center">
          <CalendarIcon className="h-4 w-4 text-neutral-600 mr-2" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-3 border rounded-md">
                <div className="flex">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="ml-3 space-y-1 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="p-4 text-center text-red-500">Failed to load deadlines</div>
          ) : deadlines?.length === 0 ? (
            <div className="p-4 text-center text-neutral-500">No upcoming deadlines</div>
          ) : (
            deadlines?.map((deadline: any) => (
              <div key={deadline.id} className="p-3 bg-white border border-neutral-200 rounded-md hover:border-primary/30 hover:bg-primary/5 transition-colors">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary">
                      {deadline.date && formatMonth(new Date(deadline.date))}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {deadline.date && formatDay(new Date(deadline.date))}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-neutral-800">{deadline.title}</p>
                    <p className="text-xs text-neutral-600 mt-0.5">{deadline.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <Link href="/calendar">
          <Button variant="link" size="sm" className="w-full mt-3 text-primary font-medium">
            View Calendar
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
