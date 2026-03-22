import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-bold text-neutral-500 dark:text-ios-gray-1 uppercase tracking-widest ml-1">
          {label}
        </label>
      ) }
      <input
        ref={ref}
        className={`
          w-full px-4 py-3 rounded-ios-md
          bg-white dark:bg-ios-dark-4
          border border-neutral-200 dark:border-ios-dark-3
          text-sm font-medium dark:text-white
          placeholder:text-neutral-400 dark:placeholder:text-neutral-500
          transition-all focus:border-ios-blue focus:ring-4 focus:ring-ios-blue/10
          ${error ? 'border-ios-red ring-ios-red/10' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-[10px] font-bold text-ios-red ml-1 uppercase tracking-wide">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
