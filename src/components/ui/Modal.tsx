import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { modalScale } from '../../utils/animationUtils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClass?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidthClass = 'max-w-md'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              variants={modalScale}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`w-full ${maxWidthClass} bg-white dark:bg-dark-surface rounded-xl shadow-xl border border-neutral-100 dark:border-dark-border pointer-events-auto flex flex-col max-h-[90vh]`}
            >
              {title && (
                <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-dark-border">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text">{title}</h3>
                  <button onClick={onClose} className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-dark-text hover:bg-neutral-100 dark:hover:bg-dark-border transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              
              <div className="p-4 overflow-y-auto">
                {children}
              </div>

              {footer && (
                <div className="p-4 border-t border-neutral-100 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface/50 rounded-b-xl flex justify-end gap-2">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
