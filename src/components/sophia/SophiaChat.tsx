import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, Send, Sparkles, ChevronDown, Maximize2, Minimize2, UserCircle2 } from 'lucide-react';
import { useSophia } from '../../contexts/SophiaContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

export const SophiaChat: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, isThinking, clearConversation } = useSophia();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    sendMessage(input.trim());
    setInput('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
    clearConversation();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setIsMinimized(false);
  };

  // Don't render on auth pages (login, register) or when user is not authenticated
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
  if (!user || isAuthPage) return null;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg flex items-center gap-3 transition-colors duration-300 z-40
          ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
          bg-gradient-to-r from-blue-600 to-purple-600 text-white
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Brain className="h-6 w-6" />
        <span className="font-medium">Falar com Sophia</span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 'auto' : '600px',
              width: isFullscreen ? '100%' : '384px',
              left: isFullscreen ? 0 : 'auto',
              top: isFullscreen ? 0 : 'auto',
              right: isFullscreen ? 0 : '24px',
              bottom: isFullscreen ? 0 : '24px'
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bg-gray-800 shadow-xl border border-gray-700 overflow-hidden flex flex-col z-30
              ${isMinimized ? 'h-auto' : isFullscreen ? 'h-screen' : 'h-[600px]'}
              ${isFullscreen ? '' : 'rounded-xl'}
            `}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-white">Sophia</h3>
                  <p className="text-xs text-white/80">Assistente IA</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isFullscreen && (
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ChevronDown className={`h-5 w-5 text-white transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
                  </button>
                )}
                <button
                  onClick={toggleFullscreen}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-5 w-5 text-white" />
                  ) : (
                    <Maximize2 className="h-5 w-5 text-white" />
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <div className="flex flex-col flex-1">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-3 ${
                        message.role === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Brain className="h-5 w-5 text-blue-500" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`rounded-lg p-3 max-w-[80%] ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-100'
                        }`}
                      >
                        {message.content}
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                          <UserCircle2 className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isThinking && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Brain className="h-5 w-5 text-blue-500" />
                        </div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3 space-x-1">
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.5, 1] }}
                          className="inline-block w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: 0.2, times: [0, 0.5, 1] }}
                          className="inline-block w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: 0.4, times: [0, 0.5, 1] }}
                          className="inline-block w-2 h-2 bg-gray-400 rounded-full"
                        />
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-800">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-white"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isThinking}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};