
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TrainingPresentation from '@/components/training/presentation-mode';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const TrainingPresentationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userRole, setUserRole] = useState('technical');
  const [loading, setLoading] = useState(true);
  const [moduleTitle, setModuleTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user info to determine role
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role || 'technical');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    // Fetch module metadata
    const fetchModule = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/training/modules/${id}/metadata`);
        if (response.ok) {
          const data = await response.json();
          setModuleTitle(data.title);
          document.title = `Training: ${data.title} | EU AI Act Compliance`;
        }
      } catch (error) {
        console.error('Error fetching module:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
    fetchModule();
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
