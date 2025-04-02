import express from 'express';
import { storage } from '../storage';
import { callDeepSeekApi } from '../ai-analysis';
import { fetchOpenAI } from '../ai-services';

const router = express.Router();

interface AssistantQueryRequest {
  query: string;
  context: {
    systemId?: string;
    assessmentId?: string;
    context?: string;
    language?: string;
    previousMessages?: { role: string; content: string }[];
  };
}

// Risk Assessment Assistant API
router.post('/risk-assessment', async (req, res) => {
  try {
    const { query, context } = req.body as AssistantQueryRequest;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Gather contextual information based on the request
    let contextualData = '';
    
    // Retrieve system information if systemId is provided
    if (context.systemId) {
      const system = await storage.getAiSystem(parseInt(context.systemId));
      if (system) {
        contextualData += `
AI System Information:
Name: ${system.name}
Purpose: ${system.purpose || 'Not specified'}
Department: ${system.department || 'Not specified'}
Risk Level: ${system.riskLevel || 'Not determined'}
Status: ${system.status || 'Not specified'}
`;
      }
    }

    // Retrieve assessment information if assessmentId is provided
    if (context.assessmentId) {
      const assessment = await storage.getRiskAssessment(parseInt(context.assessmentId));
      if (assessment) {
        contextualData += `
Risk Assessment Information:
Risk Level: ${assessment.riskLevel}
Risk Score: ${assessment.riskScore}
Status: ${assessment.status || 'In progress'}
Compliance Gaps: ${assessment.complianceGaps ? 
  (typeof assessment.complianceGaps === 'string' ? 
    assessment.complianceGaps : 
    JSON.stringify(assessment.complianceGaps)
  ) : 'Not identified'}
`;
      }
    }

    // Determine assistant mode based on context
    let assistantMode = '';
    switch (context.context) {
      case 'wizard':
        assistantMode = 'You are helping the user complete a risk assessment wizard for an AI system under the EU AI Act.';
        break;
      case 'results':
        assistantMode = 'You are helping the user interpret risk assessment results and understand compliance requirements.';
        break;
      case 'controls':
        assistantMode = 'You are helping the user select and implement appropriate risk control measures to address identified risks.';
        break;
      default:
        assistantMode = 'You are a compliance assistant specializing in EU AI Act requirements.';
    }

    // Build conversation history
    const conversationHistory = context.previousMessages || [];
    
    // Build the prompt for the AI model
    const prompt = `
${assistantMode}

User Language: ${context.language === 'de' ? 'German' : 'English'}
${contextualData ? `\nContext Information:\n${contextualData}` : ''}

You are an expert on the EU AI Act and can help users understand risk assessment requirements, interpret results, and implement appropriate controls. Be concise but thorough in your explanations. If you need to reference articles from the EU AI Act, mention the specific article numbers.

${context.language === 'de' ? 'Bitte antworte auf Deutsch.' : 'Please respond in English.'}

User query: ${query}
`;

    // Use the appropriate AI service (with fallback)
    let response;
    try {
      response = await callDeepSeekApi(prompt);
    } catch (error) {
      console.error('DeepSeek API error, falling back to OpenAI:', error);
      try {
        response = await fetchOpenAI(prompt);
      } catch (openAiError) {
        console.error('OpenAI fallback error:', openAiError);
        throw new Error('Failed to get AI response');
      }
    }

    // Check for action recommendations in the response
    const actionRegex = /\[ACTION:([^\]]+)\]\s*(\{.*?\})/g;
    let action = null;
    let cleanResponse = response;

    const actionMatch = actionRegex.exec(response);
    if (actionMatch) {
      try {
        const actionType = actionMatch[1].trim();
        const actionData = JSON.parse(actionMatch[2]);
        action = {
          type: actionType,
          data: actionData
        };
        // Remove the action directive from the response text
        cleanResponse = response.replace(actionRegex, '').trim();
      } catch (e) {
        console.error('Failed to parse action from response:', e);
      }
    }

    // Log the interaction for future analysis
    await storage.createActivity({
      type: 'assistant_interaction',
      description: `User interaction with Risk Assessment Assistant (context: ${context.context || 'general'})`,
      userId: null, // We don't have session info in this context
      systemId: context.systemId || null,
      metadata: {
        query,
        contextType: context.context,
        language: context.language,
        hasSystemId: !!context.systemId,
        hasAssessmentId: !!context.assessmentId
      },
      timestamp: new Date()
    });

    // Return the response
    return res.json({ 
      response: cleanResponse,
      action
    });
  } catch (error) {
    console.error('Assistant API error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
});

export default router;