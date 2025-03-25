
import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Button, Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger, Input, Label, Select, 
  SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, 
  useToast
} from '@/components/ui';
import { AlertCircle, CheckCircle, Plus, Settings, Trash, X } from 'lucide-react';

// Define API key interface
interface ApiKey {
  id: string;
  provider: string;
  description?: string;
  isActive: boolean;
  usageCount: number;
  usageLimit?: number;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
}

const ApiKeyManagement: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{success: boolean, message: string, provider: string} | null>(null);
  
  const { toast } = useToast();

  const [newKey, setNewKey] = useState({
    provider: '',
    key: '',
    description: '',
    isActive: true,
    usageLimit: undefined as number | undefined
  });

  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-keys');
      if (!response.ok) {
        throw new Error(`Error fetching API keys: ${response.statusText}`);
      }
      const data = await response.json();
      setApiKeys(data.keys);
      setError(null);
    } catch (err) {
      setError('Failed to load API keys. Please try again.');
      console.error('Error fetching API keys:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleAddApiKey = async () => {
    try {
      if (!newKey.provider || !newKey.key) {
        toast({
          title: "Validation Error",
          description: "Provider and API key are required",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch('/api/ai-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newKey),
      });

      if (!response.ok) {
        throw new Error(`Error adding API key: ${response.statusText}`);
      }

      const result = await response.json();
      toast({
        title: "Success",
        description: `API key for ${result.provider} added successfully`,
      });

      // Reset form and close dialog
      setNewKey({
        provider: '',
        key: '',
        description: '',
        isActive: true,
        usageLimit: undefined
      });
      setIsAddDialogOpen(false);
      
      // Refresh the list
      fetchApiKeys();
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to add API key: ${err instanceof Error ? err.message : 'Unknown error'}`,
        variant: "destructive"
      });
      console.error('Error adding API key:', err);
    }
  };

  const handleUpdateApiKey = async (id: string, updates: Partial<ApiKey>) => {
    try {
      const response = await fetch(`/api/ai-keys/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Error updating API key: ${response.statusText}`);
      }

      const result = await response.json();
      toast({
        title: "Success", 
        description: result.message || "API key updated successfully",
      });
      
      // Refresh the list
      fetchApiKeys();
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to update API key: ${err instanceof Error ? err.message : 'Unknown error'}`,
        variant: "destructive"
      });
      console.error('Error updating API key:', err);
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;
    
    try {
      const response = await fetch(`/api/ai-keys/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error deleting API key: ${response.statusText}`);
      }

      const result = await response.json();
      toast({
        title: "Success",
        description: result.message || "API key deleted successfully",
      });
      
      // Refresh the list
      fetchApiKeys();
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to delete API key: ${err instanceof Error ? err.message : 'Unknown error'}`,
        variant: "destructive"
      });
      console.error('Error deleting API key:', err);
    }
  };

  const handleTestApiKey = async (provider: string) => {
    setTestingProvider(provider);
    setTestResult(null);
    
    try {
      const response = await fetch(`/api/ai-keys/test/${provider}`);
      const result = await response.json();
      
      setTestResult({
        success: result.success,
        message: result.message,
        provider
      });
      
      toast({
        title: result.success ? "Success" : "Warning",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: `Test failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        provider
      });
      
      toast({
        title: "Error",
        description: `Failed to test API key: ${err instanceof Error ? err.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setTestingProvider(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>API Key Management</CardTitle>
              <CardDescription>Manage API keys for various AI providers</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New API Key</DialogTitle>
                  <DialogDescription>
                    Add a new API key for an AI provider
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Select
                      onValueChange={(value) => setNewKey({...newKey, provider: value})}
                      value={newKey.provider}
                    >
                      <SelectTrigger id="provider">
                        <SelectValue placeholder="Select AI provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="anthropic">Anthropic</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                        <SelectItem value="deepseek">DeepSeek</SelectItem>
                        <SelectItem value="cohere">Cohere</SelectItem>
                        <SelectItem value="stability">Stability AI</SelectItem>
                        <SelectItem value="google_search">Google Search</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input 
                      id="api-key" 
                      type="password" 
                      value={newKey.key}
                      onChange={(e) => setNewKey({...newKey, key: e.target.value})}
                      placeholder="Enter API key" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input 
                      id="description" 
                      value={newKey.description}
                      onChange={(e) => setNewKey({...newKey, description: e.target.value})}
                      placeholder="E.g., Production key for chatbot" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="usage-limit">Usage Limit (Optional)</Label>
                    <Input 
                      id="usage-limit" 
                      type="number" 
                      min="0"
                      value={newKey.usageLimit === undefined ? '' : newKey.usageLimit}
                      onChange={(e) => setNewKey({...newKey, usageLimit: e.target.value ? Number(e.target.value) : undefined})}
                      placeholder="Maximum number of uses" 
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="active" 
                      checked={newKey.isActive}
                      onCheckedChange={(checked) => setNewKey({...newKey, isActive: checked})}
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddApiKey}>
                    Add Key
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 p-4 rounded-md mb-4 flex items-start text-red-600">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="py-4 text-center text-gray-500">Loading API keys...</div>
          ) : apiKeys.length === 0 ? (
            <div className="py-4 text-center text-gray-500">
              No API keys found. Add your first API key to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">
                      {key.provider.charAt(0).toUpperCase() + key.provider.slice(1)}
                    </TableCell>
                    <TableCell>{key.description || '-'}</TableCell>
                    <TableCell>
                      {key.usageCount} {key.usageLimit ? `/ ${key.usageLimit}` : ''}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${key.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {key.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {key.lastUsed ? new Date(key.lastUsed).toLocaleString() : 'Never'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTestApiKey(key.provider)}
                        disabled={testingProvider === key.provider}
                      >
                        {testingProvider === key.provider ? 'Testing...' : 'Test'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateApiKey(key.id, { isActive: !key.isActive })}
                      >
                        {key.isActive ? 'Disable' : 'Enable'}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteApiKey(key.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {testResult && (
            <div className={`mt-4 p-4 rounded-md flex items-start ${testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {testResult.success ? (
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium">
                  {testResult.success ? 'Success' : 'Error'}: {testResult.provider}
                </p>
                <p>{testResult.message}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto" 
                onClick={() => setTestResult(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-muted/50 p-4 text-sm text-muted-foreground rounded-b-lg">
          <p>
            API keys are securely stored and used to authenticate with AI service providers.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApiKeyManagement;
