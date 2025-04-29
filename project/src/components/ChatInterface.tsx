import React, { useState, useRef, useEffect } from 'react';
import { Send, Layers } from 'lucide-react';
import { useModelContext } from '../context/ModelContext';
import Message from './Message';
import { MessageType } from '../types';
import { processQuery } from '../utils/queryProcessor';

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { modelSettings } = useModelContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: MessageType = {
      id: Date.now(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate processing the query with the model
    const response = await processQuery(input, modelSettings);
    
    const botMessage: MessageType = {
      id: Date.now() + 1,
      content: response.content,
      sender: 'bot',
      timestamp: new Date(),
      isRedirect: response.isRedirect,
      redirectUrl: response.redirectUrl
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Layers className="h-16 w-16 mb-4 text-teal-600 opacity-50" />
            <h2 className="text-xl font-medium mb-2">Start a conversation</h2>
            <p className="text-center max-w-md">
              Ask DeepSeek R1 anything. Simple questions may redirect you to search engines.
            </p>
          </div>
        )}

        {messages.map(message => (
          <Message key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center rounded-lg border border-gray-300 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 bg-white overflow-hidden">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-transparent outline-none"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="p-3 text-teal-600 hover:text-teal-700 disabled:text-gray-400 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;