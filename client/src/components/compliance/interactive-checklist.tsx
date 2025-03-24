
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  articleRef: string;
  completed: boolean;
  category: string;
}

export function InteractiveChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "1",
      title: "Implement Risk Management System",
      description: "Establish and maintain a risk management system throughout the AI system lifecycle",
      articleRef: "Article 9",
      completed: true,
      category: "Risk Management"
    },
    {
      id: "2",
      title: "Ensure Data Governance",
      description: "Implement data governance and management practices for training, validation, and testing datasets",
      articleRef: "Article 10",
      completed: false,
      category: "Data Governance"
    },
    {
      id: "3",
      title: "Prepare Technical Documentation",
      description: "Create and maintain up-to-date technical documentation for each high-risk AI system",
      articleRef: "Article 11",
      completed: true,
      category: "Documentation"
    },
    {
      id: "4", 
      title: "Enable Record-Keeping",
      description: "Design the system to automatically log events during operation",
      articleRef: "Article 12",
      completed: false,
      category: "Technical Requirements"
    },
    {
      id: "5",
      title: "Implement Transparency Measures",
      description: "Ensure high-risk AI systems are designed to be sufficiently transparent",
      articleRef: "Article 13",
      completed: false,
      category: "Transparency"
    },
    {
      id: "6", 
      title: "Establish Human Oversight",
      description: "Design high-risk AI systems to allow for effective human oversight",
      articleRef: "Article 14",
      completed: true,
      category: "Human Oversight"
    },
    {
      id: "7",
      title: "Ensure Accuracy and Robustness",
      description: "Design high-risk AI systems to achieve appropriate levels of accuracy, robustness, and cybersecurity",
      articleRef: "Article 15",
      completed: false,
      category: "Technical Requirements"
    }
  ]);

  const [expandedCategory, setExpandedCategory] = useState<string | null>("Risk Management");

  const toggleItem = (id: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const calculateProgress = () => {
    const completedCount = items.filter(item => item.completed).length;
    return (completedCount / items.length) * 100;
  };

  const categories = Array.from(new Set(items.map(item => item.category)));

  return (
    <Card>
      <CardHeader>
        <CardTitle>EU AI Act Compliance Checklist</CardTitle>
        <CardDescription>
          Track your progress toward EU AI Act compliance using this interactive checklist
        </CardDescription>
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Compliance Progress</span>
            <span className="text-sm font-medium">{Math.round(calculateProgress())}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map(category => (
            <Collapsible 
              key={category}
              open={expandedCategory === category}
              onOpenChange={() => setExpandedCategory(expandedCategory === category ? null : category)}
              className="border rounded-md"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                <h3 className="text-base font-medium">{category}</h3>
                {expandedCategory === category ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 pt-0 space-y-2 border-t">
                {items
                  .filter(item => item.category === category)
                  .map(item => (
                    <div key={item.id} className="flex items-start space-x-2 py-2">
                      <Checkbox 
                        id={`item-${item.id}`} 
                        checked={item.completed}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <label 
                            htmlFor={`item-${item.id}`}
                            className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                          >
                            {item.title}
                          </label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-md">
                                <p>{item.description}</p>
                                <p className="text-xs mt-1 font-medium">Reference: {item.articleRef}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                      {item.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                      )}
                    </div>
                  ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
