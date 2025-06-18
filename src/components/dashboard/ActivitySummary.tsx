import React from 'react';
import { Calendar, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useActivities } from '../../contexts/ActivitiesContext';
import { motion } from 'framer-motion';

export const ActivitySummary: React.FC = () => {
  const { getDailyActivities, toggleActivityStatus } = useActivities();
  const activities = getDailyActivities();

  return (
    <Card title="Atividades do Dia">
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.slice(0, 4).map((activity, index) => (
            <motion.div 
              key={activity.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleActivityStatus(activity.id)}
                  className={`rounded-full p-1 transition-colors ${
                    activity.status === 'completed' 
                      ? 'text-green-500' 
                      : 'text-gray-500 group-hover:text-gray-400'
                  }`}
                >
                  <CheckCircle className="h-5 w-5" />
                </button>
                <div>
                  <span className={activity.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'}>
                    {activity.title}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>{activity.time}</span>
                    {activity.priority === 'high' && (
                      <span className="px-1.5 py-0.5 bg-red-500/20 text-red-500 rounded-full text-[10px]">
                        Prioridade
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-4">
            <Calendar className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400">Nenhuma atividade para hoje</p>
          </div>
        )}
        
        {activities.length > 4 && (
          <div className="text-sm text-gray-400 text-center">
            + {activities.length - 4} mais atividades
          </div>
        )}
        
        <Button 
          className="w-full mt-4 flex items-center justify-center gap-1"
          variant="secondary"
        >
          Ver Todas Atividades
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};