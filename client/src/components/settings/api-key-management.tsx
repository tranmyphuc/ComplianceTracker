
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Key, Plus, Trash2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

type ApiKey = {
  id: string;
  provider: string;
  description?: string;
  isActive: boolean;
  usageCount: number;
  usageLimit?: number;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
};

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

  const handleAddKey = async () => {
    try {
      const response = await fetch('/api/ai-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newKey)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add API key');
      }
      
      toast({
        title: 'API Key Added',
        description: `Successfully added ${newKey.provider} API key`,
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
        variant: 'destructive',
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to add API key',
      });
    }
  };

  const handleUpdateKey = async (id: string, updates: Partial<ApiKey>) => {
    try {
      const response = await fetch(`/api/ai-keys/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update API key');
      }
      
      toast({
        title: 'API Key Updated',
        description: 'Successfully updated the API key',
      });
      
      // Refresh the list
      fetchApiKeys();
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update API key',
      });
    }
  };

  const handleDeleteKey = async (id: string, provider: string) => {
    if (!confirm(`Are you sure you want to delete this ${provider} API key?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/ai-keys/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }
      
      toast({
        title: 'API Key Deleted',
        description: `Successfully deleted ${provider} API key`,
      });
      
      // Refresh the list
      fetchApiKeys();
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete API key',
      });
    }
  };

  const testApiKey = async (provider: string) => {
    setTestingProvider(provider);
    setTestResult(null);
    
    try {
      const response = await fetch(`/api/ai-keys/test/${provider}`);
      const data = await response.json();
      
      setTestResult({
        success: data.success,
        message: data.message,
        provider
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: 'Failed to test API key',
        provider
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
                        <SelectItem value="deepseek">DeepSeek AI</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                        <SelectItem value="cohere">Cohere</SelectItem>
                        <SelectItem value="stability">Stability AI</SelectItem>
                        <SelectItem value="google_search">Google Custom Search API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="key">API Key</Label>
                    <Input
                      id="key"
                      type="password"
                      value={newKey.key}
                      onChange={(e) => setNewKey({...newKey, key: e.target.value})}
                      placeholder="Enter the API key"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={newKey.description}
                      onChange={(e) => setNewKey({...newKey, description: e.target.value})}
                      placeholder="Add a description for this API key"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      value={newKey.usageLimit || ''}
                      onChange={(e) => setNewKey({
                        ...newKey, 
                        usageLimit: e.target.value ? parseInt(e.target.value) : undefined
                      })}
                      placeholder="Enter maximum number of uses"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={newKey.isActive}
                      onCheckedChange={(checked) => setNewKey({...newKey, isActive: checked})}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddKey}
                    disabled={!newKey.provider || !newKey.key}
                  >
                    Add API Key
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {testResult && (
            <Alert 
              variant={testResult.success ? "default" : "destructive"} 
              className="mb-4"
            >
              <AlertTitle>{testResult.success ? 'API Key Test Successful' : 'API Key Test Failed'}</AlertTitle>
              <AlertDescription>{testResult.message}</AlertDescription>
            </Alert>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-1">No API Keys</h3>
              <p>You haven't added any API keys yet.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First API Key
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium capitalize">
                      {key.provider.replace('_', ' ')}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {key.description || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.isActive ? "success" : "secondary"}>
                        {key.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {key.usageCount}{key.usageLimit ? `/${key.usageLimit}` : ""}
                    </TableCell>
                    <TableCell>
                      {key.lastUsed 
                        ? new Date(key.lastUsed).toLocaleDateString() 
                        : "Never"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => testApiKey(key.provider)}
                        disabled={testingProvider === key.provider}
                      >
                        {testingProvider === key.provider ? (
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateKey(key.id, { isActive: !key.isActive })}
                      >
                        {key.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteKey(key.id, key.provider)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            API keys are securely stored and used to authenticate with AI service providers.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApiKeyManagement;
