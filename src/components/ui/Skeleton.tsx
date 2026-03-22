import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-neutral-200 dark:bg-dark-border rounded ${className}`} />
  );
};
