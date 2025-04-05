/**
 * Document Templates API Routes
 * 
 * Handles CRUD operations for document templates, including
 * template customization and generation.
 */

import { Router, Request, Response } from 'express';
import { db } from '../db';
import { eq, desc, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { documentTemplates, insertDocumentTemplateSchema } from '@shared/schema';
import { DocumentTemplateData, DocumentTemplateType, TemplateCustomizationRequest, TemplateGenerationOptions } from '@shared/types';
import { generateDocumentTemplate, documentTypeToString } from '../document-generator';
// TODO: Implement proper auth utils
const getAuthenticatedUser = async (req: Request) => {
  // Mock implementation for now
  return { uid: req.headers['x-user-id'] as string || 'system' };
};

// Error handling utility function
const handleError = (res: Response, err: any, message?: string) => {
  console.error(message || 'An error occurred:', err);
  
  if (err?.errors) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors
    });
  }
  
  return res.status(500).json({ 
    success: false, 
    message: message || "Internal server error" 
  });
};

const router = Router();

/**
 * GET /api/document-templates
 * Get all document templates
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type, isPublic } = req.query;
    
    let templates;
    
    // Build query based on filters
    if (type && isPublic) {
      templates = await db
        .select()
        .from(documentTemplates)
        .where(
          and(
            eq(documentTemplates.type, type as string),
            eq(documentTemplates.isPublic, isPublic === 'true')
          )
        )
        .orderBy(desc(documentTemplates.createdAt));
    } else if (type) {
      templates = await db
        .select()
        .from(documentTemplates)
        .where(eq(documentTemplates.type, type as string))
        .orderBy(desc(documentTemplates.createdAt));
    } else if (isPublic) {
      templates = await db
        .select()
        .from(documentTemplates)
        .where(eq(documentTemplates.isPublic, isPublic === 'true'))
        .orderBy(desc(documentTemplates.createdAt));
    } else {
      templates = await db
        .select()
        .from(documentTemplates)
        .orderBy(desc(documentTemplates.createdAt));
    }
    
    res.json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Error retrieving templates:', error);
    handleError(res, error);
  }
});

/**
 * GET /api/document-templates/:id
 * Get a specific template by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [template] = await db
      .select()
      .from(documentTemplates)
      .where(eq(documentTemplates.templateId, id));
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found"
      });
    }
    
    res.json({
      success: true,
      template
    });
  } catch (error) {
    console.error('Error retrieving template:', error);
    handleError(res, error);
  }
});

/**
 * POST /api/document-templates
 * Create a new document template
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const user = await getAuthenticatedUser(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    
    const templateData = req.body;
    
    // Validate template data
    const validatedData = insertDocumentTemplateSchema.parse({
      ...templateData,
      templateId: uuidv4(),
      createdBy: user.uid
    });
    
    // Insert the template
    const [createdTemplate] = await db
      .insert(documentTemplates)
      .values(validatedData)
      .returning();
    
    res.status(201).json({
      success: true,
      template: createdTemplate
    });
  } catch (error) {
    console.error('Error creating template:', error);
    handleError(res, error);
  }
});

/**
 * PUT /api/document-templates/:id
 * Update an existing template
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getAuthenticatedUser(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    
    // Check if template exists
    const [existingTemplate] = await db
      .select()
      .from(documentTemplates)
      .where(eq(documentTemplates.templateId, id));
    
    if (!existingTemplate) {
      return res.status(404).json({
        success: false,
        message: "Template not found"
      });
    }
    
    // Check if user has permission to update
    if (existingTemplate.createdBy !== user.uid && !existingTemplate.isPublic) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this template"
      });
    }
    
    // Update the template
    const [updatedTemplate] = await db
      .update(documentTemplates)
      .set({
        ...req.body,
        updatedAt: new Date()
      })
      .where(eq(documentTemplates.templateId, id))
      .returning();
    
    res.json({
      success: true,
      template: updatedTemplate
    });
  } catch (error) {
    console.error('Error updating template:', error);
    handleError(res, error);
  }
});

/**
 * DELETE /api/document-templates/:id
 * Delete a template
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getAuthenticatedUser(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    
    // Check if template exists
    const [existingTemplate] = await db
      .select()
      .from(documentTemplates)
      .where(eq(documentTemplates.templateId, id));
    
    if (!existingTemplate) {
      return res.status(404).json({
        success: false,
        message: "Template not found"
      });
    }
    
    // Check if user has permission to delete (only creator can delete)
    if (existingTemplate.createdBy !== user.uid) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this template"
      });
    }
    
    // Delete the template
    await db
      .delete(documentTemplates)
      .where(eq(documentTemplates.templateId, id));
    
    res.json({
      success: true,
      message: "Template deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    handleError(res, error);
  }
});

/**
 * POST /api/document-templates/customize
 * Create a customized template based on an existing one
 */
router.post('/customize', async (req: Request, res: Response) => {
  try {
    const user = await getAuthenticatedUser(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    
    const customizationRequest = req.body as TemplateCustomizationRequest;
    
    // Check if base template exists (if templateId is provided)
    if (customizationRequest.templateId) {
      const [baseTemplate] = await db
        .select()
        .from(documentTemplates)
        .where(eq(documentTemplates.templateId, customizationRequest.templateId));
      
      if (!baseTemplate) {
        return res.status(404).json({
          success: false,
          message: "Base template not found"
        });
      }
    }
    
    // Create a new customized template
    const [customizedTemplate] = await db
      .insert(documentTemplates)
      .values({
        templateId: uuidv4(),
        name: customizationRequest.name,
        description: customizationRequest.description || 'Custom template',
        type: (customizationRequest.metadata?.type as DocumentTemplateType) || DocumentTemplateType.CUSTOM,
        content: customizationRequest.content,
        isDefault: false,
        isPublic: customizationRequest.isPublic !== undefined ? customizationRequest.isPublic : false,
        createdBy: user.uid,
        version: '1.0',
        // Tags will be handled by Drizzle ORM
        tags: customizationRequest.tags || [],
        metadata: customizationRequest.metadata || {}
      })
      .returning();
    
    res.status(201).json({
      success: true,
      template: customizedTemplate
    });
  } catch (error) {
    console.error('Error customizing template:', error);
    handleError(res, error);
  }
});

/**
 * POST /api/document-templates/generate
 * Generate a template based on type and options
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { type, options } = req.body;
    const user = await getAuthenticatedUser(req);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    
    if (!type || !Object.values(DocumentTemplateType).includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Valid template type is required"
      });
    }
    
    // Generate template content
    const templateContent = generateDocumentTemplate(type, options);
    
    // Create template name based on type
    const templateName = documentTypeToString(type as DocumentTemplateType);
    
    // Return the generated template without saving
    res.json({
      success: true,
      template: {
        name: templateName,
        type,
        content: templateContent,
        options
      }
    });
  } catch (error) {
    console.error('Error generating template:', error);
    handleError(res, error);
  }
});

export { router as documentTemplatesRoutes };