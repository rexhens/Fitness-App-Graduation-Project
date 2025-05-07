import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI fitness coach. How can I help you today with your fitness journey?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
   try {
  const response = await fetch('https://localhost:7054/ClientCall/ask?user_id=8', {
    method: 'POST',
    headers: {
      'accept': '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question: input }),
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  let botResponse = await response.text();

  // Add some variation based on the user's question
  const lowerInput = input.toLowerCase();
  if (lowerInput.includes('sleep') || lowerInput.includes('rest')) {
    botResponse += " Quality sleep is crucial for muscle recovery and overall fitness. Getting 7-9 hours of sleep is recommended...";
  } else if (lowerInput.includes('diet') || lowerInput.includes('nutrition') || lowerInput.includes('eat')) {
    botResponse += " Nutrition is a foundation of fitness success...";
  } else if (lowerInput.includes('workout') || lowerInput.includes('exercise') || lowerInput.includes('train')) {
    botResponse += " For an effective workout routine, consistency beats intensity...";
  } else {
    botResponse += " For best fitness results, focus on the three pillars...";
  }

  const botMessageObj: Message = {
    id: (Date.now() + 1).toString(),
    text: botResponse,
    isUser: false,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, botMessageObj]);
   setLoading(false);
} catch (error) {
  console.error('Error sending message:', error);
  toast.error('Failed to get a response. Please try again.');
  setMessages((prev) => [
    ...prev,
    {
      id: (Date.now() + 1).toString(),
      text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
}
  }


  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-textPrimary">AI Fitness Coach</h1>
        <p className="mt-1 text-sm text-textSecondary">
          Ask me anything about fitness, nutrition, and wellness
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-y-auto py-4 custom-scrollbar"
      >
        <div className="space-y-4 px-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[80%] md:max-w-[70%] rounded-lg px-4 py-3 ${
                  message.isUser
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-textPrimary'
                }`}
              >
                <div className="mr-2 mt-1">
                  {message.isUser ? (
                    <User size={16} className={message.isUser ? 'text-white' : 'text-primary'} />
                  ) : (
                    <Bot size={16} className="text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] md:max-w-[70%] rounded-lg px-4 py-3 bg-gray-100 text-textPrimary">
                <div className="mr-2 mt-1">
                  <Bot size={16} className="text-primary" />
                </div>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </motion.div>

      <div className="pt-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask about workouts, nutrition, or fitness goals..."
            className="flex-1 input-field"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`btn-primary flex items-center justify-center ${
              !input.trim() || loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Send size={18} />
          </button>
        </form>
        <div className="mt-2 text-xs text-textTertiary">
          <p>Suggested questions:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {[
              "Should I get good sleep before my workout?",
              "What's a good protein intake?",
              "How often should I workout?",
              "Best exercises for core strength?",
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-textSecondary transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;