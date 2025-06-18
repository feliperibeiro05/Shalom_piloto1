import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Zap, Timer } from 'lucide-react';
import { useActivities } from '../../../contexts/ActivitiesContext';

interface FlowStateModeProps {
  isOpen: boolean;
  onClose: () => void;
}

const FLOW_QUOTES = [
  "O estado de flow é onde a mágica acontece.",
  "Foco total, consciência plena.",
  "No flow, tempo e esforço desaparecem.",
  "Mergulhe profundamente em sua tarefa.",
  "Cada momento conta, cada ação importa."
];

export const FlowStateMode: React.FC<FlowStateModeProps> = ({ isOpen, onClose }) => {
  const { getDailyActivities } = useActivities();
  const [currentActivity] = useState(getDailyActivities()[0]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [flowScore, setFlowScore] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(FLOW_QUOTES[0]);
  const [showInterface, setShowInterface] = useState(true);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        setElapsedTime(elapsed);
        
        // Calcular pontuação de flow baseado no tempo sem interrupção
        const baseScore = Math.min(elapsed / 60, 100); // Máximo de 100 pontos
        setFlowScore(Math.floor(baseScore));
        
        // Trocar citação a cada 2 minutos
        if (elapsed % 120 === 0) {
          const newQuote = FLOW_QUOTES[Math.floor(Math.random() * FLOW_QUOTES.length)];
          setCurrentQuote(newQuote);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleMouseMove = () => {
    setShowInterface(true);
    setTimeout(() => setShowInterface(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-cyan-900/30 via-gray-900 to-green-900/30 backdrop-blur-lg z-50"
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence>
          {showInterface && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 right-4"
            >
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-full flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl w-full text-center space-y-12"
          >
            {currentActivity && (
              <motion.div
                animate={{ 
                  scale: [1, 1.02, 1],
                  transition: { 
                    repeat: Infinity,
                    duration: 4
                  }
                }}
                className="space-y-6"
              >
                <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                  {currentActivity.title}
                </h2>
                <p className="text-xl text-cyan-200/80">
                  {currentActivity.description}
                </p>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-2xl font-medium text-gray-400 italic"
              >
                {currentQuote}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-12">
              <div className="text-center">
                <Timer className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
                <div className="text-3xl font-mono font-bold text-white">
                  {formatElapsedTime(elapsedTime)}
                </div>
                <div className="text-sm text-gray-400 mt-1">Tempo em Flow</div>
              </div>

              <div className="text-center">
                <Brain className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-3xl font-mono font-bold text-white">
                  {flowScore}
                </div>
                <div className="text-sm text-gray-400 mt-1">Pontuação Flow</div>
              </div>
            </div>

            <motion.div
              animate={{
                opacity: showInterface ? 1 : 0.3
              }}
              className="flex items-center justify- center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-500" />
                <span>Modo Flow Ativo</span>
              </div>
              <span>•</span>
              <div>Mova o mouse para mostrar/ocultar interface</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};