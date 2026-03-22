import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  hoverable?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  children,
  className = '',
  hoverable = false,
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      {...(hoverable && { whileHover: { y: -2, transition: { duration: 0.2 } } })}
      className={`
        bg-white dark:bg-dark-surface 
        rounded-xl shadow-sm border border-neutral-100 dark:border-dark-border 
        overflow-hidden
        ${hoverable ? 'cursor-pointer hover:shadow-md' : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';
