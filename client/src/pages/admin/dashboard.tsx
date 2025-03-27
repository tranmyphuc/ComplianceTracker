
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Key, 
  ShieldAlert, 
  Users, 
  Settings, 
  Bell, 
  Webhook, 
  CreditCard,
  BarChart3,
  Search,
  RotateCw,
  PlusCircle,
  Trash2,
  Edit,
  Check,
  X,
  AlertTriangle,
  Cpu
} from 'lucide-react';

// Mock data for demonstration
const mockApiKeys = [
  { id: 1, provider: "OpenAI", name: "Production Key", key: "sk-...A7B9", status: "active", usageLimit: 1000, currentUsage: 450, created: "2025-01-15" },
  { id: 2, provider: "Google AI", name: "Development Key", key: "AIza...X2Yp", status: "active", usageLimit: 500, currentUsage: 120, created: "2025-02-10" },
  { id: 3, provider: "Claude", name: "Testing Key", key: "sk-ant...8dR2", status: "locked", usageLimit: 200, currentUsage: 200, created: "2025-03-01" },
];

const mockUsageData = [
  { date: "Mar 20", openai: 120, google: 85, claude: 40 },
  { date: "Mar 21", openai: 132, google: 78, claude: 45 },
  { date: "Mar 22", openai: 101, google: 90, claude: 30 },
  { date: "Mar 23", openai: 134, google: 95, claude: 44 },
  { date: "Mar 24", openai: 190, google: 120, claude: 55 },
  { date: "Mar 25", openai: 211, google: 111, claude: 67 },
  { date: "Mar 26", openai: 185, google: 98, claude: 42 },
];

const mockSearchStats = [
  { date: "Mar 20", queries: 45, cost: 2.25 },
  { date: "Mar 21", queries: 52, cost: 2.60 },
  { date: "Mar 22", queries: 48, cost: 2.40 },
  { date: "Mar 23", queries: 67, cost: 3.35 },
  { date: "Mar 24", queries: 75, cost: 3.75 },
  { date: "Mar 25", queries: 82, cost: 4.10 },
  { date: "Mar 26", queries: 70, cost: 3.50 },
];

const AdminDashboard: React.FC = () => {
  const [newApiKey, setNewApiKey] = useState({ provider: "", name: "", key: "", usageLimit: 1000 });
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [editKeyData, setEditKeyData] = useState({ provider: "", name: "", key: "", usageLimit: 0 });
  
  const handleAddKey = () => {
    if (newApiKey.provider && newApiKey.name && newApiKey.key) {
      setApiKeys([...apiKeys, { 
        id: apiKeys.length + 1, 
        provider: newApiKey.provider, 
        name: newApiKey.name, 
        key: newApiKey.key, 
        status: "active", 
        usageLimit: newApiKey.usageLimit, 
        currentUsage: 0, 
        created: new Date().toISOString().split('T')[0]
      }]);
      setNewApiKey({ provider: "", name: "", key: "", usageLimit: 1000 });
    }
  };
  
  const handleEditKey = (key: any) => {
    setEditingKey(key.id);
    setEditKeyData({
      provider: key.provider,
      name: key.name,
      key: key.key,
      usageLimit: key.usageLimit
    });
  };
  
  const saveKeyChanges = () => {
    if (editingKey) {
      setApiKeys(apiKeys.map(key => 
        key.id === editingKey ? 
        { ...key, provider: editKeyData.provider, name: editKeyData.name, key: editKeyData.key, usageLimit: editKeyData.usageLimit } : 
        key
      ));
      setEditingKey(null);
    }
  };
  
  const deleteKey = (id: number) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="main">
        <TabsList className="mb-6">
          <TabsTrigger value="main">
            <BarChart className="h-4 w-4 mr-2" />
            Main Dashboard
          </TabsTrigger>
          <TabsTrigger value="api-keys">
            <Key className="h-4 w-4 mr-2" />
            API Key Management
          </TabsTrigger>
          <TabsTrigger value="ai-config">
            <Cpu className="h-4 w-4 mr-2" />
            AI Configuration
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldAlert className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system-config">
            <Settings className="h-4 w-4 mr-2" />
            System Configuration
          </TabsTrigger>
        </TabsList>
      
        {/* Main Dashboard */}
        <TabsContent value="main">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total API Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,942</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
                <div className="mt-4 h-[80px] w-full bg-muted rounded">
                  {/* Chart placeholder */}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">API Usage Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$427.89</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
                <div className="mt-4 h-[80px] w-full bg-muted rounded">
                  {/* Chart placeholder */}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">API Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">98.7%</div>
                  <Badge className="ml-2 bg-green-500">Healthy</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Average uptime across all APIs</p>
                <div className="mt-4 h-[80px] w-full bg-muted rounded">
                  {/* Chart placeholder */}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card className="col-span-1 md:col-span-1">
              <CardHeader>
                <CardTitle>API Requests by Provider</CardTitle>
                <CardDescription>Last 7 days of API usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-muted rounded flex items-center justify-center">
                  <LineChart className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-1">
              <CardHeader>
                <CardTitle>Model Usage Distribution</CardTitle>
                <CardDescription>Current billing period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-muted rounded flex items-center justify-center">
                  <PieChart className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>System alerts and issues requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2025-03-25</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>
                    </TableCell>
                    <TableCell>OpenAI API rate limit approached (80%)</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-03-24</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Error</Badge>
                    </TableCell>
                    <TableCell>Google Search API authentication failed</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-03-22</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Info</Badge>
                    </TableCell>
                    <TableCell>System backup completed successfully</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      
        {/* API Key Management */}
        <TabsContent value="api-keys">
          <div className="grid gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New API Key</CardTitle>
                <CardDescription>Add a new API key for AI platforms or Google Search</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Select 
                      value={newApiKey.provider} 
                      onValueChange={(value) => setNewApiKey({...newApiKey, provider: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OpenAI">OpenAI</SelectItem>
                        <SelectItem value="Google AI">Google AI</SelectItem>
                        <SelectItem value="Claude">Claude (Anthropic)</SelectItem>
                        <SelectItem value="Google Search">Google Search API</SelectItem>
                        <SelectItem value="Cohere">Cohere</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="key-name">Key Name</Label>
                    <Input 
                      id="key-name" 
                      placeholder="Production, Development, etc." 
                      value={newApiKey.name}
                      onChange={(e) => setNewApiKey({...newApiKey, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input 
                      id="api-key" 
                      placeholder="sk-..." 
                      type="password" 
                      value={newApiKey.key}
                      onChange={(e) => setNewApiKey({...newApiKey, key: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="usage-limit">Usage Limit</Label>
                    <Input 
                      id="usage-limit" 
                      type="number" 
                      placeholder="1000" 
                      value={newApiKey.usageLimit.toString()}
                      onChange={(e) => setNewApiKey({...newApiKey, usageLimit: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddKey}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add API Key
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Current API Keys</CardTitle>
                <CardDescription>Manage your existing API connections</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell>
                          {editingKey === key.id ? (
                            <Select 
                              value={editKeyData.provider} 
                              onValueChange={(value) => setEditKeyData({...editKeyData, provider: value})}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="OpenAI">OpenAI</SelectItem>
                                <SelectItem value="Google AI">Google AI</SelectItem>
                                <SelectItem value="Claude">Claude</SelectItem>
                                <SelectItem value="Google Search">Google Search</SelectItem>
                                <SelectItem value="Cohere">Cohere</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            key.provider
                          )}
                        </TableCell>
                        <TableCell>
                          {editingKey === key.id ? (
                            <Input 
                              value={editKeyData.name} 
                              onChange={(e) => setEditKeyData({...editKeyData, name: e.target.value})}
                              className="w-[130px]"
                            />
                          ) : (
                            key.name
                          )}
                        </TableCell>
                        <TableCell>
                          {editingKey === key.id ? (
                            <Input 
                              value={editKeyData.key} 
                              onChange={(e) => setEditKeyData({...editKeyData, key: e.target.value})}
                              type="password"
                              className="w-[100px]"
                            />
                          ) : (
                            key.key
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={key.status === 'active' ? 
                                      'bg-green-100 text-green-800 border-green-200' : 
                                      'bg-red-100 text-red-800 border-red-200'}
                          >
                            {key.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-[120px] h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  (key.currentUsage / key.usageLimit) > 0.8 
                                    ? 'bg-red-500' 
                                    : (key.currentUsage / key.usageLimit) > 0.5 
                                      ? 'bg-yellow-500' 
                                      : 'bg-green-500'
                                }`}
                                style={{ width: `${(key.currentUsage / key.usageLimit) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{key.currentUsage}/{key.usageLimit}</span>
                          </div>
                        </TableCell>
                        <TableCell>{key.created}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {editingKey === key.id ? (
                              <>
                                <Button variant="ghost" size="icon" onClick={saveKeyChanges}>
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setEditingKey(null)}>
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => handleEditKey(key)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => deleteKey(key.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                                {key.status === "active" ? (
                                  <Button variant="ghost" size="icon">
                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                  </Button>
                                ) : (
                                  <Button variant="ghost" size="icon">
                                    <RotateCw className="h-4 w-4 text-blue-500" />
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>AI API Usage</CardTitle>
                  <CardDescription>Last 7 days of API requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[260px] w-full bg-muted rounded flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>OpenAI</TableHead>
                          <TableHead>Google AI</TableHead>
                          <TableHead>Claude</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockUsageData.map((day) => (
                          <TableRow key={day.date}>
                            <TableCell>{day.date}</TableCell>
                            <TableCell>{day.openai}</TableCell>
                            <TableCell>{day.google}</TableCell>
                            <TableCell>{day.claude}</TableCell>
                            <TableCell>{day.openai + day.google + day.claude}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Google Search API</CardTitle>
                  <CardDescription>Search queries and costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[260px] w-full bg-muted rounded flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Queries</TableHead>
                          <TableHead>Cost</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockSearchStats.map((day) => (
                          <TableRow key={day.date}>
                            <TableCell>{day.date}</TableCell>
                            <TableCell>{day.queries}</TableCell>
                            <TableCell>${day.cost.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Rotation Management</CardTitle>
                <CardDescription>Configure automatic key rotation and fallback rules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Key Rotation Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="enable-rotation" className="font-medium">Enable Key Rotation</Label>
                          <p className="text-sm text-muted-foreground">Automatically switch between keys</p>
                        </div>
                        <Switch id="enable-rotation" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="rotation-strategy">Rotation Strategy</Label>
                        <Select disabled={true}>
                          <SelectTrigger>
                            <SelectValue placeholder="Round Robin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="round-robin">Round Robin</SelectItem>
                            <SelectItem value="cost-optimize">Cost Optimization</SelectItem>
                            <SelectItem value="load-balance">Load Balancing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="rotation-threshold">Rotation Threshold</Label>
                        <Select disabled={true}>
                          <SelectTrigger>
                            <SelectValue placeholder="75% of rate limit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50">50% of rate limit</SelectItem>
                            <SelectItem value="75">75% of rate limit</SelectItem>
                            <SelectItem value="90">90% of rate limit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Fallback Rules</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="enable-fallback" className="font-medium">Enable Fallback</Label>
                          <p className="text-sm text-muted-foreground">Switch provider if API fails</p>
                        </div>
                        <Switch id="enable-fallback" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="primary-provider">Primary Provider</Label>
                        <Select disabled={true}>
                          <SelectTrigger>
                            <SelectValue placeholder="OpenAI" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="openai">OpenAI</SelectItem>
                            <SelectItem value="google">Google AI</SelectItem>
                            <SelectItem value="claude">Claude</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fallback-provider">Fallback Provider</Label>
                        <Select disabled={true}>
                          <SelectTrigger>
                            <SelectValue placeholder="Claude" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="claude">Claude</SelectItem>
                            <SelectItem value="openai">OpenAI</SelectItem>
                            <SelectItem value="google">Google AI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled>Save Rotation Settings</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      
        {/* AI System Configuration */}
        <TabsContent value="ai-config">
          <div className="grid gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Parameter Adjustments</CardTitle>
                <CardDescription>Configure default parameters for AI models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="temperature">Temperature</Label>
                        <span className="text-sm">0.7</span>
                      </div>
                      <Input
                        id="temperature"
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        defaultValue="0.7"
                      />
                      <p className="text-xs text-muted-foreground">Controls randomness: Lower values are more deterministic, higher values more creative.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="top-p">Top P</Label>
                        <span className="text-sm">0.9</span>
                      </div>
                      <Input
                        id="top-p"
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        defaultValue="0.9"
                      />
                      <p className="text-xs text-muted-foreground">Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="max-tokens">Max Tokens</Label>
                        <span className="text-sm">2048</span>
                      </div>
                      <Input
                        id="max-tokens"
                        type="range"
                        min="100"
                        max="4000"
                        step="100"
                        defaultValue="2048"
                      />
                      <p className="text-xs text-muted-foreground">The maximum number of tokens to generate in the completion.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="presence-penalty">Presence Penalty</Label>
                        <span className="text-sm">0.0</span>
                      </div>
                      <Input
                        id="presence-penalty"
                        type="range"
                        min="-2"
                        max="2"
                        step="0.1"
                        defaultValue="0"
                      />
                      <p className="text-xs text-muted-foreground">Positive values penalize new tokens based on whether they appear in the text so far.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="frequency-penalty">Frequency Penalty</Label>
                        <span className="text-sm">0.0</span>
                      </div>
                      <Input
                        id="frequency-penalty"
                        type="range"
                        min="-2"
                        max="2"
                        step="0.1"
                        defaultValue="0"
                      />
                      <p className="text-xs text-muted-foreground">Positive values penalize new tokens based on their frequency in the text so far.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="system-message">Default System Message</Label>
                      <textarea
                        id="system-message"
                        className="w-full min-h-[100px] p-2 border rounded-md"
                        defaultValue="You are an AI assistant specialized in EU AI Act compliance. Your primary goal is to help users understand and implement compliance with the regulation."
                      ></textarea>
                      <p className="text-xs text-muted-foreground">Default system message that provides context to the AI models.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled>Save Parameters</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Prompt Templates</CardTitle>
                <CardDescription>Manage and store reusable prompts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Risk Assessment</TableCell>
                      <TableCell>Template for analyzing AI system risks</TableCell>
                      <TableCell>2025-03-22</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Compliance Gap Analysis</TableCell>
                      <TableCell>Template for identifying compliance gaps</TableCell>
                      <TableCell>2025-03-20</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Documentation Generator</TableCell>
                      <TableCell>Template for generating compliance documentation</TableCell>
                      <TableCell>2025-03-15</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Button className="mt-4" disabled>Add New Template</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Model Management</CardTitle>
                <CardDescription>Select and configure AI models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="border-primary/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">GPT-4 Turbo</CardTitle>
                        <CardDescription>OpenAI</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between text-sm">
                          <span>Priority:</span>
                          <Badge>Primary</Badge>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>Cost:</span>
                          <span>$0.01/1K tokens</span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm" className="w-full" disabled>Configure</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Claude 3 Opus</CardTitle>
                        <CardDescription>Anthropic</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between text-sm">
                          <span>Priority:</span>
                          <Badge variant="outline">Secondary</Badge>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>Cost:</span>
                          <span>$0.015/1K tokens</span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm" className="w-full" disabled>Configure</Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Gemini Pro</CardTitle>
                        <CardDescription>Google AI</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between text-sm">
                          <span>Priority:</span>
                          <Badge variant="outline">Tertiary</Badge>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>Cost:</span>
                          <span>$0.0075/1K tokens</span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm" className="w-full" disabled>Configure</Button>
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Auto-switching</h3>
                        <p className="text-sm text-muted-foreground">Switch models based on performance and cost</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Switching Condition</Label>
                        <Select disabled>
                          <SelectTrigger>
                            <SelectValue placeholder="Error Rate &gt; 5%" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="error">Error Rate &gt; 5%</SelectItem>
                            <SelectItem value="latency">Latency &gt; 2s</SelectItem>
                            <SelectItem value="cost">Cost &gt; Budget</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Cooldown Period</Label>
                        <Select disabled>
                          <SelectTrigger>
                            <SelectValue placeholder="10 minutes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="10">10 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Retry Strategy</Label>
                        <Select disabled>
                          <SelectTrigger>
                            <SelectValue placeholder="Exponential Backoff" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="exponential">Exponential Backoff</SelectItem>
                            <SelectItem value="fixed">Fixed Interval</SelectItem>
                            <SelectItem value="linear">Linear Backoff</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled>Save Model Configuration</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Other tabs content would go here (User Management, Security, System Configuration) */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>This section is under development</AlertTitle>
                <AlertDescription>
                  User management functionality will be available in the next update.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security options and auditing</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>This section is under development</AlertTitle>
                <AlertDescription>
                  Security settings functionality will be available in the next update.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system-config">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Configure system settings and integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>This section is under development</AlertTitle>
                <AlertDescription>
                  System configuration functionality will be available in the next update.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
