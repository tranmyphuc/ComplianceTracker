
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Book, CheckCircle, FileText, Info, List, HelpCircle, GraduationCap } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';
import { Badge } from "@/components/ui/badge";

const EuAiActGuides: React.FC = () => {
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold">EU AI Act Training Guides</h1>
        <p className="text-muted-foreground">
          Comprehensive educational resources to help you understand the EU AI Act and its implementation requirements
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              EU AI Act Fundamentals
            </CardTitle>
            <CardDescription>
              Essential introduction to the EU AI Act legislative framework
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">
              This guide covers the fundamental concepts of the EU AI Act, including its scope, key definitions, and the risk-based approach to regulation.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/training/module/1">
                Start Learning
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              Risk Classification System
            </CardTitle>
            <CardDescription>
              Understanding the EU AI Act risk categories and classification process
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">
              Learn how to properly classify AI systems according to the four risk categories defined in the EU AI Act: Unacceptable, High, Limited, and Minimal Risk.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/training/module/2">
                Start Learning
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Technical Requirements
            </CardTitle>
            <CardDescription>
              Detailed technical compliance requirements for AI systems
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">
              This guide explains the technical requirements mandated by the EU AI Act, including data governance, system documentation, and human oversight.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/training/module/3">
                Start Learning
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Compliance Documentation
            </CardTitle>
            <CardDescription>
              Essential documentation requirements for EU AI Act compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">
              Learn about the mandatory documentation requirements for AI systems under the EU AI Act, including technical documentation, risk assessments, and conformity declarations.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/documentation/training-documentation">
                View Guide
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5 text-primary" />
              Implementation Roadmap
            </CardTitle>
            <CardDescription>
              Step-by-step guide to implementing EU AI Act compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">
              This practical guide provides a structured approach to implementing EU AI Act compliance across your organization, with actionable steps and timelines.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/documentation/risk-assessment#implementation-roadmap">
                View Guide
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Comprehensive Coaching
            </CardTitle>
            <CardDescription>
              Expert-led training program with Jack from SGH Asia
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-6">
              Join our comprehensive interactive training program led by expert coach Jack from SGH Asia. Available in both English and German.
            </p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/training/comprehensive-coaching">
                View Program
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-6 mt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Role-Based Training</h2>
            <p className="text-muted-foreground">
              Tailored learning paths based on your role in the organization
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-blue-50 hover:bg-blue-100 cursor-pointer">Decision Makers</Badge>
            <Badge variant="outline" className="bg-green-50 hover:bg-green-100 cursor-pointer">Developers</Badge>
            <Badge variant="outline" className="bg-amber-50 hover:bg-amber-100 cursor-pointer">Operators</Badge>
            <Badge variant="outline" className="bg-purple-50 hover:bg-purple-100 cursor-pointer">Users</Badge>
          </div>
        </div>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Multilingual Training Resources</CardTitle>
          <CardDescription>Training materials available in multiple languages to support global implementation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex gap-3">
              <img src="/attached_assets/image_1742743429066.png" alt="SGH Asia Coach" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <h3 className="font-medium">English Training Materials</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive training materials in English covering all aspects of the EU AI Act.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <img src="/attached_assets/image_1742743429066.png" alt="SGH Asia Coach" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <h3 className="font-medium">German Training Materials</h3>
                <p className="text-sm text-muted-foreground">
                  Deutsche Schulungsmaterialien zum EU-KI-Gesetz für eine einfachere Umsetzung.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EuAiActGuides;
