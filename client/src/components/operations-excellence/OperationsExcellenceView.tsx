
import React from 'react';

const OperationsExcellenceView: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Operations Excellence</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium mb-4">Process Optimization</h2>
          <p className="text-gray-700 mb-4">
            Streamline your AI system development and deployment processes to efficiently meet EU AI Act requirements.
          </p>
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-medium text-blue-700 mb-2">Key Process Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">87%</p>
                <p className="text-sm text-gray-600">Documentation Efficiency</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">92%</p>
                <p className="text-sm text-gray-600">Compliance Integration</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium mb-4">Resource Allocation</h2>
          <p className="text-gray-700 mb-4">
            Optimize resource allocation for EU AI Act compliance activities across your organization.
          </p>
          <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Resource allocation visualization</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-medium mb-4">Compliance Workflow Automation</h2>
        <p className="text-gray-700 mb-4">
          Automate compliance workflows to increase efficiency and reduce manual effort.
        </p>
        <div className="bg-green-50 p-4 rounded mb-4">
          <h3 className="font-medium text-green-700 mb-2">Automation Opportunities</h3>
          <ul className="list-disc pl-5">
            <li className="mb-1">Documentation generation and updates</li>
            <li className="mb-1">Risk assessment scheduling and notifications</li>
            <li className="mb-1">Compliance monitoring alerts</li>
            <li className="mb-1">Regulatory update tracking</li>
          </ul>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Configure Automation
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-medium mb-4">Operational Excellence Dashboard</h2>
        <p className="text-gray-700 mb-4">
          Monitor key operational metrics for your EU AI Act compliance program.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded text-center">
            <p className="text-sm text-gray-500">Compliance Efficiency</p>
            <p className="text-2xl font-bold text-gray-800">94%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded text-center">
            <p className="text-sm text-gray-500">Process Automation</p>
            <p className="text-2xl font-bold text-gray-800">78%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded text-center">
            <p className="text-sm text-gray-500">Resource Utilization</p>
            <p className="text-2xl font-bold text-gray-800">85%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded text-center">
            <p className="text-sm text-gray-500">Time-to-Compliance</p>
            <p className="text-2xl font-bold text-gray-800">21d</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsExcellenceView;
