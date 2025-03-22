
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DownloadIcon, 
  UploadIcon, 
  FileTextIcon, 
  DatabaseIcon, 
  CheckIcon, 
  AlertTriangleIcon, 
  InfoIcon 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function ImportExportInventory() {
  const [importFormat, setImportFormat] = useState('csv');
  const [exportFormat, setExportFormat] = useState('json');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importing, setImporting] = useState(false);
  const [exportItems, setExportItems] = useState({
    systems: true,
    documents: true,
    riskAssessments: true,
    activities: false,
    deadlines: false
  });
  const { toast } = useToast();
  
  // Handle file selection for import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
    }
  };
  
  // Handle import process
  const handleImport = async () => {
    if (!importFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to import.",
        variant: "destructive"
      });
      return;
    }
    
    setImporting(true);
    setImportProgress(0);
    
    // Simulate import process with progress updates
    const totalSteps = 5;
    for (let step = 1; step <= totalSteps; step++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setImportProgress(Math.round((step / totalSteps) * 100));
    }
    
    setImporting(false);
    
    toast({
      title: "Import successful",
      description: `Successfully imported data from ${importFile.name}`,
      variant: "default"
    });
  };
  
  // Handle export process
  const handleExport = () => {
    // Build export data set name based on selected items
    const selectedItems = Object.entries(exportItems)
      .filter(([_, selected]) => selected)
      .map(([name]) => name);
      
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to export.",
        variant: "destructive"
      });
      return;
    }
    
    // Construct data set name
    const datasetName = selectedItems.length > 1 
      ? `ai-inventory-${selectedItems.length}-items` 
      : `ai-${selectedItems[0]}`;
    
    // In a real implementation, this would generate actual data
    // For demo, we'll just create a download trigger with empty data
    const dummyData = JSON.stringify({ 
      exported_at: new Date().toISOString(),
      items: selectedItems,
      format: exportFormat
    }, null, 2);
    
    const blob = new Blob([dummyData], { type: exportFormat === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${datasetName}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: `Successfully exported ${selectedItems.join(', ')} as ${exportFormat.toUpperCase()}`,
      variant: "default"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import & Export</CardTitle>
        <CardDescription>
          Import AI systems from external sources or export your inventory data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="import">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="importFormat">Import Format</Label>
                <Select value={importFormat} onValueChange={setImportFormat}>
                  <SelectTrigger id="importFormat">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="excel">Excel (XLSX)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="importFile">Select File</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="importFile"
                    type="file"
                    onChange={handleFileChange}
                    accept={
                      importFormat === 'csv' ? '.csv' : 
                      importFormat === 'json' ? '.json' : 
                      '.xlsx, .xls'
                    }
                  />
                </div>
              </div>
              
              {importFile && (
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FileTextIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Selected file</h3>
                      <p className="mt-1 text-sm text-blue-700">
                        {importFile.name} ({Math.round(importFile.size / 1024)} KB)
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {importing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Import Progress</Label>
                    <span className="text-sm text-gray-500">{importProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
                      style={{ width: `${importProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleImport} 
                className="w-full" 
                disabled={!importFile || importing}
              >
                <UploadIcon className="h-4 w-4 mr-2" />
                Import Data
              </Button>
            </div>
            
            <div className="mt-6 flex items-center justify-between bg-blue-50 p-4 rounded-md">
              <div className="flex items-start">
                <InfoIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 font-medium">Import Format</p>
                  <p className="text-sm text-blue-600 mt-1">
                    To ensure successful import, your file should include fields for system name, description, purpose, 
                    department, risk level, vendor, and version. Download a template for guidance.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="export" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exportFormat">Export Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger id="exportFormat">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Items to Export</Label>
                <div className="border rounded-md p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="exportSystems" 
                      checked={exportItems.systems}
                      onCheckedChange={(checked) => 
                        setExportItems({...exportItems, systems: !!checked})
                      }
                    />
                    <label
                      htmlFor="exportSystems"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      AI Systems
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="exportDocuments" 
                      checked={exportItems.documents}
                      onCheckedChange={(checked) => 
                        setExportItems({...exportItems, documents: !!checked})
                      }
                    />
                    <label
                      htmlFor="exportDocuments"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Documentation
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="exportRiskAssessments" 
                      checked={exportItems.riskAssessments}
                      onCheckedChange={(checked) => 
                        setExportItems({...exportItems, riskAssessments: !!checked})
                      }
                    />
                    <label
                      htmlFor="exportRiskAssessments"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Risk Assessments
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="exportActivities" 
                      checked={exportItems.activities}
                      onCheckedChange={(checked) => 
                        setExportItems({...exportItems, activities: !!checked})
                      }
                    />
                    <label
                      htmlFor="exportActivities"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Activity Logs
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="exportDeadlines" 
                      checked={exportItems.deadlines}
                      onCheckedChange={(checked) => 
                        setExportItems({...exportItems, deadlines: !!checked})
                      }
                    />
                    <label
                      htmlFor="exportDeadlines"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Compliance Deadlines
                    </label>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleExport} 
                className="w-full"
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
            
            <div className="mt-6 flex items-center justify-between bg-blue-50 p-4 rounded-md">
              <div className="flex items-start">
                <InfoIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 font-medium">Export for Compliance Reporting</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Exported data can be used for compliance reporting, audits, or sharing information with regulators. 
                    The PDF format includes a comprehensive compliance report suitable for presentation.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-6 flex justify-between">
        <Button variant="outline" asChild>
          <a href="#" download="ai-system-template.csv">
            <FileTextIcon className="h-4 w-4 mr-2" />
            Download Template
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="#" target="_blank">
            <InfoIcon className="h-4 w-4 mr-2" />
            Import/Export Guide
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
