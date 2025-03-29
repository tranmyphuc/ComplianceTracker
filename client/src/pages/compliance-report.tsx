import React, { useEffect, useState } from 'react';
import { ComplianceBriefPDF } from '@/components/reports/compliance-brief-pdf';
import { UserOnboardingProfile } from '@/components/onboarding/onboarding-wizard';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Download, Printer, Share2, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ComplianceReportPage = () => {
  const [userProfile, setUserProfile] = useState<UserOnboardingProfile | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load user profile from localStorage
    const savedProfile = localStorage.getItem('userOnboardingProfile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error parsing user profile from localStorage:', error);
      }
    }
  }, []);

  const handleDownloadPDF = () => {
    // In a real app, this would trigger PDF generation and download
    toast({
      title: "PDF Download Started",
      description: "Your personalized compliance brief is being generated and will download shortly.",
      variant: "default",
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Your compliance brief has been downloaded successfully.",
        variant: "default",
      });
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    toast({
      title: "Share Options",
      description: "Sharing functionality will be available in the next update.",
      variant: "default",
    });
  };

  const handleEmail = () => {
    toast({
      title: "Email PDF",
      description: "Email functionality will be available in the next update.",
      variant: "default",
    });
  };

  if (!userProfile) {
    return (
      <div className="container mx-auto py-8">
        <PageHeader
          heading="Compliance Report"
          subheading="Your personalized EU AI Act compliance brief"
        />
        <Card className="mt-6">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">
              No profile information available. Please complete the onboarding process first.
            </p>
            <Button
              className="mt-4"
              onClick={() => window.location.href = '/onboarding'}
            >
              Go to Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        heading="Your Personalized Compliance Brief"
        subheading="Based on your organization profile and AI system information"
      />
      
      <div className="flex justify-center gap-4 mb-8">
        <Button 
          variant="default" 
          className="gap-2 bg-purple-600 hover:bg-purple-700"
          onClick={handleDownloadPDF}
        >
          <Download size={16} />
          Download PDF
        </Button>
        
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handlePrint}
        >
          <Printer size={16} />
          Print
        </Button>
        
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handleShare}
        >
          <Share2 size={16} />
          Share
        </Button>
        
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handleEmail}
        >
          <Mail size={16} />
          Email
        </Button>
      </div>
      
      <div className="print:p-0 p-4 bg-gray-50 rounded-lg shadow-sm">
        <ComplianceBriefPDF 
          userProfile={userProfile} 
          onDownload={handleDownloadPDF}
        />
      </div>
    </div>
  );
};

export default ComplianceReportPage;