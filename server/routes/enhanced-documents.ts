import express, { Request, Response } from 'express';
import { generateEnhancedDocument, DocumentFormat } from '../enhanced-document-generator';
import { DocumentType } from '../../shared/types';
import { handleError } from '../utils/error-handler';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { marked } from 'marked';

const router = express.Router();

/**
 * POST /api/enhanced-documents/generate
 * Generates an enhanced document with visualizations and references
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { system, documentType, companyName, additionalDetails, format } = req.body;
    
    if (!system || !documentType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: system and documentType'
      });
    }
    
    console.log(`Generating enhanced ${documentType} document for system: ${system.name}`);
    
    // Generate enhanced document
    const document = await generateEnhancedDocument({
      system,
      documentType: documentType as DocumentType,
      companyName: companyName || 'Your Company',
      additionalDetails,
      format: format || DocumentFormat.MARKDOWN
    });
    
    res.json({
      success: true,
      document
    });
  } catch (error) {
    console.error('Error generating enhanced document:', error);
    handleError(res, error as Error);
  }
});

/**
 * POST /api/enhanced-documents/export
 * Exports an enhanced document to a file (PDF, DOCX, etc.)
 */
router.post('/export', async (req: Request, res: Response) => {
  try {
    const { document, format, filename } = req.body;
    
    if (!document || !format) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: document and format'
      });
    }
    
    // Create a unique filename if not provided
    const documentId = uuidv4();
    const safeFilename = (filename || `document-${documentId}`).replace(/[^a-z0-9\-_]/gi, '_');
    
    // Process document based on requested format
    let outputPath;
    let mimeType;
    
    switch (format) {
      case 'html':
        // Convert markdown to HTML
        const htmlContent = marked(document.text);
        outputPath = path.join('uploads', 'documents', `${safeFilename}.html`);
        
        // Ensure directory exists
        const directory = path.dirname(outputPath);
        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory, { recursive: true });
        }
        
        // Add basic styling and visualization placeholders
        const styledHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${safeFilename}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
              h1 { color: #333; }
              h2 { color: #444; border-bottom: 1px solid #eee; padding-bottom: 5px; }
              .metadata { background: #f7f7f7; padding: 15px; border-radius: 4px; margin-bottom: 20px; font-size: 0.9em; }
              .reference { margin-bottom: 10px; }
              .reference-title { font-weight: bold; }
              .visualization-placeholder { 
                border: 1px dashed #ccc; 
                padding: 20px; 
                text-align: center;
                margin: 20px 0;
                background: #f9f9f9;
              }
            </style>
          </head>
          <body>
            <div class="metadata">
              <p><strong>Document:</strong> ${document.metadata.documentType}</p>
              <p><strong>Generated:</strong> ${new Date(document.metadata.generatedAt).toLocaleString()}</p>
              <p><strong>System:</strong> ${document.metadata.systemId}</p>
              <p><strong>Risk Level:</strong> ${document.metadata.systemRiskLevel}</p>
            </div>
            
            ${htmlContent}
            
            <h2>References</h2>
            <div class="references">
              ${document.references.map(ref => `
                <div class="reference">
                  <div class="reference-title">Article ${ref.articleId}: ${ref.title}</div>
                  <div>${ref.relevance}</div>
                </div>
              `).join('')}
            </div>
            
            <h2>Visualizations</h2>
            ${document.visualizations?.map(viz => `
              <div class="visualization-placeholder">
                <h3>${viz.title}</h3>
                <p>${viz.description}</p>
                <p>Visualization available in the interactive version</p>
              </div>
            `).join('') || '<p>No visualizations available</p>'}
          </body>
          </html>
        `;
        
        fs.writeFileSync(outputPath, styledHtml);
        mimeType = 'text/html';
        break;
        
      case 'markdown':
      default:
        // Save as markdown
        outputPath = path.join('uploads', 'documents', `${safeFilename}.md`);
        
        // Ensure directory exists
        const mdDirectory = path.dirname(outputPath);
        if (!fs.existsSync(mdDirectory)) {
          fs.mkdirSync(mdDirectory, { recursive: true });
        }
        
        // Add metadata and references to markdown
        const metadataSection = `
# ${document.metadata.documentType}

> Generated: ${new Date(document.metadata.generatedAt).toLocaleString()}  
> System: ${document.metadata.systemId}  
> Risk Level: ${document.metadata.systemRiskLevel}  
> Version: ${document.metadata.version}

---

`;
        
        const referencesSection = `
## References

${document.references.map(ref => `
### Article ${ref.articleId}: ${ref.title}
${ref.relevance}
${ref.excerpt ? `\n${ref.excerpt}` : ''}
`).join('\n')}

`;
        
        const visualizationsSection = document.visualizations?.length ? `
## Visualizations

${document.visualizations.map(viz => `
### ${viz.title}
${viz.description}

_Visualization available in the interactive version_
`).join('\n')}
` : '';
        
        const enhancedMarkdown = metadataSection + document.text + referencesSection + visualizationsSection;
        
        fs.writeFileSync(outputPath, enhancedMarkdown);
        mimeType = 'text/markdown';
        break;
    }
    
    // Return file path and details
    res.json({
      success: true,
      file: {
        path: outputPath,
        filename: path.basename(outputPath),
        mimeType,
        format
      }
    });
  } catch (error) {
    console.error('Error exporting document:', error);
    handleError(res, error as Error);
  }
});

/**
 * GET /api/enhanced-documents/download/:filename
 * Download a generated document
 */
router.get('/download/:filename', (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    
    // Security check - prevent path traversal
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join('uploads', 'documents', sanitizedFilename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // Determine MIME type based on extension
    const ext = path.extname(sanitizedFilename).toLowerCase();
    let mimeType = 'application/octet-stream';
    
    switch (ext) {
      case '.md':
        mimeType = 'text/markdown';
        break;
      case '.html':
        mimeType = 'text/html';
        break;
      case '.pdf':
        mimeType = 'application/pdf';
        break;
      case '.docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
    }
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename=${sanitizedFilename}`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error downloading document:', error);
    handleError(res, error as Error);
  }
});

export const enhancedDocumentRoutes = router;