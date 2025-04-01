import React from "react";
import { EnhancedArticleTooltip } from "./enhanced-article-tooltip";

interface ArticleReferenceProps {
  articleId: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * ArticleReference component
 * 
 * Use this component to wrap text or elements that should display
 * enhanced tooltips when hovered, showing detailed EU AI Act information.
 * 
 * Example usage:
 * <ArticleReference articleId="Article 9">
 *   Your system needs to comply with Article 9 requirements
 * </ArticleReference>
 * 
 * If no children are provided, the component will simply display the articleId.
 */
export function ArticleReference({ 
  articleId, 
  className,
  children 
}: ArticleReferenceProps) {
  return (
    <EnhancedArticleTooltip articleId={articleId} className={className}>
      {children || articleId}
    </EnhancedArticleTooltip>
  );
}