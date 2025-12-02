import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, Loader2, Compass } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, GroundingChunk } from '../types';
import ReactMarkdown from 'react-markdown';

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm your Dallas Literary Guide. Ask me about finding a cozy reading nook, a rare edition, or directions to the nearest indie bookshop."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation not available or denied", error);
        }
      );
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(messages, input, userLocation);
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        groundingMetadata: response.groundingMetadata
      };
      
      setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderGroundingSource = (chunk: GroundingChunk, idx: number) => {
    if (chunk.maps) {
      return (
        <a 
          key={idx}
          href={chunk.maps.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block rounded-lg border border-stone-200 bg-white p-3 hover:bg-stone-50 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700">
              <MapPin size={16} />
            </div>
            <div>
              <div className="font-semibold text-stone-800 text-sm">{chunk.maps.title}</div>
              {chunk.maps.placeAnswerSources?.reviewSnippets?.[0] && (
                <div className="mt-1 text-xs text-stone-500 italic">
                  "{chunk.maps.placeAnswerSources.reviewSnippets[0].content}"
                </div>
              )}
            </div>
          </div>
        </a>
      );
    }
    return null;
  };

  return (
    <div className="flex h-[600px] flex-col overflow-hidden rounded-2xl bg-white shadow-xl border border-stone-200">
      {/* Header */}
      <div className="bg-stone-900 p-4 text-white flex items-center gap-2">
        <Compass className="h-5 w-5 text-orange-400" />
        <h2 className="font-serif text-lg font-medium tracking-wide">Lit Guide Concierge</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-stone-50">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-stone-800 text-white rounded-br-none'
                    : 'bg-white text-stone-800 border border-stone-100 rounded-bl-none'
                }`}
              >
                <div className="prose prose-stone prose-sm max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>

                {/* Grounding Chips */}
                {msg.groundingMetadata?.groundingChunks && (
                  <div className="mt-3 flex flex-col gap-2 border-t border-stone-100 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">References</p>
                    {msg.groundingMetadata.groundingChunks.map((chunk, idx) => 
                      renderGroundingSource(chunk, idx)
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 rounded-2xl rounded-bl-none bg-white p-4 shadow-sm border border-stone-100">
                <Loader2 className="h-4 w-4 animate-spin text-stone-400" />
                <span className="text-xs text-stone-400">Consulting the archives...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-stone-200 bg-white p-4">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about bookstores, events, or coffee..."
            className="w-full rounded-full border border-stone-300 bg-stone-50 py-3 pl-4 pr-12 text-sm text-stone-800 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 rounded-full bg-stone-900 p-2 text-white transition-colors hover:bg-stone-700 disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
