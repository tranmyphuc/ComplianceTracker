
import React, { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Share2, 
  CheckCircle, 
  Trophy,
  Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface Certificate {
  id: string;
  moduleId: string;
  moduleTitle: string;
  completedAt: string;
  userName: string;
  userRole: string;
}

const TrainingCertificatePage: React.FC = () => {
  const [, params] = useRoute('/training/certificate/:id');
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [, navigate] = useLocation();
  
  useEffect(() => {
    const fetchCertificate = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/training/certificate/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCertificate(data);
          document.title = `Certificate: ${data.moduleTitle} | EU AI Act Compliance`;
        } else {
          // Certificate not found
          navigate('/training');
        }
      } catch (error) {
        console.error('Error fetching certificate:', error);
        navigate('/training');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id, navigate]);

  const downloadCertificate = () => {
    if (!certificate) return;
    
    // Create a simple printable version
    const certHtml = `
      <html>
        <head>
          <title>Certificate of Completion - ${certificate.moduleTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            .certificate { max-width: 800px; margin: 0 auto; padding: 40px; border: 20px solid #3f51b5; }
            .header { text-align: center; margin-bottom: 40px; }
            .title { font-size: 30px; font-weight: bold; margin-bottom: 10px; color: #3f51b5; }
            .name { font-size: 24px; font-weight: bold; margin: 30px 0; }
            .details { margin: 20px 0; font-size: 18px; }
            .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <div class="title">CERTIFICATE OF COMPLETION</div>
              <div>EU AI Act Compliance Training</div>
            </div>
            
            <div>This certifies that</div>
            <div class="name">${certificate.userName}</div>
            
            <div>has successfully completed the training module:</div>
            <div class="details">${certificate.moduleTitle}</div>
            
            <div>Date of Completion: ${new Date(certificate.completedAt).toLocaleDateString()}</div>
            
            <div class="footer">
              EU AI Act Compliance Platform<br>
              Certificate ID: ${certificate.id}
            </div>
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([certHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${certificate.moduleTitle.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareCertificate = () => {
    if (!certificate) return;
    
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: `EU AI Act Training Certificate: ${certificate.moduleTitle}`,
        text: `I've completed the EU AI Act training module: ${certificate.moduleTitle}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback to copying the URL
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert('Certificate link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg mb-4">Certificate not found</p>
          <Button onClick={() => navigate('/training')}>Return to Training</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 mx-auto">
      <Card className="border-8 border-primary/20 overflow-hidden">
        <div className="bg-primary/10 p-8 text-center">
          <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Certificate of Completion</h1>
          <p className="text-xl">EU AI Act Compliance Training</p>
        </div>
        
        <CardContent className="p-8 text-center space-y-6">
          <div>
            <p className="text-lg text-neutral-600">This certifies that</p>
            <h2 className="text-2xl font-bold mt-2">{certificate.userName}</h2>
            <p className="text-sm text-neutral-500 mt-1">{certificate.userRole}</p>
          </div>
          
          <div>
            <p className="text-lg text-neutral-600">has successfully completed</p>
            <h3 className="text-xl font-semibold mt-2">{certificate.moduleTitle}</h3>
          </div>
          
          <div className="flex items-center justify-center text-neutral-600">
            <Calendar className="h-5 w-5 mr-2" />
            <time dateTime={certificate.completedAt}>
              {new Date(certificate.completedAt).toLocaleDateString()} 
              ({formatDistanceToNow(new Date(certificate.completedAt), { addSuffix: true })})
            </time>
          </div>
          
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Button onClick={downloadCertificate}>
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </Button>
            <Button variant="outline" onClick={shareCertificate}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Certificate
            </Button>
          </div>
          
          <div className="pt-4 text-neutral-500 text-sm flex items-center justify-center">
            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
            Verified Certificate ID: {certificate.id.slice(0, 8)}
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center">
        <Button variant="ghost" onClick={() => navigate('/training')}>
          Return to Training Dashboard
        </Button>
      </div>
    </div>
  );
};

export default TrainingCertificatePage;
