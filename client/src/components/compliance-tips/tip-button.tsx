import { LightbulbIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useComplianceTips } from './tip-provider';

interface TipButtonProps {
  tipId?: string;
  context?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showTooltip?: boolean;
}

export function TipButton({
  tipId,
  context,
  variant = 'outline',
  size = 'icon',
  className = '',
  showTooltip = true,
}: TipButtonProps) {
  const { showTip } = useComplianceTips();
  
  const handleClick = () => {
    showTip(tipId, context);
  };
  
  const button = (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={className}
      aria-label="Show compliance tip"
    >
      <LightbulbIcon className="h-4 w-4" />
    </Button>
  );
  
  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p>Show compliance tip</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return button;
}