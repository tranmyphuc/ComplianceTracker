import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '../../components/ui/button';
import { ChevronLeft } from 'lucide-react';
import TrainingPresentation from '../../components/training/presentation-mode';

const TrainingPresentationPage: React.FC = () => {
  const [params] = useParams();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [moduleTitle, setModuleTitle] = useState('');
  const [userRole, setUserRole] = useState('technical');
  const id = params.id;

  useEffect(() => {
    // Fetch module info
    if (!id) return;

    const fetchModuleInfo = async () => {
      try {
        const response = await fetch(`/api/training/modules/${id}/info`);
        const data = await response.json();
        setModuleTitle(data.title);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching module info:', error);
        setLoading(false);
      }
    };

    // Get user role/preferences
    const fetchUserRole = async () => {
      try {
        const response = await fetch('/api/user/preferences');
        const data = await response.json();
        if (data.role) {
          setUserRole(data.role);
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };

    fetchModuleInfo();
    fetchUserRole();
  }, [id]);

  const handleCompletion = async () => {
    if (!id) return;

    try {
      // Record completion
      await fetch('/api/training/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleId: id,
        }),
      });

      // Redirect to certificate or dashboard
      navigate('/training/certificate/' + id);
    } catch (error) {
      console.error('Error recording completion:', error);
      navigate('/training');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="px-4 py-2 border-b flex items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate('/training')}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Training
        </Button>
        <h1 className="ml-4 text-lg font-medium">{loading ? 'Loading...' : moduleTitle}</h1>
      </header>

      <main className="flex-1 overflow-hidden">
        {!loading && id && (
          <TrainingPresentation 
            moduleId={id} 
            role={userRole}
            onComplete={handleCompletion}
          />
        )}
      </main>
    </div>
  );
};

export default TrainingPresentationPage;