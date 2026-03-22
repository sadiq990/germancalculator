import { useAIStore } from '../store/useAIStore';
import type { AIContext } from '../types/ai.types';

export function useAI() {
  const messages = useAIStore(state => state.messages);
  const addMessage = useAIStore(state => state.addMessage);

  const sendMessage = async (content: string, context?: AIContext) => {
    const userMsgId = crypto.randomUUID();
    addMessage({
      id: userMsgId,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    });

    // Mock API Call to Claude
    setTimeout(() => {
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Das ist eine KI-Antwort auf: "${content}". Details folgen!`,
        timestamp: new Date().toISOString()
      });
    }, 1500);
  };

  return { messages, sendMessage };
}
