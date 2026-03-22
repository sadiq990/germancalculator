import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="mb-4 text-neutral-400 dark:text-dark-text-secondary">{icon}</div>}
      <h3 className="text-lg font-medium text-neutral-900 dark:text-dark-text mb-1">{title}</h3>
      {description && <p className="text-sm text-neutral-500 dark:text-dark-text-secondary max-w-sm mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};
