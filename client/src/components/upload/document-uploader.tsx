import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { FileIcon, TrashIcon, UploadIcon, XIcon, FileTextIcon, PaperclipIcon } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useLanguage } from '@/contexts/LanguageContext';

interface FileWithPreview extends File {
  preview?: string;
  id?: string;
  uploadProgress?: number;
}

interface DocumentUploaderProps {
  onUploadComplete?: (files: Array<{id: string, name: string, url: string, type: string}>) => void;
  maxFiles?: number;
  acceptedFileTypes?: string;
  assessmentId?: string;
  systemId?: string;
  category?: string;
  className?: string;
}

export function DocumentUploader({
  onUploadComplete,
  maxFiles = 5,
  acceptedFileTypes = '.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.rtf,.png,.jpg,.jpeg',
  assessmentId,
  systemId,
  category = 'documentation',
  className = ''
}: DocumentUploaderProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${assessmentId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/documents/system/${systemId}`] });
      
      setUploading(false);
      setFiles([]);
      
      toast({
        title: t('documentUploader.success') || 'Upload Complete',
        description: t('documentUploader.successDescription') || 'Your documents have been successfully uploaded',
        variant: 'default',
      });
      
      if (onUploadComplete) {
        onUploadComplete(data.files);
      }
    },
    onError: (error: Error) => {
      setUploading(false);
      setError(error.message);
      toast({
        title: t('documentUploader.error') || 'Upload Failed',
        description: error.message || t('documentUploader.errorDescription') || 'There was an error uploading your documents',
        variant: 'destructive',
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files).map((file) => {
      return Object.assign(file, {
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(2, 9),
        uploadProgress: 0
      });
    });
    
    if (files.length + newFiles.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }
    
    setFiles([...files, ...newFiles]);
    setError(null);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    const fileToRemove = files.find(file => file.id === id);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles(files.filter(file => file.id !== id));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    
    if (assessmentId) {
      formData.append('assessmentId', assessmentId);
    }
    
    if (systemId) {
      formData.append('systemId', systemId);
    }
    
    formData.append('category', category);
    
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    uploadMutation.mutate(formData);
  };

  const isImage = (file: File) => {
    return file.type.startsWith('image/');
  };

  const getFileIcon = (file: File) => {
    if (isImage(file)) {
      return null; // Will use the preview image
    }
    
    if (file.type.includes('pdf')) {
      return <FileTextIcon className="h-6 w-6 text-red-500" />;
    }
    
    if (file.type.includes('word') || file.type.includes('doc')) {
      return <FileTextIcon className="h-6 w-6 text-blue-500" />;
    }
    
    if (file.type.includes('excel') || file.type.includes('sheet') || file.type.includes('csv')) {
      return <FileTextIcon className="h-6 w-6 text-green-500" />;
    }
    
    return <FileIcon className="h-6 w-6 text-gray-500" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept={acceptedFileTypes}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <UploadIcon className="h-10 w-10 text-muted-foreground" />
          <div className="space-y-1">
            <p className="font-medium text-muted-foreground">
              {t('documentUploader.dragDrop') || 'Drag and drop files or click to upload'}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('documentUploader.maxSize') || 'Max file size: 10MB'} • {t('documentUploader.maxFiles') || 'Max files'}: {maxFiles}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('documentUploader.supportedFormats') || 'Supported formats'}: {acceptedFileTypes.split(',').join(', ')}
            </p>
          </div>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center p-2 bg-background border rounded-md gap-2">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded bg-muted">
                  {isImage(file) && file.preview ? (
                    <img src={file.preview} alt={file.name} className="h-full w-full object-cover rounded" />
                  ) : (
                    getFileIcon(file)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  {file.uploadProgress !== undefined && file.uploadProgress > 0 && file.uploadProgress < 100 && (
                    <Progress value={file.uploadProgress} className="h-1 mt-1" />
                  )}
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6 rounded-full" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (file.id) removeFile(file.id);
                  }}
                  disabled={uploading}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                files.forEach(file => {
                  if (file.preview) URL.revokeObjectURL(file.preview);
                });
                setFiles([]);
              }}
              disabled={uploading}
            >
              {t('documentUploader.clearAll') || 'Clear All'}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
              size="sm"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('documentUploader.uploading') || 'Uploading...'}
                </>
              ) : (
                <>
                  <UploadIcon className="h-4 w-4 mr-2" />
                  {t('documentUploader.upload') || 'Upload'} ({files.length})
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function DocumentList({ 
  documents,
  onDelete,
  isLoading,
  emptyMessage = 'No documents uploaded',
  showDocumentType = true,
}: { 
  documents: Array<{id: string, name: string, url: string, type: string, category?: string}>;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  showDocumentType?: boolean;
}) {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{t('documentList.loading') || 'Loading documents...'}</span>
        </div>
      </div>
    );
  }
  
  if (documents.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <PaperclipIcon className="mx-auto h-8 w-8 mb-2" />
        <p>{t('documentList.empty') || emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between p-2 border rounded hover:bg-accent/20">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FileTextIcon className="h-5 w-5 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{doc.name}</p>
              {showDocumentType && (
                <p className="text-xs text-muted-foreground">{doc.category || doc.type}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" download={doc.name}>
                <FileIcon className="h-4 w-4" />
              </a>
            </Button>
            {onDelete && (
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => onDelete(doc.id)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}