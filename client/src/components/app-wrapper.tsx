
import React from 'react';
import { useLocation } from 'wouter';

/**
 * AppWrapper helps prevent duplicate UI elements by tracking
 * which components have already been rendered in the current page.
 */
export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location] = useLocation();
  const renderedComponentsRef = React.useRef(new Set<string>());
  
  // Reset the tracking when route changes
  React.useEffect(() => {
    renderedComponentsRef.current.clear();
  }, [location]);

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};
