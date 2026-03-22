import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Trash2, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const AIChat: React.FC = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', content: "Hello! I'm your AI tax assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mock response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: "I'm analyzing your request. Based on your inputs, your effective tax rate is around 34.2%. Would you like a detailed breakdown?" 
      }]);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto w-full h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-black rounded-ios-xl shadow-2xl overflow-hidden border border-neutral-100 dark:border-ios-dark-4"
    >
      {/* Chat Header */}
      <div className="px-6 py-4 glass border-b dark:border-ios-dark-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ios-indigo rounded-full flex items-center justify-center text-white shadow-ios">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-bold text-sm dark:text-white">Standly AI</h2>
            <p className="text-[10px] text-ios-green font-bold uppercase tracking-widest flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-ios-green" />
               Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-ios-dark-4 text-neutral-400">
             <Trash2 size={18} />
           </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-[#F2F2F7] dark:bg-black/50"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                flex gap-2 max-w-[85%] sm:max-w-[70%]
                ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}
              `}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center shrink-0
                  ${msg.role === 'user' ? 'bg-ios-gray-5 dark:bg-ios-dark-4' : 'bg-ios-indigo text-white shadow-sm'}
                `}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                
                <div className={`
                  px-4 py-3 rounded-ios-lg text-sm leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-ios-blue text-white rounded-tr-none' 
                    : 'bg-white dark:bg-ios-dark-5 dark:text-white rounded-tl-none'
                  }
                `}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="px-4 py-4 glass border-t dark:border-ios-dark-4">
        <div className="flex items-center gap-3 bg-white dark:bg-ios-dark-4 p-1 rounded-full shadow-inner border dark:border-ios-dark-3">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('ai.placeholder', 'Ask about your taxes...')}
            className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none dark:text-white"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className={`
              p-2 rounded-full transition-all
              ${input.trim() 
                ? 'bg-ios-blue text-white shadow-ios' 
                : 'text-neutral-300 dark:text-ios-dark-3'}
            `}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
