
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  FileText, 
  Presentation, 
  FileSpreadsheet,
  X,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ExportModuleProps {
  moduleId: string;
  moduleTitle: string;
}

const ExportModule: React.FC<ExportModuleProps> = ({ moduleId, moduleTitle }) => {
  const [open, setOpen] = useState(false);
  const [exportType, setExportType] = useState<'markdown' | 'pptx' | 'pdf'>('markdown');
  const [exportStatus, setExportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const exportModule = async () => {
    setExportStatus('loading');
    
    try {
      const response = await fetch(`/api/training/export/${moduleId}?format=${exportType}`);
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }
      
      // Get filename from Content-Disposition header or create a default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `eu-ai-act-training-${moduleTitle.toLowerCase().replace(/\s+/g, '-')}.${exportType}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      // Download the file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportStatus('success');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setExportStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Download className="h-4 w-4 mr-2" />
        Export Module
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Training Module</DialogTitle>
            <DialogDescription>
              Export "{moduleTitle}" in different formats for offline use or distribution.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="markdown" onValueChange={(v) => setExportType(v as any)}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="markdown">Markdown</TabsTrigger>
              <TabsTrigger value="pptx">PowerPoint</TabsTrigger>
              <TabsTrigger value="pdf">PDF</TabsTrigger>
            </TabsList>
            
            <TabsContent value="markdown" className="py-4">
              <div className="flex items-center space-x-4">
                <FileText size={40} className="text-blue-500" />
                <div>
                  <h3 className="font-medium">Markdown Format</h3>
                  <p className="text-sm text-neutral-500">
                    Plain text format for easy editing and compatibility
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pptx" className="py-4">
              <div className="flex items-center space-x-4">
                <Presentation size={40} className="text-orange-500" />
                <div>
                  <h3 className="font-medium">PowerPoint Format</h3>
                  <p className="text-sm text-neutral-500">
                    Presentation slides for classroom training
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pdf" className="py-4">
              <div className="flex items-center space-x-4">
                <FileSpreadsheet size={40} className="text-red-500" />
                <div>
                  <h3 className="font-medium">PDF Format</h3>
                  <p className="text-sm text-neutral-500">
                    Document format for printing or sharing
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {exportStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Export Failed</AlertTitle>
              <AlertDescription>
                {errorMessage || 'An error occurred during export. Please try again.'}
              </AlertDescription>
            </Alert>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={exportModule} disabled={exportStatus === 'loading'}>
              {exportStatus === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : exportStatus === 'success' ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Downloaded
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExportModule;
