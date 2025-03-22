
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangleIcon, BellIcon, ExternalLinkIcon, InfoIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RegulatoryUpdate {
  id: string;
  title: string;
  description: string;
  source: string;
  date: string;
  impactLevel: 'high' | 'medium' | 'low';
  relevantArticles: string[];
  actionRequired: boolean;
  url?: string;
}

interface RegulatoryImpactAnalysis {
  implications: string[];
  requiredActions: string[];
  timeline: string;
  nonComplianceRisks: string[];
}

export function RegulatoryUpdates() {
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>([]);
  const [selectedUpdate, setSelectedUpdate] = useState<RegulatoryUpdate | null>(null);
  const [impactAnalysis, setImpactAnalysis] = useState<RegulatoryImpactAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch regulatory updates
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        // In production, this would be a real API call
        // For now, simulate API response
        const response = await fetch('/api/regulatory/updates');
        const data = await response.json();
        setUpdates(data || []);
      } catch (error) {
        console.error('Error fetching regulatory updates:', error);
        // Fallback to mock data if API fails
        setUpdates([
          {
            id: '1',
            title: 'EU AI Act Final Text Published',
            description: 'The final text of the EU AI Act has been published in the Official Journal of the European Union, starting the implementation timeline.',
            source: 'European Commission',
            date: '2024-06-01',
            impactLevel: 'high',
            relevantArticles: ['All'],
            actionRequired: true,
            url: 'https://ec.europa.eu/ai-act'
          },
          {
            id: '2',
            title: 'Guidance on Risk Assessment Methodology',
            description: 'The European Commission has published new guidance on risk assessment methodologies for high-risk AI systems.',
            source: 'European Commission',
            date: '2024-05-15',
            impactLevel: 'medium',
            relevantArticles: ['Article 9'],
            actionRequired: true
          },
          {
            id: '3',
            title: 'Updated Technical Standards for Conformity Assessment',
            description: 'The European standardization bodies have released new technical standards for conformity assessment of high-risk AI systems.',
            source: 'CEN-CENELEC',
            date: '2024-04-20',
            impactLevel: 'high',
            relevantArticles: ['Article 40', 'Article 41'],
            actionRequired: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  // Handle update selection
  const handleUpdateClick = async (update: RegulatoryUpdate) => {
    setSelectedUpdate(update);
    
    try {
      // In production, this would be a real API call to analyze impact
      // For now, simulate API response
      setImpactAnalysis({
        implications: [
          "Updates to technical documentation required",
          "Additional conformity assessment steps needed",
          "Potential changes to risk assessment methodology"
        ],
        requiredActions: [
          "Review and update risk assessment documentation",
          "Implement new technical standards in system design",
          "Update conformity assessment procedures"
        ],
        timeline: "3 months before enforcement deadline",
        nonComplianceRisks: [
          "Potential penalties of up to 7% of global annual turnover",
          "Prohibition from EU market",
          "Reputational damage"
        ]
      });
    } catch (error) {
      console.error('Error analyzing regulatory impact:', error);
      setImpactAnalysis(null);
    }
    
    setIsDialogOpen(true);
  };

  // Filter updates by tab
  const filteredUpdates = updates.filter(update => {
    if (activeTab === 'all') return true;
    if (activeTab === 'action' && update.actionRequired) return true;
    if (activeTab === 'high' && update.impactLevel === 'high') return true;
    return false;
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>EU AI Act Regulatory Updates</CardTitle>
              <CardDescription>Stay informed about the latest regulatory developments</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              <BellIcon className="h-4 w-4" />
              Subscribe
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Updates</TabsTrigger>
              <TabsTrigger value="action">
                Action Required
                {updates.filter(u => u.actionRequired).length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {updates.filter(u => u.actionRequired).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="high">
                High Impact
                {updates.filter(u => u.impactLevel === 'high').length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {updates.filter(u => u.impactLevel === 'high').length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <div className="text-center py-6">Loading regulatory updates...</div>
              ) : filteredUpdates.length === 0 ? (
                <div className="text-center py-6 text-gray-500">No updates found</div>
              ) : (
                <div className="space-y-4">
                  {filteredUpdates.map((update) => (
                    <div
                      key={update.id}
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleUpdateClick(update)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-500">{update.source}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{update.date}</span>
                          </div>
                          <h3 className="font-medium">{update.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant={
                              update.impactLevel === 'high' ? 'destructive' : 
                              update.impactLevel === 'medium' ? 'default' : 'outline'
                            }>
                              {update.impactLevel.charAt(0).toUpperCase() + update.impactLevel.slice(1)} Impact
                            </Badge>
                            
                            {update.actionRequired && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-800 hover:bg-amber-100">
                                <AlertTriangleIcon className="h-3 w-3 mr-1" />
                                Action Required
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLinkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Regulatory Update Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedUpdate && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span>{selectedUpdate.source}</span>
                  <span>•</span>
                  <span>{selectedUpdate.date}</span>
                </div>
                <DialogTitle className="text-xl">{selectedUpdate.title}</DialogTitle>
                <DialogDescription className="mt-2">{selectedUpdate.description}</DialogDescription>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant={
                    selectedUpdate.impactLevel === 'high' ? 'destructive' : 
                    selectedUpdate.impactLevel === 'medium' ? 'default' : 'outline'
                  }>
                    {selectedUpdate.impactLevel.charAt(0).toUpperCase() + selectedUpdate.impactLevel.slice(1)} Impact
                  </Badge>
                  
                  {selectedUpdate.actionRequired && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-800">
                      <AlertTriangleIcon className="h-3 w-3 mr-1" />
                      Action Required
                    </Badge>
                  )}
                  
                  {selectedUpdate.relevantArticles.map(article => (
                    <Badge key={article} variant="outline">
                      {article}
                    </Badge>
                  ))}
                </div>
              </DialogHeader>
              
              <div className="mt-4">
                <h3 className="font-medium text-lg mb-3">Impact Analysis</h3>
                
                {impactAnalysis ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Key Implications</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {impactAnalysis.implications.map((implication, index) => (
                          <li key={index} className="text-gray-600">{implication}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Required Actions</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {impactAnalysis.requiredActions.map((action, index) => (
                          <li key={index} className="text-gray-600">{action}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Suggested Timeline</h4>
                      <p className="text-gray-600">{impactAnalysis.timeline}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Non-Compliance Risks</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {impactAnalysis.nonComplianceRisks.map((risk, index) => (
                          <li key={index} className="text-gray-600">{risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">Loading impact analysis...</div>
                )}
                
                <div className="mt-6 flex justify-between">
                  {selectedUpdate.url && (
                    <Button variant="outline" className="gap-1" asChild>
                      <a href={selectedUpdate.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLinkIcon className="h-4 w-4 mr-1" />
                        View Source
                      </a>
                    </Button>
                  )}
                  
                  <Button>Create Compliance Task</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between bg-blue-50 p-4 rounded-md">
        <div className="flex items-start">
          <InfoIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-700 font-medium">EU AI Act Updates</p>
            <p className="text-sm text-blue-600 mt-1">
              Staying current with regulatory changes is critical for maintaining compliance with the EU AI Act. 
              The regulation will evolve through implementing acts, delegated acts, and technical standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
