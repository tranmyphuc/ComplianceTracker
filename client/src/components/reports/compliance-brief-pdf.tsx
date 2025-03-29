import React from 'react';
import { UserOnboardingProfile } from '../onboarding/onboarding-wizard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Shield, AlertTriangle, Clock, ChevronRight, FileCheck, CheckCircle, 
  BookOpen, User, Building, Cpu, Calendar, PieChart as PieChartIcon
} from 'lucide-react';

// Custom risk score calculation based on organization profile
const calculateRiskScores = (profile: UserOnboardingProfile) => {
  // Default scores
  const scores = {
    documentation: 65,
    technicalCompliance: 70,
    governanceProcesses: 60,
    riskManagement: 75,
    dataManagement: 80
  };
  
  // Adjust based on organization size
  if (profile.organizationSize === 'Large (1,000+ employees)') {
    scores.governanceProcesses -= 10; // Larger orgs typically have more complex governance challenges
    scores.documentation -= 5;
  } else if (profile.organizationSize === 'Medium (100-999 employees)') {
    scores.technicalCompliance += 5;
  } else {
    scores.governanceProcesses += 10; // Smaller orgs can implement governance changes faster
    scores.riskManagement -= 10; // But might have fewer risk management resources
  }
  
  // Adjust based on industry
  if (profile.industry === 'Healthcare' || profile.industry === 'Financial Services') {
    scores.dataManagement -= 15; // These industries have stricter data requirements
    scores.riskManagement += 10; // But often have better risk processes
  } else if (profile.industry === 'Manufacturing' || profile.industry === 'Retail') {
    scores.technicalCompliance -= 5;
  } else if (profile.industry === 'Technology') {
    scores.technicalCompliance += 15;
    scores.documentation -= 10; // Tech companies often prioritize development over documentation
  }
  
  // Adjust based on AI system types
  if (profile.aiSystemTypes?.includes('Generative AI')) {
    scores.technicalCompliance -= 10; // GenAI has more compliance challenges
    scores.dataManagement -= 10;
  }
  if (profile.aiSystemTypes?.includes('Computer Vision')) {
    scores.dataManagement -= 5; // Image data has privacy implications
  }
  if (profile.aiSystemTypes?.includes('Decision Support')) {
    scores.riskManagement -= 5; // Decision support systems need careful risk assessment
  }
  
  // Ensure scores are within 0-100 range
  Object.keys(scores).forEach(key => {
    scores[key as keyof typeof scores] = Math.max(0, Math.min(100, scores[key as keyof typeof scores]));
  });
  
  return scores;
};

// Timeline data based on organization profile
const generateTimeline = (profile: UserOnboardingProfile) => {
  // Base timeline
  const timeline = [
    { 
      phase: 'Immediate (1-3 months)', 
      activities: [
        'AI systems inventory',
        'Initial risk assessment',
        'Gap analysis',
        'Compliance team formation'
      ]
    },
    { 
      phase: 'Short-term (3-6 months)', 
      activities: [
        'Documentation improvements',
        'Updated data procedures',
        'Staff training',
        'Risk mitigation plans'
      ]
    },
    { 
      phase: 'Medium-term (6-12 months)', 
      activities: [
        'Technical adaptations',
        'Conformity assessment',
        'External validation',
        'Process documentation'
      ]
    },
    { 
      phase: 'Long-term (12+ months)', 
      activities: [
        'Ongoing monitoring',
        'Compliance maintenance',
        'Regular audits',
        'Continuous improvement'
      ]
    }
  ];
  
  // Customize timeline based on organization type and systems
  if (profile.organizationSize === 'Small (1-99 employees)') {
    timeline[0].activities.push('Resource allocation planning');
    timeline[1].activities.push('External expertise engagement');
  } else if (profile.organizationSize === 'Large (1,000+ employees)') {
    timeline[0].activities.push('Departmental responsibility mapping');
    timeline[1].activities.push('Cross-functional workstream establishment');
    timeline[2].activities.push('Subsidiary alignment');
  }
  
  if (profile.aiSystemTypes?.includes('High Risk AI')) {
    timeline[0].activities.push('Priority risk assessment');
    timeline[1].activities.push('Detailed conformity planning');
  }
  
  if (profile.industry === 'Healthcare' || profile.industry === 'Financial Services') {
    timeline[0].activities.push('Sector-specific requirement mapping');
    timeline[2].activities.push('Regulatory integration planning');
  }
  
  return timeline;
};

// Priority recommendations based on role
const generateRoleRecommendations = (profile: UserOnboardingProfile) => {
  const recommendations: {[key: string]: string[]} = {
    'Technical Team': [
      'Implement technical safeguards for AI system transparency',
      'Establish continuous monitoring for AI performance and drift',
      'Create documentation templates for system architecture',
      'Integrate explainability features into AI interfaces'
    ],
    'Legal/Compliance': [
      'Develop comprehensive AI governance policies',
      'Create documentation workflows for EU AI Act requirements',
      'Establish cross-departmental compliance procedures',
      'Design AI risk assessment templates'
    ],
    'Decision Maker': [
      'Allocate resources for compliance implementation',
      'Approve governance structure for AI oversight',
      'Establish compliance milestones and KPIs',
      'Align business strategy with compliance requirements'
    ],
    'Data Scientist': [
      'Implement bias detection and mitigation procedures',
      'Create model cards for all AI systems',
      'Develop testing protocols for AI performance',
      'Establish data quality assurance processes'
    ],
    'Project Manager': [
      'Create project plans for compliance implementation',
      'Develop task tracking for compliance milestones',
      'Establish stakeholder communication channels',
      'Design reporting processes for compliance status'
    ],
    'Executive': [
      'Establish executive oversight for AI governance',
      'Approve resources for compliance implementation',
      'Review compliance strategy and risk exposure',
      'Integrate compliance into business planning'
    ]
  };
  
  // Default recommendations if role is not specified
  const defaultRecommendations = [
    'Conduct inventory of all AI systems',
    'Perform risk assessment for each system',
    'Establish compliance documentation processes',
    'Create training program for staff awareness'
  ];
  
  return profile.role && recommendations[profile.role] 
    ? recommendations[profile.role] 
    : defaultRecommendations;
};

// Industry-specific compliance challenges
const getIndustryChallenges = (industry?: string) => {
  const challenges: {[key: string]: {challenge: string, solution: string}[]} = {
    'Healthcare': [
      {
        challenge: 'Patient data privacy with medical AI',
        solution: 'Implement enhanced data protection measures and explicit consent mechanisms'
      },
      {
        challenge: 'Clinical decision support systems classification',
        solution: 'Conduct detailed impact assessments and maintain human oversight'
      },
      {
        challenge: 'Integration with existing medical regulations',
        solution: 'Map overlapping requirements between EU AI Act and medical device regulations'
      }
    ],
    'Financial Services': [
      {
        challenge: 'Algorithmic credit scoring transparency',
        solution: 'Develop explainability methods and clear documentation for automated decisions'
      },
      {
        challenge: 'Fraud detection system false positives',
        solution: 'Implement tiered human review processes and continuous model monitoring'
      },
      {
        challenge: 'Integration with existing financial regulations',
        solution: 'Create unified compliance framework addressing all relevant regulations'
      }
    ],
    'Manufacturing': [
      {
        challenge: 'Worker safety with AI-controlled machinery',
        solution: 'Implement robust testing, failsafes, and emergency override systems'
      },
      {
        challenge: 'Quality control AI system reliability',
        solution: 'Develop statistical validation methods and performance benchmarks'
      },
      {
        challenge: 'Legacy system integration with new requirements',
        solution: 'Phase compliance implementation with priority on high-risk systems'
      }
    ],
    'Retail': [
      {
        challenge: 'Customer preference prediction and privacy',
        solution: 'Ensure transparent data collection and processing with clear opt-out options'
      },
      {
        challenge: 'Dynamic pricing algorithm fairness',
        solution: 'Implement fairness testing and regular bias audits'
      },
      {
        challenge: 'Multi-channel customer interaction consistency',
        solution: 'Establish uniform AI governance across all customer touchpoints'
      }
    ],
    'Technology': [
      {
        challenge: 'Rapid development cycles vs. compliance documentation',
        solution: 'Integrate compliance requirements into development workflows with automated tools'
      },
      {
        challenge: 'Open source AI components with unclear provenance',
        solution: 'Implement component tracking and third-party verification procedures'
      },
      {
        challenge: 'Cross-border data flows and processing',
        solution: 'Develop region-specific data handling policies and localization strategies'
      }
    ],
    'Professional Services': [
      {
        challenge: 'Client confidentiality with AI analysis tools',
        solution: 'Implement enhanced encryption and access controls with clear usage boundaries'
      },
      {
        challenge: 'Advisory liability for AI-assisted recommendations',
        solution: 'Maintain clear delineation of AI vs. human judgment with documented oversight'
      },
      {
        challenge: 'Knowledge management system compliance',
        solution: 'Implement source tracking and regular content review processes'
      }
    ]
  };
  
  return industry && challenges[industry] 
    ? challenges[industry] 
    : challenges['Technology']; // Default to technology if industry not specified or not found
};

// Generate visualization data for compliance readiness
const getComplianceReadinessData = (profile: UserOnboardingProfile) => {
  const riskScores = calculateRiskScores(profile);
  
  // Radar chart data
  const radarData = [
    { subject: 'Documentation', A: riskScores.documentation, fullMark: 100 },
    { subject: 'Technical Compliance', A: riskScores.technicalCompliance, fullMark: 100 },
    { subject: 'Governance', A: riskScores.governanceProcesses, fullMark: 100 },
    { subject: 'Risk Management', A: riskScores.riskManagement, fullMark: 100 },
    { subject: 'Data Management', A: riskScores.dataManagement, fullMark: 100 }
  ];
  
  // Bar chart data for risk levels by AI system type
  const systemRiskData = [
    { name: 'Generative AI', risk: 85 },
    { name: 'Computer Vision', risk: 75 },
    { name: 'NLP', risk: 65 },
    { name: 'Decision Support', risk: 90 },
    { name: 'Predictive Analytics', risk: 70 }
  ];
  
  // Filter to only include system types the organization has
  const filteredSystemRiskData = profile.aiSystemTypes 
    ? systemRiskData.filter(system => profile.aiSystemTypes?.includes(system.name))
    : systemRiskData;
  
  // Timeline chart data (simplified view of months to compliance)
  const timelineData = [
    { name: 'Inventory', months: 1 },
    { name: 'Risk Assessment', months: 2 },
    { name: 'Documentation', months: 4 },
    { name: 'Technical Changes', months: 6 },
    { name: 'Verification', months: 8 },
    { name: 'Full Compliance', months: 12 }
  ];
  
  return {
    radarData,
    systemRiskData: filteredSystemRiskData.length > 0 ? filteredSystemRiskData : systemRiskData,
    timelineData
  };
};

// Calculate overall compliance readiness score
const calculateOverallScore = (profile: UserOnboardingProfile) => {
  const riskScores = calculateRiskScores(profile);
  const scores = Object.values(riskScores);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};

interface ComplianceBriefPDFProps {
  userProfile: UserOnboardingProfile;
  onDownload?: () => void;
  isGenerating?: boolean;
}

export const ComplianceBriefPDF: React.FC<ComplianceBriefPDFProps> = ({ userProfile, onDownload, isGenerating }) => {
  const riskScores = calculateRiskScores(userProfile);
  const timeline = generateTimeline(userProfile);
  const roleRecommendations = generateRoleRecommendations(userProfile);
  const industryChallenges = getIndustryChallenges(userProfile.industry);
  const visualizationData = getComplianceReadinessData(userProfile);
  const overallScore = calculateOverallScore(userProfile);
  
  // Determine compliance readiness level
  let readinessLevel = 'Low';
  let readinessColor = 'text-red-600';
  if (overallScore >= 80) {
    readinessLevel = 'High';
    readinessColor = 'text-green-600';
  } else if (overallScore >= 60) {
    readinessLevel = 'Medium';
    readinessColor = 'text-amber-600';
  }
  
  // Pie chart data for compliance gaps
  const complianceGapData = [
    { name: 'Documentation', value: 100 - riskScores.documentation, fill: '#f97316' },
    { name: 'Technical', value: 100 - riskScores.technicalCompliance, fill: '#3b82f6' },
    { name: 'Governance', value: 100 - riskScores.governanceProcesses, fill: '#8b5cf6' },
    { name: 'Risk Management', value: 100 - riskScores.riskManagement, fill: '#10b981' },
    { name: 'Data Management', value: 100 - riskScores.dataManagement, fill: '#f43f5e' }
  ];
  
  // RACI matrix for roles
  const raciMatrix = [
    { activity: 'AI System Inventory', technical: 'R', legal: 'A', executive: 'I', data: 'C', project: 'R' },
    { activity: 'Risk Assessment', technical: 'C', legal: 'A', executive: 'I', data: 'R', project: 'C' },
    { activity: 'Documentation', technical: 'R', legal: 'A', executive: 'I', data: 'C', project: 'R' },
    { activity: 'Testing & Validation', technical: 'R', legal: 'I', executive: 'I', data: 'R', project: 'A' },
    { activity: 'Human Oversight', technical: 'C', legal: 'R', executive: 'A', data: 'C', project: 'I' },
    { activity: 'Implementation Review', technical: 'C', legal: 'R', executive: 'A', data: 'I', project: 'R' }
  ];
  
  return (
    <div className="bg-white rounded-lg p-8 max-w-5xl mx-auto shadow-lg overflow-auto relative" style={{ minHeight: '1000px' }}>
      {isGenerating && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center p-8 rounded-lg">
            <div className="w-16 h-16 border-t-4 border-b-4 border-purple-600 rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800">Generating PDF</h3>
            <p className="text-gray-600">Please wait while SGH ASIA AI analyzes your data...</p>
          </div>
        </div>
      )}
      {/* Header with Logo and Title */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
        <div className="flex items-center">
          <div className="bg-purple-600 text-white p-2 rounded-lg mr-3">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">EU AI Act Compliance Brief</h1>
            <p className="text-sm text-gray-500">Powered by SGH ASIA AI Analysis</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
          <p className="text-sm font-medium text-purple-600">Confidential Document</p>
        </div>
      </div>
      
      {/* Executive Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
          <User className="mr-2 text-purple-600" size={20} />
          Organization Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Industry</p>
            <p className="font-medium">{userProfile.industry || "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Organization Size</p>
            <p className="font-medium">{userProfile.organizationSize || "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium">{userProfile.role || "Not specified"}</p>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
          <h3 className="font-medium text-purple-800 mb-2">AI Systems in Scope</h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.aiSystemTypes && userProfile.aiSystemTypes.length > 0 ? (
              userProfile.aiSystemTypes.map((system, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Cpu className="mr-1" size={12} />
                  {system}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No AI systems specified</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Compliance Readiness Score */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <PieChartIcon className="mr-2 text-blue-600" size={20} />
          Compliance Readiness Assessment
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center mb-4 md:mb-0">
            <div className="relative inline-block">
              <svg className="w-32 h-32">
                <circle 
                  cx="64" 
                  cy="64" 
                  r="60" 
                  fill="none" 
                  stroke="#e5e7eb" 
                  strokeWidth="8" 
                />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="60" 
                  fill="none" 
                  stroke={overallScore >= 80 ? "#10b981" : overallScore >= 60 ? "#f59e0b" : "#ef4444"} 
                  strokeWidth="8" 
                  strokeDasharray={`${overallScore * 3.77} ${377 - overallScore * 3.77}`} 
                  strokeDashoffset="94.25" 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className={`text-3xl font-bold ${readinessColor}`}>{overallScore}%</span>
                <span className="text-sm text-gray-500">Readiness</span>
              </div>
            </div>
            <p className={`mt-2 font-medium ${readinessColor}`}>{readinessLevel} Readiness Level</p>
          </div>
          
          <div className="flex-1 ml-0 md:ml-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(riskScores).map(([key, score]) => {
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                let color = 'bg-red-500';
                if (score >= 80) color = 'bg-green-500';
                else if (score >= 60) color = 'bg-amber-500';
                
                return (
                  <div key={key} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className={`h-2.5 rounded-full ${color}`} 
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{formattedKey}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100">
              <p className="text-sm text-blue-800">
                <AlertTriangle className="inline mr-1" size={16} />
                {overallScore < 60 ? 
                  "Significant compliance gaps identified. Immediate action recommended." :
                  overallScore < 80 ?
                  "Moderate compliance gaps exist. Strategic improvements needed." :
                  "Good compliance foundation. Focus on maintaining and optimizing systems."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* System Risk Levels */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <AlertTriangle className="mr-2 text-amber-600" size={20} />
          AI System Risk Analysis
        </h2>
        
        <div className="bg-amber-50 p-4 rounded-lg mb-4 border border-amber-100">
          <h3 className="font-medium text-amber-800 mb-2">EU AI Act Risk Classification</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-red-100 p-3 rounded-md border border-red-200">
              <h4 className="font-medium text-red-800">Unacceptable Risk</h4>
              <p className="text-xs text-red-700 mt-1">Prohibited AI applications that pose clear threats to people's safety</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-md border border-amber-200">
              <h4 className="font-medium text-amber-800">High Risk</h4>
              <p className="text-xs text-amber-700 mt-1">Systems requiring strict compliance, extensive documentation and testing</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-md border border-blue-200">
              <h4 className="font-medium text-blue-800">Limited Risk</h4>
              <p className="text-xs text-blue-700 mt-1">Systems with specific transparency obligations</p>
            </div>
            <div className="bg-green-100 p-3 rounded-md border border-green-200">
              <h4 className="font-medium text-green-800">Minimal Risk</h4>
              <p className="text-xs text-green-700 mt-1">Systems with minimal compliance requirements</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="font-medium text-gray-800 mb-3">Risk Level by AI System Type</h3>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={visualizationData.systemRiskData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis label={{ value: 'Risk Level', angle: -90, position: 'insideLeft', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="risk" name="Risk Score" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="font-medium text-gray-800 mb-3">Compliance Gaps</h3>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complianceGapData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {complianceGapData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* Implementation Timeline */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Clock className="mr-2 text-indigo-600" size={20} />
          Implementation Roadmap
        </h2>
        
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 mb-6">
          <h3 className="font-medium text-gray-800 mb-3">Compliance Milestones</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={visualizationData.timelineData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Months', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="months" stroke="#8b5cf6" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="space-y-4">
          {timeline.map((phase, index) => (
            <div key={index} className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <h3 className="font-medium text-indigo-800 mb-2">{phase.phase}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {phase.activities.map((activity, actIdx) => (
                  <div key={actIdx} className="flex items-center">
                    <CheckCircle className="text-indigo-600 mr-2" size={16} />
                    <span className="text-sm text-indigo-800">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Industry-Specific Challenges */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Building className="mr-2 text-gray-600" size={20} />
          Industry-Specific Challenges &amp; Solutions
        </h2>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-3">
            {userProfile.industry || "Industry"} Compliance Challenges
          </h3>
          
          <div className="space-y-4">
            {industryChallenges.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-red-100 p-1 rounded-full mr-2 mt-1">
                    <AlertTriangle className="text-red-600" size={14} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{item.challenge}</h4>
                    <div className="mt-2 flex items-start">
                      <div className="bg-green-100 p-1 rounded-full mr-2 mt-1">
                        <CheckCircle className="text-green-600" size={14} />
                      </div>
                      <p className="text-sm text-gray-600">{item.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Role-Specific Recommendations */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <User className="mr-2 text-green-600" size={20} />
          Role-Specific Action Plan
        </h2>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <h3 className="font-medium text-green-800 mb-3">
            Priority Actions for {userProfile.role || "Your Role"}
          </h3>
          
          <div className="space-y-2">
            {roleRecommendations.map((rec, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border border-green-200 shadow-sm flex items-start">
                <ChevronRight className="text-green-600 mr-2 mt-1 flex-shrink-0" size={16} />
                <p className="text-sm text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
          
          {/* RACI Matrix */}
          <div className="mt-6">
            <h3 className="font-medium text-green-800 mb-3">Responsibility Matrix (RACI)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white text-sm">
                <thead>
                  <tr className="bg-green-100 text-green-800">
                    <th className="text-left p-2">Activity</th>
                    <th className="p-2">Technical</th>
                    <th className="p-2">Legal</th>
                    <th className="p-2">Executive</th>
                    <th className="p-2">Data Science</th>
                    <th className="p-2">Project Mgmt</th>
                  </tr>
                </thead>
                <tbody>
                  {raciMatrix.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                      <td className="text-left p-2 font-medium">{row.activity}</td>
                      <td className="p-2 text-center">{row.technical}</td>
                      <td className="p-2 text-center">{row.legal}</td>
                      <td className="p-2 text-center">{row.executive}</td>
                      <td className="p-2 text-center">{row.data}</td>
                      <td className="p-2 text-center">{row.project}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-green-100 text-xs text-green-800">
                    <td colSpan={6} className="p-2 text-center">
                      R = Responsible, A = Accountable, C = Consulted, I = Informed
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Conclusion and Next Steps */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FileCheck className="mr-2 text-purple-600" size={20} />
          Next Steps
        </h2>
        
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
          <p className="text-purple-800 mb-4">
            Based on this assessment, we recommend the following immediate actions to advance your EU AI Act compliance journey:
          </p>
          
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-md border border-purple-200 flex items-start">
              <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</div>
              <div>
                <h4 className="font-medium text-gray-800">Complete AI System Inventory</h4>
                <p className="text-sm text-gray-600 mt-1">Document all AI systems in use or development across your organization, including purpose, capabilities, and data sources.</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-md border border-purple-200 flex items-start">
              <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</div>
              <div>
                <h4 className="font-medium text-gray-800">Conduct Risk Assessment</h4>
                <p className="text-sm text-gray-600 mt-1">Assess each system against EU AI Act criteria to determine risk classification and compliance requirements.</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-md border border-purple-200 flex items-start">
              <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</div>
              <div>
                <h4 className="font-medium text-gray-800">Form Cross-Functional Team</h4>
                <p className="text-sm text-gray-600 mt-1">Establish a compliance team with representatives from technical, legal, and business departments to drive implementation.</p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-md border border-purple-200 flex items-start">
              <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</div>
              <div>
                <h4 className="font-medium text-gray-800">Gap Analysis &amp; Planning</h4>
                <p className="text-sm text-gray-600 mt-1">Compare current practices with EU AI Act requirements and develop a detailed implementation roadmap.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onDownload && onDownload();
              }}
              className="inline-flex items-center px-4 py-2 rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
            >
              <BookOpen className="mr-2" size={16} />
              Access Full Compliance Resources
            </a>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-12 border-t border-gray-200 pt-4 text-center">
        <p className="text-sm text-gray-500">
          This compliance brief was generated based on your organization profile and our AI-powered analysis.
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Powered by SGH ASIA AI Compliance Platform • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default ComplianceBriefPDF;