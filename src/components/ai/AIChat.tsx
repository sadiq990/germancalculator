import React, { useState, useEffect, useRef } from 'react';
import { PageTransition } from '../layout/PageTransition';
import { useTranslation } from '../../hooks/useTranslation';
import { useAI } from '../../hooks/useAI';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Send, Bot } from 'lucide-react';

export const AIChat: React.FC = () => {
  const { t } = useTranslation();
  const { messages, sendMessage } = useAI();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-neutral-50 dark:bg-dark-bg p-4 max-w-2xl mx-auto w-full pb-20">
        <h1 className="text-2xl font-bold mb-4">{t('nav.ai')}</h1>

        <div className="flex-1 overflow-y-auto flex flex-col gap-4 mb-4 pr-2">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500 gap-2">
              <Bot className="w-12 h-12 text-primary opacity-50" />
              <p className="dark:text-dark-text-secondary">Frag mich etwas zu deinen Zeiten oder Steuern!</p>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary"/>
                </div>
              )}
              <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-sm' 
                  : 'bg-white dark:bg-dark-surface border border-neutral-100 dark:border-dark-border rounded-tl-sm shadow-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2">
          <Input 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t('ai.ask_explanation')}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} className="w-[44px] h-[44px] px-0 flex items-center justify-center shrink-0">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};
