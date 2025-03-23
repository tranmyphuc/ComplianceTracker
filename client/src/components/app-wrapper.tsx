
import React, { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'wouter';

// Create a context to track rendered components
interface RenderedComponentsContext {
  has: (componentId: string) => boolean;
  add: (componentId: string) => void;
  clear: () => void;
}

const ComponentTrackingContext = createContext<RenderedComponentsContext>({
  has: () => false,
  add: () => {},
  clear: () => {},
});

// Hook to check and register components
export const useComponentTracking = (componentId: string, shouldRender = true) => {
  const context = useContext(ComponentTrackingContext);
  
  const isAlreadyRendered = context.has(componentId);
  
  // Register this component instance if it should render
  if (shouldRender && !isAlreadyRendered) {
    context.add(componentId);
  }
  
  return isAlreadyRendered;
};

/**
 * AppWrapper helps prevent duplicate UI elements by tracking
 * which components have already been rendered in the current page.
 */
export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location] = useLocation();
  const renderedComponentsRef = React.useRef(new Set<string>());
  
  // Context value with methods to track components
  const contextValue = React.useMemo(() => ({
    has: (id: string) => renderedComponentsRef.current.has(id),
    add: (id: string) => renderedComponentsRef.current.add(id),
    clear: () => renderedComponentsRef.current.clear()
  }), []);
  
  // Reset the tracking when route changes
  useEffect(() => {
    renderedComponentsRef.current.clear();
    
    // For debugging
    console.log('AppWrapper: Cleared component tracking on route change');
  }, [location]);

  return (
    <ComponentTrackingContext.Provider value={contextValue}>
      {children}
    </ComponentTrackingContext.Provider>
  );
};
