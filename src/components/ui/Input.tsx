import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
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
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={generatedId}
          className={`
            block w-full h-[44px] rounded-lg border-[1.5px] transition-colors
            ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-neutral-200 dark:border-dark-border focus:border-primary focus:ring-primary/20'}
            bg-white dark:bg-dark-surface text-neutral-900 dark:text-dark-text placeholder:text-neutral-400 dark:placeholder:text-neutral-500
            ${leftIcon ? 'pl-10' : 'pl-3'}
            ${rightIcon ? 'pr-10' : 'pr-3'}
            focus:outline-none focus:ring-2
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
