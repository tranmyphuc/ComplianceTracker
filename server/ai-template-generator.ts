/**
 * AI Template Generator
 * Uses AI to intelligently generate and customize document templates
 * based on AI system characteristics and risk levels
 */

import { aiServices, fetchOpenAI } from './lib/ai-services';
import { db } from './db';
import { documentTemplates, InsertDocumentTemplate } from '@shared/schema';
import { v4 as uuidv4 } from 'uuid';
import { AiSystem } from '@shared/types';
import { RiskAssessment } from '@shared/types';
import { eq } from 'drizzle-orm';

// Template types for different risk levels
const TEMPLATE_TYPES = {
  HIGH_RISK: [
    'technical_documentation',
    'risk_assessment',
    'human_oversight_protocol', 
    'conformity_assessment',
    'data_governance',
    'monitoring_plan',
    'incident_response'
  ],
  LIMITED_RISK: [
    'technical_documentation_simplified',
    'transparency_report',
    'guidelines_for_users'
  ],
  MINIMAL_RISK: [
    'basic_documentation',
    'voluntary_code_adherence'
  ]
};

/**
 * Suggests appropriate templates based on AI system characteristics and risk level
 */
export async function suggestTemplates(system: AiSystem, assessment?: RiskAssessment) {
  const riskLevel = assessment?.riskLevel || system.riskLevel || 'Unknown';
  
  // Get all available templates
  const allTemplates = await db.select().from(documentTemplates);
  
  // Determine which templates are most appropriate based on risk level
  let recommendedTemplateIds: string[] = [];
  
  if (riskLevel.includes('High') || riskLevel === 'Unacceptable') {
    recommendedTemplateIds = TEMPLATE_TYPES.HIGH_RISK;
  } else if (riskLevel.includes('Limited')) {
    recommendedTemplateIds = TEMPLATE_TYPES.LIMITED_RISK;
  } else {
    recommendedTemplateIds = TEMPLATE_TYPES.MINIMAL_RISK;
  }
  
  // Find matching templates from our database
  const recommendedTemplates = allTemplates.filter(template => {
    // Match either by template ID or by looking for keywords in the name or description
    return recommendedTemplateIds.some(id => 
      template.templateId === id || 
      template.name.toLowerCase().includes(id.replace('_', ' ')) ||
      (template.description && template.description.toLowerCase().includes(id.replace('_', ' ')))
    );
  });
  
  // Use AI to enhance the recommendations if available
  try {
    const aiService = aiServices.getPrimaryService();
    if (aiService) {
      const systemDescription = JSON.stringify({
        name: system.name,
        description: system.description,
        purpose: system.purpose,
        riskLevel: riskLevel,
        capabilities: system.capabilities,
        domain: system.domain
      });
      
      const prompt = `Based on this AI system: ${systemDescription}, 
      suggest which document templates would be most appropriate for EU AI Act compliance.
      Provide a response in JSON format with an array of objects, each containing "templateType" and "reason" fields.
      Focus on EU AI Act requirements for ${riskLevel} systems.`;
      
      const response = await aiService.complete({
        messages: [
          { role: "system", content: "You are an expert in EU AI Act compliance documentation." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      });
      
      if (response?.content) {
        try {
          // Extract JSON from response
          const jsonMatch = response.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const aiSuggestions = JSON.parse(jsonMatch[0]);
            if (aiSuggestions.templates && Array.isArray(aiSuggestions.templates)) {
              // Enhance our recommendations with AI insights
              return {
                templates: recommendedTemplates,
                aiSuggestions: aiSuggestions.templates,
                message: "AI-enhanced template recommendations"
              };
            }
          }
        } catch (error) {
          console.error("Error parsing AI template suggestions:", error);
        }
      }
    }
  } catch (error) {
    console.error("Error getting AI template suggestions:", error);
  }
  
  // Return basic recommendations if AI enhancement failed
  return {
    templates: recommendedTemplates,
    message: "Template recommendations based on system risk level"
  };
}

/**
 * Generates custom document template content based on system characteristics
 */
export async function generateTemplateContent(templateType: string, system: AiSystem, assessment?: RiskAssessment) {
  const riskLevel = assessment?.riskLevel || system.riskLevel || 'Unknown';
  
  // Base prompt that describes what we want
  let basePrompt = `Create a detailed markdown template for a "${templateType}" document for an AI system called "${system.name}".
  The system is classified as "${riskLevel}" under the EU AI Act.
  The template should include appropriate headings, sections, and placeholders for variable information.
  Focus on compliance with EU AI Act requirements for ${riskLevel} risk systems.`;
  
  // Add system details if available
  if (system.description) {
    basePrompt += `\nSystem description: ${system.description}`;
  }
  
  if (system.purpose) {
    basePrompt += `\nSystem purpose: ${system.purpose}`;
  }
  
  if (system.domain) {
    basePrompt += `\nSystem domain: ${system.domain}`;
  }
  
  // Add assessment details if available
  if (assessment) {
    basePrompt += `\nRisk assessment score: ${assessment.score}`;
    
    if (assessment.risks && Array.isArray(assessment.risks)) {
      basePrompt += `\nIdentified risks: ${assessment.risks.map(r => r.name).join(', ')}`;
    }
  }
  
  // Specific instructions based on document type
  switch (templateType.toLowerCase()) {
    case 'technical_documentation':
      basePrompt += `\nInclude sections for: System Overview, Technical Specifications, Architecture, Data Flows, Interfaces, Security Measures, Performance Metrics, and Testing Results.`;
      break;
    case 'risk_assessment':
      basePrompt += `\nInclude sections for: Executive Summary, Identified Risks, Risk Scoring, Mitigation Measures, Residual Risks, and Monitoring Plan.`;
      break;
    case 'human_oversight':
      basePrompt += `\nInclude sections for: Oversight Mechanisms, Human-in-the-Loop Processes, Operator Training Requirements, Intervention Procedures, and Exception Handling.`;
      break;
    case 'data_governance':
      basePrompt += `\nInclude sections for: Data Sources, Data Collection Practices, Data Processing, Quality Measures, Bias Prevention, Privacy Safeguards, and Retention Policies.`;
      break;
    default:
      basePrompt += `\nInclude appropriate sections for a ${templateType} document relevant to EU AI Act compliance.`;
  }
  
  // Add placeholder instructions
  basePrompt += `\nUse placeholders in square brackets for variable information, e.g., [SYSTEM_NAME], [VERSION], [DATE], etc.`;
  
  try {
    const aiService = aiServices.getPrimaryService();
    if (!aiService) {
      throw new Error("No AI service available");
    }
    
    const response = await aiService.complete({
      messages: [
        { role: "system", content: "You are an expert in creating EU AI Act compliance documentation templates." },
        { role: "user", content: basePrompt }
      ],
      temperature: 0.2
    });
    
    if (response?.content) {
      // Extract markdown content, removing any code block markers
      let templateContent = response.content;
      templateContent = templateContent.replace(/```markdown/g, '').replace(/```/g, '');
      
      return {
        success: true,
        content: templateContent,
        message: "AI-generated template content"
      };
    } else {
      throw new Error("Empty AI response");
    }
  } catch (error) {
    console.error(`Error generating template content for ${templateType}:`, error);
    return {
      success: false,
      message: `Failed to generate template content: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Creates a new AI-generated document template
 */
export async function createAiGeneratedTemplate(
  templateType: string,
  name: string,
  system: AiSystem,
  assessment?: RiskAssessment
) {
  try {
    // Generate the template content
    const contentResult = await generateTemplateContent(templateType, system, assessment);
    
    if (!contentResult.success || !contentResult.content) {
      return {
        success: false,
        message: contentResult.message
      };
    }
    
    // Create the template
    const newTemplate: InsertDocumentTemplate = {
      templateId: uuidv4(),
      name: name,
      description: `AI-generated template for ${templateType} based on ${system.name}`,
      type: 'custom',
      content: contentResult.content,
      isDefault: false,
      isPublic: true,
      createdBy: 'ai',
      createdAt: new Date(),
      version: '1.0.0',
      tags: [templateType, system.riskLevel || 'unknown'],
      metadata: {
        generatedFor: system.systemId,
        generationType: 'ai',
        baseTemplateType: templateType
      }
    };
    
    // Insert into database
    const [insertedTemplate] = await db.insert(documentTemplates).values(newTemplate).returning();
    
    return {
      success: true,
      template: insertedTemplate,
      message: "Successfully created AI-generated template"
    };
  } catch (error) {
    console.error("Error creating AI-generated template:", error);
    return {
      success: false,
      message: `Failed to create template: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Enhance existing template with AI suggestions
 */
export async function enhanceExistingTemplate(templateId: string, system: AiSystem, assessment?: RiskAssessment) {
  try {
    // Get the existing template
    const [template] = await db.select().from(documentTemplates).where(eq(documentTemplates.templateId, templateId));
    
    if (!template) {
      return {
        success: false,
        message: "Template not found"
      };
    }
    
    // Generate enhancement suggestions
    const aiService = aiServices.getPrimaryService();
    if (!aiService) {
      return {
        success: false,
        message: "No AI service available"
      };
    }
    
    const systemInfo = JSON.stringify({
      name: system.name,
      description: system.description,
      purpose: system.purpose,
      riskLevel: assessment?.riskLevel || system.riskLevel,
      domain: system.domain
    });
    
    const prompt = `I have a document template titled "${template.name}" with the following content:
    
    ${template.content}
    
    Please suggest enhancements to make this template more comprehensive and aligned with EU AI Act requirements for this AI system:
    
    ${systemInfo}
    
    Provide your enhanced version of the template content while maintaining the existing structure.`;
    
    const response = await aiService.complete({
      messages: [
        { role: "system", content: "You are an expert in EU AI Act compliance documentation." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });
    
    if (response?.content) {
      // Extract enhanced content
      let enhancedContent = response.content;
      enhancedContent = enhancedContent.replace(/```markdown/g, '').replace(/```/g, '');
      
      // Create a new template based on the enhanced content
      const enhancedTemplateData: InsertDocumentTemplate = {
        templateId: uuidv4(),
        name: `${template.name} (Enhanced)`,
        description: `AI-enhanced version of template for ${system.name}`,
        type: 'custom',
        content: enhancedContent,
        isDefault: false,
        isPublic: true,
        createdBy: 'ai',
        createdAt: new Date(),
        version: `${template.version}-enhanced`,
        tags: [...(template.tags || []), 'enhanced'],
        metadata: {
          originalTemplateId: template.templateId,
          generatedFor: system.systemId,
          enhancementDate: new Date().toISOString()
        }
      };
      
      const [insertedTemplate] = await db.insert(documentTemplates).values(enhancedTemplateData).returning();
      
      return {
        success: true,
        originalTemplate: template,
        enhancedTemplate: insertedTemplate,
        message: "Successfully created AI-enhanced template"
      };
    } else {
      throw new Error("Empty AI response");
    }
  } catch (error) {
    console.error("Error enhancing template:", error);
    return {
      success: false,
      message: `Failed to enhance template: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}