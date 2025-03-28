import express from 'express';
import { storage } from "../storage";
import multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  uploadDocumentSchema,
  getDocumentsSchema,
  deleteDocumentSchema
} from '@shared/schemas/document';

const router = express.Router();

// Configure storage location and file naming
const uploadsDir = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file storage
const storage_config = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename to prevent collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// File filter to validate uploads
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept all file types for now
  // You can add restrictions based on MIME type if needed
  cb(null, true);
};

// Create the multer upload instance
const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter
});

// POST /api/documents - Upload new document(s)
router.post('/', upload.array('files', 10), async (req, res) => {
  try {
    // Validate request
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded.'
      });
    }

    const { assessmentId, systemId, category = 'general' } = req.body;
    
    // Track successful uploads
    const uploadedFiles = [];
    
    // Process each uploaded file
    for (const file of req.files as Express.Multer.File[]) {
      // Generate document ID
      const documentId = uuidv4();
      
      // Create document record
      const document = {
        documentId,
        name: file.originalname,
        fileName: file.filename,
        path: file.path,
        url: `/uploads/${file.filename}`,
        type: file.mimetype,
        size: file.size,
        category,
        assessmentId: assessmentId || null,
        systemId: systemId || null,
        uploadedBy: req.body.userId || 'anonymous', // Changed from req.user?.uid to req.body.userId
        description: req.body.description || null,
        uploadedAt: new Date()
      };
      
      // Save to database
      const savedDoc = await storage.createDocumentFile(document);
      uploadedFiles.push({
        id: savedDoc.documentId,
        name: savedDoc.name,
        url: savedDoc.url,
        type: savedDoc.type
      });
    }
    
    // Send response
    return res.status(201).json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully.`,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading documents:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload documents.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/documents - Get documents
router.get('/', async (req, res) => {
  try {
    // Get parameters
    const { assessmentId, systemId, category } = req.query;
    
    // Fetch documents based on provided filters
    let docs: any[] = [];
    
    if (assessmentId) {
      docs = await storage.getDocumentFilesByAssessment(assessmentId as string);
    } else if (systemId) {
      docs = await storage.getDocumentFilesBySystem(systemId as string);
    } else {
      // TODO: Implement a method to get all documents or paginated results
      return res.status(400).json({
        success: false,
        message: 'Please provide assessmentId or systemId to filter documents.'
      });
    }
    
    // Filter by category if specified
    if (category) {
      docs = docs.filter(doc => doc.category === category);
    }
    
    // Format response
    const formattedDocs = docs.map(doc => ({
      id: doc.documentId,
      name: doc.name,
      url: doc.url,
      type: doc.type,
      size: doc.size,
      category: doc.category,
      uploadedAt: doc.uploadedAt,
      description: doc.description
    }));
    
    return res.status(200).json({
      success: true,
      count: formattedDocs.length,
      documents: formattedDocs
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch documents.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/documents/:id - Get a specific document
router.get('/:id', async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await storage.getDocumentFileById(documentId);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.'
      });
    }
    
    return res.status(200).json({
      success: true,
      document: {
        id: document.documentId,
        name: document.name,
        url: document.url,
        type: document.type,
        size: document.size,
        category: document.category,
        uploadedAt: document.uploadedAt,
        description: document.description
      }
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch document.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/documents/:id - Delete a document
router.delete('/:id', async (req, res) => {
  try {
    const documentId = req.params.id;
    
    // Get document to find file path before deletion
    const document = await storage.getDocumentFileById(documentId);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found.'
      });
    }
    
    // Delete from database
    const result = await storage.deleteDocumentFile(documentId);
    
    if (result) {
      // Delete file from disk
      try {
        fs.unlinkSync(document.path);
      } catch (fileError) {
        console.warn(`Failed to delete file from disk: ${document.path}`);
        // Continue with response even if file deletion fails
      }
      
      return res.status(200).json({
        success: true,
        message: 'Document deleted successfully.'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete document.'
      });
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete document.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export const documentRoutes = router;