import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { useActivities } from '../../contexts/ActivitiesContext';
import { ChevronLeft, ChevronRight, TrendingUp, Brain, Clock, Target, List, Coffee, Sun } from 'lucide-react';

export const ProductivityChart: React.FC = () => {
  const { activities } = useActivities();
  const [currentTipIndex, setCurrentTipIndex] = React.useState(0);

  const productivityTips = [
    {
      icon: Brain,
      title: "Técnica Pomodoro",
      description: "Use intervalos de 25 minutos de foco total, seguidos por 5 minutos de descanso para maximizar sua produtividade."
    },
    {
      icon: Clock,
      title: "Horário Mais Produtivo",
      description: "Identifique seu período mais produtivo do dia e programe as tarefas mais importantes para esse momento."
    },
    {
      icon: Target,
      title: "Regra dos 2 Minutos",
      description: "Se uma tarefa leva menos de 2 minutos, faça-a imediatamente em vez de adicioná-la à sua lista."
    },
    {
      icon: List,
      title: "Método Eisenhower",
      description: "Organize suas tarefas por importância e urgência para priorizar melhor seu tempo."
    },
    {
      icon: Coffee,
      title: "Pausas Estratégicas",
      description: "Faça pausas curtas e regulares para manter seu cérebro energizado e evitar fadiga mental."
    },
    {
      icon: Sun,
      title: "Rotina Matinal",
      description: "Estabeleça uma rotina matinal sólida para começar o dia com mais foco e energia."
    },
    {
      icon: Brain,
      title: "Single-tasking",
      description: "Foque em uma tarefa por vez em vez de multitarefa para melhorar a qualidade e eficiência."
    }
  ];

  const data = useMemo(() => {
    const today = new Date();
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayActivities = activities.filter(a => a.date === dateStr);
      const completed = dayActivities.filter(a => a.status === 'completed').length;
      const pending = dayActivities.filter(a => a.status === 'pending').length;
      const late = dayActivities.filter(a => a.status === 'late').length;

      data.push({
        day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][date.getDay()],
        concluídas: completed,
        pendentes: pending,
        atrasadas: late
      });
    }

    return data;
  }, [activities]);

  const insights = useMemo(() => {
    const totalActivities = activities.length;
    const completedActivities = activities.filter(a => a.status === 'completed').length;
    const completionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;
    
    const morningActivities = activities.filter(a => {
      const hour = parseInt(a.time.split(':')[0]);
      return hour >= 5 && hour < 12;
    }).length;
    
    const afternoonActivities = activities.filter(a => {
      const hour = parseInt(a.time.split(':')[0]);
      return hour >= 12 && hour < 18;
    }).length;
    
    const eveningActivities = activities.filter(a => {
      const hour = parseInt(a.time.split(':')[0]);
      return hour >= 18 || hour < 5;
    }).length;

    const mostProductivePeriod = Math.max(morningActivities, afternoonActivities, eveningActivities);
    let productivePeriod = '';
    if (mostProductivePeriod === morningActivities) productivePeriod = 'manhã';
    else if (mostProductivePeriod === afternoonActivities) productivePeriod = 'tarde';
    else productivePeriod = 'noite';

    return [
      {
        title: 'Taxa de Conclusão',
        value: `${completionRate.toFixed(1)}%`,
        description: `Você completa em média ${completionRate.toFixed(1)}% de suas atividades`,
        trend: completionRate > 70 ? 'positive' : completionRate > 50 ? 'neutral' : 'negative'
      },
      {
        title: 'Período Mais Produtivo',
        value: productivePeriod,
        description: `Você tende a ser mais produtivo durante a ${productivePeriod}`,
        trend: 'info'
      },
      {
        title: 'Consistência',
        value: totalActivities > 0 ? 'Ativa' : 'Iniciando',
        description: `${totalActivities} atividades registradas no total`,
        trend: totalActivities > 10 ? 'positive' : 'neutral'
      }
    ];
  }, [activities]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg"
      >
        <p className="font-medium text-gray-300 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-400">{entry.name}:</span>
            <span className="text-white font-medium">{entry.value}</span>
          </div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="lateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="day" 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Bar
              dataKey="concluídas"
              fill="url(#completedGradient)"
              radius={[4, 4, 0, 0]}
              name="Concluídas"
            />
            <Bar
              dataKey="pendentes"
              fill="url(#pendingGradient)"
              radius={[4, 4, 0, 0]}
              name="Pendentes"
            />
            <Bar
              dataKey="atrasadas"
              fill="url(#lateGradient)"
              radius={[4, 4, 0, 0]}
              name="Atrasadas"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-400">{insight.title}</h4>
              <TrendingUp className={`h-4 w-4 ${
                insight.trend === 'positive' ? 'text-green-500' :
                insight.trend === 'negative' ? 'text-red-500' :
                insight.trend === 'info' ? 'text-blue-500' : 'text-yellow-500'
              }`} />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{insight.value}</p>
            <p className="text-sm text-gray-400">{insight.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Productivity Tips Carousel */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Dicas de Produtividade</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTipIndex(prev => (prev === 0 ? productivityTips.length - 1 : prev - 1))}
              className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-400" />
            </button>
            <button
              onClick={() => setCurrentTipIndex(prev => (prev === productivityTips.length - 1 ? 0 : prev + 1))}
              className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <motion.div
            key={currentTipIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-start gap-4"
          >
            {React.createElement(productivityTips[currentTipIndex].icon, {
              className: "h-8 w-8 text-blue-500 flex-shrink-0"
            })}
            <div>
              <h4 className="text-lg font-medium text-white mb-2">
                {productivityTips[currentTipIndex].title}
              </h4>
              <p className="text-gray-400">
                {productivityTips[currentTipIndex].description}
              </p>
            </div>
          </motion.div>

          <div className="flex justify-center mt-4 gap-2">
            {productivityTips.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTipIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentTipIndex ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};