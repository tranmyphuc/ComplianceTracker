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
      
      return res.json(roleContent);
    }
    
    // Fall back to sample data if not in database
    if (MODULE_CONTENTS[moduleId]) {
      const roleContent = MODULE_CONTENTS[moduleId][userRole] || MODULE_CONTENTS[moduleId].default;
      return res.json(roleContent);
    }
    
    return res.status(404).json({ error: 'Module not found' });
  } catch (error) {
    console.error('Error fetching module content:', error);
    return res.status(500).json({ error: 'Failed to fetch module content' });
  }
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
      if (completion > existingProgress[0].completion) {
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
        completion: item.completion
      };
    });
    
    return res.json(formattedProgress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return res.status(500).json({ error: 'Failed to fetch user progress' });
  }
}