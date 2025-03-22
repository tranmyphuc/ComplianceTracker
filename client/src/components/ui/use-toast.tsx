
import * as React from "react"
import { createContext, useContext, useCallback, useMemo, useState } from "react"

type ToastVariant = "default" | "destructive" | "success"

interface ToastProps {
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface Toast extends ToastProps {
  id: string
  open: boolean
}

interface ToastContextValue {
  toast: (props: ToastProps) => void
  dismiss: (id: string) => void
  toasts: Toast[]
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    ({ title, description, variant = "default", duration = 5000 }: ToastProps) => {
      const id = crypto.randomUUID()
      const newToast: Toast = {
        id,
        title,
        description,
        variant,
        open: true,
        duration,
      }
      
      setToasts((prev) => [...prev, newToast])
      
      if (duration > 0) {
        setTimeout(() => {
          dismiss(id)
        }, duration)
      }
      
      return id
    },
    []
  )

  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, open: false } : toast
      )
    )
    
    // Remove toast after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 300)
  }, [])

  const value = useMemo(
    () => ({
      toast,
      dismiss,
      toasts,
    }),
    [toast, dismiss, toasts]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
        role="region"
        aria-label="Notifications"
      >
        {toasts
          .filter((toast) => toast.open)
          .map((toast) => (
            <div
              key={toast.id}
              className={`mb-2 flex w-full items-center justify-between rounded-md border bg-background p-4 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full ${
                toast.variant === "destructive"
                  ? "border-red-600 text-red-600"
                  : toast.variant === "success"
                  ? "border-green-600 text-green-600"
                  : "border-border"
              }`}
            >
              <div className="grid gap-1">
                {toast.title && <div className="text-sm font-semibold">{toast.title}</div>}
                {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="ml-4 rounded-full p-1 text-foreground/50 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
