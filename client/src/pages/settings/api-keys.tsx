import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ApiKeyManagement from "@/components/settings/api-key-management";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

export default function ApiKeysPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/settings">
            <Button variant="ghost" className="flex items-center gap-1 pl-0 mb-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Settings
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">API Key Management</h1>
          <p className="text-muted-foreground">
            Configure API keys for various AI providers and external services
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>API Key Information</CardTitle>
            <CardDescription>
              Learn about the API keys required for different features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">OpenAI</h3>
                <p className="text-sm text-muted-foreground">
                  Used for generating sophisticated compliance recommendations and content analysis.
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline ml-1"
                  >
                    Get API key
                  </a>
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Google Gemini</h3>
                <p className="text-sm text-muted-foreground">
                  Used for advanced compliance analysis and document scanning.
                  <a 
                    href="https://ai.google.dev/tutorials/setup" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline ml-1"
                  >
                    Get API key
                  </a>
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">DeepSeek</h3>
                <p className="text-sm text-muted-foreground">
                  Used for deep compliance analysis and risk assessment.
                  <a 
                    href="https://platform.deepseek.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline ml-1"
                  >
                    Get API key
                  </a>
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Google Search</h3>
                <p className="text-sm text-muted-foreground">
                  Used for retrieving up-to-date information about regulatory changes.
                  <a 
                    href="https://developers.google.com/custom-search/v1/introduction" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline ml-1"
                  >
                    Get API key
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <ApiKeyManagement />
      </div>
    </div>
  );
}