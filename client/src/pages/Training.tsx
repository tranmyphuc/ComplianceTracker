import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookIcon,
  GraduationCapIcon,
  AwardIcon,
  UsersIcon,
  FilterIcon,
  SearchIcon,
  ClipboardListIcon,
  BarChartIcon,
  CheckSquareIcon,
  UserIcon,
  BookOpen
} from 'lucide-react';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  relevance: string;
  progress: number;
  categories: string[];
}

const Training: React.FC = () => {
  const [activeTab, setActiveTab] = useState('modules');
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [filteredModules, setFilteredModules] = useState<TrainingModule[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGuidelines, setShowGuidelines] = useState(false); //Added state for guidelines

  useEffect(() => {
    // Fetch training modules
    const fetchModules = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/training/modules');
        // const data = await response.json();

        // Using mock data for demo
        const data = [
          {
            id: 'eu-ai-act-intro',
            title: 'EU AI Act Introduction',
            description: 'Introduction to the EU AI Act, its scope, and key provisions',
            duration: '20-30 minutes',
            relevance: 'Medium',
            progress: 5,
            categories: ['Regulatory Overview', 'Compliance Basics']
          },
          {
            id: 'risk-classification',
            title: 'Risk Classification System',
            description: 'Understanding the risk categories and how to classify AI systems',
            duration: '25-35 minutes',
            relevance: 'High',
            progress: 0,
            categories: ['Risk Management', 'Compliance']
          },
          {
            id: 'technical-requirements',
            title: 'Technical Requirements',
            description: 'Technical requirements for high-risk AI systems',
            duration: '40-50 minutes',
            relevance: 'High',
            progress: 0,
            categories: ['Technical Compliance', 'AI Development']
          },
          {
            id: 'data-governance',
            title: 'Data Governance & Quality',
            description: 'Data governance requirements and quality standards for AI systems',
            duration: '35-45 minutes',
            relevance: 'Medium',
            progress: 0,
            categories: ['Data Management', 'Technical Compliance']
          },
          {
            id: 'human-oversight',
            title: 'Human Oversight Requirements',
            description: 'Understanding and implementing human oversight for AI systems',
            duration: '30-40 minutes',
            relevance: 'High',
            progress: 0,
            categories: ['Governance', 'Compliance']
          },
          {
            id: 'transparency',
            title: 'Transparency Obligations',
            description: 'Transparency and documentation requirements for AI systems',
            duration: '25-35 minutes',
            relevance: 'Medium',
            progress: 0,
            categories: ['Documentation', 'Compliance']
          },
          {
            id: 'conformity-assessment',
            title: 'Conformity Assessment',
            description: 'Conformity assessment procedures for high-risk AI systems',
            duration: '45-55 minutes',
            relevance: 'High',
            progress: 0,
            categories: ['Compliance', 'Technical Compliance']
          },
          {
            id: 'prohibited-systems',
            title: 'Prohibited AI Systems',
            description: 'Understanding prohibited AI applications under the EU AI Act',
            duration: '20-30 minutes',
            relevance: 'High',
            progress: 0,
            categories: ['Regulatory Overview', 'Compliance']
          }
        ];

        setModules(data);
        setFilteredModules(data);

        // Extract unique categories
        const allCategories = data.flatMap(module => module.categories);
        const uniqueCategories = [...new Set(allCategories)];
        setCategories(uniqueCategories);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching training modules:', error);
        setIsLoading(false);
      }
    };

    fetchModules();
  }, []);

  useEffect(() => {
    // Filter modules based on search query and selected categories
    let result = modules;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(module =>
        module.title.toLowerCase().includes(query) ||
        module.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(module =>
        module.categories.some(category => selectedCategories.includes(category))
      );
    }

    setFilteredModules(result);
  }, [searchQuery, selectedCategories, modules]);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Training Center</h1>
          <p className="text-muted-foreground mt-1">
            Enhance your knowledge and skills on EU AI Act compliance
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link href="/training/comprehensive-coaching">
            <Button>
              <UsersIcon className="h-4 w-4 mr-2" />
              Comprehensive Coaching
            </Button>
          </Link>
          <Link href="/documentation/training-documentation">
            <Button variant="outline">
              <BookIcon className="h-4 w-4 mr-2" />
              View Documentation
            </Button>
          </Link>
          <Link href="/training/eu-ai-act-guide"> {/* Added link to training guide */}
            <Button variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Training Guide
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-8 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="rounded-lg bg-white p-4 shadow-sm flex items-center justify-center">
              <img
                src="/attached_assets/image_1742743429066.png"
                alt="SGH Asia Coach"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Comprehensive EU AI Act Training</h2>
              <p className="text-blue-700 mb-4">
                Join our expert coach Jack from SGH Asia for a comprehensive interactive training program
                on EU AI Act compliance. Available in both English and German.
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                <Badge variant="secondary" className="bg-blue-100">Interactive Slides</Badge>
                <Badge variant="secondary" className="bg-blue-100">Bilingual Content</Badge>
                <Badge variant="secondary" className="bg-blue-100">Visual Learning</Badge>
                <Badge variant="secondary" className="bg-blue-100">Knowledge Assessment</Badge>
              </div>
              <Link href="/training/comprehensive-coaching">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <GraduationCapIcon className="h-4 w-4 mr-2" />
                  Start Comprehensive Training
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="modules" className="mb-8" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="modules" className="flex items-center">
              <ClipboardListIcon className="h-4 w-4 mr-2" />
              Training Modules
            </TabsTrigger>
            <TabsTrigger value="your-progress" className="flex items-center">
              <BarChartIcon className="h-4 w-4 mr-2" />
              Your Progress
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center">
              <AwardIcon className="h-4 w-4 mr-2" />
              Certificates
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="modules" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search modules..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Categories</Label>
                    <div className="mt-2 space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`justify-start text-sm w-full ${
                              selectedCategories.includes(category)
                                ? 'bg-primary/10 border-primary/20'
                                : ''
                            }`}
                            onClick={() => toggleCategory(category)}
                          >
                            {selectedCategories.includes(category) && (
                              <CheckSquareIcon className="h-4 w-4 mr-2 text-primary" />
                            )}
                            {!selectedCategories.includes(category) && (
                              <FilterIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                            )}
                            {category}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(searchQuery || selectedCategories.length > 0) && (
                    <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:w-3/4">
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredModules.map((module) => (
                  <Card key={module.id} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between mb-1">
                        <Badge
                          variant="outline"
                          className={
                            module.relevance === 'High'
                              ? 'border-red-200 text-red-600 bg-red-50'
                              : 'border-blue-200 text-blue-600 bg-blue-50'
                          }
                        >
                          {module.relevance} Relevance
                        </Badge>
                        <span className="text-sm text-muted-foreground">{module.duration}</span>
                      </div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3 flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {module.categories.map((category) => (
                          <Badge key={category} variant="secondary" className="bg-slate-100">
                            {category}
                          </Badge>
                        ))}
                      </div>
                      {module.progress > 0 && (
                        <div className="space-y-1 mb-3">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{module.progress}%</span>
                          </div>
                          <Progress value={module.progress} className="h-2" />
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Link href={`/training/module/${module.id}`} className="w-full">
                        <Button className="w-full" variant="outline">
                          {module.progress > 0 ? 'Continue' : 'Start'} Module
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}

                {filteredModules.length === 0 && (
                  <div className="col-span-full p-8 text-center border rounded-lg">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <SearchIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">No modules found</h3>
                    <p className="mt-2 text-muted-foreground">
                      Try adjusting your search or filter criteria.
                    </p>
                    <Button variant="outline" className="mt-4" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="your-progress">
          <Card>
            <CardHeader>
              <CardTitle>Your Training Progress</CardTitle>
              <CardDescription>
                Track your progress across all training modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Overall Completion</span>
                    <span className="text-sm text-muted-foreground">5%</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Module Progress</h3>

                  {modules.map((module) => (
                    <div key={module.id} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{module.title}</span>
                        <span className="text-sm text-muted-foreground">{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>Your Certificates</CardTitle>
              <CardDescription>
                View and download your training certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <AwardIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No certificates yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Complete training modules to earn certificates
                </p>
                <Button className="mt-4" onClick={() => setActiveTab('modules')}>
                  Browse Modules
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Training;