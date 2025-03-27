/**
 * Script to seed training modules with content for each role
 */
const { db } = require('./server/db');
const { trainingModules } = require('./shared/schema');

// Sample module content for different roles
const moduleContents = [
  {
    module_id: 'eu-ai-act-intro',
    title: 'EU AI Act Introduction',
    description: 'Introduction to the EU AI Act, its scope, and key provisions',
    content: {
      technical: {
        slides: [
          {
            title: 'Technical Overview',
            content: '<p>The EU AI Act creates a comprehensive regulatory framework that will impact how technical teams develop and deploy AI systems. This module covers the key technical implications.</p>',
            pathRelevance: {
              decision_maker: "Medium - Understanding the technical requirements is helpful but not your primary concern",
              developer: "High - These requirements directly impact your development practices",
              operator: "High - You'll need to ensure systems maintain compliance during operation",
              legal: "Medium - Technical details help you understand implementation challenges"
            }
          },
          {
            title: 'Technical Compliance Requirements',
            content: '<p>High-risk AI systems require implementation of:</p><ul><li>Risk management systems</li><li>Data quality controls</li><li>Technical documentation</li><li>Record-keeping capabilities</li><li>Transparency mechanisms</li><li>Human oversight interfaces</li><li>Accuracy, robustness and cybersecurity measures</li></ul>',
            quiz: {
              question: "Which technical requirement is NOT mandated by the EU AI Act for high-risk AI systems?",
              options: [
                "Risk management system",
                "Quantum computing capabilities",
                "Technical documentation",
                "Human oversight"
              ],
              correctAnswer: 1,
              explanation: "Quantum computing capabilities are not required by the EU AI Act. The Act focuses on risk management, documentation, oversight, and other practicable measures regardless of the underlying technology."
            }
          }
        ]
      },
      legal: {
        slides: [
          {
            title: 'Legal Framework Overview',
            content: '<p>The EU AI Act establishes a legal framework for artificial intelligence with a risk-based approach. This module explores the legal implications and compliance requirements.</p>',
            pathRelevance: {
              decision_maker: "Medium - Understanding the legal framework helps inform strategic decisions",
              developer: "Medium - Legal context helps you understand why technical requirements exist",
              operator: "Medium - Legal requirements shape operational procedures",
              legal: "High - This is directly relevant to your compliance responsibilities"
            }
          },
          {
            title: 'Legal Obligations and Liabilities',
            content: '<p>The EU AI Act creates specific legal obligations for:</p><ul><li>AI providers</li><li>Importers and distributors</li><li>Deployers of high-risk systems</li><li>Notified bodies</li></ul><p>Non-compliance can result in significant penalties of up to €35 million or 7% of global annual turnover.</p>',
            quiz: {
              question: "What is the maximum potential penalty for serious violations of the EU AI Act?",
              options: [
                "€10 million or 2% of global annual turnover",
                "€20 million or 4% of global annual turnover",
                "€35 million or 7% of global annual turnover",
                "€50 million or 10% of global annual turnover"
              ],
              correctAnswer: 2,
              explanation: "The EU AI Act sets maximum penalties at €35 million or 7% of global annual turnover, whichever is higher, for the most serious violations."
            }
          }
        ]
      },
      decision_maker: {
        slides: [
          {
            title: 'Strategic Impact Assessment',
            content: '<p>For decision makers, the EU AI Act represents both regulatory challenges and strategic opportunities. This module helps you navigate the strategic implications.</p>',
            pathRelevance: {
              decision_maker: "High - This directly impacts your strategic planning responsibilities",
              developer: "Low - Strategic considerations are less relevant to your implementation work",
              operator: "Medium - Understanding strategic goals helps align operational priorities",
              legal: "Medium - Strategic context informs your compliance guidance"
            }
          },
          {
            title: 'Resource Planning and Governance',
            content: '<p>Implementing EU AI Act compliance requires:</p><ul><li>Cross-functional governance structures</li><li>Budget allocation for compliance activities</li><li>Risk assessment frameworks</li><li>Documentation systems</li><li>Training programs</li><li>Monitoring and testing resources</li></ul>',
            quiz: {
              question: "Which of the following is most important for decision makers to establish first when preparing for EU AI Act compliance?",
              options: [
                "Technical documentation templates",
                "Marketing materials explaining compliance",
                "Cross-functional governance structure",
                "Detailed technical specifications"
              ],
              correctAnswer: 2,
              explanation: "A cross-functional governance structure should be established first, as it creates the organizational foundation needed to coordinate all other compliance activities across departments."
            }
          }
        ]
      }
    }
  },
  {
    module_id: 'risk-classification',
    title: 'Risk Classification System',
    description: 'Understanding the risk categories and how to classify AI systems',
    content: {
      technical: {
        slides: [
          {
            title: 'Technical Risk Assessment',
            content: '<p>Risk classification requires technical analysis of AI systems. This module covers the technical aspects of risk assessment and classification.</p>'
          },
          {
            title: 'Technical Assessment Criteria',
            content: '<p>Technical factors in risk assessment include:</p><ul><li>Purpose and applications of the AI system</li><li>Sector of deployment</li><li>Autonomy level</li><li>Data dependencies</li><li>Human oversight capabilities</li></ul>',
            quiz: {
              question: "Which technical factor is NOT typically considered in EU AI Act risk classification?",
              options: [
                "Purpose of the AI system",
                "Programming language used",
                "Sector of deployment",
                "Level of autonomy"
              ],
              correctAnswer: 1,
              explanation: "The programming language used to develop an AI system is not a relevant factor for risk classification under the EU AI Act. The Act focuses on the purpose, functionality, application domain, and impact of AI systems rather than implementation details."
            }
          }
        ]
      }
    }
  }
];

/**
 * Seed training modules in the database
 */
async function seedTrainingModules() {
  try {
    console.log('Seeding training modules...');
    
    for (const moduleData of moduleContents) {
      console.log(`Processing module: ${moduleData.module_id}`);
      
      // Check if module already exists
      const existingModule = await db.select().from(trainingModules).where(trainingModules.module_id === moduleData.module_id);
      
      if (existingModule && existingModule.length > 0) {
        console.log(`Module ${moduleData.module_id} already exists. Updating...`);
        await db.update(trainingModules)
          .set({
            title: moduleData.title,
            description: moduleData.description,
            content: moduleData.content,
            updated_at: new Date()
          })
          .where(trainingModules.module_id === moduleData.module_id);
      } else {
        console.log(`Creating new module: ${moduleData.module_id}`);
        await db.insert(trainingModules).values({
          module_id: moduleData.module_id,
          title: moduleData.title,
          description: moduleData.description,
          content: moduleData.content,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }
    
    console.log('Finished seeding training modules!');
  } catch (error) {
    console.error('Error seeding training modules:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
seedTrainingModules();