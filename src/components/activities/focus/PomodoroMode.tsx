import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Settings, X, Volume2, VolumeX } from 'lucide-react';
import { useActivities } from '../../../contexts/ActivitiesContext';

interface PomodoroModeProps {
  isOpen: boolean;
  onClose: () => void;
}

type PomodoroState = 'focus' | 'break';

export const PomodoroMode: React.FC<PomodoroModeProps> = ({ isOpen, onClose }) => {
  const { getDailyActivities } = useActivities();
  const [currentActivity] = useState(getDailyActivities()[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [state, setState] = useState<PomodoroState>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playCompletionSound();
      if (state === 'focus') {
        setState('break');
        setTimeLeft(breakTime * 60);
        setSessionsCompleted(prev => prev + 1);
      } else {
        setState('focus');
        setTimeLeft(focusTime * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, state, focusTime, breakTime]);

  const playCompletionSound = () => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      }, i * 200);
    });

    gainNode.gain.value = 0.1;
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.8);
    setTimeout(() => oscillator.stop(), 800);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const skipInterval = () => {
    if (state === 'focus') {
      setState('break');
      setTimeLeft(breakTime * 60);
      setSessionsCompleted(prev => prev + 1);
    } else {
      setState('focus');
      setTimeLeft(focusTime * 60);
    }
    setIsRunning(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-purple-900/30 via-gray-900 to-blue-900/30 backdrop-blur-lg z-50"
      >
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="h-6 w-6" />
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="h-6 w-6" />
            ) : (
              <VolumeX className="h-6 w-6" />
            )}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 right-4 bg-gray-800/90 backdrop-blur-md rounded-lg p-4 space-y-4 w-64"
          >
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Tempo de Foco (min)</label>
              <input
                type="number"
                value={focusTime}
                onChange={(e) => setFocusTime(parseInt(e.target.value))}
                min="1"
                max="60"
                className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Tempo de Descanso (min)</label>
              <input
                type="number"
                value={breakTime}
                onChange={(e) => setBreakTime(parseInt(e.target.value))}
                min="1"
                max="30"
                className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </motion.div>
        )}

        <div className="h-full flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl w-full text-center space-y-12"
          >
            {currentActivity && (
              <motion.div
                animate={{ 
                  scale: isRunning ? [1, 1.05, 1] : 1,
                  transition: { 
                    repeat: isRunning ? Infinity : 0,
                    duration: 4
                  }
                }}
                className="space-y-6"
              >
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {currentActivity.title}
                </h2>
                <p className="text-xl text-blue-200/80">
                  {currentActivity.description}
                </p>
              </motion.div>
            )}

            <div className="space-y-4">
              <motion.div
                animate={{
                  scale: timeLeft <= 60 ? [1, 1.1, 1] : 1,
                  transition: {
                    repeat: timeLeft <= 60 ? Infinity : 0,
                    duration: 1
                  }
                }}
                className="relative"
              >
                <div className="text-9xl font-mono font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-2xl font-medium text-gray-400 mt-4">
                  {state === 'focus' ? 'Tempo de Foco' : 'Pausa'}
                </div>
              </motion.div>

              <div className="flex items-center justify-center gap-8">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="p-6 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 transition-colors border border-purple-400/30"
                >
                  {isRunning ? (
                    <Pause className="h-10 w-10 text-purple-300" />
                  ) : (
                    <Play className="h-10 w-10 text-purple-300" />
                  )}
                </button>

                <button
                  onClick={skipInterval}
                  className="p-6 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 transition-colors border border-blue-400/30"
                >
                  <SkipForward className="h-10 w-10 text-blue-300" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 text-gray-400">
              <div>
                <span className="text-2xl font-bold">{sessionsCompleted}</span>
                <span className="ml-2">sessões completas</span>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-lg bg-gradient-to-r from-purple-400/60 to-blue-400/60 bg-clip-text text-transparent italic"
            >
              {state === 'focus' 
                ? "Mantenha o foco. Cada minuto conta." 
                : "Momento de descansar. Respire fundo."}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};