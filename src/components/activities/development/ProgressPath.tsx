import React from 'react';
import { motion } from 'framer-motion';
import { Flag, Star, Trophy } from 'lucide-react';
import { Card } from '../../ui/Card';

interface ProgressPathProps {
  progress: number;
}

export const ProgressPath: React.FC<ProgressPathProps> = ({ progress }) => {
  const milestones = [
    { icon: Flag, label: 'Iniciante', percent: 0 },
    { icon: Star, label: 'Intermediário', percent: 50 },
    { icon: Trophy, label: 'Avançado', percent: 100 }
  ];

  return (
    <Card title="Caminho de Progresso">
      <div className="relative pt-8 pb-4">
        {/* Linha de Progresso */}
        <div className="absolute top-12 left-0 w-full h-1 bg-gray-700">
          <motion.div
            className="absolute top-0 left-0 h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Marcos */}
        <div className="relative flex justify-between">
          {milestones.map(({ icon: Icon, label, percent }, index) => (
            <div
              key={label}
              className={`flex flex-col items-center ${
                progress >= percent ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${progress >= percent ? 'bg-blue-500/20' : 'bg-gray-800'}
                transition-colors duration-300
              `}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-sm mt-2">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};