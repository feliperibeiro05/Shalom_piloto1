import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Target, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useDevelopment } from '../../contexts/DevelopmentContext';
import { useNavigate } from 'react-router-dom';

export const NextGoalWidget: React.FC = () => {
  const { plans } = useDevelopment();
  const navigate = useNavigate();
  
  // Get the active plan and its next incomplete milestone
  const activePlan = plans.find(plan => plan.id === plans[0]?.id);
  const nextMilestone = activePlan?.milestones.find(m => !m.completed);
  
  if (!nextMilestone) {
    return (
      <Card title="Próxima Meta">
        <div className="text-center py-4">
          <Target className="h-12 w-12 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400">Nenhuma meta pendente</p>
          <p className="text-sm text-gray-500">Crie novas metas para acompanhar seu progresso</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Próxima Meta">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <Target className="h-6 w-6 text-purple-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-white mb-1">{nextMilestone.title}</h3>
            <p className="text-sm text-gray-400">{nextMilestone.description}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Progresso</span>
            <span className="text-white">{Math.round((nextMilestone.progress / nextMilestone.total) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(nextMilestone.progress / nextMilestone.total) * 100}%` }}
              className="h-full bg-purple-500 rounded-full"
            />
          </div>
        </div>
        
        <p className="text-sm text-gray-400">
          Você está a {nextMilestone.total - nextMilestone.progress} passos de concluir esta meta.
        </p>
        
        <Button 
          onClick={() => navigate('/dashboard/activities')}
          className="w-full flex items-center justify-center gap-1"
          variant="secondary"
        >
          Ver Detalhes
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};