import { db } from "./server/db";
import * as schema from "./shared/schema";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";

// Function to add training modules one at a time to handle issues
async function addTrainingModules() {
  try {
    console.log("Adding training modules...");
    
    // Delete existing modules first to avoid duplicates
    await db.delete(schema.trainingModules);
    
    // Module 1: EU AI Act Introduction
    await db.insert(schema.trainingModules).values({
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
      content: {
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
      }
    });
    
    console.log("Module 1 added successfully");
    
    // Module 2: Risk Classification System
    await db.insert(schema.trainingModules).values({
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
      content: {
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
      }
    });
    
    console.log("Module 2 added successfully");
    
    // Module 3: Technical Requirements
    await db.insert(schema.trainingModules).values({
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
      content: {
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
      }
    });
    
    console.log("Module 3 added successfully");
    
    // Modules 4-6 would follow the same pattern
    // We'll add them in subsequent batches if needed
    
    console.log("Successfully added training modules");
  } catch (error) {
    console.error("Error adding training modules:", error);
  }
}

// Run the function
addTrainingModules().catch(console.error);