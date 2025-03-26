import React from 'react';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { Check, Square, ChevronRight, ChevronDown, Folder, File } from 'lucide-react';

interface CheckboxTreeProps {
  nodes: any[];
  checked: string[];
  expanded: string[];
  onCheck: (checked: string[]) => void;
  onExpand: (expanded: string[]) => void;
  showExpandAll?: boolean;
  noCascade?: boolean;
  className?: string;
}

const CustomCheckboxTree: React.FC<CheckboxTreeProps> = ({
  nodes,
  checked,
  expanded,
  onCheck,
  onExpand,
  showExpandAll = false,
  noCascade = false,
  className = ''
}) => {
  const icons = {
    check: <Check className="h-4 w-4" />,
    uncheck: <Square className="h-4 w-4" />,
    halfCheck: <Square className="h-4 w-4 text-muted-foreground" />,
    expandClose: <ChevronRight className="h-4 w-4" />,
    expandOpen: <ChevronDown className="h-4 w-4" />,
    expandAll: <ChevronDown className="h-4 w-4" />,
    collapseAll: <ChevronRight className="h-4 w-4" />,
    parentClose: <Folder className="h-4 w-4" />,
    parentOpen: <Folder className="h-4 w-4 text-primary" />,
    leaf: <File className="h-4 w-4" />
  };

  return (
    <div className={className}>
      <CheckboxTree
        nodes={nodes}
        checked={checked}
        expanded={expanded}
        onCheck={onCheck}
        onExpand={onExpand}
        icons={icons}
        showExpandAll={showExpandAll}
        noCascade={noCascade}
      />
    </div>
  );
};

export { CustomCheckboxTree as CheckboxTree };