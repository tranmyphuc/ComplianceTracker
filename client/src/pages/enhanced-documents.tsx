/**
 * Enhanced Documents Page
 * Advanced document generation and management for EU AI Act compliance
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { EnhancedDocumentGenerator } from '@/components/document/enhanced-document-generator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertCircle,
  FileText,
  List,
  Bookmark
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DocumentType } from '@shared/types';

export default function EnhancedDocumentsPage() {
  const [activeTab, setActiveTab] = React.useState('generator');

  // Fetch existing documents (to be implemented)
  const { data: existingDocuments, isLoading } = useQuery({
    queryKey: ['/api/enhanced-documents'],
    enabled: activeTab === 'saved',
  });

  return (
    <>
      <Helmet>
        <title>Enhanced Documents | EU AI Act Compliance Platform</title>
      </Helmet>

      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Enhanced Documents</h1>
          <p className="text-muted-foreground">
            Generate comprehensive EU AI Act compliance documentation with advanced features and visualizations
          </p>
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Document Generation Assistant</AlertTitle>
          <AlertDescription className="text-blue-700">
            This tool leverages AI to generate advanced compliance documents tailored to your AI systems.
            Select a document template, provide system details, and customize your document with visualizations.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="generator" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Document Generator</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              <span className="hidden md:inline">Saved Documents</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden md:inline">Templates</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator" className="mt-6">
            <EnhancedDocumentGenerator />
          </TabsContent>
          
          <TabsContent value="saved" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Generated Documents</CardTitle>
                <CardDescription>
                  View and manage your previously generated compliance documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : existingDocuments && existingDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {existingDocuments.map((doc: any) => (
                      <Card key={doc.id} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">{doc.title}</CardTitle>
                          <CardDescription>
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {doc.documentType}
                            </span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">View</Button>
                              <Button size="sm" variant="ghost">Delete</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                    <h3 className="text-lg font-medium mb-1">No documents yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Generate your first enhanced document by using the Document Generator tab
                    </p>
                    <Button onClick={() => setActiveTab('generator')}>Create Document</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Templates</CardTitle>
                <CardDescription>
                  Browse and manage document templates for different compliance needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.values(DocumentType).map((type) => (
                    <Card key={type} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg capitalize">
                          {type.replace(/_/g, ' ')}
                        </CardTitle>
                        <CardDescription>
                          Standard EU AI Act template
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex justify-end">
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setActiveTab('generator');
                              // TODO: Set the selected template type
                            }}
                          >
                            Use Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}