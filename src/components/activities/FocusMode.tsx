import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Focus, Timer, Zap, Music } from 'lucide-react';
import { useActivities } from '../../contexts/ActivitiesContext';
import { PomodoroMode } from './focus/PomodoroMode';
import { AmbientSoundMode } from './focus/AmbientSoundMode';
import { FlowStateMode } from './focus/FlowStateMode';

type FocusType = 'pomodoro' | 'ambient' | 'flow' | null;

export const FocusMode: React.FC = () => {
  const { getPriorityActivities } = useActivities();
  const priorities = getPriorityActivities();
  const [activeMode, setActiveMode] = useState<FocusType>(null);

  const handleCloseMode = () => {
    setActiveMode(null);
  };

  return (
    <>
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Focus className="h-6 w-6 text-purple-500" />
            <h3 className="text-lg font-medium text-white">Modo Foco</h3>
          </div>
          <span className="text-sm text-gray-400">
            {priorities.length} prioridades restantes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveMode('pomodoro')}
            className="flex flex-col items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
          >
            <Timer className="h-6 w-6 text-purple-500" />
            <span className="text-sm font-medium text-gray-300">Pomodoro</span>
            <p className="text-xs text-gray-400 text-center">
              25 min foco + 5 min descanso
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveMode('ambient')}
            className="flex flex-col items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-colors"
          >
            <Music className="h-6 w-6 text-blue-500" />
            <span className="text-sm font-medium text-gray-300">Som Ambiente</span>
            <p className="text-xs text-gray-400 text-center">
              Sons relaxantes para foco
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveMode('flow')}
            className="flex flex-col items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-green-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors"
          >
            <Zap className="h-6 w-6 text-cyan-500" />
            <span className="text-sm font-medium text-gray-300">Flow State</span>
            <p className="text-xs text-gray-400 text-center">
              Modo imersivo total
            </p>
          </motion.button>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            O Modo Foco ajuda você a manter-se concentrado em suas prioridades.
            Escolha uma técnica acima para começar uma sessão focada.
          </p>
        </div>
      </div>

      <PomodoroMode 
        isOpen={activeMode === 'pomodoro'} 
        onClose={handleCloseMode} 
      />
      
      <AmbientSoundMode 
        isOpen={activeMode === 'ambient'} 
        onClose={handleCloseMode} 
      />
      
      <FlowStateMode 
        isOpen={activeMode === 'flow'} 
        onClose={handleCloseMode} 
      />
    </>
  );
};