import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Clock, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { useActivities } from '../../contexts/ActivitiesContext';

export const ProductivityInsights: React.FC = () => {
  const { activities } = useActivities();
  const [currentInsightIndex, setCurrentInsightIndex] = React.useState(0);

  const insights = React.useMemo(() => {
    // Calcular horário mais produtivo
    const completedActivities = activities.filter(a => a.status === 'completed');
    const timeMap = new Map<number, number>();
    
    completedActivities.forEach(activity => {
      const hour = parseInt(activity.time.split(':')[0]);
      timeMap.set(hour, (timeMap.get(hour) || 0) + 1);
    });

    let mostProductiveHour = 0;
    let maxCompletions = 0;
    timeMap.forEach((completions, hour) => {
      if (completions > maxCompletions) {
        maxCompletions = completions;
        mostProductiveHour = hour;
      }
    });

    // Calcular sequência atual de atividades completadas
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < activities.length; i++) {
      if (activities[i].date === today && activities[i].status === 'completed') {
        currentStreak++;
      }
    }

    // Calcular taxa de conclusão por categoria
    const categoryStats = new Map<string, { total: number; completed: number }>();
    activities.forEach(activity => {
      const stats = categoryStats.get(activity.category) || { total: 0, completed: 0 };
      stats.total++;
      if (activity.status === 'completed') stats.completed++;
      categoryStats.set(activity.category, stats);
    });

    let bestCategory = '';
    let bestRate = 0;
    categoryStats.forEach((stats, category) => {
      const rate = stats.completed / stats.total;
      if (rate > bestRate) {
        bestRate = rate;
        bestCategory = category;
      }
    });

    return [
      {
        icon: Clock,
        title: 'Horário Mais Produtivo',
        description: `Você é mais produtivo às ${mostProductiveHour}:00h`,
        color: 'text-blue-500'
      },
      {
        icon: TrendingUp,
        title: 'Sequência Atual',
        description: `${currentStreak} atividades completadas hoje`,
        color: 'text-green-500'
      },
      {
        icon: Target,
        title: 'Categoria Destaque',
        description: `Melhor desempenho em ${bestCategory}`,
        color: 'text-purple-500'
      },
      {
        icon: Brain,
        title: 'Dica Personalizada',
        description: `Programe suas tarefas mais importantes para ${mostProductiveHour}:00h`,
        color: 'text-cyan-500'
      }
    ];
  }, [activities]);

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-medium text-white">Insights de Produtividade</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentInsightIndex(prev => 
              prev === 0 ? insights.length - 1 : prev - 1
            )}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-400" />
          </button>
          <button
            onClick={() => setCurrentInsightIndex(prev => 
              prev === insights.length - 1 ? 0 : prev + 1
            )}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      <motion.div
        key={currentInsightIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex items-start gap-4"
      >
        {React.createElement(insights[currentInsightIndex].icon, {
          className: `h-8 w-8 ${insights[currentInsightIndex].color}`
        })}
        <div>
          <h4 className="text-lg font-medium text-white mb-2">
            {insights[currentInsightIndex].title}
          </h4>
          <p className="text-gray-400">
            {insights[currentInsightIndex].description}
          </p>
        </div>
      </motion.div>

      <div className="flex justify-center mt-4 gap-2">
        {insights.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentInsightIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentInsightIndex ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};