/**
 * EU AI Act Compliance Data
 * Reference data and constants related to EU AI Act compliance
 */

/**
 * High-risk domains according to the EU AI Act
 */
export const euAiActDomains = {
  // Annex III - High-risk systems
  critical_infrastructure: {
    name: 'Critical Infrastructure Management',
    article: 'Annex III (2)',
    description: 'AI systems used as safety components in the management and operation of critical infrastructure',
    examples: [
      'Road traffic management',
      'Water supply',
      'Gas supply',
      'Electricity supply',
      'Critical digital infrastructure'
    ]
  },
  education: {
    name: 'Education and Vocational Training',
    article: 'Annex III (3)',
    description: 'AI systems used to determine access, admission, evaluation or educational assignment of persons',
    examples: [
      'Student assessment systems',
      'Educational institution admission systems',
      'Adaptive learning platforms',
      'Exam proctoring systems'
    ]
  },
  employment: {
    name: 'Employment and Worker Management',
    article: 'Annex III (4)',
    description: 'AI systems used for recruitment, promotion, termination or task allocation',
    examples: [
      'CV scanning and sorting systems',
      'Interview assessment systems',
      'Performance monitoring tools',
      'Workforce allocation systems'
    ]
  },
  essential_services: {
    name: 'Access to Essential Services',
    article: 'Annex III (5)',
    description: 'AI systems used to evaluate eligibility for public assistance or services',
    examples: [
      'Credit scoring systems',
      'Loan approval systems',
      'Public housing allocation systems',
      'Social welfare eligibility systems'
    ]
  },
  law_enforcement: {
    name: 'Law Enforcement',
    article: 'Annex III (6)',
    description: 'AI systems used by law enforcement for various purposes',
    examples: [
      'Individual risk assessment',
      'Polygraph or emotion detection',
      'Document authenticity evaluation',
      'Predictive policing'
    ]
  },
  migration: {
    name: 'Migration, Asylum and Border Control',
    article: 'Annex III (7)',
    description: 'AI systems used in migration, asylum or border control management',
    examples: [
      'Identity verification systems',
      'Risk assessment for security threats',
      'Document verification systems',
      'Asylum claim processing tools'
    ]
  },
  justice: {
    name: 'Administration of Justice',
    article: 'Annex III (8)',
    description: 'AI systems assisting judicial authorities in researching, interpreting, or applying law',
    examples: [
      'Legal research assistants',
      'Sentencing recommendation systems',
      'Legal outcome prediction tools',
      'Case priority assessment systems'
    ]
  },
  healthcare: {
    name: 'Healthcare and Medical Devices',
    article: 'MDR/IVDR + Annex III',
    description: 'AI systems qualifying as medical devices or used in healthcare decision-making',
    examples: [
      'Diagnostic systems',
      'Treatment planning tools',
      'Patient risk stratification',
      'Medical image analysis',
      'Radiology assistants',
      'Pathology analysis tools'
    ]
  }
};

/**
 * Risk categories according to the EU AI Act
 */
export const euAiActRiskCategories = {
  unacceptable: {
    name: 'Unacceptable Risk',
    description: 'AI systems presenting unacceptable risks are prohibited',
    examples: [
      'Social scoring systems',
      'Real-time remote biometric identification in public spaces for law enforcement (with limited exceptions)',
      'Emotion recognition in the workplace or educational institutions',
      'AI systems that manipulate human behavior to circumvent free will',
      'AI systems that exploit vulnerabilities of specific groups'
    ],
    articles: ['Article 5']
  },
  high: {
    name: 'High Risk',
    description: 'AI systems with significant potential harm to health, safety, or fundamental rights',
    examples: [
      'AI systems in products covered by EU safety legislation (e.g., medical devices, machinery)',
      'AI systems listed in Annex III of the EU AI Act',
      'Critical infrastructure management',
      'Educational or vocational training',
      'Employment, worker management, and access to self-employment',
      'Essential private and public services (credit scoring, etc.)',
      'Law enforcement',
      'Migration, asylum, and border control',
      'Administration of justice and democratic processes'
    ],
    articles: ['Article 6', 'Article 8-29']
  },
  limited: {
    name: 'Limited Risk',
    description: 'AI systems with specific transparency requirements',
    examples: [
      'Chatbots',
      'Emotion recognition systems',
      'Biometric categorization systems',
      'AI-generated or manipulated content (deepfakes)'
    ],
    articles: ['Article 52']
  },
  minimal: {
    name: 'Minimal Risk',
    description: 'All other AI systems with minimal regulatory requirements',
    examples: [
      'AI-enabled video games',
      'Spam filters',
      'Inventory management systems',
      'Manufacturing optimization tools',
      'Basic recommendation systems'
    ],
    articles: ['None - Voluntary codes of conduct (Article 69)']
  }
};

/**
 * EU AI Act key requirements for high-risk AI systems
 */
export const euAiActRequirements = {
  risk_management: {
    name: 'Risk Management System',
    article: 'Article 9',
    description: 'Establish, implement, document and maintain a risk management system',
    requirements: [
      'Continuous iterative process throughout lifecycle',
      'Systematic risk identification and analysis',
      'Risk estimation and evaluation',
      'Adoption of risk management measures'
    ]
  },
  data_governance: {
    name: 'Data and Data Governance',
    article: 'Article 10',
    description: 'Training, validation and testing data must meet quality criteria',
    requirements: [
      'Relevant, representative, free of errors, complete',
      'Data governance and management practices',
      'Examination for biases',
      'Identification of data gaps or shortcomings'
    ]
  },
  technical_documentation: {
    name: 'Technical Documentation',
    article: 'Article 11',
    description: 'Extensive documentation demonstrating compliance',
    requirements: [
      'System description and purpose',
      'Design specifications',
      'Key design choices and assumptions',
      'System capabilities and limitations',
      'Monitoring, functioning and control mechanisms'
    ]
  },
  record_keeping: {
    name: 'Record-Keeping',
    article: 'Article 12',
    description: 'Automatic logging of events with traceability',
    requirements: [
      'Recording of events throughout lifecycle',
      'Logging capabilities enabling audit trail',
      'Technical measures to ensure logging integrity',
      'Record retention for appropriate period'
    ]
  },
  transparency: {
    name: 'Transparency',
    article: 'Article 13',
    description: 'Clear information to users about the AI system',
    requirements: [
      'Operation designed for transparency',
      'Instructions for use with specific information',
      'Capabilities and limitations of the system',
      'Level of accuracy, robustness and cybersecurity'
    ]
  },
  human_oversight: {
    name: 'Human Oversight',
    article: 'Article 14',
    description: 'Designed and developed to enable effective human oversight',
    requirements: [
      'Understanding system outputs and functionality',
      'Remaining aware of automation bias',
      'Ability to correctly interpret outputs',
      'Ability to decide not to use or override the system',
      'Ability to intervene or interrupt system operation'
    ]
  },
  accuracy_robustness: {
    name: 'Accuracy, Robustness and Cybersecurity',
    article: 'Article 15',
    description: 'Appropriate level of accuracy, robustness and cybersecurity',
    requirements: [
      'Suitable accuracy metrics for intended purpose',
      'Resilience to errors, faults and inconsistencies',
      'Resilience to adversarial manipulations',
      'Backup and recovery plans for security failures',
      'Technical measures for cybersecurity'
    ]
  }
};

/**
 * EU AI Act articles most commonly referenced in risk assessment
 */
export const euAiActArticles = [
  {
    id: 'article-5',
    title: 'Article 5 - Prohibited Artificial Intelligence Practices',
    description: 'AI systems that pose an unacceptable risk to people\'s safety, livelihoods, and rights are prohibited',
    examples: [
      'Social scoring systems by governments',
      'Manipulation of human behavior to circumvent free will',
      'Exploitation of vulnerabilities of specific groups',
      'Real-time remote biometric identification in public spaces (with limited exceptions)'
    ]
  },
  {
    id: 'article-6',
    title: 'Article 6 - Classification Rules for High-Risk AI Systems',
    description: 'Defines what qualifies as high-risk AI systems requiring compliance with requirements',
    examples: [
      'AI systems as safety components of products covered by EU safety legislation',
      'AI systems listed in Annex III of the EU AI Act'
    ]
  },
  {
    id: 'article-9',
    title: 'Article 9 - Risk Management System',
    description: 'Requirements for a risk management system for high-risk AI systems',
    examples: [
      'Risk identification and analysis',
      'Risk estimation and evaluation',
      'Testing to identify and address risks',
      'Risk management measures implementation'
    ]
  },
  {
    id: 'article-10',
    title: 'Article 10 - Data and Data Governance',
    description: 'Requirements for data quality and governance in high-risk AI systems',
    examples: [
      'Training, validation, and testing data quality criteria',
      'Data governance practices',
      'Bias examination and mitigation',
      'Data security and privacy measures'
    ]
  },
  {
    id: 'article-11',
    title: 'Article 11 - Technical Documentation',
    description: 'Extensive documentation requirements for high-risk AI systems',
    examples: [
      'System description and purpose',
      'Design specifications',
      'Development methodologies',
      'System capabilities and limitations'
    ]
  },
  {
    id: 'article-13',
    title: 'Article 13 - Transparency and Provision of Information to Users',
    description: 'Requirements for transparent information provision to users',
    examples: [
      'Clear instructions for use',
      'Specification of capabilities and limitations',
      'Information on level of accuracy and performance',
      'Human oversight measures'
    ]
  },
  {
    id: 'article-14',
    title: 'Article 14 - Human Oversight',
    description: 'Requirements for effective human oversight of high-risk AI systems',
    examples: [
      'Human monitoring capabilities',
      'Human intervention mechanisms',
      'Prevention of automation bias',
      'Control measures for operators'
    ]
  },
  {
    id: 'article-15',
    title: 'Article 15 - Accuracy, Robustness and Cybersecurity',
    description: 'Technical requirements for performance, resilience and security',
    examples: [
      'Accuracy metrics suitable for intended purpose',
      'Resilience to errors and adversarial attacks',
      'Fallback plans and redundancy measures',
      'Cybersecurity controls and monitoring'
    ]
  },
  {
    id: 'article-16-29',
    title: 'Articles 16-29 - Provider and User Obligations',
    description: 'Obligations for providers and users of high-risk AI systems',
    examples: [
      'Quality management system',
      'Conformity assessment procedures',
      'CE marking of conformity',
      'Incident reporting obligations'
    ]
  },
  {
    id: 'article-52',
    title: 'Article 52 - Transparency Obligations',
    description: 'Transparency obligations for certain AI systems with limited risk',
    examples: [
      'Disclosure when interacting with AI systems like chatbots',
      'Disclosure of emotion recognition or biometric categorization',
      'Disclosure of AI-generated or manipulated content (deepfakes)'
    ]
  },
  {
    id: 'article-69',
    title: 'Article 69 - Codes of Conduct',
    description: 'Voluntary codes of conduct for non-high-risk AI systems',
    examples: [
      'Voluntary technical specifications',
      'Environmental sustainability commitments',
      'Voluntary accessibility requirements',
      'Stakeholder participation guidelines'
    ]
  }
];

/**
 * Export all EU AI Act compliance data
 */
export default {
  euAiActDomains,
  euAiActRiskCategories,
  euAiActRequirements,
  euAiActArticles
};