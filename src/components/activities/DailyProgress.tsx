import React from 'react';
import { motion } from 'framer-motion';
import { useActivities } from '../../contexts/ActivitiesContext';

export const DailyProgress: React.FC = () => {
  const { getCompletionRate } = useActivities();
  const { completed, total } = getCompletionRate();
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-300">
          Progresso Diário
        </span>
        <span className="text-sm font-medium text-blue-400">
          {completed}/{total} atividades
        </span>
      </div>
      <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{percentage.toFixed(0)}% concluído</span>
        <span>{total - completed} restantes</span>
      </div>
    </div>
  );
};