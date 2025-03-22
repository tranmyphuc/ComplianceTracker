import { Request, Response } from "express";
import { callDeepSeekApi } from "./ai-analysis";

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
  updatedAt: Date;
}

// Mock module data until database schema is updated
const modules: TrainingModule[] = [
  {
    id: "1",
    title: "EU AI Act Introduction",
    description: "Overview of the EU AI Act, its objectives, scope, and implications for organizations.",
    estimated_time: "45 minutes",
    topics: ["AI Act Overview", "Key Definitions", "Prohibited Practices", "Risk Categories"],
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
    description: "Detailed exploration of the risk-based approach and classification criteria.",
    estimated_time: "60 minutes",
    topics: ["Risk-Based Approach", "Classification Criteria", "Examples by Category", "Risk Assessment Process"],
    role_relevance: {
      decision_maker: "High",
      developer: "High",
      operator: "Medium",
      user: "Low"
    }
  },
  {
    id: "3",
    title: "Technical Requirements",
    description: "Technical compliance requirements for AI systems under the EU AI Act.",
    estimated_time: "90 minutes",
    topics: ["Data Governance", "Technical Documentation", "Record Keeping", "Transparency"],
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
    description: "Comprehensive guide to required documentation for AI system compliance.",
    estimated_time: "75 minutes",
    topics: ["Technical Documentation", "Risk Management", "Data Sheets", "User Instructions"],
    role_relevance: {
      decision_maker: "Medium",
      developer: "High",
      operator: "Medium",
      user: "Low"
    }
  },
  {
    id: "5",
    title: "Governance Framework",
    description: "Organizational governance structures for EU AI Act compliance.",
    estimated_time: "60 minutes",
    topics: ["Compliance Roles", "Reporting Structure", "Oversight Mechanisms", "Incident Response"],
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
    description: "Real-world examples of EU AI Act implementation across various industries.",
    estimated_time: "90 minutes",
    topics: ["Healthcare AI", "Financial Services", "Manufacturing", "Public Services"],
    role_relevance: {
      decision_maker: "High",
      developer: "High",
      operator: "High",
      user: "Medium"
    }
  }
];

// In-memory store for user progress until database schema is updated
const userProgress: Record<string, Record<string, TrainingProgress>> = {};

/**
 * Get all training modules
 */
export async function getTrainingModules(req: Request, res: Response) {
  try {
    res.json(modules);
  } catch (error) {
    console.error("Error fetching training modules:", error);
    res.status(500).json({ message: "Failed to fetch training modules" });
  }
}

/**
 * Get specific module content
 */
export async function getModuleContent(req: Request, res: Response) {
  try {
    const moduleId = req.params.moduleId;
    const userRole = req.query.role as string || "user";
    
    const module = modules.find(m => m.id === moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    // Generate module content based on user role
    const content = await generateModuleContent(module, userRole);
    res.json(content);
  } catch (error) {
    console.error("Error fetching module content:", error);
    res.status(500).json({ message: "Failed to fetch module content" });
  }
}

/**
 * Track user's training progress
 */
export async function trackTrainingProgress(req: Request, res: Response) {
  try {
    const { userId, moduleId, completion } = req.body;
    
    if (!userId || !moduleId || completion === undefined) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Validate moduleId
    const moduleExists = modules.some(m => m.id === moduleId);
    if (!moduleExists) {
      return res.status(404).json({ message: "Module not found" });
    }

    // Store progress
    if (!userProgress[userId]) {
      userProgress[userId] = {};
    }

    userProgress[userId][moduleId] = {
      userId,
      moduleId,
      completion: Math.min(100, Math.max(0, completion)), // Ensure between 0-100
      updatedAt: new Date()
    };

    res.json({
      userId,
      moduleId,
      completion: userProgress[userId][moduleId].completion,
      status: "updated"
    });
  } catch (error) {
    console.error("Error tracking progress:", error);
    res.status(500).json({ message: "Failed to track progress" });
  }
}

/**
 * Get user's training progress
 */
export async function getUserProgress(req: Request, res: Response) {
  try {
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({ message: "Missing user ID" });
    }

    // Return progress
    const progress = userProgress[userId] || {};
    res.json(progress);
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ message: "Failed to fetch progress" });
  }
}

/**
 * Generate module content using AI
 */
async function generateModuleContent(module: TrainingModule, userRole: string): Promise<ModuleContent> {
  try {
    // For larger-scale implementation, this would call an AI service
    // or load predefined content from a database
    
    // Try to generate content using DeepSeek API
    const prompt = `
      Generate a complete EU AI Act training module with the following details:
      
      Module title: ${module.title}
      Module description: ${module.description}
      Topics: ${module.topics.join(', ')}
      User role: ${userRole}
      
      The content should be tailored to a user with role: ${userRole}.
      
      Structure your response as JSON with the following format:
      {
        "title": "Module title",
        "sections": [
          {
            "title": "Section title",
            "content": "HTML-formatted content with paragraphs, lists, etc."
          }
        ],
        "assessments": [
          {
            "question": "Question text",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correctAnswer": "Correct option text"
          }
        ]
      }
      
      Include 3-4 informative sections and 2-3 assessment questions.
      Ensure all content is accurate according to the official EU AI Act.
      Format section content with HTML tags like <p>, <ul>, <li>, <h3>, etc.
    `;
    
    try {
      const aiResponse = await callDeepSeekApi(prompt, 'training_module');
      const parsedContent = JSON.parse(aiResponse);
      
      // Validate the response has the expected structure
      if (parsedContent.title && 
          Array.isArray(parsedContent.sections) && 
          Array.isArray(parsedContent.assessments)) {
        return parsedContent;
      }
    } catch (error) {
      console.error("Error generating module content with AI:", error);
      // Fall back to static content
    }
    
    // Fallback static content if AI generation fails
    return {
      title: module.title,
      sections: [
        {
          title: "Introduction",
          content: `
            <h3>Welcome to this training module</h3>
            <p>The EU AI Act is a comprehensive regulatory framework designed to ensure AI systems used within the European Union are safe, transparent, traceable, non-discriminatory and environmentally friendly. The Act takes a risk-based approach, with different requirements based on the level of risk posed by AI systems.</p>
            <p>This module will provide you with a fundamental understanding of the EU AI Act, its key provisions, and how it impacts your organization's AI development and deployment practices.</p>
          `
        },
        {
          title: "Learning Objectives",
          content: `
            <p>By the end of this module, you will be able to:</p>
            <ul>
              <li>Understand the purpose and scope of the EU AI Act</li>
              <li>Identify the different risk categories for AI systems</li>
              <li>Recognize prohibited AI practices</li>
              <li>Understand basic compliance requirements for your role</li>
            </ul>
          `
        },
        {
          title: "Key Concepts",
          content: `
            <h3>Risk-Based Approach</h3>
            <p>The EU AI Act classifies AI systems into four risk categories:</p>
            <ol>
              <li><strong>Unacceptable Risk:</strong> AI systems that pose a clear threat to people are prohibited.</li>
              <li><strong>High Risk:</strong> AI systems that could harm people's safety or fundamental rights are subject to strict requirements.</li>
              <li><strong>Limited Risk:</strong> AI systems with specific transparency obligations.</li>
              <li><strong>Minimal Risk:</strong> All other AI systems are subject to minimal regulation.</li>
            </ol>
            <p>Your responsibilities and compliance requirements will vary depending on the risk classification of the AI systems you work with.</p>
          `
        }
      ],
      assessments: [
        {
          question: "Which of the following is NOT one of the risk categories in the EU AI Act?",
          options: [
            "Unacceptable Risk",
            "High Risk",
            "Medium Risk",
            "Limited Risk"
          ],
          correctAnswer: "Medium Risk"
        },
        {
          question: "What happens to AI systems classified as 'Unacceptable Risk'?",
          options: [
            "They require continuous monitoring",
            "They are prohibited",
            "They need special certification",
            "They must be registered in an EU database"
          ],
          correctAnswer: "They are prohibited"
        }
      ]
    };
  } catch (error) {
    console.error("Error in generateModuleContent:", error);
    throw error;
  }
}