import React from 'react';

export const ExportPreview: React.FC<{ itemsCount: number }> = ({ itemsCount }) => {
  return (
    <div className="w-full h-64 bg-neutral-100 dark:bg-dark-bg border border-neutral-200 dark:border-dark-border rounded-xl flex items-center justify-center flex-col gap-2 mt-4 text-neutral-500">
      <span className="text-4xl text-neutral-400">📄</span>
      <p className="dark:text-dark-text-secondary">Preview: {itemsCount} items selected</p>
    </div>
  );
};
