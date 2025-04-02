import { useState } from "react";
import { 
  DownloadIcon, 
  FileTextIcon, 
  PaperclipIcon, 
  TrashIcon, 
  UploadIcon, 
  FileIcon,
  FilePlusIcon,
  ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AttachmentDropdownProps {
  systemId?: string;
  onUploadComplete?: (files: Array<{id: string, name: string, url: string, type: string}>) => void;
}

export function AttachmentDropdown({ systemId, onUploadComplete }: AttachmentDropdownProps) {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<Array<{id: string, name: string, url: string, type: string}>>([]);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("view"); // "view" or "upload"
  
  // Mock data for the attachments
  const mockAttachments = [
    { id: "1", name: "Technical Specification.pdf", url: "#", type: "application/pdf" },
    { id: "2", name: "Data Flow Diagram.png", url: "#", type: "image/png" },
    { id: "3", name: "Risk Assessment Results.docx", url: "#", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  ];
  
  const attachments = [...mockAttachments, ...uploadedFiles];
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newFiles = Array.from(files).map((file, index) => ({
        id: `uploaded-${Date.now()}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setUploading(false);
      setActiveTab("view");
      
      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) uploaded successfully.`,
      });
      
      if (onUploadComplete) {
        onUploadComplete(newFiles);
      }
    }, 1500);
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileTextIcon className="h-4 w-4 text-red-500" />;
    if (fileType.includes('image')) return <ImageIcon className="h-4 w-4 text-blue-500" />;
    if (fileType.includes('word') || fileType.includes('document')) return <FileTextIcon className="h-4 w-4 text-blue-600" />;
    return <FileIcon className="h-4 w-4 text-gray-500" />;
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <PaperclipIcon className="h-4 w-4" />
          <span>Attachments</span>
          {attachments.length > 0 && (
            <div className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {attachments.length}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">System Attachments</h4>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-8">
              <TabsList className="h-8">
                <TabsTrigger value="view" className="text-xs h-7">View Files</TabsTrigger>
                <TabsTrigger value="upload" className="text-xs h-7">Upload New</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <TabsContent value="view" className="m-0">
            {attachments.length === 0 ? (
              <div className="text-center py-8">
                <FileIcon className="h-8 w-8 mx-auto text-neutral-300 mb-2" />
                <p className="text-sm text-neutral-500">No attachments yet</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setActiveTab("upload")}
                >
                  <UploadIcon className="h-4 w-4 mr-1" />
                  Upload Files
                </Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto border rounded-md p-2">
                {attachments.map((file) => (
                  <div 
                    key={file.id} 
                    className="flex items-center justify-between p-2 hover:bg-neutral-50 rounded-md"
                  >
                    <div className="flex items-center space-x-2 overflow-hidden">
                      {getFileIcon(file.type)}
                      <span className="text-sm truncate" title={file.name}>{file.name}</span>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <DownloadIcon className="h-4 w-4 text-neutral-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upload" className="m-0">
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload" className="text-sm mb-1 block">Upload Files</Label>
                <div 
                  className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-neutral-50"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <UploadIcon className="h-8 w-8 mx-auto mb-2 text-neutral-400" />
                  <p className="text-sm text-neutral-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-neutral-400 mt-1">PDF, DOC, TXT, PNG, JPG (max 5MB)</p>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mr-2"
                  onClick={() => setActiveTab("view")}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  disabled={uploading}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {uploading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FilePlusIcon className="h-4 w-4 mr-1" />
                      Select Files
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </PopoverContent>
    </Popover>
  );
}