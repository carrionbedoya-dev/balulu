"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 space-y-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-3 px-5 py-4 rounded-balulu shadow-balulu-lg ${
                toast.type === "success"
                  ? "bg-balulu-secondary-50 border border-balulu-secondary-200"
                  : toast.type === "error"
                  ? "bg-red-50 border border-red-200"
                  : "bg-balulu-primary-50 border border-balulu-primary-200"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-balulu-secondary-600" />
              ) : toast.type === "error" ? (
                <XCircle className="w-5 h-5 text-red-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-balulu-primary-600" />
              )}
              <p
                className={`text-sm font-medium ${
                  toast.type === "success"
                    ? "text-balulu-secondary-800"
                    : toast.type === "error"
                    ? "text-red-800"
                    : "text-balulu-primary-800"
                }`}
              >
                {toast.message}
              </p>
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
                className="ml-2 text-balulu-muted hover:text-balulu-text"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
