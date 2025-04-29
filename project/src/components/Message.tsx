import React from 'react';
import { ExternalLink } from 'lucide-react';
import { MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
    >
      <div 
        className={`max-w-[80%] md:max-w-[70%] rounded-lg p-4 ${
          isUser 
            ? 'bg-teal-600 text-white rounded-br-none' 
            : 'bg-white border border-gray-200 rounded-bl-none'
        }`}
      >
        <div className="text-sm mb-1">
          {isUser ? 'You' : 'DeepSeek R1'}
        </div>
        
        <div>
          {message.isRedirect ? (
            <div>
              <p className="mb-2">{message.content}</p>
              <a 
                href={message.redirectUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors"
              >
                Search on Google
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </div>
          ) : (
            <p>{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;