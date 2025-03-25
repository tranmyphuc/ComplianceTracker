
import { toast } from "@/components/ui/use-toast";

/**
 * Centralized API error handler
 * @param error The error object from the API call
 * @param fallbackMessage A fallback message if error doesn't contain a message
 * @param silent If true, won't show a toast notification
 */
export const handleApiError = (
  error: any, 
  fallbackMessage = "An error occurred while fetching data", 
  silent = false
) => {
  console.error("API Error:", error);
  
  const errorMessage = error?.response?.data?.message || 
                       error?.message || 
                       fallbackMessage;
  
  if (!silent) {
    toast({
      variant: "destructive",
      title: "Error",
      description: errorMessage,
    });
  }
  
  return errorMessage;
};

/**
 * Wrapper for async API calls with built-in error handling
 * @param apiCall The async API call function
 * @param errorMessage Custom error message
 * @param silent If true, won't show a toast notification
 */
export const safeApiCall = async (
  apiCall: () => Promise<any>,
  errorMessage = "An error occurred", 
  silent = false
) => {
  try {
    return await apiCall();
  } catch (error) {
    handleApiError(error, errorMessage, silent);
    return null;
  }
};
