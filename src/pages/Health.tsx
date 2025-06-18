import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Droplet, Apple, Dumbbell, Moon, 
  TrendingUp, Calendar, Plus, BarChart2, Target,
  Clock, Award, Battery, X, Filter, ArrowLeft, ArrowRight
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useHealth } from '../contexts/HealthContext';

export const Health: React.FC = () => {
  const { 
    metrics, 
    goals, 
    insights, 
    addMetric, 
    getHealthScore, 
    getGoalProgress,
    getTodaysMetrics
  } = useHealth();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [showAddMetricModal, setShowAddMetricModal] = useState(false);
  const [metricType, setMetricType] = useState<'water' | 'sleep' | 'exercise' | 'nutrition'>('water');
  const [metricValue, setMetricValue] = useState('');
  
  // Calculate health score
  const healthScore = getHealthScore();

  // Get daily goals
  const dailyGoals = goals.filter(goal => goal.isActive).map(goal => {
    const progress = getGoalProgress(goal.id);
    return {
      id: goal.id,
      type: goal.type,
      icon: goal.type === 'water' ? Droplet : 
            goal.type === 'sleep' ? Moon :
            goal.type === 'exercise' ? Dumbbell : Apple,
      label: goal.type === 'water' ? 'Água' : 
             goal.type === 'sleep' ? 'Sono' :
             goal.type === 'exercise' ? 'Exercício' : 'Nutrição',
      current: getTodaysMetrics()
        .filter(m => m.type === goal.type)
        .reduce((sum, m) => sum + m.value, 0),
      target: goal.target,
      unit: goal.unit,
      progress,
      color: goal.type === 'water' ? 'blue' : 
             goal.type === 'sleep' ? 'purple' :
             goal.type === 'exercise' ? 'green' : 'red'
    };
  });

  const handleAddMetric = () => {
    if (!metricValue || parseFloat(metricValue) <= 0) return;

    const value = parseFloat(metricValue);
    const unit = metricType === 'water' ? 'ml' : 
                metricType === 'sleep' ? 'horas' :
                metricType === 'exercise' ? 'min' : 'pontos';

    addMetric({
      type: metricType,
      value,
      unit,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });

    setMetricValue('');
    setShowAddMetricModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Saúde e Bem-estar</h1>
          <p className="text-gray-400">Monitore seus hábitos saudáveis e alcance suas metas</p>
        </div>
        <Button
          onClick={() => setShowAddMetricModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Registrar Atividade
        </Button>
      </div>

      {/* Health Score */}
      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
        <div className="flex items-center gap-6">
          <div className="relative">
            <svg className="w-32 h-32">
              <circle
                className="text-gray-700"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="56"
                cx="64"
                cy="64"
              />
              <circle
                className="text-green-500"
                strokeWidth="8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="56"
                cx="64"
                cy="64"
                strokeDasharray={`${healthScore * 3.51} 351`}
                transform="rotate(-90 64 64)"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-3xl font-bold text-white">{healthScore}</span>
              <span className="text-sm text-gray-400 block">Score</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Score de Saúde</h3>
            <p className="text-gray-400">
              {healthScore > 80 ? 'Seu score de saúde está ótimo! Continue mantendo bons hábitos.' :
               healthScore > 60 ? 'Seu score de saúde está bom. Continue melhorando seus hábitos.' :
               healthScore > 40 ? 'Seu score de saúde está regular. Foque em melhorar seus hábitos.' :
               'Seu score de saúde precisa de atenção. Vamos trabalhar para melhorá-lo.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Daily Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dailyGoals.map((goal) => (
          <Card key={goal.id}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 bg-${goal.color}-500/20 rounded-lg`}>
                <goal.icon className={`h-6 w-6 text-${goal.color}-500`} />
              </div>
              <span className="text-sm text-gray-400">{goal.label}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">
                  {goal.current}
                  <span className="text-sm text-gray-400 ml-1">{goal.unit}</span>
                </span>
                <span className="text-sm text-gray-400">
                  Meta: {goal.target} {goal.unit}
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress}%` }}
                  className={`h-full bg-${goal.color}-500 rounded-full`}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{goal.progress.toFixed(0)}%</span>
                <span>{Math.max(0, goal.target - goal.current)} {goal.unit} restantes</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Weekly Progress */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">Progresso Semanal</h3>
          <div className="flex items-center gap-2">
            {['day', 'week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period as any)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {period === 'day' ? 'Dia' : period === 'week' ? 'Semana' : 'Mês'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-6">
          {Array.from({ length: 7 }).map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - 6 + index);
            const dateStr = date.toISOString().split('T')[0];
            const dayMetrics = metrics.filter(m => m.date === dateStr);
            const dayScore = dayMetrics.length > 0 ? 
              Math.min(100, dayMetrics.reduce((sum, m) => {
                const goal = goals.find(g => g.type === m.type);
                return sum + (goal ? Math.min(100, (m.value / goal.target) * 100) : 0);
              }, 0) / Math.max(1, dayMetrics.length)) : 0;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="text-xs text-gray-400 mb-1">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][date.getDay()]}
                </div>
                <div className="relative w-full">
                  <div className="h-24 bg-gray-700 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${dayScore}%` }}
                      className="absolute bottom-0 w-full bg-blue-500 rounded-b-lg"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {date.getDate()}/{date.getMonth() + 1}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Score Diário</span>
          </div>
          <span>Média: {healthScore}%</span>
        </div>
      </Card>

      {/* Recommendations */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">Recomendações Personalizadas</h3>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-lg bg-gray-700 text-gray-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button className="p-1 rounded-lg bg-gray-700 text-gray-400 hover:text-white">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <h4 className="font-medium text-white">Sono</h4>
            </div>
            <p className="text-sm text-gray-400">
              Tente dormir 30 minutos mais cedo para alcançar sua meta de 8 horas de sono.
            </p>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Target className="h-5 w-5 text-green-500" />
              </div>
              <h4 className="font-medium text-white">Exercício</h4>
            </div>
            <p className="text-sm text-gray-400">
              Você está próximo da sua meta de exercícios. Mais 15 minutos hoje!
            </p>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Battery className="h-5 w-5 text-purple-500" />
              </div>
              <h4 className="font-medium text-white">Energia</h4>
            </div>
            <p className="text-sm text-gray-400">
              Seu nível de energia está ótimo! Continue com a rotina atual.
            </p>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">Conquistas Recentes</h3>
          <Button variant="secondary" size="sm">
            Ver Todas
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: '7 Dias Ativos', description: 'Exercitou-se por 7 dias seguidos' },
            { title: 'Meta de Água', description: 'Atingiu a meta de água por 5 dias' },
            { title: 'Sono Regular', description: 'Manteve horário regular de sono' },
            { title: 'Dieta Equilibrada', description: 'Manteve dieta balanceada por 1 semana' }
          ].map((achievement, index) => (
            <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <Award className="h-8 w-8 text-yellow-500 mb-3" />
              <h4 className="font-medium text-white mb-1">{achievement.title}</h4>
              <p className="text-sm text-gray-400">{achievement.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Add Metric Modal */}
      <AnimatePresence>
        {showAddMetricModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Registrar Atividade</h3>
                <button
                  onClick={() => setShowAddMetricModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tipo de Atividade
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setMetricType('water')}
                      className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors ${
                        metricType === 'water'
                          ? 'bg-blue-500/20 border-blue-500'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <Droplet className="h-5 w-5 text-blue-500" />
                      <span className="text-sm">Água</span>
                    </button>
                    <button
                      onClick={() => setMetricType('sleep')}
                      className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors ${
                        metricType === 'sleep'
                          ? 'bg-purple-500/20 border-purple-500'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <Moon className="h-5 w-5 text-purple-500" />
                      <span className="text-sm">Sono</span>
                    </button>
                    <button
                      onClick={() => setMetricType('exercise')}
                      className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors ${
                        metricType === 'exercise'
                          ? 'bg-green-500/20 border-green-500'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <Dumbbell className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Exercício</span>
                    </button>
                    <button
                      onClick={() => setMetricType('nutrition')}
                      className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors ${
                        metricType === 'nutrition'
                          ? 'bg-red-500/20 border-red-500'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <Apple className="h-5 w-5 text-red-500" />
                      <span className="text-sm">Nutrição</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {metricType === 'water' ? 'Quantidade (ml)' :
                     metricType === 'sleep' ? 'Duração (horas)' :
                     metricType === 'exercise' ? 'Duração (minutos)' :
                     'Pontuação (1-10)'}
                  </label>
                  <input
                    type="number"
                    value={metricValue}
                    onChange={(e) => setMetricValue(e.target.value)}
                    min="0"
                    max={metricType === 'nutrition' ? "10" : undefined}
                    step={metricType === 'sleep' ? "0.5" : "1"}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                    placeholder={metricType === 'water' ? "Ex: 500" :
                                metricType === 'sleep' ? "Ex: 8" :
                                metricType === 'exercise' ? "Ex: 30" :
                                "Ex: 8"}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => setShowAddMetricModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAddMetric}
                    disabled={!metricValue || parseFloat(metricValue) <= 0}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Registrar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};