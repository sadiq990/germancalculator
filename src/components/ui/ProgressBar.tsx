import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0 to 100
  colorClass?: string;
  heightClass?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  colorClass = 'bg-primary',
  heightClass = 'h-2',
  className = ''
}) => {
  const p = Math.min(100, Math.max(0, progress || 0));

  return (
    <div className={`w-full bg-neutral-100 dark:bg-dark-border rounded-full overflow-hidden ${heightClass} ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${p}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`h-full ${colorClass} rounded-full`}
      />
    </div>
  );
};
