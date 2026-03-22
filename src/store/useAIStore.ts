import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AIMessage } from '../types/ai.types';

interface AIState {
  messages: AIMessage[];
  addMessage: (msg: AIMessage) => void;
  clearMessages: () => void;
}

export const useAIStore = create<AIState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      clearMessages: () => set({ messages: [] })
    }),
    { name: 'ai-storage' }
  )
);
