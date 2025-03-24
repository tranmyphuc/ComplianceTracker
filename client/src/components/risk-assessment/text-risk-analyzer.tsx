import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { apiRequest } from '@/lib/queryClient';

interface RiskFactor {
  factor: string;
  level: string;
}

interface TextRiskAnalyzerProps {
  onAnalysisComplete?: (result: any) => void;
}

export default function TextRiskAnalyzer({ onAnalysisComplete }: TextRiskAnalyzerProps) {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const analyzeRisk = async () => {
    if (!text.trim()) {
      setError('Please enter a description of the AI system to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await apiRequest('/api/analyze/risk-from-text', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      
      setResult(response);
      if (onAnalysisComplete) {
        onAnalysisComplete(response);
      }
    } catch (err) {
      console.error('Error analyzing risk:', err);
      setError('Failed to analyze text. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    riskLevel = riskLevel.toLowerCase();
    if (riskLevel.includes('unacceptable')) return 'bg-red-500 text-white';
    if (riskLevel.includes('high')) return 'bg-orange-500 text-white';
    if (riskLevel.includes('limited')) return 'bg-yellow-500 text-black';
    if (riskLevel.includes('minimal')) return 'bg-green-500 text-white';
    return 'bg-blue-500 text-white';
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    riskLevel = riskLevel.toLowerCase();
    if (riskLevel.includes('unacceptable')) return <XCircle className="h-6 w-6" />;
    if (riskLevel.includes('high')) return <AlertTriangle className="h-6 w-6" />;
    if (riskLevel.includes('limited')) return <Info className="h-6 w-6" />;
    if (riskLevel.includes('minimal')) return <CheckCircle className="h-6 w-6" />;
    return <Info className="h-6 w-6" />;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>EU AI Act Risk Analyzer</CardTitle>
          <CardDescription>
            Enter a detailed description of your AI system to analyze its risk level according to the EU AI Act.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe your AI system in detail. Include its purpose, capabilities, domain of use, potential impacts, and any other relevant information..."
            value={text}
            onChange={handleTextChange}
            rows={8}
            className="resize-none"
          />
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            onClick={analyzeRisk}
            disabled={isAnalyzing || !text.trim()}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : 'Analyze Risk'}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Risk Analysis Results</CardTitle>
              <Badge className={getRiskLevelColor(result.riskLevel)}>
                <span className="flex items-center gap-1">
                  {getRiskLevelIcon(result.riskLevel)}
                  {result.riskLevel}
                </span>
              </Badge>
            </div>
            <CardDescription>
              {result.systemCategory && (
                <div className="mt-1">
                  <span className="font-semibold">System Category:</span> {result.systemCategory}
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="improvements">Improvements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.analysis?.riskFactors?.length > 0 ? (
                      <div className="grid gap-2">
                        {result.analysis.riskFactors.map((factor: RiskFactor, index: number) => (
                          <div 
                            key={index} 
                            className="border rounded-md p-3 flex items-center justify-between"
                          >
                            <div>{factor.factor}</div>
                            <Badge 
                              className={
                                factor.level === 'High' 
                                  ? 'bg-orange-500 text-white' 
                                  : factor.level === 'Medium' 
                                    ? 'bg-yellow-500 text-black' 
                                    : 'bg-blue-500 text-white'
                              }
                            >
                              {factor.level}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No specific risk factors identified.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="keywords">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Keywords Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          Prohibited Use Keywords
                        </h4>
                        {result.analysis?.prohibitedKeywords?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {result.analysis.prohibitedKeywords.map((keyword: string, index: number) => (
                              <Badge key={index} variant="outline" className="bg-red-100 text-red-800 border-red-300">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No prohibited use keywords detected.</p>
                        )}
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                          High-Risk Keywords
                        </h4>
                        {result.analysis?.highRiskKeywords?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {result.analysis.highRiskKeywords.map((keyword: string, index: number) => (
                              <Badge key={index} variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No high-risk keywords detected.</p>
                        )}
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Info className="h-4 w-4 text-yellow-500 mr-2" />
                          Limited-Risk Keywords
                        </h4>
                        {result.analysis?.limitedRiskKeywords?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {result.analysis.limitedRiskKeywords.map((keyword: string, index: number) => (
                              <Badge key={index} variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No limited-risk keywords detected.</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="articles">
                <Card>
                  <CardHeader>
                    <CardTitle>Relevant EU AI Act Articles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.relevantArticles?.length > 0 ? (
                      <div className="space-y-3">
                        {result.relevantArticles.map((article: string, index: number) => (
                          <Alert key={index} className="bg-blue-50 text-blue-800 border-blue-200">
                            <AlertTitle className="flex items-center">
                              <Info className="h-4 w-4 mr-2" />
                              {article}
                            </AlertTitle>
                          </Alert>
                        ))}
                      </div>
                    ) : (
                      <p>No specific articles identified.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="improvements">
                <Card>
                  <CardHeader>
                    <CardTitle>Suggested Improvements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.suggestedImprovements?.length > 0 ? (
                      <div className="space-y-2">
                        {result.suggestedImprovements.map((improvement: string, index: number) => (
                          <div key={index} className="flex items-start gap-2 p-2 border-b last:border-0">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>{improvement}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No specific improvements identified.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}