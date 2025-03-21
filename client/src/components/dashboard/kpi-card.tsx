import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { CircularProgressIndicator } from "./circular-progress";

interface KpiCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  change?: number;
  percentage?: boolean;
  progressValue?: number;
  iconColor?: string;
  iconBgColor?: string;
  suffix?: string;
  subtext?: string;
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  change,
  percentage = false,
  progressValue,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  suffix = "",
  subtext,
}: KpiCardProps) {
  const isPositiveChange = change && change > 0;
  
  return (
    <Card className="hover:shadow transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-neutral-500 text-sm font-medium">{title}</h3>
          <div className={`h-8 w-8 ${iconBgColor} rounded-full flex items-center justify-center`}>
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
        </div>
        
        <div className="flex items-end">
          {progressValue !== undefined ? (
            <div className="flex items-center">
              <div className="relative h-10 w-10 mr-2">
                <CircularProgressIndicator value={progressValue} />
              </div>
              <span className="text-2xl font-semibold text-neutral-800">
                {value}
                {percentage && "%"}
                {suffix}
              </span>
            </div>
          ) : (
            <>
              <span className="text-2xl font-semibold text-neutral-800">
                {value}
                {percentage && "%"}
                {suffix}
              </span>
              {change !== undefined && (
                <span 
                  className={`ml-2 text-sm flex items-center ${
                    isPositiveChange ? "text-[#16a34a]" : "text-[#dc2626]"
                  }`}
                >
                  {isPositiveChange ? (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  {Math.abs(change)}
                </span>
              )}
            </>
          )}
        </div>
        
        {subtext && (
          <p className="text-xs text-neutral-500 mt-1">{subtext}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function CircularProgressCard({ title, value, icon: Icon, change, subtext }: KpiCardProps) {
  return (
    <Card className="hover:shadow transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-neutral-500 text-sm font-medium">{title}</h3>
          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="relative h-10 w-10 mr-2">
            <CircularProgressIndicator value={Number(value)} />
          </div>
          <span className="text-2xl font-semibold text-neutral-800">{value}%</span>
        </div>
        
        {subtext && (
          <p className="text-xs text-neutral-500 mt-1">{subtext}</p>
        )}
      </CardContent>
    </Card>
  );
}
