import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-ios-md";
  
  const variants = {
    primary: "bg-ios-blue text-white shadow-ios hover:bg-ios-blue/90",
    secondary: "bg-ios-gray-5 dark:bg-ios-dark-4 text-ios-blue hover:bg-ios-gray-4 dark:hover:bg-ios-dark-3",
    premium: "bg-gradient-to-r from-ios-indigo to-ios-purple text-white shadow-ios hover:opacity-90",
    ghost: "bg-transparent text-ios-blue hover:bg-ios-blue/10",
    danger: "bg-ios-red/10 text-ios-red hover:bg-ios-red/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <motion.button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
