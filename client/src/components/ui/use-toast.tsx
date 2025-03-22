import React, { createContext, useContext } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

interface ToastContextType {
  toast: ReturnType<typeof useToast>;
}

const ToastContext = createContext<ToastContextType>({} as ToastContextType);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => useContext(ToastContext);