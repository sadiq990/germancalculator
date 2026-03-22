import React from 'react';
import { motion } from 'framer-motion';

interface TimerButtonProps {
  isActive: boolean;
  onToggle: () => void;
}

export const TimerButton: React.FC<TimerButtonProps> = ({ isActive, onToggle }) => {
  return (
    <div className="flex justify-center items-center my-8">
      <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
        {isActive && (
          <>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-primary/20 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-4 bg-primary/30 rounded-full"
            />
          </>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className={`
            relative z-10 w-40 h-40 md:w-48 md:h-48 rounded-full shadow-lg flex flex-col justify-center items-center select-none outline-none focus:ring-4
            ${isActive 
              ? 'bg-danger text-white hover:bg-danger/90 focus:ring-danger/50' 
              : 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50'
            }
          `}
        >
          <span className="text-2xl md:text-3xl font-bold tracking-wider">
            {isActive ? 'STOP' : 'START'}
          </span>
        </motion.button>
      </div>
    </div>
  );
};
