
import React from 'react';

const GrowthInnovationView: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Growth & Innovation</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium mb-4">Innovation Opportunities</h2>
          <p className="text-gray-700 mb-4">
            Discover ways to leverage EU AI Act compliance for competitive advantage and innovation.
          </p>
          <div className="bg-green-50 p-4 rounded mb-4">
            <h3 className="font-medium text-green-700 mb-2">Top Opportunities</h3>
            <ul className="list-disc pl-5">
              <li className="mb-1">Develop transparent AI solutions ahead of competitors</li>
              <li className="mb-1">Create compliance-as-a-service offerings for customers</li>
              <li className="mb-1">Build trust-focused AI systems with enhanced explainability</li>
              <li className="mb-1">Enter high-risk domains with compliant AI solutions</li>
            </ul>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Explore Opportunities
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium mb-4">Growth Strategy</h2>
          <p className="text-gray-700 mb-4">
            Align EU AI Act compliance with your organization's growth strategy.
          </p>
          <div className="h-48 bg-gray-100 rounded flex items-center justify-center mb-4">
            <p className="text-gray-500">Growth strategy matrix</p>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Strategy alignment score:</span>
            <span className="text-sm font-medium">84%</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-medium mb-4">Innovation Roadmap</h2>
        <p className="text-gray-700 mb-4">
          Strategic roadmap for AI innovation aligned with EU AI Act compliance.
        </p>
        <div className="relative overflow-x-auto">
          <div className="min-w-full">
            <div className="flex items-center mb-4 space-x-1">
              <div className="w-1/4 p-3 bg-gray-100 rounded-l-lg">
                <h3 className="text-center font-medium">Phase 1</h3>
                <p className="text-center text-sm text-gray-500">Foundation</p>
                <p className="text-center text-xs mt-2">Q3-Q4 2023</p>
              </div>
              <div className="w-1/4 p-3 bg-gray-100">
                <h3 className="text-center font-medium">Phase 2</h3>
                <p className="text-center text-sm text-gray-500">Optimization</p>
                <p className="text-center text-xs mt-2">Q1-Q2 2024</p>
              </div>
              <div className="w-1/4 p-3 bg-gray-100">
                <h3 className="text-center font-medium">Phase 3</h3>
                <p className="text-center text-sm text-gray-500">Expansion</p>
                <p className="text-center text-xs mt-2">Q3-Q4 2024</p>
              </div>
              <div className="w-1/4 p-3 bg-gray-100 rounded-r-lg">
                <h3 className="text-center font-medium">Phase 4</h3>
                <p className="text-center text-sm text-gray-500">Leadership</p>
                <p className="text-center text-xs mt-2">2025</p>
              </div>
            </div>
            <div className="flex">
              <div className="w-1/4 p-3 border-r border-gray-200">
                <ul className="text-sm space-y-2">
                  <li>• Compliance baselines</li>
                  <li>• Basic integration</li>
                  <li>• Risk assessment</li>
                </ul>
              </div>
              <div className="w-1/4 p-3 border-r border-gray-200">
                <ul className="text-sm space-y-2">
                  <li>• Enhanced documentation</li>
                  <li>• Process automation</li>
                  <li>• Compliance monitoring</li>
                </ul>
              </div>
              <div className="w-1/4 p-3 border-r border-gray-200">
                <ul className="text-sm space-y-2">
                  <li>• Compliance-as-service</li>
                  <li>• New market entry</li>
                  <li>• Partner ecosystem</li>
                </ul>
              </div>
              <div className="w-1/4 p-3">
                <ul className="text-sm space-y-2">
                  <li>• Thought leadership</li>
                  <li>• Standards influence</li>
                  <li>• Next-gen solutions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-medium mb-4">Innovation Pipeline</h2>
        <p className="text-gray-700 mb-4">
          Track innovation initiatives enabled by EU AI Act compliance.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initiative</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Compliant-by-design AI Platform</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Product</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">In Development</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">High</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Q4 2023</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">AI Compliance Assessment Service</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Service</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Medium</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Ongoing</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Transparency Toolkit for Healthcare AI</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Solution</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Planning</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">High</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Q2 2024</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GrowthInnovationView;
