import React from 'react';
import { AlertCircle, Clock, CheckCircle, Flag } from 'lucide-react';
import { useActivities } from '../../contexts/ActivitiesContext';
import { motion } from 'framer-motion';

export const PriorityView: React.FC = () => {
  const { getPriorityActivities, toggleActivityStatus, deleteActivity } = useActivities();
  const priorityActivities = getPriorityActivities();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'late':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (priorityActivities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Flag className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Nenhuma prioridade definida para esta semana.</p>
        <p className="text-sm">Adicione atividades prioritárias para acompanhar aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {priorityActivities.map(activity => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          whileHover={{ scale: 1.02 }}
          className="group relative bg-gray-800/50 rounded-lg p-4 border-l-2 border-blue-500 hover:bg-gray-800 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-white">{activity.title}</h4>
              {activity.description && (
                <p className="text-sm text-gray-400 mt-1">{activity.description}</p>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                <span>{new Date(activity.date).toLocaleDateString()}</span>
                {activity.time && (
                  <>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleActivityStatus(activity.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {getStatusIcon(activity.status)}
              </button>
              <button
                onClick={() => deleteActivity(activity.id)}
                className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
              >
                <AlertCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};