/**
 * Script to add the AI Literacy Training Module to the database
 */
import fetch from 'node-fetch';
import { aiLiteracyTrainingModule } from './server/modules/ai-literacy-training.js';

async function addLiteracyModule() {
  try {
    console.log("Preparing AI Literacy module content...");
    
    // Prepare the module data in the format expected by the API
    const moduleData = {
      moduleId: aiLiteracyTrainingModule.id,
      title: aiLiteracyTrainingModule.title,
      description: aiLiteracyTrainingModule.description,
      estimatedTime: aiLiteracyTrainingModule.estimated_time,
      topics: aiLiteracyTrainingModule.topics,
      order: 10, // Set a high order to place it at the end of the list
      roleRelevance: aiLiteracyTrainingModule.role_relevance,
      content: aiLiteracyTrainingModule.content
    };
    
    console.log("Sending module data to API...");
    
    // Send the module data to the API
    const response = await fetch('http://localhost:5000/api/training/add-module', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(moduleData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log("AI Literacy module added successfully:", result);
    } else {
      console.error("Failed to add AI Literacy module:", result);
    }
  } catch (error) {
    console.error("Error adding AI Literacy module:", error);
  }
}

// Run the function
addLiteracyModule()
  .then(() => {
    console.log("Script completed");
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });