import { useEffect } from 'react';

export function useKeyboardShortcuts(onToggleTimer: () => void, onNewEntry: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        onToggleTimer();
      } else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyN') {
        e.preventDefault();
        onNewEntry();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleTimer, onNewEntry]);
}
