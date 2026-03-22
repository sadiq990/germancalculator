import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-20 right-4 left-4 sm:left-auto sm:w-80 z-[200] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="glass-heavy rounded-ios-lg shadow-2xl p-4 flex items-center justify-between border-none overflow-hidden relative"
            >
              {/* Type Indicator Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                toast.type === 'success' ? 'bg-ios-green' : 
                toast.type === 'error' ? 'bg-ios-red' : 'bg-ios-blue'
              }`} />

              <div className="flex items-center gap-3">
                {toast.type === 'success' && <CheckCircle className="text-ios-green" size={20} />}
                {toast.type === 'error' && <AlertCircle className="text-ios-red" size={20} />}
                {toast.type === 'info' && <Info className="text-ios-blue" size={20} />}
                <span className="text-sm font-semibold dark:text-white leading-tight">
                  {toast.message}
                </span>
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-ios-dark-4 text-neutral-400"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
