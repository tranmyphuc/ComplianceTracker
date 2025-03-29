/**
 * Enhanced Document Routes
 * Routes for generating and managing enhanced EU AI Act compliance documents
 */

import { Router, Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { handleApiError, ApiError } from '../utils/error-handler';
import { DocumentType, DocumentFormat } from '@shared/types';
import { marked } from 'marked';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// In-memory storage for generated documents (to be replaced with database)
let generatedDocuments: any[] = [];

// Directory for storing exported documents
const DOCUMENTS_DIR = path.join(process.cwd(), 'uploads', 'documents');

// Ensure documents directory exists
if (!fs.existsSync(DOCUMENTS_DIR)) {
  fs.mkdirSync(DOCUMENTS_DIR, { recursive: true });
}

/**
 * Generate sample document content based on template and input
 */
function generateDocumentContent(documentType: DocumentType, content: string, includeReferences: boolean): string {
  // Base document structure
  let markdownContent = '';
  
  // Add document header
  switch (documentType) {
    case DocumentType.TECHNICAL_DOCUMENTATION:
      markdownContent = `# Technical Documentation\n\n## Overview\n\n${content}\n\n`;
      markdownContent += `## Technical Specifications\n\nThe AI system implements the following technical specifications to ensure compliance with the EU AI Act:\n\n`;
      markdownContent += `- Neural network architecture optimized for interpretability\n`;
      markdownContent += `- Privacy-preserving data processing pipeline\n`;
      markdownContent += `- Continuous monitoring and performance metrics\n\n`;
      
      if (includeReferences) {
        markdownContent += `## Legal References\n\n`;
        markdownContent += `- **Article 10**: Technical documentation requirements specify that all aspects of the system must be documented.\n`;
        markdownContent += `- **Article 11**: Record-keeping obligations for high-risk AI systems.\n`;
      }
      break;
      
    case DocumentType.RISK_ASSESSMENT:
      markdownContent = `# Risk Assessment Report\n\n## Executive Summary\n\n${content}\n\n`;
      markdownContent += `## Risk Analysis\n\n`;
      markdownContent += `| Risk Category | Likelihood | Impact | Mitigation Measures |\n`;
      markdownContent += `|---------------|-----------|--------|---------------------|\n`;
      markdownContent += `| Fundamental Rights | Medium | High | Enhanced data protection practices |\n`;
      markdownContent += `| Safety | Low | High | Fail-safe mechanisms and human oversight |\n`;
      markdownContent += `| Bias & Discrimination | Medium | High | Regular bias audits and diverse training data |\n\n`;
      
      if (includeReferences) {
        markdownContent += `## Legal References\n\n`;
        markdownContent += `- **Article 9**: Risk management system requirements.\n`;
        markdownContent += `- **Article 16**: Obligations of providers of high-risk AI systems.\n`;
      }
      break;
      
    case DocumentType.CONFORMITY_DECLARATION:
      markdownContent = `# Declaration of Conformity\n\n## Declaration Statement\n\n`;
      markdownContent += `This declaration of conformity is issued under the sole responsibility of the provider. `;
      markdownContent += `The AI system described herein:\n\n${content}\n\n`;
      markdownContent += `Conforms to all relevant requirements of the European Union Artificial Intelligence Act.\n\n`;
      markdownContent += `## Conformity Assessment Procedure\n\n`;
      markdownContent += `- Conducted internal control assessment\n`;
      markdownContent += `- Verified system against harmonized standards\n`;
      markdownContent += `- Performed technical testing and validation\n\n`;
      
      if (includeReferences) {
        markdownContent += `## Legal References\n\n`;
        markdownContent += `- **Article 48**: EU declaration of conformity\n`;
        markdownContent += `- **Article 49**: CE marking of conformity\n`;
      }
      break;
      
    case DocumentType.HUMAN_OVERSIGHT_PROTOCOL:
      markdownContent = `# Human Oversight Protocol\n\n## Purpose\n\n`;
      markdownContent += `This protocol establishes guidelines for effective human oversight of the AI system:\n\n${content}\n\n`;
      markdownContent += `## Oversight Procedures\n\n`;
      markdownContent += `1. **Monitoring**: Continuous monitoring of system outputs by trained personnel\n`;
      markdownContent += `2. **Intervention**: Clear procedures for human intervention when necessary\n`;
      markdownContent += `3. **Escalation**: Defined escalation paths for detected issues\n`;
      markdownContent += `4. **Documentation**: Comprehensive logging of all oversight activities\n\n`;
      
      if (includeReferences) {
        markdownContent += `## Legal References\n\n`;
        markdownContent += `- **Article 14**: Human oversight requirements\n`;
        markdownContent += `- **Article 29**: Obligations of users of high-risk AI systems\n`;
      }
      break;
      
    case DocumentType.DATA_GOVERNANCE_POLICY:
      markdownContent = `# Data Governance Policy\n\n## Introduction\n\n`;
      markdownContent += `This policy outlines the data governance practices for the AI system:\n\n${content}\n\n`;
      markdownContent += `## Data Management Principles\n\n`;
      markdownContent += `- **Data Quality**: Procedures to ensure data accuracy and relevance\n`;
      markdownContent += `- **Data Privacy**: Measures to protect personal data in accordance with GDPR\n`;
      markdownContent += `- **Data Security**: Safeguards against unauthorized access and data breaches\n`;
      markdownContent += `- **Data Lifecycle**: Clear policies for data retention and deletion\n\n`;
      
      if (includeReferences) {
        markdownContent += `## Legal References\n\n`;
        markdownContent += `- **Article 10(2)**: Data governance requirements\n`;
        markdownContent += `- **Article 5**: Prohibited AI practices related to data usage\n`;
      }
      break;
      
    case DocumentType.INCIDENT_RESPONSE_PLAN:
      markdownContent = `# Incident Response Plan\n\n## Overview\n\n`;
      markdownContent += `This plan outlines procedures for responding to incidents involving the AI system:\n\n${content}\n\n`;
      markdownContent += `## Incident Response Process\n\n`;
      markdownContent += `1. **Detection**: Monitoring systems for early incident detection\n`;
      markdownContent += `2. **Assessment**: Procedures for evaluating incident severity and impact\n`;
      markdownContent += `3. **Containment**: Measures to limit the impact of incidents\n`;
      markdownContent += `4. **Remediation**: Steps to address and resolve incidents\n`;
      markdownContent += `5. **Reporting**: Guidelines for internal and external reporting\n\n`;
      
      if (includeReferences) {
        markdownContent += `## Legal References\n\n`;
        markdownContent += `- **Article 62**: Post-market monitoring system\n`;
        markdownContent += `- **Article 64**: Reporting of serious incidents and malfunctioning\n`;
      }
      break;
      
    default:
      markdownContent = `# ${documentType.replace(/_/g, ' ')}\n\n${content}`;
  }
  
  return markdownContent;
}

/**
 * Export document to the specified format
 */
async function exportDocument(content: string, format: DocumentFormat, filename: string): Promise<string> {
  const filePath = path.join(DOCUMENTS_DIR, filename);
  
  switch (format) {
    case DocumentFormat.PDF:
      // For this example, we'll just save the content as HTML with a PDF extension
      // In a real implementation, you would use a library like puppeteer or pdfkit
      const htmlContent = marked.parse(content);
      fs.writeFileSync(filePath, `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Exported Document</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1, h2, h3 { color: #333; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>`);
      break;
      
    case DocumentFormat.DOCX:
      // For this example, we'll just save the content as HTML with a DOCX extension
      // In a real implementation, you would use a library like docx
      fs.writeFileSync(filePath, marked.parse(content) as string);
      break;
      
    case DocumentFormat.HTML:
      fs.writeFileSync(filePath, marked.parse(content) as string);
      break;
      
    case DocumentFormat.MARKDOWN:
    default:
      fs.writeFileSync(filePath, content);
      break;
  }
  
  return filename;
}

/**
 * POST /api/enhanced-documents/generate
 * Generates an enhanced document with visualizations and references
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      documentType, 
      content, 
      includeVisualization = true, 
      includeReferences = true,
      format = DocumentFormat.PDF,
      systemId
    } = req.body;
    
    if (!title || !documentType || !content) {
      throw new ApiError('Missing required fields', 400);
    }
    
    // Generate document content based on template
    const generatedContent = generateDocumentContent(documentType, content, includeReferences);
    
    // Create document record
    const documentId = uuidv4();
    const newDocument = {
      id: documentId,
      title,
      documentType,
      content: generatedContent,
      format,
      createdAt: new Date().toISOString(),
      userId: 'anonymous', // In a real app would use req.session.userId
      systemId,
      includesVisualization: includeVisualization,
      includesReferences: includeReferences
    };
    
    // Store document (in-memory for now)
    generatedDocuments.push(newDocument);
    
    res.status(201).json(newDocument);
  } catch (error) {
    handleApiError(res, error, 'Failed to generate document');
  }
});

/**
 * POST /api/enhanced-documents/export
 * Exports an enhanced document to a file (PDF, DOCX, etc.)
 */
router.post('/export', async (req: Request, res: Response) => {
  try {
    const { id, format } = req.body;
    
    if (!id || !format) {
      throw new ApiError('Missing required fields', 400);
    }
    
    // Find document
    const document = generatedDocuments.find(doc => doc.id === id);
    
    if (!document) {
      throw new ApiError('Document not found', 404);
    }
    
    // Generate filename
    const filename = `${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().getTime()}.${format}`;
    
    // Export document to file
    await exportDocument(document.content, format, filename);
    
    res.status(200).json({
      id: document.id,
      filename,
      format,
      size: fs.statSync(path.join(DOCUMENTS_DIR, filename)).size,
      url: `/api/enhanced-documents/download/${filename}`
    });
  } catch (error) {
    handleApiError(res, error, 'Failed to export document');
  }
});

/**
 * GET /api/enhanced-documents/download/:filename
 * Download a generated document
 */
router.get('/download/:filename', (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(DOCUMENTS_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      throw new ApiError('File not found', 404);
    }
    
    res.download(filePath);
  } catch (error) {
    handleApiError(res, error, 'Failed to download document');
  }
});

/**
 * GET /api/enhanced-documents
 * Get list of generated documents
 */
router.get('/', (req: Request, res: Response) => {
  try {
    // Filter by user ID if authenticated (in a real app)
    let documents = generatedDocuments;
    
    // Note: In a real app with authentication, we would filter by user ID
    // if (req.session?.userId) {
    //   documents = documents.filter(doc => doc.userId === req.session.userId);
    // }
    
    res.status(200).json(documents);
  } catch (error) {
    handleApiError(res, error, 'Failed to retrieve documents');
  }
});

export const enhancedDocumentRoutes = router;