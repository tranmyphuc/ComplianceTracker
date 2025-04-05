import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL for API requests
const BASE_URL = 'http://localhost:5000';

// Create an uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory at: ${uploadsDir}`);
}

// Function to create a custom document template
async function createTemplate() {
  try {
    console.log('Creating custom document template...');
    
    const templateData = {
      name: 'EU AI Act High-Risk System Checklist',
      type: 'custom',
      description: 'Checklist for assessing high-risk AI systems compliance with EU AI Act',
      version: '1.0.0',
      content: `# EU AI Act Compliance Checklist for [SYSTEM_NAME]

## System Information
- **System Name:** [SYSTEM_NAME]
- **Version:** [VERSION]
- **Risk Classification:** [RISK_LEVEL]
- **Assessment Date:** [DATE]

## Required Compliance Activities

### Risk Management (Article 9)
- [ ] Established continuous risk management process
- [ ] Identified and analyzed known and foreseeable risks
- [ ] Estimated and evaluated risks from intended use
- [ ] Evaluated risks from reasonably foreseeable misuse

### Data Governance (Article 10)
- [ ] Implemented data governance and management practices
- [ ] Identified relevance of training, validation, and testing data
- [ ] Examined data for biases
- [ ] Identified data gaps or shortcomings

### Technical Documentation (Article 11)
- [ ] Created and maintained up-to-date technical documentation
- [ ] Documentation demonstrates compliance with AI Act
- [ ] Documentation enables assessment by conformity assessment bodies
- [ ] Documentation is proportionate to the nature of the AI system

### Record-Keeping (Article 12)
- [ ] Automatic recording of events while system operates
- [ ] Logging capabilities designed into system
- [ ] Records enable monitoring of system operation
- [ ] Records kept in accordance with legal obligations

### Transparency (Article 13)
- [ ] System operation is sufficiently transparent
- [ ] Users can interpret system output
- [ ] Instructions for use are provided
- [ ] Clear specification of purpose and limitations

### Human Oversight (Article 14)
- [ ] Human oversight measures built into system
- [ ] Full understanding by overseers of system capabilities
- [ ] Ability to override automated decisions
- [ ] Ability to decide not to use the system

### Accuracy, Robustness, Cybersecurity (Article 15)
- [ ] Appropriate levels of accuracy for intended purpose
- [ ] Resilient against third party attempts to manipulate
- [ ] Protected against vulnerabilities
- [ ] Failback plans and fallback solutions in place

## Improvement Actions
[IMPROVEMENT_ACTIONS]

## Declaration
This checklist was completed by: [ASSESSOR_NAME]
Organization: [ORGANIZATION]
Date: [ASSESSMENT_DATE]
`,
      isPublic: true,
    };
    
    const response = await axios.post(`${BASE_URL}/api/document-templates`, templateData);
    
    console.log('Template created successfully:', response.data);
    return response.data.template;
  } catch (error) {
    console.error('Error creating template:', error.response?.data || error.message);
    throw error;
  }
}

// Function to generate a document from the template
async function generateDocument(templateId) {
  try {
    console.log(`Generating document from template ${templateId}...`);
    
    // Variables to replace in the template
    const variables = {
      SYSTEM_NAME: 'ChatAssist AI Assistant',
      VERSION: '2.5.0',
      RISK_LEVEL: 'High-Risk',
      DATE: new Date().toLocaleDateString(),
      ASSESSOR_NAME: 'Jane Smith',
      ORGANIZATION: 'SGH Global',
      ASSESSMENT_DATE: new Date().toLocaleDateString(),
      IMPROVEMENT_ACTIONS: '1. Update data governance documentation\n2. Improve monitoring capabilities\n3. Enhance transparency measures',
    };
    
    const generateData = {
      templateId,
      variables,
      format: 'pdf',
      systemName: 'ChatAssist AI Assistant'
    };
    
    const response = await axios.post(`${BASE_URL}/api/document-generation/from-template`, generateData);
    
    console.log('Document generated successfully:', response.data);
    return response.data.document;
  } catch (error) {
    console.error('Error generating document:', error.response?.data || error.message);
    throw error;
  }
}

// Function to generate a document in a specific format
async function generateDocumentWithFormat(templateId, format) {
  try {
    console.log(`Generating ${format} document from template ${templateId}...`);
    
    // Variables to replace in the template
    const variables = {
      SYSTEM_NAME: 'ChatAssist AI Assistant',
      VERSION: '2.5.0',
      RISK_LEVEL: 'High-Risk',
      DATE: new Date().toLocaleDateString(),
      ASSESSOR_NAME: 'Jane Smith',
      ORGANIZATION: 'SGH Global',
      ASSESSMENT_DATE: new Date().toLocaleDateString(),
      IMPROVEMENT_ACTIONS: '1. Update data governance documentation\n2. Improve monitoring capabilities\n3. Enhance transparency measures',
    };
    
    const generateData = {
      templateId,
      variables,
      format,
      systemName: 'ChatAssist AI Assistant'
    };
    
    const response = await axios.post(`${BASE_URL}/api/document-generation/from-template`, generateData);
    
    console.log(`${format.toUpperCase()} document generated successfully:`, response.data);
    return response.data.document;
  } catch (error) {
    console.error(`Error generating ${format} document:`, error.response?.data || error.message);
    throw error;
  }
}

// Main function to run the test
async function runTest() {
  try {
    // Step 1: Create a template
    const template = await createTemplate();
    
    if (template) {
      // Step 2: Generate documents in different formats
      const pdfDocument = await generateDocumentWithFormat(template.templateId, 'pdf');
      const htmlDocument = await generateDocumentWithFormat(template.templateId, 'html');
      const markdownDocument = await generateDocumentWithFormat(template.templateId, 'markdown');
      
      // Display results
      console.log("\nGenerated Documents:");
      if (pdfDocument) {
        console.log(`PDF document: ${pdfDocument.url}`);
      }
      if (htmlDocument) {
        console.log(`HTML document: ${htmlDocument.url}`);
      }
      if (markdownDocument) {
        console.log(`Markdown document: ${markdownDocument.url}`);
      }
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
runTest();