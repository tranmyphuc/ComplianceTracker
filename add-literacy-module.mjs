/**
 * Script to add the AI Literacy Training Module to the database
 * 
 * This script uses direct database insertion rather than API calls,
 * which helps avoid issues with the relative import paths.
 */
import postgres from 'postgres';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Create PostgreSQL client
const sql = postgres(process.env.DATABASE_URL);

// Read the AI Literacy training module content from file
async function addLiteracyModule() {
  try {
    console.log("Reading AI Literacy module content from file...");
    
    // Read the file directly since imports might be problematic
    const fileContent = fs.readFileSync('./server/modules/ai-literacy-training.ts', 'utf8');
    
    // Extract the module data using regex
    const moduleIdMatch = fileContent.match(/id: "(.*?)"/);
    const titleMatch = fileContent.match(/title: "(.*?)"/);
    const descriptionMatch = fileContent.match(/description: "(.*?)"/);
    const estimatedTimeMatch = fileContent.match(/estimated_time: "(.*?)"/);
    const topicsMatch = fileContent.match(/topics: \[(.*?)\]/s);
    const roleRelevanceMatch = fileContent.match(/role_relevance: \{(.*?)\}/s);
    const contentMatch = fileContent.match(/content: \{(.*?)$/s);
    
    if (!moduleIdMatch || !titleMatch || !descriptionMatch) {
      throw new Error("Could not extract required module data from file");
    }
    
    const moduleId = moduleIdMatch[1];
    const title = titleMatch[1];
    const description = descriptionMatch[1];
    const estimatedTime = estimatedTimeMatch ? estimatedTimeMatch[1] : "60-90 minutes";
    
    // Parse topics array
    let topics = ["AI Basics", "EU AI Act", "Risk Management", "Documentation"];
    if (topicsMatch) {
      const topicsStr = topicsMatch[1];
      topics = topicsStr.split(',')
        .map(t => t.trim())
        .filter(t => t.startsWith('"') && t.endsWith('"'))
        .map(t => t.slice(1, -1));
    }
    
    // Create basic role relevance
    let roleRelevance = {
      decision_maker: "High",
      developer: "High",
      operator: "Medium",
      user: "Medium"
    };
    
    // Extract actual content sections
    let moduleContent = {};
    
    // Find all sections in the content
    const sectionsMatches = fileContent.match(/title: "(.*?)",\s*content: `(.*?)`/gs);
    if (sectionsMatches) {
      const sections = sectionsMatches.map(match => {
        const titleMatch = match.match(/title: "(.*?)"/);
        const contentMatch = match.match(/content: `([\s\S]*?)`/);
        return {
          title: titleMatch ? titleMatch[1] : 'Untitled Section',
          content: contentMatch ? contentMatch[1] : ''
        };
      });
      
      // Find assessments
      const assessmentsMatch = fileContent.match(/assessments: \[([\s\S]*?)\]/);
      let assessments = [];
      
      if (assessmentsMatch) {
        // Extract individual assessment objects
        const assessmentRegex = /\{\s*question: "(.*?)",\s*options: \[(.*?)\],\s*correctAnswer: "(.*?)"\s*\}/gs;
        let assessmentMatch;
        while ((assessmentMatch = assessmentRegex.exec(assessmentsMatch[1])) !== null) {
          const options = assessmentMatch[2]
            .split(',')
            .map(opt => opt.trim())
            .filter(opt => opt.startsWith('"') && opt.endsWith('"'))
            .map(opt => opt.slice(1, -1));
          
          assessments.push({
            question: assessmentMatch[1],
            options: options,
            correctAnswer: assessmentMatch[3]
          });
        }
      }
      
      moduleContent = {
        default: {
          title: "AI Literacy and EU AI Act Compliance",
          sections: sections,
          assessments: assessments
        }
      };
    }
    
    // Prepare the module data
    const moduleData = {
      module_id: moduleId,
      title,
      description,
      estimated_time: estimatedTime,
      topics,
      order: 10, // Set a high order to place it at the end of the list
      role_relevance: roleRelevance,
      content: moduleContent
    };
    
    console.log("Checking if module already exists in database...");
    
    // Check if module already exists
    const existingModules = await sql`
      SELECT * FROM training_modules WHERE module_id = ${moduleId}
    `;
    
    if (existingModules.length > 0) {
      console.log(`Module ${moduleId} already exists, updating...`);
      await sql`
        UPDATE training_modules 
        SET 
          title = ${moduleData.title},
          description = ${moduleData.description},
          estimated_time = ${moduleData.estimated_time},
          topics = ${moduleData.topics},
          "order" = ${moduleData.order},
          role_relevance = ${moduleData.role_relevance},
          content = ${moduleData.content}
        WHERE module_id = ${moduleId}
      `;
    } else {
      console.log(`Adding new module: ${moduleId}`);
      await sql`
        INSERT INTO training_modules (
          module_id, title, description, estimated_time, 
          topics, "order", role_relevance, content
        ) 
        VALUES (
          ${moduleData.module_id},
          ${moduleData.title},
          ${moduleData.description},
          ${moduleData.estimated_time},
          ${moduleData.topics},
          ${moduleData.order},
          ${moduleData.role_relevance},
          ${moduleData.content}
        )
      `;
    }
    
    console.log("AI Literacy module added successfully!");
  } catch (error) {
    console.error("Error adding AI Literacy module:", error);
  } finally {
    // Close the database connection
    await sql.end();
  }
}

// Run the function
addLiteracyModule()
  .then(() => {
    console.log("Script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });