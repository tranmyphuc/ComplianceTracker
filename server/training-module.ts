import { Request, Response } from 'express';
import { storage } from './storage';
import { trainingModules, trainingProgress } from '../shared/schema';
import { db } from './db';
import { eq, and } from 'drizzle-orm';

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  estimated_time: string;
  topics: string[];
  role_relevance: {
    decision_maker: string;
    developer: string;
    operator: string;
    user: string;
  };
}

export interface ModuleContent {
  title: string;
  sections: {
    title: string;
    content: string;
  }[];
  assessments: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

export interface TrainingProgress {
  moduleId: string;
  userId: string;
  completion: number;
  assessmentScore?: number;
  updatedAt: Date;
}

// Sample training modules data
const TRAINING_MODULES: TrainingModule[] = [
  {
    id: "1",
    title: "EU AI Act Introduction",
    description: "Introduction to the EU AI Act, its scope, and key provisions",
    estimated_time: "20-30 minutes",
    topics: ["Overview", "Scope", "Key Definitions", "Risk-Based Approach"],
    role_relevance: {
      decision_maker: "High",
      developer: "High",
      operator: "High",
      user: "Medium"
    }
  },
  {
    id: "2",
    title: "Risk Classification System",
    description: "Understanding the risk categories and how to classify AI systems",
    estimated_time: "25-35 minutes",
    topics: ["Prohibited Uses", "High-Risk Systems", "Limited Risk", "Minimal Risk"],
    role_relevance: {
      decision_maker: "High",
      developer: "High",
      operator: "High",
      user: "Medium"
    }
  },
  {
    id: "3",
    title: "Technical Requirements",
    description: "Technical requirements for high-risk AI systems",
    estimated_time: "40-50 minutes",
    topics: ["Data Governance", "Technical Documentation", "Record Keeping", "Accuracy & Robustness"],
    role_relevance: {
      decision_maker: "Medium",
      developer: "High",
      operator: "High",
      user: "Low"
    }
  },
  {
    id: "4",
    title: "Documentation Requirements",
    description: "Essential documentation required for EU AI Act compliance",
    estimated_time: "30-40 minutes",
    topics: ["Technical Documentation", "Conformity Assessment", "Declaration of Conformity", "Risk Management System"],
    role_relevance: {
      decision_maker: "High",
      developer: "High",
      operator: "Medium",
      user: "Low"
    }
  },
  {
    id: "5",
    title: "Governance Framework",
    description: "Implementing an effective governance structure for AI compliance",
    estimated_time: "35-45 minutes",
    topics: ["Compliance Officer", "Risk Management", "Monitoring Systems", "Post-Market Surveillance"],
    role_relevance: {
      decision_maker: "High",
      developer: "Medium",
      operator: "Medium",
      user: "Low"
    }
  },
  {
    id: "6",
    title: "Implementation Case Studies",
    description: "Real-world examples of EU AI Act implementation",
    estimated_time: "45-60 minutes",
    topics: ["Use Cases", "Implementation Steps", "Challenges", "Best Practices"],
    role_relevance: {
      decision_maker: "High",
      developer: "High",
      operator: "High",
      user: "Medium"
    }
  }
];

// Sample module content with role-specific variations
const MODULE_CONTENTS: Record<string, Record<string, ModuleContent>> = {
  "1": {
    "default": {
      title: "EU AI Act Introduction",
      sections: [
        {
          title: "What is the EU AI Act?",
          content: `<p>The EU AI Act is a comprehensive legal framework specifically regulating artificial intelligence systems in the European Union. It establishes a risk-based approach that categorizes AI applications based on their potential risk level.</p>
          <p>The regulation aims to ensure AI systems used in the EU are:</p>
          <ul>
            <li>Safe and respectful of fundamental rights</li>
            <li>Transparent and explainable</li>
            <li>Traceable and with human oversight</li>
            <li>Non-discriminatory and environmentally sustainable</li>
          </ul>`
        },
        {
          title: "Risk-Based Approach",
          content: `<p>The EU AI Act takes a risk-based approach, categorizing AI systems into four risk levels:</p>
          <ol>
            <li><strong>Unacceptable Risk (Prohibited)</strong>: AI systems that pose a clear threat to safety, livelihoods, or rights of people.</li>
            <li><strong>High Risk</strong>: AI systems that may cause significant harm to health, safety, or fundamental rights.</li>
            <li><strong>Limited Risk</strong>: AI systems with specific transparency requirements.</li>
            <li><strong>Minimal Risk</strong>: All other AI systems with voluntary compliance measures.</li>
          </ol>
          <p>Each risk level comes with different compliance requirements, with the most stringent rules applying to high-risk systems.</p>`
        },
        {
          title: "Key Definitions and Scope",
          content: `<p>The EU AI Act defines AI systems as:</p>
          <blockquote>
            Software developed with techniques including machine learning, logic/knowledge-based approaches, and statistical approaches, that can generate outputs such as content, predictions, recommendations, or decisions influencing the environments they interact with.
          </blockquote>
          <p>The regulation has extraterritorial scope, applying to:</p>
          <ul>
            <li>Providers placing AI systems on the EU market</li>
            <li>Users of AI systems located within the EU</li>
            <li>Providers and users located outside the EU if the output is used in the EU</li>
          </ul>`
        }
      ],
      assessments: [
        {
          question: "How many risk categories does the EU AI Act establish?",
          options: ["Two", "Three", "Four", "Five"],
          correctAnswer: "Four"
        },
        {
          question: "Which of the following is NOT a prohibited AI practice under the EU AI Act?",
          options: [
            "Social scoring systems by governments",
            "Facial recognition for product recommendations",
            "Exploiting vulnerabilities of specific groups",
            "Subliminal manipulation techniques"
          ],
          correctAnswer: "Facial recognition for product recommendations"
        },
        {
          question: "The EU AI Act applies to:",
          options: [
            "Only companies headquartered in the EU",
            "Only AI systems developed within the EU",
            "Any provider placing AI systems on the EU market, regardless of location",
            "Only high-risk AI systems"
          ],
          correctAnswer: "Any provider placing AI systems on the EU market, regardless of location"
        }
      ]
    },
    "decision_maker": {
      title: "EU AI Act Introduction - Strategic Overview",
      sections: [
        {
          title: "Strategic Implications of the EU AI Act",
          content: `<p>As a decision-maker, understanding the EU AI Act is critical for strategic planning and risk management. This regulation represents a significant shift in how AI systems are governed within and connected to the European market.</p>
          <p>Key strategic considerations include:</p>
          <ul>
            <li>Organizational compliance strategy and resource allocation</li>
            <li>Budget planning for technical and documentation requirements</li>
            <li>Governance structure implementation and compliance officer designation</li>
            <li>Risk management frameworks that align with the regulation</li>
            <li>Market strategy adjustments for products and services using AI</li>
          </ul>`
        },
        {
          title: "Risk-Based Approach and Business Impact",
          content: `<p>The EU AI Act's risk-based approach has direct business implications:</p>
          <ol>
            <li><strong>Unacceptable Risk (Prohibited)</strong>: These AI applications cannot be brought to market and may require complete redesign or abandonment.</li>
            <li><strong>High Risk</strong>: Substantial compliance requirements including conformity assessments, documentation, and ongoing monitoring which impact development timelines and costs.</li>
            <li><strong>Limited Risk</strong>: Transparency obligations that affect user interface design and disclosure practices.</li>
            <li><strong>Minimal Risk</strong>: Voluntary codes of conduct that can serve as competitive differentiators.</li>
          </ol>
          <p>Decision-makers must evaluate their AI portfolio against these categories and allocate resources accordingly.</p>`
        },
        {
          title: "Compliance Timeline and Planning",
          content: `<p>The EU AI Act implementation follows a phased approach:</p>
          <ul>
            <li><strong>Adoption phase</strong>: The regulation is currently being finalized</li>
            <li><strong>Entry into force</strong>: 20 days after publication</li>
            <li><strong>Prohibited practices</strong>: Apply after 6 months</li>
            <li><strong>General-purpose AI governance</strong>: Applies after 12 months</li>
            <li><strong>Main provisions</strong>: Apply after 24 months</li>
            <li><strong>Full compliance requirements</strong>: Apply after 36 months</li>
          </ul>
          <p>Strategic decision-makers should develop a phased compliance roadmap aligned with these timelines, prioritizing high-risk systems and prohibited practices.</p>`
        }
      ],
      assessments: [
        {
          question: "What should be the first priority for decision-makers when preparing for EU AI Act compliance?",
          options: [
            "Hiring new AI developers",
            "Conducting an inventory of AI systems and risk assessment",
            "Implementing new AI tools",
            "Moving operations outside the EU"
          ],
          correctAnswer: "Conducting an inventory of AI systems and risk assessment"
        },
        {
          question: "Which compliance requirement typically requires the most significant resource allocation?",
          options: [
            "Voluntary codes of conduct for minimal-risk systems",
            "Technical documentation and record-keeping",
            "Conformity assessment and ongoing monitoring for high-risk systems",
            "Basic transparency requirements"
          ],
          correctAnswer: "Conformity assessment and ongoing monitoring for high-risk systems"
        },
        {
          question: "As a strategic decision-maker, what governance structure change might be necessary under the EU AI Act?",
          options: [
            "Eliminating the IT department",
            "Designating a compliance officer for AI systems",
            "Moving all AI operations to cloud providers",
            "Eliminating human oversight of AI systems"
          ],
          correctAnswer: "Designating a compliance officer for AI systems"
        }
      ]
    }
  },
  "2": {
    "default": {
      title: "Risk Classification System",
      sections: [
        {
          title: "Understanding AI Risk Categories",
          content: `<p>The EU AI Act classifies AI systems into four distinct risk categories:</p>
          <ol>
            <li><strong>Unacceptable Risk (Prohibited)</strong>: AI systems deemed to pose a clear threat to safety, livelihoods, or rights of people.</li>
            <li><strong>High Risk</strong>: AI systems that may cause significant harm to health, safety, or fundamental rights.</li>
            <li><strong>Limited Risk</strong>: AI systems with specific transparency requirements.</li>
            <li><strong>Minimal Risk</strong>: All other AI systems that pose little to no risk.</li>
          </ol>`
        },
        {
          title: "Prohibited AI Practices",
          content: `<p>The following AI practices are prohibited under the EU AI Act:</p>
          <ul>
            <li>Social scoring systems used by public authorities</li>
            <li>Real-time remote biometric identification in publicly accessible spaces for law enforcement (with limited exceptions)</li>
            <li>AI systems that use subliminal or manipulative techniques to distort behavior</li>
            <li>AI that exploits vulnerabilities of specific groups (age, disability, etc.)</li>
            <li>AI-based social scoring for general purposes</li>
          </ul>
          <p>These applications are considered to have unacceptable risk and cannot be deployed within the EU market.</p>`
        },
        {
          title: "High-Risk AI Systems",
          content: `<p>High-risk AI systems require the most comprehensive compliance measures. An AI system is considered high-risk if it falls into one of two categories:</p>
          <ol>
            <li><strong>AI systems as safety components of products</strong> that are subject to third-party conformity assessment under existing product safety legislation (e.g., medical devices, machinery, toys)</li>
            <li><strong>Stand-alone AI systems</strong> in specific areas such as:
              <ul>
                <li>Biometric identification and categorization</li>
                <li>Critical infrastructure management</li>
                <li>Education and vocational training</li>
                <li>Employment, worker management, and access to self-employment</li>
                <li>Access to essential services (credit scoring, social benefits)</li>
                <li>Law enforcement</li>
                <li>Migration, asylum, and border control</li>
                <li>Administration of justice and democratic processes</li>
              </ul>
            </li>
          </ol>
          <p>High-risk AI systems must meet requirements related to data quality, documentation, transparency, human oversight, accuracy, and more.</p>`
        }
      ],
      assessments: [
        {
          question: "Which of the following AI systems would most likely be classified as high-risk?",
          options: [
            "A video game recommendation system",
            "An AI system used for recruitment and candidate selection",
            "A smart home control system",
            "A music creation AI application"
          ],
          correctAnswer: "An AI system used for recruitment and candidate selection"
        },
        {
          question: "Which practice is NOT prohibited under the EU AI Act?",
          options: [
            "Social scoring by governments",
            "AI-powered customer service chatbots",
            "Systems exploiting vulnerabilities of specific groups",
            "Real-time facial recognition in public spaces (with few exceptions)"
          ],
          correctAnswer: "AI-powered customer service chatbots"
        },
        {
          question: "For high-risk AI systems, which requirement is NOT mandatory?",
          options: [
            "Risk management system",
            "Technical documentation",
            "Human oversight",
            "Open-source code publication"
          ],
          correctAnswer: "Open-source code publication"
        }
      ]
    }
  },
  "4": {
    "default": {
      title: "Documentation Requirements",
      sections: [
        {
          title: "Technical Documentation Overview",
          content: `<p>The EU AI Act requires comprehensive technical documentation for high-risk AI systems. This documentation must be prepared before the system is placed on the market and kept up-to-date throughout its lifecycle.</p>
          <p>The technical documentation serves several key purposes:</p>
          <ul>
            <li>Demonstrating compliance with regulatory requirements</li>
            <li>Providing transparency about the system's functioning</li>
            <li>Enabling assessment by regulatory authorities</li>
            <li>Supporting the conformity assessment process</li>
            <li>Facilitating post-market monitoring and oversight</li>
          </ul>
          <p>Proper documentation is a cornerstone of compliance and must be developed alongside the AI system, not as an afterthought.</p>`
        },
        {
          title: "Essential Elements of Technical Documentation",
          content: `<p>According to the EU AI Act, technical documentation for high-risk AI systems must include:</p>
          <ol>
            <li><strong>General description</strong> of the AI system and its intended purpose</li>
            <li><strong>System architecture</strong> describing the integration into products or overall design</li>
            <li><strong>Data requirements</strong> including choices, data governance procedures, and preprocessing</li>
            <li><strong>Development methodologies and processes</strong> including training, validation, and testing</li>
            <li><strong>Human oversight measures</strong> and how they are integrated into the system</li>
            <li><strong>Accuracy specifications</strong> and metrics used to determine compliance</li>
            <li><strong>Risk management system</strong> documentation including identified risks and mitigations</li>
            <li><strong>Change management procedures</strong> for ongoing updates and modifications</li>
            <li><strong>Validation and testing procedures</strong> with results and metrics</li>
          </ol>
          <p>Each of these elements must be documented in sufficient detail to demonstrate compliance with all requirements of the EU AI Act.</p>`
        },
        {
          title: "Declaration of Conformity",
          content: `<p>The EU Declaration of Conformity is a formal declaration by the provider that a high-risk AI system complies with the requirements of the EU AI Act. The declaration must include:</p>
          <ul>
            <li>Name and address of the AI system provider</li>
            <li>Statement that the Declaration of Conformity is issued under the sole responsibility of the provider</li>
            <li>Identity of the AI system (name, version, etc.)</li>
            <li>Statement that the AI system in question meets the requirements of the EU AI Act</li>
            <li>References to any harmonized standards or common specifications applied</li>
            <li>Where applicable, name and identification number of the notified body that performed the conformity assessment</li>
            <li>Place and date of issue, name and signature of the authorized person</li>
          </ul>
          <p>The declaration must be kept up-to-date and translated into languages required by Member States where the AI system is made available.</p>`
        },
        {
          title: "Risk Management Documentation",
          content: `<p>The risk management system documentation is a critical component that must:</p>
          <ol>
            <li><strong>Identify and analyze</strong> known and foreseeable risks associated with the AI system</li>
            <li><strong>Estimate and evaluate</strong> risks that may emerge during operation</li>
            <li><strong>Document risk mitigations</strong> including design choices and controls</li>
            <li><strong>Provide testing data</strong> demonstrating safety throughout the lifecycle</li>
            <li><strong>Detail the post-market monitoring plan</strong> for identifying and addressing risks</li>
          </ol>
          <p>This documentation must be continuously updated throughout the system's lifecycle as new risks are identified or as the system evolves.</p>`
        }
      ],
      assessments: [
        {
          question: "Which of the following is NOT typically included in technical documentation for high-risk AI systems?",
          options: [
            "System architecture",
            "Human oversight measures",
            "Source code in its entirety",
            "Data governance procedures"
          ],
          correctAnswer: "Source code in its entirety"
        },
        {
          question: "When must technical documentation be prepared for a high-risk AI system?",
          options: [
            "After the system has been on the market for 6 months",
            "Only if specifically requested by authorities",
            "Before the system is placed on the market",
            "Within one year of system deployment"
          ],
          correctAnswer: "Before the system is placed on the market"
        },
        {
          question: "What is the purpose of the EU Declaration of Conformity?",
          options: [
            "To provide a technical description of the AI system",
            "To formally declare that the AI system complies with the EU AI Act",
            "To advertise the system's capabilities to potential customers",
            "To transfer liability to the end user"
          ],
          correctAnswer: "To formally declare that the AI system complies with the EU AI Act"
        },
        {
          question: "Risk management documentation must be:",
          options: [
            "Created once and never modified",
            "Updated only after a major system failure",
            "Continuously updated throughout the system's lifecycle",
            "Kept confidential and never shared with authorities"
          ],
          correctAnswer: "Continuously updated throughout the system's lifecycle"
        }
      ]
    },
    "developer": {
      title: "Documentation Requirements for Developers",
      sections: [
        {
          title: "Developer Documentation Responsibilities",
          content: `<p>As a developer of high-risk AI systems, you have specific responsibilities for creating and maintaining technical documentation:</p>
          <ul>
            <li>Document all design decisions with clear justifications</li>
            <li>Maintain detailed records of data sources, preprocessing, and validation</li>
            <li>Record model architecture, hyperparameters, and training methodologies</li>
            <li>Document testing procedures, metrics, and results in detail</li>
            <li>Create clear documentation on system limitations and potential failure modes</li>
            <li>Provide technical implementation details for human oversight mechanisms</li>
          </ul>
          <p>Your documentation should be thorough enough that another technical expert could understand how the system works and verify its compliance.</p>`
        },
        {
          title: "Documenting AI System Development",
          content: `<p>For development documentation, you should include:</p>
          <ol>
            <li><strong>Training data specifications:</strong>
              <ul>
                <li>Sources, collection methodologies, and preprocessing steps</li>
                <li>Data cleaning and normalization procedures</li>
                <li>Data segmentation (training, validation, testing)</li>
                <li>Data quality assurance measures</li>
              </ul>
            </li>
            <li><strong>Model development:</strong>
              <ul>
                <li>Algorithm selection with rationale</li>
                <li>Model architecture and hyperparameter details</li>
                <li>Training methodologies and convergence criteria</li>
                <li>Performance metrics and validation approaches</li>
                <li>Model optimization techniques</li>
              </ul>
            </li>
            <li><strong>Testing and validation:</strong>
              <ul>
                <li>Test cases and scenarios</li>
                <li>Performance metrics for different user groups or conditions</li>
                <li>Edge case handling and stress testing results</li>
                <li>Statistical significance of results</li>
              </ul>
            </li>
          </ol>
          <p>This detailed documentation is essential for conformity assessment and continuous improvement.</p>`
        },
        {
          title: "Technical Implementation Documentation",
          content: `<p>Document the technical implementation with:</p>
          <ul>
            <li><strong>System architecture diagrams</strong> showing components and data flows</li>
            <li><strong>API specifications</strong> for all interfaces and integrations</li>
            <li><strong>Runtime requirements</strong> including computational resources needed</li>
            <li><strong>Deployment configurations</strong> for various environments</li>
            <li><strong>Monitoring implementation</strong> for runtime performance and drift detection</li>
            <li><strong>Logging mechanisms</strong> for tracking system behavior and decisions</li>
            <li><strong>Security measures</strong> including authentication, encryption, and access controls</li>
          </ul>
          <p>Include version control information and change management procedures to track how the system evolves over time.</p>`
        },
        {
          title: "Performance Metrics Documentation",
          content: `<p>As a developer, you must document comprehensive performance metrics:</p>
          <ul>
            <li><strong>Accuracy metrics</strong> appropriate to the specific use case</li>
            <li><strong>Robustness testing</strong> results under various environmental conditions</li>
            <li><strong>Fairness metrics</strong> across different demographic groups</li>
            <li><strong>Resource utilization</strong> including computational and memory requirements</li>
            <li><strong>Response time</strong> and latency measurements</li>
            <li><strong>Error rates</strong> with detailed breakdown by error type</li>
            <li><strong>Confidence scores</strong> and their correlation with actual accuracy</li>
          </ul>
          <p>Document these metrics for the entire system and for critical components individually, providing a comprehensive performance profile.</p>`
        }
      ],
      assessments: [
        {
          question: "As a developer, which aspect of data documentation is most critical for compliance?",
          options: [
            "Aesthetic presentation of data visualizations",
            "Data sources, collection methods, and preprocessing steps",
            "Marketing potential of the datasets",
            "Speed of data processing only"
          ],
          correctAnswer: "Data sources, collection methods, and preprocessing steps"
        },
        {
          question: "What should system architecture documentation include?",
          options: [
            "Only the AI model itself",
            "Components, data flows, and integration points",
            "Marketing materials for each component",
            "Only third-party libraries used"
          ],
          correctAnswer: "Components, data flows, and integration points"
        },
        {
          question: "For performance documentation, which of the following is NOT typically required?",
          options: [
            "Accuracy metrics appropriate to the use case",
            "Competitive benchmarking against all market competitors",
            "Robustness testing under various conditions",
            "Fairness metrics across different demographic groups"
          ],
          correctAnswer: "Competitive benchmarking against all market competitors"
        },
        {
          question: "Which of the following best describes good documentation of model development?",
          options: [
            "Brief summary of the final model only",
            "Detailed tracking of algorithm selection, model architecture, hyperparameters, and validation approaches",
            "List of developers who worked on the project",
            "Only documenting successful approaches, not failed attempts"
          ],
          correctAnswer: "Detailed tracking of algorithm selection, model architecture, hyperparameters, and validation approaches"
        }
      ]
    }
  },
  "5": {
    "default": {
      title: "Governance Framework",
      sections: [
        {
          title: "Governance Structure for AI Compliance",
          content: `<p>An effective AI governance structure is essential for EU AI Act compliance. Organizations should establish:</p>
          <ul>
            <li><strong>AI Ethics Committee</strong> - A cross-functional body responsible for oversight of AI development and deployment practices</li>
            <li><strong>AI Compliance Officer</strong> - A designated role responsible for ensuring regulatory compliance across all AI systems</li>
            <li><strong>Clear Lines of Responsibility</strong> - Defined accountability for different aspects of compliance</li>
            <li><strong>Documentation Processes</strong> - Procedures for creating and maintaining required documentation</li>
            <li><strong>Review Mechanisms</strong> - Regular assessment processes for AI systems throughout their lifecycle</li>
          </ul>
          <p>The governance structure should be integrated with existing compliance and risk management frameworks while addressing the specific requirements of AI systems.</p>`
        },
        {
          title: "Risk Management Framework",
          content: `<p>A comprehensive risk management framework for AI systems should include:</p>
          <ol>
            <li><strong>Risk Identification</strong> - Systematic process to identify potential risks in AI systems</li>
            <li><strong>Risk Assessment</strong> - Evaluation of probability and severity of identified risks</li>
            <li><strong>Risk Mitigation</strong> - Implementation of controls to reduce risks to acceptable levels</li>
            <li><strong>Monitoring and Review</strong> - Continuous monitoring of risks and effectiveness of controls</li>
            <li><strong>Documentation</strong> - Thorough documentation of the entire risk management process</li>
          </ol>
          <p>The risk management framework should be tailored to the specific AI applications in use, with special attention to high-risk systems as defined by the EU AI Act.</p>`
        },
        {
          title: "Monitoring Systems and Post-Market Surveillance",
          content: `<p>The EU AI Act requires ongoing monitoring of high-risk AI systems after deployment. An effective monitoring system includes:</p>
          <ul>
            <li><strong>Performance Metrics</strong> - Continuous tracking of key performance indicators</li>
            <li><strong>Drift Detection</strong> - Identifying changes in data distribution or system behavior</li>
            <li><strong>Incident Reporting</strong> - Mechanisms for logging and reporting operational issues</li>
            <li><strong>User Feedback Channels</strong> - Systematic collection and analysis of user feedback</li>
            <li><strong>Regular Audits</strong> - Scheduled reviews of system performance and compliance</li>
            <li><strong>Update Management</strong> - Controlled processes for implementing system updates</li>
          </ul>
          <p>Post-market surveillance is essential for maintaining compliance throughout the AI system lifecycle and responding to emerging risks.</p>`
        },
        {
          title: "Human Oversight Implementation",
          content: `<p>Human oversight is a key requirement for high-risk AI systems under the EU AI Act. Effective implementation includes:</p>
          <ol>
            <li><strong>Oversight Mechanisms</strong> - Technical means for human monitoring and intervention</li>
            <li><strong>Clear Authority</strong> - Defined roles and authority for human overseers</li>
            <li><strong>Training Programs</strong> - Comprehensive training for individuals providing oversight</li>
            <li><strong>Decision Boundaries</strong> - Clear guidelines for when human intervention is required</li>
            <li><strong>Override Capabilities</strong> - Technical ability to override system decisions</li>
            <li><strong>Documentation</strong> - Recording of oversight activities and interventions</li>
          </ol>
          <p>Human oversight should be designed to be meaningful and effective, enabling timely intervention before harm occurs.</p>`
        }
      ],
      assessments: [
        {
          question: "Which of the following is NOT typically part of an AI governance structure?",
          options: [
            "AI Ethics Committee",
            "AI Compliance Officer",
            "Fully Autonomous Decision System",
            "Documentation Processes"
          ],
          correctAnswer: "Fully Autonomous Decision System"
        },
        {
          question: "What is the primary purpose of post-market surveillance for AI systems?",
          options: [
            "To market the AI system to new customers",
            "To maintain compliance and detect emerging risks throughout the system lifecycle",
            "To eliminate the need for human oversight",
            "To reduce documentation requirements"
          ],
          correctAnswer: "To maintain compliance and detect emerging risks throughout the system lifecycle"
        },
        {
          question: "Human oversight for high-risk AI systems requires:",
          options: [
            "Complete replacement of AI decision-making with human judgment",
            "Mechanisms for monitoring, understanding, and intervening in AI decisions when necessary",
            "Limiting AI capabilities to prevent any autonomous operations",
            "Removing human involvement from the AI decision process"
          ],
          correctAnswer: "Mechanisms for monitoring, understanding, and intervening in AI decisions when necessary"
        },
        {
          question: "Which component of risk management involves determining how likely and severe potential harms might be?",
          options: [
            "Risk Identification",
            "Risk Assessment",
            "Risk Mitigation",
            "Risk Documentation"
          ],
          correctAnswer: "Risk Assessment"
        }
      ]
    },
    "decision_maker": {
      title: "Governance Framework for Decision Makers",
      sections: [
        {
          title: "Strategic Governance Implementation",
          content: `<p>As a decision-maker, implementing an effective AI governance framework requires strategic consideration of:</p>
          <ul>
            <li><strong>Organizational Structure</strong> - Determining where AI governance fits within the broader organization</li>
            <li><strong>Resource Allocation</strong> - Budgeting for compliance activities, staffing, and tools</li>
            <li><strong>Policy Development</strong> - Creating comprehensive policies for AI development and deployment</li>
            <li><strong>Accountability Framework</strong> - Establishing clear accountability for compliance outcomes</li>
            <li><strong>Culture Development</strong> - Fostering a culture that values ethical AI and compliance</li>
          </ul>
          <p>Decision-makers must ensure that governance structures are not merely performative but are embedded into operational processes with appropriate authority and resources.</p>`
        },
        {
          title: "Board-Level Considerations",
          content: `<p>For executives and board members, AI governance requires consideration of:</p>
          <ol>
            <li><strong>Regulatory Risk</strong> - Understanding potential penalties for non-compliance</li>
            <li><strong>Reputational Impact</strong> - Considering how AI practices affect brand perception</li>
            <li><strong>Strategic Alignment</strong> - Ensuring AI governance aligns with overall business strategy</li>
            <li><strong>Oversight Responsibilities</strong> - Defining board-level oversight of AI systems</li>
            <li><strong>Reporting Structures</strong> - Establishing clear reporting on AI compliance to board level</li>
          </ol>
          <p>Board-level engagement with AI governance is essential for ensuring organizational commitment and proper resource allocation.</p>`
        },
        {
          title: "Compliance Investment Strategy",
          content: `<p>Decision-makers must develop a strategic approach to compliance investment:</p>
          <ul>
            <li><strong>Risk-Based Prioritization</strong> - Allocating resources based on system risk levels</li>
            <li><strong>Compliance Roadmap</strong> - Developing a timeline for implementing governance measures</li>
            <li><strong>Technology Investment</strong> - Evaluating tools for monitoring, documentation, and risk management</li>
            <li><strong>Staff Development</strong> - Training and hiring for necessary compliance capabilities</li>
            <li><strong>Return on Investment Analysis</strong> - Considering business benefits of strong governance</li>
          </ul>
          <p>Compliance should be viewed not merely as a cost center but as risk management that protects business value and can create competitive advantage.</p>`
        },
        {
          title: "Governance Effectiveness Metrics",
          content: `<p>To ensure governance effectiveness, decision-makers should track:</p>
          <ol>
            <li><strong>Compliance Coverage</strong> - Percentage of AI systems covered by governance framework</li>
            <li><strong>Incident Response Times</strong> - Speed of detecting and addressing AI system issues</li>
            <li><strong>Documentation Completeness</strong> - Status of required documentation for high-risk systems</li>
            <li><strong>Training Completion</strong> - Percentage of relevant staff with appropriate compliance training</li>
            <li><strong>Audit Findings</strong> - Number and severity of findings in compliance audits</li>
            <li><strong>Stakeholder Feedback</strong> - Input from users, customers, and other stakeholders</li>
          </ol>
          <p>Regular reporting on these metrics to senior leadership ensures visibility of governance effectiveness and areas for improvement.</p>`
        }
      ],
      assessments: [
        {
          question: "As a decision-maker, which approach to AI governance is most effective?",
          options: [
            "Delegating all responsibility to the IT department",
            "Focusing exclusively on technical controls",
            "Integrating governance into organizational structure with clear accountability and resources",
            "Implementing governance only after problems occur"
          ],
          correctAnswer: "Integrating governance into organizational structure with clearaccountability and resources"
        },
        {
          question: "Which metric best indicates the effectiveness of an AI governance framework?",
          options: [
            "Number of AI systems developed",
            "Speed of AI development",
            "Compliance coverage and incident response times",
            "Cost reduction in AI development"
          ],
          correctAnswer: "Compliance coverage and incident response times"
        },
        {
          question: "When allocating resources for AI compliance, decision-makers should prioritize:",
          options: [
            "Equal resources for all AI systems regardless of risk",
            "Systems based on their risk level, with highest priority for high-risk systems",
            "Only systems that have already experienced compliance issues",
            "Marketing-related AI systems exclusively"
          ],
          correctAnswer: "Systems based on their risk level, with highest priority for high-risk systems"
        },
        {
          question: "Board-level oversight of AI systems should include:",
          options: [
            "Direct technical supervision of AI development",
            "Coding reviews of all AI systems",
            "Regular reporting on AI compliance status and risks",
            "Involvement in day-to-day AI operations"
          ],
          correctAnswer: "Regular reporting on AI compliance status and risks"
        }
      ]
    }
  },
  "6": {
    "default": {
      title: "Implementation Case Studies",
      sections: [
        {
          title: "Healthcare AI Compliance Case Study",
          content: `<p>A major healthcare provider implemented a diagnostic support AI system that fell under the high-risk category. Their compliance journey illustrates key implementation steps:</p>
          <ol>
            <li><strong>Initial Risk Assessment</strong>: The organization conducted a comprehensive risk assessment that identified the system as high-risk due to its healthcare application and potential impact on patient outcomes.</li>
            <li><strong>Data Governance Implementation</strong>: They established a robust data governance framework, ensuring training data was representative, had proper consent, and was regularly audited for quality.</li>
            <li><strong>Technical Documentation</strong>: They created detailed technical documentation covering system architecture, data requirements, validation methodologies, and performance metrics.</li>
            <li><strong>Human Oversight Design</strong>: The system was designed with clear human oversight mechanisms, including confidence scores for predictions and escalation paths for uncertain cases.</li>
            <li><strong>Conformity Assessment</strong>: They conducted a thorough internal assessment followed by a third-party conformity assessment.</li>
            <li><strong>Post-Market Monitoring</strong>: A continuous monitoring system was implemented to track performance in real-world settings.</li>
          </ol>
          <p>This implementation resulted in a compliant system that maintained high diagnostic accuracy while meeting all EU AI Act requirements.</p>`
        },
        {
          title: "Financial Services Implementation",
          content: `<p>A financial institution implemented an AI-based credit scoring system that needed to comply with the EU AI Act. Their approach included:</p>
          <ul>
            <li><strong>Fairness-by-design</strong>: They incorporated fairness metrics throughout the development process, testing for bias across different demographic groups.</li>
            <li><strong>Explainability Implementation</strong>: The system was designed to provide clear explanations for credit decisions, showing which factors influenced the outcome.</li>
            <li><strong>Documentation Automation</strong>: They implemented tooling to automatically generate and update parts of the technical documentation as the model evolved.</li>
            <li><strong>Risk Management Integration</strong>: AI risk assessments were integrated into the organization's existing enterprise risk management framework.</li>
            <li><strong>Regular Auditing</strong>: A schedule of regular audits was established to verify continued compliance.</li>
          </ul>
          <p>This implementation demonstrates how EU AI Act requirements can be integrated into existing financial services governance frameworks.</p>`
        },
        {
          title: "Manufacturing Implementation Challenges",
          content: `<p>A manufacturing company implementing a quality control AI system faced several challenges:</p>
          <ol>
            <li><strong>Data Scarcity</strong>: Limited examples of product defects made it difficult to build a balanced training dataset. Solution: They implemented synthetic data generation and data augmentation techniques.</li>
            <li><strong>Documentation Burden</strong>: The technical documentation requirements seemed overwhelming. Solution: They adopted a phased approach, prioritizing critical components first.</li>
            <li><strong>Performance vs. Explainability</strong>: More accurate models were less explainable. Solution: They implemented a dual-model approach with a complex model for predictions and a simpler model for explanations.</li>
            <li><strong>Integration with Legacy Systems</strong>: The oversight mechanisms needed to work with existing production systems. Solution: They created an abstraction layer that enabled monitoring without disrupting production.</li>
          </ol>
          <p>This case study highlights common implementation challenges and practical approaches to overcome them while maintaining compliance.</p>`
        },
        {
          title: "Implementation Best Practices",
          content: `<p>From successful implementations across industries, several best practices have emerged:</p>
          <ul>
            <li><strong>Start with Inventory</strong>: Begin by inventorying all AI systems to identify which fall under the EU AI Act scope.</li>
            <li><strong>Risk-Based Prioritization</strong>: Focus compliance efforts on high-risk systems first.</li>
            <li><strong>Embed Compliance in Development</strong>: Integrate compliance requirements into the AI development lifecycle rather than treating them as an afterthought.</li>
            <li><strong>Leverage Automation</strong>: Use tools to automate documentation, testing, and monitoring where possible.</li>
            <li><strong>Cross-Functional Teams</strong>: Form teams with technical, legal, and domain expertise to address compliance holistically.</li>
            <li><strong>Regular Reviews</strong>: Establish a cadence of regular compliance reviews as systems evolve.</li>
            <li><strong>Continuous Training</strong>: Ensure ongoing training for all stakeholders involved in AI development and oversight.</li>
          </ul>
          <p>Organizations that adopt these practices typically achieve more efficient compliance while maintaining innovation velocity.</p>`
        }
      ],
      assessments: [
        {
          question: "What is a key lesson from the healthcare AI implementation case study?",
          options: [
            "AI systems in healthcare cannot be compliant with the EU AI Act",
            "Human oversight mechanisms are unnecessary if the AI is accurate enough",
            "Integrating compliance considerations throughout the development lifecycle is essential",
            "Technical documentation is optional for healthcare applications"
          ],
          correctAnswer: "Integrating compliance considerations throughout the development lifecycle is essential"
        },
        {
          question: "Which approach did the financial services implementation use to address explainability requirements?",
          options: [
            "They obtained an exemption from explainability requirements",
            "They designed the system to provide clear explanations for credit decisions",
            "They eliminated the AI system entirely",
            "They restricted the system to only process non-personal data"
          ],
          correctAnswer: "They designed the system to provide clear explanations for credit decisions"
        },
        {
          question: "How did the manufacturing company address the challenge of data scarcity?",
          options: [
            "They ignored the requirement for representative data",
            "They purchased personal data without consent",
            "They implemented synthetic data generation and data augmentation techniques",
            "They used only publicly available data"
          ],
          correctAnswer: "They implemented synthetic data generation and data augmentation techniques"
        },
        {
          question: "According to the best practices, what should organizations do first when implementing EU AI Act compliance?",
          options: [
            "Hire external consultants",
            "Create an inventory of AI systems to identify which fall under the EU AI Act scope",
            "Implement monitoring systems for all AI applications",
            "Develop new AI systems with built-in compliance"
          ],
          correctAnswer: "Create an inventory of AI systems to identify which fall under the EU AI Act scope"
        }
      ]
    },
    "developer": {
      title: "Implementation Case Studies for Developers",
      sections: [
        {
          title: "Technical Implementation Patterns",
          content: `<p>From a developer perspective, several technical implementation patterns have emerged for achieving EU AI Act compliance:</p>
          <ol>
            <li><strong>Model Cards</strong>: Structured documentation of model characteristics, including training data, performance metrics, limitations, and ethical considerations.</li>
            <li><strong>Data Sheets</strong>: Formalized documentation of dataset properties, including collection methodology, preprocessing steps, and potential biases.</li>
            <li><strong>Explainability Wrappers</strong>: Implementation of model-agnostic explanation layers that can provide interpretable insights for any black-box model.</li>
            <li><strong>Continuous Validation Pipelines</strong>: Automated testing frameworks that regularly validate model performance across various metrics and data distributions.</li>
            <li><strong>Versioned Model Registry</strong>: Systems for tracking all model versions, associated artifacts, and approval workflows.</li>
            <li><strong>Logging and Traceability</strong>: Comprehensive logging of model inputs, outputs, and decision factors for auditability.</li>
          </ol>
          <p>These technical patterns can be adapted and combined to address specific compliance requirements for different AI systems.</p>`
        },
        {
          title: "Developer-Focused Implementation Tools",
          content: `<p>Several tools have proven valuable for developers implementing EU AI Act compliance:</p>
          <ul>
            <li><strong>Fairness Libraries</strong>: Tools like AIF360 and Fairlearn for measuring and mitigating algorithmic bias.</li>
            <li><strong>Explainability Frameworks</strong>: Libraries such as SHAP, LIME, and InterpretML for generating explanations of model decisions.</li>
            <li><strong>Model and Data Documentation Tools</strong>: Automated documentation generators that maintain standardized documentation.</li>
            <li><strong>Monitoring Solutions</strong>: Tools for detecting drift, performance degradation, and anomalies in production.</li>
            <li><strong>Risk Assessment Frameworks</strong>: Structured approaches for assessing and documenting AI system risks.</li>
            <li><strong>Visualization Tools</strong>: Ways to communicate complex model behavior to stakeholders and overseers.</li>
          </ul>
          <p>Leveraging these tools can significantly reduce the implementation burden while improving compliance quality.</p>`
        },
        {
          title: "Code Architecture for Compliance",
          content: `<p>Successful implementations often feature specific architectural considerations:</p>
          <ol>
            <li><strong>Separation of Concerns</strong>: Clearly delineated modules for data processing, model training, inference, and monitoring.</li>
            <li><strong>Auditable Data Pipelines</strong>: Data processing workflows that maintain provenance and enable reproduction.</li>
            <li><strong>Human-in-the-Loop Design Patterns</strong>: Architectures that facilitate meaningful human oversight at appropriate points.</li>
            <li><strong>Confidence Scoring</strong>: Mechanisms to assess and communicate prediction confidence levels.</li>
            <li><strong>Fallback Mechanisms</strong>: Graceful degradation paths when AI components cannot make reliable decisions.</li>
            <li><strong>Compliance Metadata</strong>: Structured storage of compliance-related information alongside model artifacts.</li>
          </ol>
          <p>These architectural approaches make compliance more manageable and less likely to require major refactoring later.</p>`
        },
        {
          title: "Testing Strategies for Compliance",
          content: `<p>Comprehensive testing is essential for EU AI Act compliance. Key testing strategies include:</p>
          <ul>
            <li><strong>Adversarial Testing</strong>: Proactively identifying potential failure modes through challenging inputs.</li>
            <li><strong>Fairness Testing</strong>: Evaluating model performance across different demographic groups to detect bias.</li>
            <li><strong>Robustness Testing</strong>: Assessing model performance under various perturbations and edge cases.</li>
            <li><strong>Performance Boundary Testing</strong>: Identifying conditions where the system's reliability degrades.</li>
            <li><strong>Oversight Mechanism Testing</strong>: Verifying that human oversight controls function as intended.</li>
            <li><strong>Documentation Completeness Testing</strong>: Validating that all required documentation elements are present and accurate.</li>
          </ul>
          <p>These testing approaches should be integrated into CI/CD pipelines to ensure continuous compliance throughout development.</p>`
        }
      ],
      assessments: [
        {
          question: "Which technical implementation pattern is primarily focused on documenting dataset characteristics?",
          options: [
            "Model Cards",
            "Data Sheets",
            "Explainability Wrappers",
            "Versioned Model Registry"
          ],
          correctAnswer: "Data Sheets"
        },
        {
          question: "What is the primary purpose of implementing 'Confidence Scoring' in an AI system architecture?",
          options: [
            "To speed up model training",
            "To improve model accuracy",
            "To assess and communicate prediction reliability levels",
            "To reduce computational requirements"
          ],
          correctAnswer: "To assess and communicate prediction reliability levels"
        },
        {
          question: "Which testing strategy is specifically designed to identify potential biases in AI systems?",
          options: [
            "Adversarial Testing",
            "Fairness Testing",
            "Robustness Testing",
            "Performance Boundary Testing"
          ],
          correctAnswer: "Fairness Testing"
        },
        {
          question: "When implementing human oversight mechanisms, developers should focus on:",
          options: [
            "Minimizing the need for human involvement",
            "Designing interfaces that facilitate meaningful human oversight at appropriate points",
            "Ensuring humans can override the system but not understand it",
            "Keeping human operators busy with constant verification tasks"
          ],
          correctAnswer: "Designing interfaces that facilitate meaningful human oversight at appropriate points"
        }
      ]
    }
  }
};

/**
 * Get all training modules
 */
export async function getTrainingModules(req: Request, res: Response) {
  try {
    const modules = await db.select().from(trainingModules).orderBy(trainingModules.order);

    // Fall back to sample data if no modules in database
    if (!modules || modules.length === 0) {
      return res.json(TRAINING_MODULES);
    }

    return res.json(modules.map(module => ({
      id: module.moduleId,
      title: module.title,
      description: module.description,
      estimated_time: module.estimatedTime,
      topics: module.topics as string[],
      role_relevance: module.roleRelevance as {
        decision_maker: string;
        developer: string;
        operator: string;
        user: string;
      }
    })));
  } catch (error) {
    console.error('Error fetching training modules:', error);
    return res.status(500).json({ error: 'Failed to fetch training modules' });
  }
}

/**
 * Get specific module content
 */
export async function getModuleContent(req: Request, res: Response) {
  try {
    const { moduleId } = req.params;
    const userRole = req.query.role as string || 'user';

    // Try to get module from database first
    const module = await db.select().from(trainingModules).where(eq(trainingModules.moduleId, moduleId)).limit(1);

    if (module && module.length > 0) {
      const moduleData = module[0];
      const content = moduleData.content as any;

      // Get role-specific content if available
      const roleContent = content[userRole] || content.default;

      // Format full module content for the enhanced UI
      const enhancedContent = {
        title: moduleData.title,
        description: moduleData.description,
        estimated_time: moduleData.estimatedTime,
        content: {
          slides: buildSlides(roleContent),
          document: buildDocument(roleContent, moduleData.title),
          exercises: buildExercises(roleContent, moduleId),
          assessment: {
            questions: roleContent.quiz || []
          }
        }
      };

      return res.json(enhancedContent);
    }

    // Fall back to sample data if not in database
    if (MODULE_CONTENTS[moduleId]) {
      const roleContent = MODULE_CONTENTS[moduleId][userRole] || MODULE_CONTENTS[moduleId].default;

      // Format full module content for the enhanced UI
      const enhancedContent = {
        title: MODULE_CONTENTS[moduleId].title,
        description: MODULE_CONTENTS[moduleId].description,
        estimated_time: MODULE_CONTENTS[moduleId].estimated_time,
        content: {
          slides: buildSlides(roleContent),
          document: buildDocument(roleContent, MODULE_CONTENTS[moduleId].title),
          exercises: buildExercises(roleContent, moduleId),
          assessment: {
            questions: roleContent.quiz || []
          }
        }
      };

      return res.json(enhancedContent);
    }

    return res.status(404).json({ error: 'Module not found' });
  } catch (error) {
    console.error('Error fetching module content:', error);
    return res.status(500).json({ error: 'Failed to fetch module content' });
  }
}

// Helper function to build slides from content
function buildSlides(content: any) {
  // If content already has slides, use them
  if (content.slides) {
    return content.slides;
  }

  // Otherwise, parse content markdown into slides
  const slides = [];

  if (content.content) {
    // Split content by headers (# or ##)
    const sections = content.content.split(/(?=# |## )/);

    sections.forEach((section: string) => {
      // Extract title from the first line
      const titleMatch = section.match(/^(# |## )(.*)/);
      let title = titleMatch ? titleMatch[2] : "Introduction";
      let sectionContent = section.replace(/^(# |## )(.*)/, ''); // Remove title

      slides.push({
        title: title,
        content: `<div class="markdown-content">${sectionContent}</div>`
      });
    });
  }

  // Add intro slide if no slides were created
  if (slides.length === 0) {
    slides.push({
      title: "Introduction",
      content: "<p>No content available for this module.</p>"
    });
  }

  return slides;
}

// Helper function to build document HTML
function buildDocument(content: any, title: string) {
  if (content.document) {
    return content.document;
  }

  if (content.content) {
    return `<div class="markdown-content">
      <h1>${title}</h1>
      ${content.content}
    </div>`;
  }

  return "<p>No documentation available for this module.</p>";
}

// Helper function to build exercises
function buildExercises(content: any, moduleId: string) {
  if (content.exercises) {
    return content.exercises;
  }

  // Generate default exercises based on module ID
  const defaultExercises = [
    {
      title: "Apply Knowledge",
      description: "<p>This exercise helps you apply the concepts learned in this module to practical scenarios.</p>",
      tasks: [
        "Review the key concepts presented in the module",
        "Apply these concepts to your organization's context",
        "Document the relevance and potential implementation challenges"
      ]
    },
    {
      title: "Self-Assessment",
      description: "<p>Test your understanding by answering these questions without referring to the module content.</p>",
      tasks: [
        "Explain the main requirements covered in this module in your own words",
        "Identify at least three ways these requirements impact your organization",
        "Outline an implementation approach for your specific context"
      ]
    }
  ];

  // Add module-specific exercises
  if (moduleId === "1") {
    defaultExercises.push({
      title: "EU AI Act Scope Analysis",
      description: "<p>Analyze how the EU AI Act applies to specific AI systems.</p>",
      tasks: [
        "List all AI systems currently in use in your organization",
        "Determine which ones fall under the scope of the EU AI Act",
        "Document your reasoning for each system"
      ]
    });
  } else if (moduleId === "2") {
    defaultExercises.push({
      title: "Risk Classification Exercise",
      description: "<p>Practice classifying AI systems according to the EU AI Act risk framework.</p>",
      tasks: [
        "Select three AI systems from different domains",
        "Apply the risk classification methodology to each system",
        "Document your classification process and results"
      ]
    });
  } else if (moduleId === "3") {
    defaultExercises.push({
      title: "Technical Requirements Checklist",
      description: "<p>Create a compliance checklist for technical requirements.</p>",
      tasks: [
        "Develop a checklist covering all technical requirements for high-risk AI systems",
        "Apply this checklist to an existing or planned AI system",
        "Identify compliance gaps and potential remediation actions"
      ]
    });
  }

  return defaultExercises;
}

/**
 * Track user's training progress
 */
export async function trackTrainingProgress(req: Request, res: Response) {
  try {
    const { userId, moduleId, completion } = req.body;

    if (!userId || !moduleId || typeof completion !== 'number') {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Update progress in database
    const existingProgress = await db
      .select()
      .from(trainingProgress)
      .where(and(
        eq(trainingProgress.userId, userId),
        eq(trainingProgress.moduleId, moduleId)
      ))
      .limit(1);

    if (existingProgress && existingProgress.length > 0) {
      // Update existing progress if new completion is higher
      if (completion > (existingProgress[0].completion || 0)) {
        await db
          .update(trainingProgress)
          .set({ 
            completion,
            updatedAt: new Date()
          })
          .where(eq(trainingProgress.id, existingProgress[0].id));
      }
    } else {
      // Create new progress entry
      await db
        .insert(trainingProgress)
        .values({
          userId,
          moduleId,
          completion,
          updatedAt: new Date()
        });
    }

    return res.json({ status: 'success', moduleId, userId, completion });
  } catch (error) {
    console.error('Error tracking training progress:', error);
    return res.status(500).json({ error: 'Failed to track progress' });
  }
}

/**
 * Get user's training progress
 */
export async function getUserProgress(req: Request, res: Response) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    const progress = await db
      .select()
      .from(trainingProgress)
      .where(eq(trainingProgress.userId, userId as string));

    // Format progress as object with moduleId as key
    const formattedProgress: Record<string, { completion: number }> = {};

    progress.forEach(item => {
      formattedProgress[item.moduleId] = {
        completion: item.completion || 0
      };
    });

    return res.json(formattedProgress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return res.status(500).json({ error: 'Failed to fetch user progress' });
  }
}
// Helper functions for training presentation mode
const mockTrainingContent = {
  technical: {
    slides: [
      { title: 'Slide 1', content: 'Technical content for slide 1' },
      { title: 'Slide 2', content: 'Technical content for slide 2' }
    ]
  },
  decision_maker: {
    slides: [
      { title: 'Slide 1', content: 'Decision maker content for slide 1' },
      { title: 'Slide 2', content: 'Decision maker content for slide 2' }
    ]
  }
};

export const getTrainingModuleContent = async (moduleId: string, role: string = 'technical') => {
  // In a real implementation, this would fetch from database
  // Here we're using the mock data

  // Find the module
  const modules = await getTrainingModules();
  const module = modules.find(m => m.id === moduleId);

  if (!module) {
    return null;
  }

  // Return the content based on the role
  // This would be more sophisticated in a real implementation
  switch (moduleId) {
    case 'eu-ai-act-intro':
      return mockTrainingContent[role] || mockTrainingContent.technical;
    case 'risk-classification':
      // Would have different content per role
      return mockTrainingContent[role] || mockTrainingContent.technical;
    case 'technical-requirements':
      // Would have different content per role
      return mockTrainingContent[role] || mockTrainingContent.technical;
    default:
      return mockTrainingContent.technical;
  }
};

export const getTrainingModuleMetadata = async (moduleId: string) => {
  // In a real implementation, this would fetch from database
  const modules = await getTrainingModules();
  return modules.find(m => m.id === moduleId) || null;
};

export const recordTrainingCompletion = async (userId: string, moduleId: string) => {
  // In a real implementation, this would record to database
  // For now we just return a mock certificate ID
  const certificateId = `cert-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return certificateId;
};

export const getTrainingCertificate = async (certificateId: string) => {
  // In a real implementation, this would fetch from database
  // For now we return mock data
  const modules = await getTrainingModules();
  const randomModule = modules[Math.floor(Math.random() * modules.length)];

  return {
    id: certificateId,
    moduleId: randomModule.id,
    moduleTitle: randomModule.title,
    completedAt: new Date().toISOString(),
    userName: 'Demo User',
    userRole: 'IT Manager'
  };
};

export const exportTrainingModule = async (moduleId: string, format: string) => {
  // In a real implementation, this would generate the export files
  // For now we return mock data
  const module = await getTrainingModuleMetadata(moduleId);

  if (!module) {
    throw new Error('Module not found');
  }

  let content = '';
  let filename = '';
  let contentType = '';

  switch (format) {
    case 'markdown':
      content = `# ${module.title}\n\n## Overview\n\n${module.description}\n\n## Module Content\n\nThis would contain the full module content in markdown format.`;
      filename = `${module.id}.md`;
      contentType = 'text/markdown';
      break;
    case 'pptx':
      // This would actually generate a PPTX file
      // For now, just return a placeholder
      content = 'PPTX content placeholder';
      filename = `${module.id}.pptx`;
      contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      break;
    case 'pdf':
      // This would actually generate a PDF file
      // For now, just return a placeholder
      content = 'PDF content placeholder';
      filename = `${module.id}.pdf`;
      contentType = 'application/pdf';
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  return { content, filename, contentType };
};

export const getTrainingModules = async () => {
  // In a real implementation, this would fetch from database
  return [
    {
      id: 'eu-ai-act-intro',
      title: 'EU AI Act Introduction',
      description: 'Introduction to the EU AI Act, its scope, and key provisions',
      duration: '20-30 minutes',
      relevance: 'Medium',
      progress: 5,
      categories: ['Regulatory Overview', 'Compliance Basics']
    },
    {
      id: 'risk-classification',
      title: 'Risk Classification System',
      description: 'Understanding the risk categories and how to classify AI systems',
      duration: '25-35 minutes',
      relevance: 'High',
      progress: 0,
      categories: ['Risk Management', 'Compliance']
    },
    {
      id: 'technical-requirements',
      title: 'Technical Requirements',
      description: 'Technical requirements for high-risk AI systems',
      duration: '40-50 minutes',
      relevance: 'High',
      progress: 0,
      categories: ['Technical Compliance', 'AI Development']
    }
  ];
};