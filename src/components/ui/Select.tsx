import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options,
  className = '',
  id,
  ...props
}, ref) => {
  const generatedId = id || Math.random().toString(36).substring(7);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={generatedId} className="block text-sm font-medium text-neutral-900 dark:text-dark-text-secondary mb-1">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={generatedId}
        className={`
          block w-full h-[44px] rounded-lg border-[1.5px] transition-colors
          ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-neutral-200 dark:border-dark-border focus:border-primary focus:ring-primary/20'}
          bg-white dark:bg-dark-surface text-neutral-900 dark:text-dark-text
          px-3
          focus:outline-none focus:ring-2
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
