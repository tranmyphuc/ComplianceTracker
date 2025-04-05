/**
 * AI Services Provider
 * Consolidated access to AI services used in the application
 */

import OpenAI from "openai";
import { storage } from "../storage";

// Interface for AI service providers
interface AIService {
  name: string;
  complete: (args: any) => Promise<any>;
  available: boolean;
}

/**
 * OpenAI Service implementation
 */
class OpenAIService implements AIService {
  name = 'openai';
  available = false;
  private client: OpenAI | null = null;
  
  constructor() {
    this.initialize();
  }
  
  private async initialize() {
    try {
      // Get API key from storage
      const apiKeys = await (storage as any).getApiKeys() || [];
      const openaiKey = apiKeys.find((key: any) => key.provider === 'openai');
      
      if (openaiKey && openaiKey.key) {
        this.client = new OpenAI({
          apiKey: openaiKey.key,
        });
        this.available = true;
        console.log('OpenAI service initialized');
      } else {
        console.log('OpenAI API key not found');
        this.available = false;
      }
    } catch (error) {
      console.error('Failed to initialize OpenAI service:', error);
      this.available = false;
    }
  }
  
  async complete({ messages, temperature = 0.7, response_format = undefined }: {
    messages: any[];
    temperature?: number;
    response_format?: { type: "json_object" } | undefined;
  }) {
    if (!this.client || !this.available) {
      console.error('OpenAI service not available');
      return null;
    }
    
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4-turbo",
        messages,
        temperature,
        response_format
      });
      
      return response.choices[0].message;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
}

/**
 * DeepSeek AI Service implementation (stub for now, can be implemented later)
 */
class DeepSeekService implements AIService {
  name = 'deepseek';
  available = false;
  
  constructor() {
    this.initialize();
  }
  
  private async initialize() {
    try {
      // Get API key from storage
      const apiKeys = await (storage as any).getApiKeys() || [];
      const deepseekKey = apiKeys.find((key: any) => key.provider === 'deepseek');
      
      if (deepseekKey && deepseekKey.key) {
        this.available = true;
        console.log('DeepSeek service initialized');
      } else {
        console.log('DeepSeek API key not found');
        this.available = false;
      }
    } catch (error) {
      console.error('Failed to initialize DeepSeek service:', error);
      this.available = false;
    }
  }
  
  async complete({ messages }: { messages: any[] }) {
    if (!this.available) {
      console.error('DeepSeek service not available');
      return null;
    }
    
    try {
      // In a real implementation, this would call DeepSeek API
      // For now, just return a simple response format
      return {
        content: JSON.stringify({
          riskLevel: "high",
          relevantArticles: ["Article 6 - Classification Rules for High-Risk AI Systems", "Article 9 - Risk Management System"],
          suggestedImprovements: ["Implement comprehensive documentation", "Establish human oversight protocols"],
          potentialImpact: "Significant impact on fundamental rights requiring assessment",
          vulnerabilities: "Limited transparency and explainability of decision-making process"
        })
      };
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  }
}

// Create instances of all services
const openaiService = new OpenAIService();
const deepseekService = new DeepSeekService();

// AI Services singleton
export const aiServices = {
  // Get all available services
  getServices(): AIService[] {
    return [
      openaiService,
      deepseekService
    ].filter(service => service.available);
  },
  
  // Get the primary service (first available)
  getPrimaryService(): AIService | null {
    const services = this.getServices();
    return services.length > 0 ? services[0] : null;
  },
  
  // Get a specific service by name
  getService(name: string): AIService | null {
    const services = this.getServices();
    return services.find(service => service.name === name) || null;
  },
  
  // Generate text using available AI services
  async generateText(prompt: string, type: string = 'general'): Promise<string> {
    const service = this.getPrimaryService();
    if (!service) {
      throw new Error('No AI service available');
    }
    
    try {
      const response = await service.complete({
        messages: [
          { role: "system", content: `You are an expert in EU AI Act compliance. Provide ${type} analysis.` },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      });
      
      return response?.content || "I'm sorry, I couldn't generate a response at this time.";
    } catch (error) {
      console.error(`Error generating text with ${service.name}:`, error);
      throw error;
    }
  },
  
  // Reset services (useful for testing)
  reset() {
    openaiService.available = false;
    deepseekService.available = false;
  }
};

// Helper function to fetch OpenAI (used by other modules)
export async function fetchOpenAI(prompt: string, type: string = 'general') {
  const service = aiServices.getService('openai');
  if (!service) {
    console.error('OpenAI service not available');
    return null;
  }
  
  try {
    const response = await service.complete({
      messages: [
        { role: "system", content: `You are an expert in EU AI Act compliance. Provide ${type} analysis.` },
        { role: "user", content: prompt }
      ],
      temperature: 0.1
    });
    
    return response?.content || null;
  } catch (error) {
    console.error('Error in fetchOpenAI:', error);
    return null;
  }
}