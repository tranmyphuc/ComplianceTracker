import { db } from "./server/db";
import * as schema from "./shared/schema";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";

// Function to directly add training modules
async function addTrainingModules() {
  try {
    console.log("Adding training modules...");
    
    // Delete existing modules first
    await db.delete(schema.trainingModules);
    
    // Add new modules
    await db.insert(schema.trainingModules).values([
      {
        moduleId: "1",
        title: "EU AI Act Introduction",
        description: "Introduction to the EU AI Act, its scope, and key provisions",
        estimatedTime: "20-30 minutes",
        topics: ["Overview", "Scope", "Key Definitions", "Risk-Based Approach"],
        order: 1,
        roleRelevance: {
          decision_maker: "High",
          developer: "High", 
          operator: "High",
          user: "Medium"
        },
        content: JSON.stringify({
          sections: [
            {
              title: "What is the EU AI Act?",
              content: "<p>The EU AI Act is a comprehensive legal framework specifically regulating artificial intelligence systems in the European Union. It establishes a risk-based approach that categorizes AI applications based on their potential risk level.</p><p>The regulation aims to ensure AI systems used in the EU are safe and respectful of fundamental rights.</p>"
            },
            {
              title: "Key Objectives",
              content: "<p>The EU AI Act has several key objectives:</p><ul><li>Ensure AI systems placed on the EU market are safe</li><li>Respect fundamental rights and EU values</li><li>Ensure legal certainty to facilitate innovation</li><li>Enhance governance and enforcement of AI regulations</li><li>Promote development of a single market for lawful, safe and trustworthy AI applications</li></ul>"
            },
            {
              title: "Risk-Based Approach",
              content: "<p>The EU AI Act classifies AI systems into four risk categories:</p><ol><li><strong>Unacceptable Risk</strong>: Systems posing a clear threat to people's safety, livelihoods, or rights (prohibited)</li><li><strong>High Risk</strong>: Systems with significant potential impact on health, safety, or fundamental rights</li><li><strong>Limited Risk</strong>: Systems with specific transparency obligations</li><li><strong>Minimal Risk</strong>: All other AI systems with minimal regulatory requirements</li></ol>"
            }
          ],
          assessments: [
            {
              question: "What is the primary approach used in the EU AI Act to regulate AI systems?",
              options: ["One-size-fits-all approach", "Self-certification approach", "Risk-based approach", "Voluntary code of conduct"],
              correctAnswer: "Risk-based approach"
            },
            {
              question: "How many risk categories does the EU AI Act establish?",
              options: ["Two", "Three", "Four", "Five"],
              correctAnswer: "Four"
            },
            {
              question: "Which of the following is NOT a key objective of the EU AI Act?",
              options: ["Ensure AI systems are safe", "Ban all forms of AI development", "Respect fundamental rights", "Facilitate innovation"],
              correctAnswer: "Ban all forms of AI development"
            }
          ]
        }),
        createdAt: new Date()
      },
      {
        moduleId: "2",
        title: "Risk Classification System",
        description: "Understanding the risk categories and how to classify AI systems",
        estimatedTime: "25-35 minutes",
        topics: ["Prohibited Uses", "High-Risk Systems", "Limited Risk", "Minimal Risk"],
        order: 2,
        roleRelevance: {
          decision_maker: "High",
          developer: "High",
          operator: "High",
          user: "Medium"
        },
        content: JSON.stringify({
          sections: [
            {
              title: "Understanding AI Risk Categories",
              content: "<p>The EU AI Act classifies AI systems into four distinct risk categories:</p><ol><li><strong>Unacceptable Risk (Prohibited)</strong>: AI systems deemed to pose a clear threat to safety, livelihoods, or rights of people.</li><li><strong>High Risk</strong>: AI systems that may cause significant harm to health, safety, or fundamental rights.</li><li><strong>Limited Risk</strong>: AI systems with specific transparency requirements.</li><li><strong>Minimal Risk</strong>: All other AI systems that pose little to no risk.</li></ol>"
            },
            {
              title: "Prohibited AI Practices",
              content: "<p>The following AI practices are prohibited under the EU AI Act:</p><ul><li>Social scoring systems used by public authorities</li><li>Real-time remote biometric identification in publicly accessible spaces for law enforcement (with limited exceptions)</li><li>AI systems that use subliminal or manipulative techniques to distort behavior</li><li>AI that exploits vulnerabilities of specific groups (age, disability, etc.)</li></ul>"
            },
            {
              title: "High-Risk AI Systems",
              content: "<p>High-risk AI systems require the most comprehensive compliance measures. An AI system is considered high-risk if it falls into one of two categories:</p><ol><li><strong>AI systems as safety components of products</strong> that are subject to third-party conformity assessment under existing product safety legislation (e.g., medical devices, machinery, toys)</li><li><strong>Stand-alone AI systems</strong> in specific areas such as biometric identification, critical infrastructure, education, employment, law enforcement, and migration control</li></ol>"
            }
          ],
          assessments: [
            {
              question: "Which of the following AI systems would most likely be classified as high-risk?",
              options: ["A video game recommendation system", "An AI system used for recruitment and candidate selection", "A smart home control system", "A music creation AI application"],
              correctAnswer: "An AI system used for recruitment and candidate selection"
            },
            {
              question: "Which practice is NOT prohibited under the EU AI Act?",
              options: ["Social scoring by governments", "AI-powered customer service chatbots", "Systems exploiting vulnerabilities of specific groups", "Real-time facial recognition in public spaces (with few exceptions)"],
              correctAnswer: "AI-powered customer service chatbots"
            },
            {
              question: "For high-risk AI systems, which requirement is NOT mandatory?",
              options: ["Risk management system", "Technical documentation", "Human oversight", "Open-source code publication"],
              correctAnswer: "Open-source code publication"
            }
          ]
        }),
        createdAt: new Date()
      },
      {
        moduleId: "3",
        title: "Technical Requirements",
        description: "Technical requirements for high-risk AI systems",
        estimatedTime: "40-50 minutes",
        topics: ["Data Governance", "Technical Documentation", "Record Keeping", "Accuracy & Robustness"],
        order: 3,
        roleRelevance: {
          decision_maker: "Medium",
          developer: "High",
          operator: "High",
          user: "Low"
        },
        content: JSON.stringify({
          sections: [
            {
              title: "Data Governance Requirements",
              content: "<p>High-risk AI systems must implement robust data governance practices:</p><ul><li>Training, validation, and testing data must be relevant, representative, and free of errors</li><li>Data must account for characteristics of specific demographic groups</li><li>Data bias must be identified and mitigated</li><li>Personal data must be protected in accordance with privacy regulations</li></ul>"
            },
            {
              title: "Technical Documentation",
              content: "<p>Technical documentation must include:</p><ul><li>General description of the system and its intended purpose</li><li>Design specifications including architecture, algorithms, and data requirements</li><li>Development process description and validation procedures</li><li>Risk management systems and mitigation measures</li><li>Testing and validation procedures</li></ul>"
            },
            {
              title: "Record-Keeping Requirements",
              content: "<p>High-risk AI systems must include:</p><ul><li>Automatic recording of events (logging) throughout operation</li><li>Traceability of system operations</li><li>Ability to monitor for incidents and malfunctions</li><li>Records that allow for post-market monitoring</li></ul>"
            }
          ],
          assessments: [
            {
              question: "Which of the following is NOT a data governance requirement under the EU AI Act?",
              options: ["Using representative data", "Testing data for bias", "Using only synthetic data", "Ensuring data quality"],
              correctAnswer: "Using only synthetic data"
            },
            {
              question: "What does the technical documentation requirement for high-risk AI systems include?",
              options: ["Only design specifications", "Only details about training data sources", "Only risk management measures", "All of the development process, design, and risk management"],
              correctAnswer: "All of the development process, design, and risk management"
            },
            {
              question: "What type of logging is required for high-risk AI systems?",
              options: ["Manual record-keeping only", "Continuous manual auditing", "Automatic recording of events during operation", "Monthly reporting of operations"],
              correctAnswer: "Automatic recording of events during operation"
            }
          ]
        }),
        createdAt: new Date()
      },
      {
        moduleId: "4",
        title: "Documentation Requirements",
        description: "Essential documentation required for EU AI Act compliance",
        estimatedTime: "30-40 minutes",
        topics: ["Technical Documentation", "Conformity Assessment", "Declaration of Conformity", "Risk Management System"],
        order: 4,
        roleRelevance: {
          decision_maker: "High",
          developer: "High",
          operator: "Medium",
          user: "Low"
        },
        content: JSON.stringify({
          sections: [
            {
              title: "Documentation Overview",
              content: "<p>The EU AI Act requires providers of high-risk AI systems to prepare and maintain extensive documentation. This documentation serves several purposes:</p><ul><li>Demonstrates compliance with regulatory requirements</li><li>Enables assessment of compliance by authorities</li><li>Provides users with necessary information</li><li>Serves as a basis for ongoing management and monitoring</li></ul>"
            },
            {
              title: "Technical Documentation Components",
              content: "<p>Technical documentation must include:</p><ol><li>General description of the AI system</li><li>Description of system elements (architecture, algorithms, data, etc.)</li><li>Documentation of risk management system</li><li>Description of validation and testing procedures</li><li>Description of monitoring, functioning, and control mechanisms</li><li>Instructions for use</li></ol>"
            },
            {
              title: "Conformity Assessment",
              content: "<p>Conformity assessment procedures vary depending on the type of high-risk AI system:</p><ul><li>Systems that are components of products already subject to third-party assessment: conform to existing product regulations</li><li>Stand-alone high-risk AI systems: internal conformity assessment based on technical specifications</li><li>Special procedures for specific systems like biometric identification</li></ul>"
            }
          ],
          assessments: [
            {
              question: "What is the primary purpose of technical documentation under the EU AI Act?",
              options: ["To prevent AI system development", "To demonstrate compliance with regulatory requirements", "To restrict access to AI technology", "To increase development costs"],
              correctAnswer: "To demonstrate compliance with regulatory requirements"
            },
            {
              question: "Which of the following is NOT required in technical documentation?",
              options: ["Description of the AI system architecture", "Documentation of risk management", "Source code for the entire system", "Description of validation procedures"],
              correctAnswer: "Source code for the entire system"
            },
            {
              question: "What does a Declaration of Conformity indicate?",
              options: ["That the AI system is completely risk-free", "That the provider takes sole responsibility for compliance", "That authorities have approved the system", "That the system is exempt from regulations"],
              correctAnswer: "That the provider takes sole responsibility for compliance"
            }
          ]
        }),
        createdAt: new Date()
      },
      {
        moduleId: "5",
        title: "Governance Framework",
        description: "Implementing an effective governance structure for AI compliance",
        estimatedTime: "35-45 minutes",
        topics: ["Compliance Officer", "Risk Management", "Monitoring Systems", "Post-Market Surveillance"],
        order: 5,
        roleRelevance: {
          decision_maker: "High",
          developer: "Medium",
          operator: "Medium",
          user: "Low"
        },
        content: JSON.stringify({
          sections: [
            {
              title: "AI Governance Structure",
              content: "<p>An effective AI governance structure should include:</p><ul><li>Clear roles and responsibilities for AI oversight</li><li>Board-level visibility and accountability</li><li>Cross-functional representation (legal, technical, business)</li><li>Defined processes for risk assessment and decision-making</li><li>Regular reporting and review mechanisms</li></ul>"
            },
            {
              title: "Risk Management Framework",
              content: "<p>The EU AI Act requires a robust risk management system that:</p><ol><li>Identifies and analyzes known and foreseeable risks</li><li>Estimates and evaluates risks that may emerge during operation</li><li>Evaluates other potentially arising risks based on data analysis</li><li>Adopts suitable risk management measures</li><li>Includes ongoing testing and validation procedures</li></ol>"
            },
            {
              title: "Post-Market Monitoring",
              content: "<p>Organizations must implement post-market monitoring systems that:</p><ul><li>Actively and systematically collect, document, and analyze data on performance</li><li>Test systems against new risks not covered in initial assessment</li><li>Evaluate effectiveness of risk mitigation measures</li><li>Identify and report serious incidents and malfunctions</li><li>Maintain records of incidents and corrective actions</li></ul>"
            }
          ],
          assessments: [
            {
              question: "Which of the following is a key component of an effective AI governance structure?",
              options: ["Centralizing all decisions with the IT department", "Eliminating human oversight", "Board-level visibility and accountability", "Conducting risk assessments only once"],
              correctAnswer: "Board-level visibility and accountability"
            },
            {
              question: "What is the main purpose of a risk management framework under the EU AI Act?",
              options: ["To avoid all AI development", "To identify, analyze, and mitigate risks systematically", "To delegate all responsibility to third parties", "To focus only on technical performance metrics"],
              correctAnswer: "To identify, analyze, and mitigate risks systematically"
            },
            {
              question: "What is required in a post-market monitoring system?",
              options: ["Only passive collection of user complaints", "Actively collecting and analyzing performance data", "Relying solely on regulatory inspections", "Waiting for problems to occur before taking action"],
              correctAnswer: "Actively collecting and analyzing performance data"
            }
          ]
        }),
        createdAt: new Date()
      },
      {
        moduleId: "6",
        title: "Implementation Case Studies",
        description: "Real-world examples of EU AI Act implementation",
        estimatedTime: "45-60 minutes",
        topics: ["Use Cases", "Implementation Steps", "Challenges", "Best Practices"],
        order: 6,
        roleRelevance: {
          decision_maker: "High",
          developer: "High",
          operator: "High",
          user: "Medium"
        },
        content: JSON.stringify({
          sections: [
            {
              title: "Healthcare AI Implementation",
              content: "<p>Case Study: Medical Diagnostic Support System</p><p>Implementation challenges and solutions:</p><ul><li>Classification as high-risk system requiring full compliance</li><li>Data governance measures to ensure representative training data</li><li>Implementing explainability features for healthcare professionals</li><li>Testing for potential biases in different demographic groups</li><li>Implementing robust logging and monitoring systems</li><li>Creating complete technical documentation</li></ul>"
            },
            {
              title: "Financial Services Implementation",
              content: "<p>Case Study: Credit Risk Assessment AI</p><p>Implementation approach:</p><ul><li>Classification as high-risk system due to impact on access to essential services</li><li>Proactive risk assessment and management system</li><li>Implementation of human oversight mechanisms</li><li>Ensuring transparency of decisions through explainable AI techniques</li><li>Regular testing for bias and ethical concerns</li><li>Strong governance framework with clear accountability</li></ul>"
            },
            {
              title: "Implementation Best Practices",
              content: "<p>Key lessons from successful implementations:</p><ol><li>Begin with a comprehensive AI inventory and risk assessment</li><li>Establish cross-functional implementation teams with clear leadership</li><li>Build compliance into development processes from the beginning</li><li>Implement robust documentation practices throughout the lifecycle</li><li>Establish continuous monitoring and feedback loops</li><li>Create clear roles and responsibilities for compliance</li><li>Provide adequate training for all relevant personnel</li></ol>"
            }
          ],
          assessments: [
            {
              question: "Which of the following is a best practice for EU AI Act implementation?",
              options: ["Waiting until the system is complete before considering compliance", "Assigning compliance responsibility only to legal teams", "Building compliance into development processes from the beginning", "Conducting risk assessment only at the end of development"],
              correctAnswer: "Building compliance into development processes from the beginning"
            },
            {
              question: "Why is human oversight particularly important in high-risk AI implementations?",
              options: ["It replaces the need for technical documentation", "It ensures human control and intervention when needed", "It eliminates the need for monitoring systems", "It transfers all liability to the human operators"],
              correctAnswer: "It ensures human control and intervention when needed"
            },
            {
              question: "What is the first step organizations should take when implementing EU AI Act compliance?",
              options: ["Completely redesign all AI systems", "Create a comprehensive AI inventory and risk assessment", "Wait for formal enforcement actions", "Outsource all AI development to third parties"],
              correctAnswer: "Create a comprehensive AI inventory and risk assessment"
            }
          ]
        }),
        createdAt: new Date()
      }
    ]);
    
    console.log("Successfully added training modules");
  } catch (error) {
    console.error("Error adding training modules:", error);
  }
}

// Run the function
addTrainingModules().catch(console.error);