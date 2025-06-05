
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { chatWithAI } from '@/utils/nameGenerator';

interface NamePreferences {
  fatherName: string;
  motherName: string;
  gender: string;
  religion: string;
  culture: string;
  startLetter: string;
  endLetter: string;
  mustInclude: string;
  meaningPreference: string;
  siblingNames: string;
  birthDate: string;
  birthTime: string;
  nameRules: string[];
  searchType: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIChatProps {
  preferences: NamePreferences;
}

const AIChat: React.FC<AIChatProps> = ({ preferences }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI name assistant for AstroName AI. I can help you explore name ideas, explain meanings, suggest alternatives, or discuss cultural significance. What would you like to know about baby names?",
      timestamp: new Date(),
      suggestions: [
        "Give me modern girl names that start with 'A'",
        "Suggest names that blend our parent names",
        "Names that match with my daughter Anika",
        "What are some unique unisex names?"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, scrollToBottom]);

  // Optimized scroll handling for long conversations
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && messages.length > 20) {
      // Auto-cleanup old messages for performance
      const shouldCleanup = messages.length > 50;
      if (shouldCleanup) {
        setMessages(prev => prev.slice(-30)); // Keep last 30 messages
      }
    }
  }, [messages.length]);

  const handleSendMessage = async () => {
    console.log('Send message clicked, input:', inputMessage);
    
    if (!inputMessage.trim()) {
      console.log('Empty message, returning');
      return;
    }

    if (isLoading || isTyping) {
      console.log('Already processing, returning');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    console.log('Adding user message:', userMessage);
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      console.log('Calling chatWithAI with:', inputMessage, preferences);
      
      const response = await chatWithAI(inputMessage.trim(), preferences);
      
      console.log('Got AI response:', response);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content || "I'm sorry, I couldn't generate a proper response. Please try again.",
        timestamp: new Date(),
        suggestions: response.suggestions || []
      };
      
      console.log('Adding assistant message:', assistantMessage);
      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: "Response received",
        description: "AI assistant replied successfully!",
      });
      
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please check your internet connection and try again.",
        timestamp: new Date(),
        suggestions: [
          "Try a simpler question",
          "Ask about traditional names",
          "What are popular baby names?"
        ]
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Chat Error",
        description: "Failed to get response from AI assistant. Please try again.",
        variant: "destructive"
      });
    } finally {
      console.log('Resetting loading states');
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log('Suggestion clicked:', suggestion);
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('Enter key pressed');
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[500px] sm:h-[600px] flex flex-col bg-white/95 backdrop-blur-sm border border-purple-100/50">
      <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 px-3 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          <span className="hidden sm:inline">AstroName AI Assistant</span>
          <span className="sm:hidden">AI Assistant</span>
          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 sm:gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              {message.type === 'assistant' && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[85%] sm:max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                <div
                  className={`p-2 sm:p-3 rounded-lg text-sm sm:text-base ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                </div>
                
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 sm:mt-3 space-y-2">
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Try asking:</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-colors text-xs sm:text-sm px-2 py-1"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              {message.type === 'user' && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 order-3">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-2 sm:gap-3 justify-start">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <div className="bg-gray-100 p-2 sm:p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t p-2 sm:p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about baby names..."
              className="flex-1 text-sm sm:text-base h-10 sm:h-auto"
              disabled={isTyping || isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping || isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 px-3 sm:px-4"
              size="sm"
            >
              {isLoading ? (
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChat;
