
import React from 'react';

const MarketIntelligenceView: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Market Intelligence</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium mb-4">EU AI Act Market Trends</h2>
          <p className="text-gray-700 mb-4">
            Track the latest market trends related to EU AI Act compliance adoption across industries.
          </p>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Market adoption trend chart</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium mb-4">Competitor Analysis</h2>
          <p className="text-gray-700 mb-4">
            Benchmark your organization's compliance status against industry peers.
          </p>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Competitor compliance chart</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-medium mb-4">Regulatory Impact Forecast</h2>
        <p className="text-gray-700 mb-4">
          Predictive analysis of how upcoming EU AI Act amendments might impact your organization.
        </p>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">Regulatory impact forecast visualization</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-medium mb-4">Market Opportunity Analysis</h2>
        <p className="text-gray-700 mb-4">
          Identify new business opportunities from EU AI Act compliance.
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li className="mb-2">New service offerings based on compliance expertise</li>
          <li className="mb-2">Product differentiation through enhanced transparency</li>
          <li className="mb-2">Market expansion by addressing high-risk domains</li>
          <li className="mb-2">Partnership opportunities with compliance solutions providers</li>
        </ul>
      </div>
    </div>
  );
};

export default MarketIntelligenceView;
