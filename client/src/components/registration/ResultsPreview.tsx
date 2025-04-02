import React, { useState } from 'react';
import { CheckIcon, AlertTriangleIcon, ShieldAlertIcon, ShieldIcon, InfoIcon, MinusCircleIcon, PlusCircleIcon } from 'lucide-react';
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

// Jack said: "Display confidence scores and justifications to help users verify suggestions"
interface FieldResult {
  value: string;
  confidence: number;
  justification?: string;
}

interface ResultsPreviewProps {
  results: Record<string, FieldResult>;
  onApply: (fieldsToUse: 'all' | 'high_confidence' | string[]) => void;
  webSearchUsed?: boolean;
  sources?: Array<{title: string, url: string}>;
}

export function ResultsPreview({ results, onApply, webSearchUsed = false, sources = [] }: ResultsPreviewProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>(Object.keys(results));
  const [viewMode, setViewMode] = useState<'all' | 'grouped'>('grouped');
  
  // Group fields by confidence level
  const groupedFields = {
    high: [] as string[],
    medium: [] as string[],
    low: [] as string[]
  };
  
  Object.entries(results).forEach(([fieldName, result]) => {
    if (result.confidence >= 80) {
      groupedFields.high.push(fieldName);
    } else if (result.confidence >= 60) {
      groupedFields.medium.push(fieldName);
    } else {
      groupedFields.low.push(fieldName);
    }
  });
  
  // Toggle selection for a field
  const toggleField = (fieldName: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldName)
        ? prev.filter(f => f !== fieldName)
        : [...prev, fieldName]
    );
  };
  
  // Toggle all fields in a confidence group
  const toggleGroup = (group: 'high' | 'medium' | 'low') => {
    const groupFields = groupedFields[group];
    const allSelected = groupFields.every(field => selectedFields.includes(field));
    
    if (allSelected) {
      // Deselect all in group
      setSelectedFields(prev => prev.filter(field => !groupFields.includes(field)));
    } else {
      // Select all in group
      setSelectedFields(prev => {
        const newSelection = [...prev];
        groupFields.forEach(field => {
          if (!newSelection.includes(field)) {
            newSelection.push(field);
          }
        });
        return newSelection;
      });
    }
  };
  
  // Select or deselect all fields
  const toggleAll = () => {
    const allFields = Object.keys(results);
    const allSelected = allFields.length === selectedFields.length;
    
    setSelectedFields(allSelected ? [] : allFields);
  };
  
  // Apply only high confidence suggestions
  const applyHighConfidenceOnly = () => {
    onApply('high_confidence');
  };
  
  // Apply selected suggestions
  const applySelected = () => {
    onApply(selectedFields);
  };
  
  // Apply all suggestions
  const applyAll = () => {
    onApply('all');
  };
  
  // Get confidence badge for a field
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckIcon className="w-3 h-3 mr-1" />
          High ({confidence}%)
        </Badge>
      );
    } else if (confidence >= 60) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <InfoIcon className="w-3 h-3 mr-1" />
          Medium ({confidence}%)
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertTriangleIcon className="w-3 h-3 mr-1" />
          Low ({confidence}%)
        </Badge>
      );
    }
  };
  
  // Get risk level badge if present
  const getRiskLevelBadge = (fieldName: string, value: string) => {
    if (fieldName !== 'riskLevel') return null;
    
    const riskLevel = value.toLowerCase();
    
    if (riskLevel.includes('unacceptable')) {
      return (
        <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
          <ShieldAlertIcon className="w-3 h-3 mr-1" />
          Unacceptable Risk
        </Badge>
      );
    } else if (riskLevel.includes('high')) {
      return (
        <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-700 border-orange-200">
          <ShieldAlertIcon className="w-3 h-3 mr-1" />
          High Risk
        </Badge>
      );
    } else if (riskLevel.includes('limited')) {
      return (
        <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">
          <ShieldIcon className="w-3 h-3 mr-1" />
          Limited Risk
        </Badge>
      );
    } else if (riskLevel.includes('minimal')) {
      return (
        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
          <ShieldIcon className="w-3 h-3 mr-1" />
          Minimal Risk
        </Badge>
      );
    }
    
    return null;
  };
  
  // Render field by field
  const renderAllFields = () => {
    return (
      <div className="space-y-3">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium">All Fields ({Object.keys(results).length})</h3>
          <Button variant="ghost" size="sm" onClick={toggleAll}>
            {Object.keys(results).length === selectedFields.length ? 
              <MinusCircleIcon className="w-4 h-4 mr-1" /> : 
              <PlusCircleIcon className="w-4 h-4 mr-1" />
            }
            {Object.keys(results).length === selectedFields.length ? "Deselect All" : "Select All"}
          </Button>
        </div>
        
        <ScrollArea className="h-[400px] pr-4">
          {Object.entries(results).map(([fieldName, result]) => (
            <div 
              key={fieldName} 
              className={`p-3 mb-2 rounded-md border ${
                selectedFields.includes(fieldName) ? 
                  'border-blue-200 bg-blue-50' : 
                  'border-neutral-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium">
                      {fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1')}
                    </h4>
                    {getConfidenceBadge(result.confidence)}
                    {getRiskLevelBadge(fieldName, result.value)}
                  </div>
                  
                  <p className="mt-1 text-sm">
                    {result.value}
                  </p>
                  
                  {result.justification && (
                    <p className="mt-2 text-xs text-neutral-500">
                      {result.justification}
                    </p>
                  )}
                </div>
                
                <Button 
                  variant={selectedFields.includes(fieldName) ? "default" : "outline"} 
                  size="sm"
                  onClick={() => toggleField(fieldName)}
                >
                  {selectedFields.includes(fieldName) ? "Selected" : "Select"}
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    );
  };
  
  // Render fields grouped by confidence
  const renderGroupedFields = () => {
    return (
      <Accordion type="multiple" defaultValue={['high']} className="w-full">
        {/* High Confidence Group */}
        <AccordionItem value="high">
          <AccordionTrigger className="py-3">
            <div className="flex items-center">
              <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
              <span>High Confidence ({groupedFields.high.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mb-2 flex justify-between">
              <span className="text-xs text-neutral-500">Fields with 80-100% confidence score</span>
              <Button variant="ghost" size="sm" onClick={() => toggleGroup('high')}>
                {groupedFields.high.every(field => selectedFields.includes(field)) ? 
                  <MinusCircleIcon className="w-3 h-3 mr-1" /> : 
                  <PlusCircleIcon className="w-3 h-3 mr-1" />
                }
                {groupedFields.high.every(field => selectedFields.includes(field)) ? 
                  "Deselect All" : "Select All"}
              </Button>
            </div>
            
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
              {groupedFields.high.map(fieldName => (
                <div 
                  key={fieldName} 
                  className={`p-2 rounded-md border text-sm ${
                    selectedFields.includes(fieldName) ? 
                      'border-blue-200 bg-blue-50' : 
                      'border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">
                        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1')}:
                      </span>{' '}
                      <span>{results[fieldName].value}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => toggleField(fieldName)}
                    >
                      {selectedFields.includes(fieldName) ? 
                        <CheckIcon className="w-4 h-4" /> : 
                        <PlusCircleIcon className="w-4 h-4" />
                      }
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Medium Confidence Group */}
        <AccordionItem value="medium">
          <AccordionTrigger className="py-3">
            <div className="flex items-center">
              <InfoIcon className="w-4 h-4 mr-2 text-blue-500" />
              <span>Medium Confidence ({groupedFields.medium.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mb-2 flex justify-between">
              <span className="text-xs text-neutral-500">Fields with 60-79% confidence score</span>
              <Button variant="ghost" size="sm" onClick={() => toggleGroup('medium')}>
                {groupedFields.medium.every(field => selectedFields.includes(field)) ? 
                  <MinusCircleIcon className="w-3 h-3 mr-1" /> : 
                  <PlusCircleIcon className="w-3 h-3 mr-1" />
                }
                {groupedFields.medium.every(field => selectedFields.includes(field)) ? 
                  "Deselect All" : "Select All"}
              </Button>
            </div>
            
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
              {groupedFields.medium.map(fieldName => (
                <div 
                  key={fieldName} 
                  className={`p-2 rounded-md border text-sm ${
                    selectedFields.includes(fieldName) ? 
                      'border-blue-200 bg-blue-50' : 
                      'border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">
                        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1')}:
                      </span>{' '}
                      <span>{results[fieldName].value}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => toggleField(fieldName)}
                    >
                      {selectedFields.includes(fieldName) ? 
                        <CheckIcon className="w-4 h-4" /> : 
                        <PlusCircleIcon className="w-4 h-4" />
                      }
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Low Confidence Group */}
        <AccordionItem value="low">
          <AccordionTrigger className="py-3">
            <div className="flex items-center">
              <AlertTriangleIcon className="w-4 h-4 mr-2 text-yellow-500" />
              <span>Low Confidence ({groupedFields.low.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mb-2 flex justify-between">
              <span className="text-xs text-neutral-500">Fields with less than 60% confidence score</span>
              <Button variant="ghost" size="sm" onClick={() => toggleGroup('low')}>
                {groupedFields.low.every(field => selectedFields.includes(field)) ? 
                  <MinusCircleIcon className="w-3 h-3 mr-1" /> : 
                  <PlusCircleIcon className="w-3 h-3 mr-1" />
                }
                {groupedFields.low.every(field => selectedFields.includes(field)) ? 
                  "Deselect All" : "Select All"}
              </Button>
            </div>
            
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
              {groupedFields.low.map(fieldName => (
                <div 
                  key={fieldName} 
                  className={`p-2 rounded-md border text-sm ${
                    selectedFields.includes(fieldName) ? 
                      'border-blue-200 bg-blue-50' : 
                      'border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">
                        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1')}:
                      </span>{' '}
                      <span>{results[fieldName].value}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => toggleField(fieldName)}
                    >
                      {selectedFields.includes(fieldName) ? 
                        <CheckIcon className="w-4 h-4" /> : 
                        <PlusCircleIcon className="w-4 h-4" />
                      }
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };
  
  return (
    <div className="space-y-4">
      {/* Web search info */}
      {webSearchUsed && sources.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Enhanced with latest information</CardTitle>
            <CardDescription>
              Results include data from web research to ensure compliance with current regulations
            </CardDescription>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-xs text-neutral-500">
              <h4 className="font-medium mb-1">Sources consulted:</h4>
              <ul className="list-disc pl-4">
                {sources.map((source, index) => (
                  <li key={index}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* View mode selector */}
      <div className="flex space-x-2">
        <Button 
          variant={viewMode === 'grouped' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setViewMode('grouped')}
        >
          Group by Confidence
        </Button>
        <Button 
          variant={viewMode === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setViewMode('all')}
        >
          View All Fields
        </Button>
      </div>
      
      {/* Results view */}
      <div className="mt-4">
        {viewMode === 'grouped' ? renderGroupedFields() : renderAllFields()}
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 mt-4">
        <Button 
          variant="outline" 
          onClick={applyHighConfidenceOnly}
          className="sm:flex-1"
        >
          <CheckIcon className="w-4 h-4 mr-2" />
          Apply High Confidence Only
        </Button>
        <Button 
          variant="default" 
          onClick={applySelected}
          className="sm:flex-1"
          disabled={selectedFields.length === 0}
        >
          Apply {selectedFields.length} Selected
        </Button>
        <Button 
          variant="default" 
          onClick={applyAll}
          className="sm:flex-1"
        >
          Apply All
        </Button>
      </div>
    </div>
  );
}