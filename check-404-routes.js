
#!/usr/bin/env node

const fetch = require('node-fetch');

// Base URL of the application
const baseUrl = 'http://localhost:5000';

// Common routes to check
const routesToCheck = [
  '/',
  '/dashboard',
  '/systems',
  '/systems/registration',
  '/compliance',
  '/compliance/assessment',
  '/compliance/documentation',
  '/compliance/regulatory-updates',
  '/governance',
  '/governance/framework',
  '/knowledge-base',
  '/knowledge-base/articles',
  '/profile',
  '/audit',
  '/audit/records',
  '/monitoring',
  // API routes
  '/api/systems',
  '/api/compliance/assessment',
  '/api/compliance/score',
  '/api/compliance/roadmap',
  '/api/monitoring/check',
  '/api/documents/generate',
  '/api/regulatory/updates',
  '/api/knowledge/articles',
  '/api/audit/records',
  '/api/chatbot/query'
];

async function checkRoutes() {
  console.log('Checking routes for 404 errors...');
  console.log('================================');

  const results = {
    ok: [],
    notFound: [],
    error: []
  };

  for (const route of routesToCheck) {
    try {
      const url = `${baseUrl}${route}`;
      const response = await fetch(url);
      
      if (response.status === 404) {
        console.log(`❌ 404: ${route}`);
        results.notFound.push(route);
      } else if (response.ok) {
        console.log(`✅ ${response.status}: ${route}`);
        results.ok.push(route);
      } else {
        console.log(`⚠️ ${response.status}: ${route}`);
        results.error.push({ route, status: response.status });
      }
    } catch (error) {
      console.error(`🔥 Error checking ${route}:`, error.message);
      results.error.push({ route, error: error.message });
    }
  }

  console.log('\nSummary:');
  console.log(`✅ Accessible routes: ${results.ok.length}`);
  console.log(`❌ 404 Not Found: ${results.notFound.length}`);
  console.log(`⚠️ Other errors: ${results.error.length}`);
  
  if (results.notFound.length > 0) {
    console.log('\n404 Pages that need to be fixed:');
    results.notFound.forEach(route => console.log(`- ${route}`));
  }
}

checkRoutes().catch(console.error);
