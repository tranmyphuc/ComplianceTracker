/**
 * Script to add the AI Literacy Training Module to the database
 */
require('dotenv').config();
const { db } = require('./server/db');
const { trainingModules } = require('./shared/schema');
const { eq } = require('drizzle-orm');
const { aiLiteracyTrainingModule } = require('./server/modules/ai-literacy-training');

async function addAILiteracyModule() {
  try {
    console.log("Adding AI Literacy training module to database...");
    
    // Prepare the module data in the format expected by the database
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
    
    // Check if module already exists
    const existingModules = await db.select()
      .from(trainingModules)
      .where(eq(trainingModules.moduleId, moduleData.moduleId));
    
    if (existingModules.length > 0) {
      console.log(`Module ${moduleData.moduleId} already exists, updating...`);
      await db.update(trainingModules)
        .set({
          title: moduleData.title,
          description: moduleData.description,
          estimatedTime: moduleData.estimatedTime,
          topics: moduleData.topics,
          order: moduleData.order,
          roleRelevance: moduleData.roleRelevance,
          content: moduleData.content
        })
        .where(eq(trainingModules.moduleId, moduleData.moduleId));
    } else {
      console.log(`Adding new module: ${moduleData.moduleId}`);
      await db.insert(trainingModules)
        .values(moduleData);
    }
    
    console.log("AI Literacy module added successfully!");
  } catch (error) {
    console.error("Error adding AI Literacy module:", error);
  }
}

// Run the function
addAILiteracyModule()
  .then(() => {
    console.log("Script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });