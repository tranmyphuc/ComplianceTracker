
/**
 * Route verification utility
 * This helps check if all routes referenced in the application are valid
 */

import { useEffect } from 'react';
import { useLocation } from 'wouter';

export const useRouteVerification = () => {
  const [location] = useLocation();
  
  useEffect(() => {
    console.log(`Current route: ${location}`);
    // You could extend this to verify against a list of valid routes
  }, [location]);
};

export const verifyRoutes = (routes: string[]) => {
  // Log all routes for debugging
  console.log('All registered routes:', routes);
  
  // This could be extended to check for duplicates or validate route patterns
  const duplicates = routes.filter((item, index) => routes.indexOf(item) !== index);
  if (duplicates.length > 0) {
    console.warn('Duplicate routes found:', duplicates);
  }
  
  return {
    totalRoutes: routes.length,
    duplicates
  };
};
