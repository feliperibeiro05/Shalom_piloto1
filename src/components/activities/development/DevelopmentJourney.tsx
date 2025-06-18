import React, { useState } from 'react';
import { Brain, Target, Sparkles, BookOpen, Trophy, BarChart2, Calendar, Clock, Zap, Flag, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ProgressPath } from './ProgressPath';
import { MilestoneTracker } from './MilestoneTracker';
import { HabitBuilder } from './HabitBuilder';
import { SkillTree } from './SkillTree';
import { NewPlanModal } from './NewPlanModal';
import { useDevelopment } from '../../../contexts/DevelopmentContext';

export const DevelopmentJourney: React.FC = () => {
  const { 
    plans, 
    activePlanId, 
    setActivePlan,
    toggleMilestone,
    updateHabitStreak,
    updateSkillProgress
  } = useDevelopment();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'habits' | 'skills'>('overview');
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);

  const activePlan = plans.find(plan => plan.id === activePlanId);

  // Calculate daily practice time
  const dailyPracticeTime = React.useMemo(() => {
    if (!activePlan) return 0;
    return activePlan.habits.reduce((total, habit) => {
      if (habit.lastCompleted === new Date().toISOString().split('T')[0]) {
        return total + 45; // Assuming 45 minutes per completed habit
      }
      return total;
    }, 0);
  }, [activePlan]);

  // Calculate completed activities today
  const completedActivities = React.useMemo(() => {
    if (!activePlan) return 0;
    return activePlan.habits.filter(habit => 
      habit.lastCompleted === new Date().toISOString().split('T')[0]
    ).length;
  }, [activePlan]);

  // Calculate current streak
  const currentStreak = React.useMemo(() => {
    if (!activePlan) return 0;
    return Math.max(...activePlan.habits.map(habit => habit.streak));
  }, [activePlan]);

  // Get next steps based on incomplete milestones
  const nextSteps = React.useMemo(() => {
    if (!activePlan) return [];
    return activePlan.milestones
      .filter(m => !m.completed)
      .slice(0, 3);
  }, [activePlan]);

  // Get recent achievements
  const recentAchievements = React.useMemo(() => {
    if (!activePlan) return [];
    return activePlan.milestones
      .filter(m => m.completed)
      .sort((a, b) => {
        const dateA = new Date(a.completedDate || 0);
        const dateB = new Date(b.completedDate || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 2);
  }, [activePlan]);

  const handleCreateFirstItem = (tab: 'milestones' | 'habits' | 'skills') => {
    setActiveTab(tab);
    // The respective component will show its creation form
  };

  if (!activePlan && plans.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700 p-8">
        <Brain className="h-20 w-20 text-blue-500/50 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-white mb-4">
          Comece sua jornada de desenvolvimento
        </h3>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
          Crie um plano personalizado para acompanhar seu progresso, desenvolver hábitos consistentes e mapear suas habilidades em qualquer área de interesse.
        </p>
        <Button
          onClick={() => setShowNewPlanModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-lg"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Criar Meu Primeiro Plano
        </Button>

        <NewPlanModal
          isOpen={showNewPlanModal}
          onClose={() => setShowNewPlanModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-white">Jornada de Desenvolvimento</h2>
            <p className="text-gray-400">Transforme seus objetivos em realidade</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {plans.length > 0 && (
            <select
              value={activePlanId || ''}
              onChange={(e) => setActivePlan(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            >
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.title}
                </option>
              ))}
            </select>
          )}
          <Button
            onClick={() => setShowNewPlanModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Jornada
          </Button>
        </div>
      </div>

      {activePlan && (
        <>
          {/* Tabs de Navegação */}
          <div className="flex gap-2 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('milestones')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'milestones'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Marcos
            </button>
            <button
              onClick={() => setActiveTab('habits')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'habits'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Hábitos
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'skills'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Árvore de Habilidades
            </button>
          </div>

          {/* Conteúdo Principal */}
          <div className="grid grid-cols-12 gap-6">
            {/* Coluna Principal */}
            <div className="col-span-8">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Cartão de Progresso */}
                  <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>Meta: {new Date(activePlan.targetDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="pt-12 pb-6 px-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {activePlan.title}
                      </h3>
                      <p className="text-gray-400 mb-6">
                        {activePlan.description}
                      </p>

                      {/* Barra de Progresso */}
                      <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden mb-4">
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${activePlan.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progresso Geral</span>
                        <span className="text-white font-medium">{activePlan.progress}%</span>
                      </div>
                    </div>

                    {/* Estatísticas Rápidas */}
                    <div className="grid grid-cols-4 gap-4 p-6 bg-gray-800/50">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {activePlan.milestones.filter(m => m.completed).length}
                          <span className="text-gray-400">/{activePlan.milestones.length}</span>
                        </div>
                        <span className="text-sm text-gray-400">Marcos Alcançados</span>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {currentStreak}
                        </div>
                        <span className="text-sm text-gray-400">Maior Sequência</span>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {activePlan.skillTree.level}
                        </div>
                        <span className="text-sm text-gray-400">Nível Atual</span>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {Math.floor((new Date(activePlan.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                        </div>
                        <span className="text-sm text-gray-400">Dias Restantes</span>
                      </div>
                    </div>
                  </Card>

                  {/* Próximos Passos */}
                  <Card title="Próximos Passos Recomendados">
                    <div className="space-y-4">
                      {nextSteps.map(milestone => (
                        <div key={milestone.id} className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Target className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white mb-1">{milestone.title}</h4>
                            <p className="text-sm text-gray-400">{milestone.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Conquistas Recentes */}
                  {recentAchievements.length > 0 && (
                    <Card title="Conquistas Recentes">
                      <div className="space-y-4">
                        {recentAchievements.map(milestone => (
                          <div key={milestone.id} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                            <Trophy className="h-6 w-6 text-yellow-500" />
                            <div>
                              <h4 className="font-medium text-white">{milestone.title}</h4>
                              <p className="text-sm text-gray-400">{milestone.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === 'milestones' && (
                <MilestoneTracker 
                  milestones={activePlan.milestones}
                  planId={activePlan.id}
                />
              )}

              {activeTab === 'habits' && (
                <HabitBuilder
                  habits={activePlan.habits}
                  planId={activePlan.id}
                />
              )}

              {activeTab === 'skills' && (
                <SkillTree
                  skill={activePlan.skillTree}
                  planId={activePlan.id}
                />
              )}
            </div>

            {/* Coluna Lateral */}
            <div className="col-span-4 space-y-6">
              {/* Progresso Diário */}
              <Card title="Progresso Diário">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-400">Tempo de Prática Hoje</span>
                    </div>
                    <span className="text-lg font-bold text-white">{dailyPracticeTime} min</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-400">Atividades Concluídas</span>
                    </div>
                    <span className="text-lg font-bold text-white">{completedActivities}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-400">Sequência Atual</span>
                    </div>
                    <span className="text-lg font-bold text-white">{currentStreak} dias</span>
                  </div>
                </div>
              </Card>

              {/* Caminho de Progresso */}
              <ProgressPath progress={activePlan.progress} />

              {/* Dicas Personalizadas */}
              <Card title="Dicas Personalizadas">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Consistência é Chave</h4>
                    <p className="text-sm text-gray-400">
                      Mantenha uma rotina regular de prática em {activePlan.category}. Pequenos progressos diários levam a grandes resultados.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Método de Aprendizado</h4>
                    <p className="text-sm text-gray-400">
                      Alterne entre teoria e prática. Dedique tempo para entender os fundamentos e depois aplique em projetos reais.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Próximo Foco</h4>
                    <p className="text-sm text-gray-400">
                      Concentre-se em {
                        activePlan.milestones.find(m => !m.completed)?.title || 'consolidar seus conhecimentos atuais'
                      }.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      <NewPlanModal
        isOpen={showNewPlanModal}
        onClose={() => setShowNewPlanModal(false)}
      />
    </div>
  );
};