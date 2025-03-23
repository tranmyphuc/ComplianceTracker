
import React from 'react';
import { Helmet } from 'react-helmet';
import ApiKeyManagement from '@/components/settings/api-key-management';

const ApiKeysPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>API Key Management | EU AI Act Compliance Platform</title>
      </Helmet>
      <div className="container mx-auto py-8 max-w-7xl">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold">API Key Management</h1>
          <p className="text-muted-foreground">
            Manage API keys for various AI service providers used across the platform
          </p>
        </div>
        
        <ApiKeyManagement />
      </div>
    </>
  );
};

export default ApiKeysPage;
