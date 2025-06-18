import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, X, Play, Pause, Clock } from 'lucide-react';
import { useActivities } from '../../../contexts/ActivitiesContext';

interface AmbientSoundModeProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Sound {
  id: string;
  name: string;
  url: string;
  icon: string;
  volume: number;
  isPlaying: boolean;
}

export const AmbientSoundMode: React.FC<AmbientSoundModeProps> = ({ isOpen, onClose }) => {
  const [sounds, setSounds] = useState<Sound[]>([
    {
      id: 'rain',
      name: 'Chuva',
      url: 'https://cdn.pixabay.com/download/audio/2022/02/11/audio_d1d8d1e698.mp3',
      icon: '🌧️',
      volume: 0.5,
      isPlaying: false
    },
    {
      id: 'waves',
      name: 'Ondas',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1fb4e87c0d.mp3',
      icon: '🌊',
      volume: 0.5,
      isPlaying: false
    },
    {
      id: 'forest',
      name: 'Floresta',
      url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
      icon: '🌳',
      volume: 0.5,
      isPlaying: false
    },
    {
      id: 'whitenoise',
      name: 'Ruído Branco',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73acc.mp3',
      icon: '📻',
      volume: 0.5,
      isPlaying: false
    }
  ]);

  const [timer, setTimer] = useState<number | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    sounds.forEach(sound => {
      if (!audioRefs.current[sound.id]) {
        const audio = new Audio(sound.url);
        audio.loop = true;
        audioRefs.current[sound.id] = audio;
      }
      
      const audio = audioRefs.current[sound.id];
      audio.volume = sound.volume;
      
      if (sound.isPlaying) {
        audio.play().catch(() => {
          setSounds(prev => prev.map(s => 
            s.id === sound.id ? { ...s, isPlaying: false } : s
          ));
        });
      } else {
        audio.pause();
      }
    });

    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, [sounds]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev === null || prev <= 1) {
            stopAllSounds();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const toggleSound = (id: string) => {
    setSounds(prev => prev.map(sound => 
      sound.id === id ? { ...sound, isPlaying: !sound.isPlaying } : sound
    ));
  };

  const updateVolume = (id: string, volume: number) => {
    setSounds(prev => prev.map(sound => 
      sound.id === id ? { ...sound, volume } : sound
    ));
  };

  const stopAllSounds = () => {
    setSounds(prev => prev.map(sound => ({ ...sound, isPlaying: false })));
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-blue-900/30 via-gray-900 to-cyan-900/30 backdrop-blur-lg z-50"
      >
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setTimer(timer === null ? 3600 : null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Clock className="h-6 w-6" />
            </button>
            {timer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full right-0 mt-2 bg-gray-800 rounded-lg px-3 py-1 text-sm text-gray-300"
              >
                {formatTime(timer)}
              </motion.div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="h-full flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl w-full space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Som Ambiente
              </h2>
              <p className="text-xl text-blue-200/80">
                Combine sons relaxantes para criar seu ambiente perfeito
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sounds.map(sound => (
                <motion.div
                  key={sound.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sound.icon}</span>
                      <span className="text-lg font-medium text-white">
                        {sound.name}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleSound(sound.id)}
                      className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                    >
                      {sound.isPlaying ? (
                        <Pause className="h-5 w-5 text-blue-400" />
                      ) : (
                        <Play className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={sound.volume}
                    onChange={(e) => updateVolume(sound.id, parseFloat(e.target.value))}
                    className="w-full"
                  />
                </motion.div>
              ))}
            </div>

            {timer !== null && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setTimer(1800)} // 30min
                  className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
                >
                  30min
                </button>
                <button
                  onClick={() => setTimer(3600)} // 1h
                  className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
                >
                  1h
                </button>
                <button
                  onClick={() => setTimer(7200)} // 2h
                  className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
                >
                  2h
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};