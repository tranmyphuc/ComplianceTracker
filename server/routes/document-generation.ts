/**
 * API routes for document auto-generation
 */
import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { marked } from 'marked';
import PDFDocument from 'pdfkit';
import { storage } from '../storage';
// Importing error handling functions
import { AppError } from "../error-handling";
import { 
  DocumentType,
  generateDocument,
  generateDocumentTemplate
} from '../document-generator';

const router = Router();

export enum DocumentFormat {
  PDF = 'pdf',
  MARKDOWN = 'markdown',
  HTML = 'html'
}

/**
 * POST /api/document-generation/generate
 * Generate document based on system and assessment data
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { 
      systemId, 
      documentType,
      format = DocumentFormat.PDF,
      assessmentId = null,
      includeArticles = true
    } = req.body;
    
    if (!systemId || !documentType) {
      return res.status(400).json({ 
        success: false, 
        message: "System ID and document type are required" 
      });
    }
    
    // Get system data
    const system = await storage.getAiSystem(systemId);
    if (!system) {
      return res.status(404).json({ 
        success: false, 
        message: "System not found" 
      });
    }
    
    // Get assessment data if provided
    let assessment = null;
    if (assessmentId) {
      assessment = await storage.getRiskAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: "Risk assessment not found"
        });
      }
    } else {
      // Get most recent assessment if available
      const assessments = await storage.getRiskAssessmentsForSystem(systemId);
      if (assessments && assessments.length > 0) {
        // Sort by date descending
        assessments.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        assessment = assessments[0];
      }
    }
    
    // Get relevant articles if including them
    let relevantArticles = [];
    if (includeArticles && system.riskLevel) {
      try {
        // Get article numbers based on risk level
        const articleNumbers = getRiskLevelArticles(system.riskLevel);
        // Fetch the actual article content - getting articles one by one since there's no bulk method
        for (const articleNumber of articleNumbers) {
          try {
            const article = await storage.getEuAiActArticle(articleNumber.toString());
            if (article) {
              relevantArticles.push(article);
            }
          } catch (articleError) {
            console.error(`Error fetching article ${articleNumber}:`, articleError);
          }
        }
      } catch (error) {
        console.error("Error fetching relevant articles:", error);
      }
    }
    
    // Get evidence documents related to this system
    let evidenceDocuments = [];
    try {
      // Use document_files table to get documents for this system
      evidenceDocuments = await storage.getDocumentFilesBySystem(system.id.toString());
    } catch (error) {
      console.error("Error fetching evidence documents:", error);
    }
    
    // Generate document content
    const companyName = req.body.companyName || "SGH Group";
    const generatedContent = await generateDocument(
      documentType as DocumentType,
      system,
      assessment,
      {
        companyName,
        includeArticles,
        relevantArticles,
        evidenceDocuments
      }
    );
    
    // Generate title for the document
    const title = generateDocumentTitle(documentType as DocumentType, system.name);
    
    // Create unique filename
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const filename = `${documentType}_${system.systemId || 'system'}_${timestamp}`;
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Format and store document in requested format
    const filePath = await formatAndStoreDocument(
      generatedContent,
      path.join(uploadsDir, filename),
      format,
      title
    );
    
    // Store document reference in the database
    const newDocument = await storage.createDocumentFile({
      name: title,
      documentId: `doc-${Date.now()}`,
      fileName: path.basename(filePath),
      path: filePath,
      url: `/uploads/${path.basename(filePath)}`,
      type: format as string,
      size: fs.statSync(filePath).size,
      systemId: system.id.toString(),
      assessmentId: assessment?.id ? assessment.id.toString() : null,
      description: `${documentType} for ${system.name}`,
      // Store additional metadata as category
      category: JSON.stringify({
        generationDate: new Date(),
        generationType: 'auto',
        format: format,
        systemRiskLevel: system.riskLevel,
        includesArticles: includeArticles,
        articleCount: relevantArticles.length
      })
    });
    
    res.json({
      success: true,
      document: {
        id: newDocument.id,
        title: newDocument.name,
        filename: newDocument.fileName,
        filepath: newDocument.path,
        format: newDocument.type,
        url: `/uploads/${newDocument.fileName}`,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error generating document:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate document",
      error: error.message
    });
  }
});

/**
 * GET /api/document-generation/preview/:id
 * Get a document preview (HTML format)
 */
router.get('/preview/:id', async (req: Request, res: Response) => {
  try {
    const documentId = req.params.id;
    const document = await storage.getDocumentFileById(documentId);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }
    
    // Check if file exists
    if (!fs.existsSync(document.path)) {
      return res.status(404).json({
        success: false,
        message: "Document file not found"
      });
    }
    
    // Read the file content
    const fileContent = fs.readFileSync(document.path, 'utf8');
    
    // Convert to HTML if it's markdown
    let htmlContent = fileContent;
    if (document.type === DocumentFormat.MARKDOWN) {
      htmlContent = convertMarkdownToHTML(fileContent);
    }
    
    res.json({
      success: true,
      document: {
        id: document.id,
        title: document.name,
        content: htmlContent,
        format: document.type
      }
    });
  } catch (error) {
    console.error('Error retrieving document preview:', error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve document preview",
      error: error.message
    });
  }
});

/**
 * GET /api/document-generation/templates
 * Get available document templates
 */
router.get('/templates', (_req: Request, res: Response) => {
  try {
    const templates = [
      { id: 'technical_documentation', name: 'Technical Documentation', description: 'Detailed technical specifications and architecture.' },
      { id: 'risk_assessment_report', name: 'Risk Assessment Report', description: 'Comprehensive risk analysis with mitigation measures.' },
      { id: 'compliance_report', name: 'Compliance Report', description: 'EU AI Act compliance status and requirements.' },
      { id: 'executive_summary', name: 'Executive Summary', description: 'High-level overview for management and stakeholders.' },
      { id: 'data_governance', name: 'Data Governance Documentation', description: 'Data sources, processing, and management practices.' }
    ];
    
    res.json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Error retrieving templates:', error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve document templates",
      error: error.message
    });
  }
});

/**
 * Generate a title for the document
 */
function generateDocumentTitle(documentType: DocumentType, systemName: string): string {
  const titles = {
    [DocumentType.TECHNICAL_DOCUMENTATION]: `Technical Documentation - ${systemName}`,
    [DocumentType.RISK_ASSESSMENT]: `Risk Assessment Report - ${systemName}`,
    [DocumentType.COMPLIANCE_REPORT]: `Compliance Report - ${systemName}`,
    [DocumentType.DATA_GOVERNANCE]: `Data Governance Documentation - ${systemName}`,
    [DocumentType.EXECUTIVE_SUMMARY]: `Executive Summary - ${systemName}`,
    [DocumentType.CONFORMITY_DECLARATION]: `Declaration of Conformity - ${systemName}`,
    [DocumentType.PRODUCT_INSTRUCTIONS]: `User Instructions - ${systemName}`
  };
  
  return titles[documentType] || `${documentType} - ${systemName}`;
}

/**
 * Format and store document in requested format
 */
async function formatAndStoreDocument(
  content: string,
  baseFilepath: string,
  format: DocumentFormat,
  title: string
): Promise<string> {
  let filepath;
  
  switch (format) {
    case DocumentFormat.PDF:
      filepath = `${baseFilepath}.pdf`;
      await generatePDF(content, filepath, title);
      break;
      
    case DocumentFormat.HTML:
      filepath = `${baseFilepath}.html`;
      await generateHTML(content, filepath, title);
      break;
      
    case DocumentFormat.MARKDOWN:
    default:
      filepath = `${baseFilepath}.md`;
      fs.writeFileSync(filepath, content);
      break;
  }
  
  return filepath;
}

/**
 * Generate PDF document
 */
async function generatePDF(content: string, filepath: string, title: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Convert markdown to HTML
      const htmlContent = convertMarkdownToHTML(content);
      
      // Create a new PDF document
      const doc = new PDFDocument({ 
        margins: { top: 50, bottom: 50, left: 72, right: 72 },
        info: {
          Title: title,
          Author: 'SGH Group EU AI Act Compliance Platform',
          Subject: 'AI System Documentation',
          Keywords: 'EU AI Act, compliance, documentation, AI system'
        }
      });
      
      // Pipe the PDF to a file
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);
      
      // Add title
      doc.fontSize(24).text(title, { align: 'center' });
      doc.moveDown(2);
      
      // Add generation date
      doc.fontSize(12)
        .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(2);
      
      // Add content
      // This is a simple implementation that just adds the text
      // A more sophisticated version would properly render HTML with styles
      doc.fontSize(12).text(htmlContent.replace(/<[^>]*>/g, ''));
      
      // Finalize the PDF and end the stream
      doc.end();
      
      stream.on('finish', () => {
        resolve();
      });
      
      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate HTML document
 */
async function generateHTML(content: string, filepath: string, title: string): Promise<void> {
  const htmlContent = convertMarkdownToHTML(content);
  
  const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      text-align: center;
      color: #333;
    }
    .generation-date {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
    }
    th {
      background-color: #f2f2f2;
    }
    code {
      background-color: #f5f5f5;
      padding: 2px 4px;
      border-radius: 4px;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 15px;
      color: #666;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="generation-date">Generated on: ${new Date().toLocaleDateString()}</div>
  <div class="content">
    ${htmlContent}
  </div>
</body>
</html>
  `;
  
  fs.writeFileSync(filepath, fullHtml);
}

/**
 * Convert markdown to HTML
 */
function convertMarkdownToHTML(markdown: string): string {
  return marked(markdown);
}

/**
 * Get relevant EU AI Act articles based on risk level
 */
function getRiskLevelArticles(riskLevel: string): number[] {
  // Normalize risk level for comparison
  const normalizedRiskLevel = riskLevel.toLowerCase();
  
  if (normalizedRiskLevel.includes('high')) {
    // High-risk systems have the most requirements
    return [6, 9, 10, 11, 12, 13, 14, 15, 16, 17, 29];
  } else if (normalizedRiskLevel.includes('limited')) {
    // Limited risk systems have transparency obligations
    return [5, 52];
  } else if (normalizedRiskLevel.includes('minimal')) {
    // Minimal risk systems have few requirements
    return [5];
  } else if (normalizedRiskLevel.includes('unacceptable')) {
    // Unacceptable risk systems are prohibited
    return [5];
  }
  
  // Default - return general articles
  return [5, 6, 52];
}

export { router as documentGenerationRoutes };