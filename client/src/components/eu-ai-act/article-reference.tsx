import React from "react";
import { EnhancedArticleTooltip } from "./enhanced-article-tooltip";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleReferenceProps {
  articleId: string;
  riskLevel?: "prohibited" | "high" | "limited" | "minimal" | "unknown";
  inline?: boolean;
  showIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Component for displaying EU AI Act article references with enhanced tooltips
 */
export function ArticleReference({
  articleId,
  riskLevel,
  inline = false,
  showIcon = true,
  children,
  className,
}: ArticleReferenceProps) {
  // Helper function to determine the text color based on risk level
  const getRiskColor = (risk?: string): string => {
    if (!risk) return "";
    
    switch (risk.toLowerCase()) {
      case "prohibited":
        return "text-red-600 hover:text-red-800";
      case "high":
        return "text-orange-600 hover:text-orange-800";
      case "limited":
        return "text-yellow-600 hover:text-yellow-800";
      case "minimal":
        return "text-green-600 hover:text-green-800";
      default:
        return "text-primary hover:text-primary/80";
    }
  };

  const displayText = children || articleId;
  const riskColor = getRiskColor(riskLevel);
  
  // Inline reference appears directly within text
  if (inline) {
    return (
      <EnhancedArticleTooltip articleId={articleId}>
        <span className={cn("font-medium", riskColor, className)}>
          {displayText}
        </span>
      </EnhancedArticleTooltip>
    );
  }
  
  // Standard reference appears as a badge/button
  return (
    <EnhancedArticleTooltip articleId={articleId}>
      <span 
        className={cn(
          "inline-flex items-center font-medium px-1.5 py-0.5 rounded-md border border-current",
          riskColor,
          className
        )}
      >
        {showIcon && <BookOpen className="mr-1 h-3 w-3" />}
        {displayText}
      </span>
    </EnhancedArticleTooltip>
  );
}