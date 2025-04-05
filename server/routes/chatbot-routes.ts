import express from 'express';
import { aiServices } from '../lib/ai-services';
import { callDeepSeekApi } from '../ai-analysis';

const router = express.Router();

// Add chat routes
router.post('/query', async (req, res) => {
  try {
    const { query, history, mode, language, context } = req.body;
    
    // For backward compatibility, accept either 'query' or 'message' parameter
    const message = query || req.body.message;
    
    if (!message) {
      return res.status(400).json({ 
        message: 'Query is required' 
      });
    }
    
    // Construct the prompt based on the mode
    let systemPrompt = getSystemPrompt(mode, language);
    
    // If there's context, add it to the system prompt
    if (context) {
      systemPrompt += `\n\nAdditional context: ${context}`;
    }
    
    // Format the chat history for the AI service
    const formattedHistory = formatChatHistory(history);
    
    // Use DeepSeek API for chat functionality with fallback to aiServices
    let aiResponse = '';
    try {
      // Build prompt that includes system instructions, history and user message
      const prompt = `${systemPrompt}\n\n${formattedHistory.map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n\n')}\n\nUser: ${message}`;
      
      // Try with a timeout to avoid hanging
      const timeoutPromise = new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error('DeepSeek API timeout')), 5000);
      });
      
      try {
        // Race between the API call and the timeout
        aiResponse = await Promise.race([
          callDeepSeekApi(prompt),
          timeoutPromise
        ]);
      } catch (timeoutError) {
        console.log('Falling back to aiServices due to timeout or error');
        // Fallback to aiServices
        aiResponse = await aiServices.generateText(prompt, 'chatbot');
      }
    } catch (error) {
      console.error('Error with all AI services:', error);
      aiResponse = "I'm having trouble connecting to the AI service right now. Please try again later.";
    }
    
    // Attempt to extract structured data when appropriate
    let extractedData = null;
    if (message.toLowerCase().includes('create') || 
        message.toLowerCase().includes('generate') || 
        message.toLowerCase().includes('fill') ||
        message.toLowerCase().includes('setup') ||
        message.toLowerCase().includes('template')) {
      extractedData = await extractStructuredData(mode, message, aiResponse);
    }
    
    res.json({
      response: aiResponse,
      extractedData
    });
    
  } catch (error) {
    console.error('Error in chatbot query:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred while processing your request'
    });
  }
});

function getSystemPrompt(mode: string, language: string): string {
  let prompt = '';
  
  // Base prompt for all modes
  prompt = `You are an AI assistant specialized in helping with EU AI Act compliance. 
  
You're assisting a user with their ${mode} needs. 
Respond in ${language === 'de' ? 'German' : 'English'} language.

The current date is ${new Date().toLocaleDateString()}.`;

  // Mode-specific instructions
  switch (mode) {
    case 'registration':
      prompt += `\n\nYou will help the user register their AI system by collecting the necessary information.
      
Key fields you should collect include:
- System name
- Purpose/description
- Intended use
- Risk category (if known)
- Type of AI technology used
- Data sources
- Human oversight measures
- Technical specifications

Be conversational but focused on gathering complete information. Ask follow-up questions to get details.
If the user asks to create a template or generate a system description, provide structured information in a way that can be imported into the system.`;
      break;
      
    case 'risk-assessment':
      prompt += `\n\nYou will help the user assess the risks of their AI system according to EU AI Act criteria.
      
Key aspects to address:
- Intended purpose and use cases
- Risk classification (prohibited, high-risk, limited risk, minimal risk)
- Potential risks to fundamental rights
- Technical robustness considerations
- Data quality and bias potential
- Human oversight measures
- Transparency requirements

Be thorough in your risk analysis. Ask about specific features and use cases to provide accurate guidance.
If the user asks to generate a risk assessment, create a detailed assessment that can be imported into the system.`;
      break;
      
    case 'documentation':
      prompt += `\n\nYou will help the user generate documentation required for EU AI Act compliance.
      
Key documentation types:
- Technical documentation
- Risk management documentation
- Data governance documentation
- Training and test set documentation
- Human oversight procedures
- Monitoring and update plans
- Conformity assessment documentation

Be precise and comprehensive. Ask about specific requirements and tailor documentation to the system type.
If the user asks to generate document templates, create structured content that can be imported into the system.`;
      break;
      
    default:
      prompt += `\n\nYou will provide general guidance on EU AI Act compliance.
      
Focus on:
- Explaining relevant regulatory requirements
- Clarifying compliance obligations
- Suggesting best practices
- Addressing specific compliance questions

Be helpful, accurate, and cite specific articles of the EU AI Act when relevant.`;
  }
  
  return prompt;
}

function formatChatHistory(history: any[] = []): { role: string, content: string }[] {
  if (!history || !Array.isArray(history)) {
    return [];
  }
  
  return history.map(item => ({
    role: item.role === 'assistant' ? 'assistant' : 'user',
    content: item.content
  }));
}

async function extractStructuredData(mode: string, userMessage: string, aiResponse: string): Promise<any | null> {
  try {
    // Create a prompt to extract structured data based on mode and conversation
    const extractionPrompt = `
Based on the following conversation, extract structured data for a ${mode} template.

User message: ${userMessage}

Assistant response: ${aiResponse}

Extract the key fields in JSON format. For example:
${getExampleJson(mode)}

Return ONLY valid JSON without any explanation or additional text.`;

    // Use DeepSeek API to extract structured data with aiServices fallback
    let extractionResponse = '';
    try {
      // Try with a timeout to avoid hanging
      const timeoutPromise = new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error('DeepSeek API timeout')), 5000);
      });
      
      extractionResponse = await Promise.race([
        callDeepSeekApi(extractionPrompt),
        timeoutPromise
      ]);
    } catch (timeoutError) {
      console.log('Falling back to aiServices for extraction due to timeout or error');
      // Fallback to aiServices
      extractionResponse = await aiServices.generateText(extractionPrompt, 'extraction');
    }
    
    // Try to parse the JSON response
    try {
      // Find JSON in the response (look for content between curly braces)
      const jsonMatch = extractionResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonContent = jsonMatch[0];
        return JSON.parse(jsonContent);
      }
      return null;
    } catch (parseError) {
      console.error('Error parsing extracted data:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Error extracting structured data:', error);
    return null;
  }
}

function getExampleJson(mode: string): string {
  switch (mode) {
    case 'registration':
      return `{
  "name": "Predictive Maintenance AI",
  "description": "AI system for predicting equipment failures in manufacturing plants",
  "purpose": "To monitor equipment health and predict failures before they occur",
  "aiTechnology": "Machine learning with random forest and gradient boosting",
  "riskCategory": "Limited risk",
  "intendedUsers": "Maintenance technicians and plant managers",
  "dataSources": "Equipment sensors, maintenance logs, operational data",
  "humanOversight": "Technician reviews predictions before maintenance is scheduled"
}`;
      
    case 'risk-assessment':
      return `{
  "systemName": "Customer Service Chatbot",
  "riskCategory": "Limited risk",
  "intendedUse": "Handling customer inquiries and routing to human agents when needed",
  "potentialRisks": [
    "Misunderstanding sensitive customer requests",
    "Providing inaccurate information",
    "Privacy concerns with customer data"
  ],
  "mitigationMeasures": [
    "Regular accuracy reviews",
    "Clear disclosure of AI nature",
    "Human fallback option always available"
  ],
  "dataGovernance": "Customer data is anonymized after use",
  "transparencyMeasures": "Users are informed they're interacting with an AI system"
}`;
      
    case 'documentation':
      return `{
  "documentTitle": "Technical Documentation for Recruitment AI System",
  "systemPurpose": "To screen and rank job candidates based on qualifications",
  "complianceRequirements": [
    "Transparency to candidates about AI use",
    "Human review of all shortlisted candidates",
    "Regular bias testing"
  ],
  "dataHandling": "Resumes and candidate data stored securely for 6 months",
  "technicalArchitecture": "Cloud-based natural language processing with custom ML models",
  "testingMethods": "Regular bias and performance audits with documented results",
  "humanOversightProcedures": "HR specialists review and can override all decisions"
}`;
      
    default:
      return `{
  "topic": "EU AI Act Compliance Overview",
  "keyComponents": [
    "Risk classification",
    "Documentation requirements",
    "Human oversight",
    "Data governance"
  ],
  "applicableRegulations": ["EU AI Act", "GDPR"],
  "suggestedActions": [
    "Conduct initial risk assessment",
    "Review data handling procedures",
    "Establish human oversight protocols"
  ]
}`;
  }
}

export default router;