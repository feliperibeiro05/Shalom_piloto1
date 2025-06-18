import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useActivities } from '../contexts/ActivitiesContext';
import { useFinancial } from '../contexts/FinancialContext';
import { useHealth } from '../contexts/HealthContext';
import { useDevelopment } from '../contexts/DevelopmentContext';
import { useEmotional } from '../contexts/EmotionalContext';
import { WelcomeMessage } from '../components/dashboard/WelcomeMessage';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { ActivitySummary } from '../components/dashboard/ActivitySummary';
import { FinancialHealth } from '../components/dashboard/FinancialHealth';
import { InvestmentChart } from '../components/dashboard/InvestmentChart';
import { CommunityHighlights } from '../components/dashboard/CommunityHighlights';
import { NewsDigest } from '../components/dashboard/NewsDigest';
import { ProgressSummary } from '../components/dashboard/ProgressSummary';
import { NextGoalWidget } from '../components/dashboard/NextGoalWidget';
import { MoodWidget } from '../components/dashboard/MoodWidget';
import { QuickActions } from '../components/dashboard/QuickActions';
import { 
  Bell, Plus, Calendar, ChevronRight, Target, 
  Brain, Heart, PiggyBank, BookOpen, BarChart2
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { activities, getDailyActivities, getPriorityActivities } = useActivities();
  const { getBalance, getIncomeTotal, getExpenseTotal } = useFinancial();
  const { getHealthScore } = useHealth();
  const { plans } = useDevelopment();
  const { getWellbeingScore } = useEmotional();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<{id: string; title: string; message: string; type: string}[]>([]);

  // Calculate stats
  const dailyActivities = getDailyActivities();
  const priorityActivities = getPriorityActivities();
  
  // Generate notifications
  useEffect(() => {
    const newNotifications = [];
    
    // Activity notifications
    if (priorityActivities.length > 0) {
      newNotifications.push({
        id: 'priority-1',
        title: 'Prioridade Pendente',
        message: `Você tem ${priorityActivities.length} atividades prioritárias para esta semana.`,
        type: 'warning'
      });
    }
    
    // Financial notifications
    const monthlyIncome = getIncomeTotal('month');
    const monthlyExpenses = getExpenseTotal('month');
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
    
    if (savingsRate < 10) {
      newNotifications.push({
        id: 'finance-1',
        title: 'Taxa de Poupança Baixa',
        message: 'Sua taxa de poupança está abaixo de 10%. Considere revisar seus gastos.',
        type: 'alert'
      });
    }
    
    // Health notifications
    const healthScore = getHealthScore();
    if (healthScore < 50) {
      newNotifications.push({
        id: 'health-1',
        title: 'Score de Saúde Baixo',
        message: 'Seu score de saúde está abaixo do ideal. Considere focar em suas metas diárias.',
        type: 'warning'
      });
    }
    
    // Emotional notifications
    const wellbeingScore = getWellbeingScore();
    if (wellbeingScore > 80) {
      newNotifications.push({
        id: 'emotional-1',
        title: 'Bem-estar Excelente!',
        message: 'Seu bem-estar emocional está ótimo! Continue com suas práticas atuais.',
        type: 'success'
      });
    }
    
    setNotifications(newNotifications);
  }, [priorityActivities.length, getIncomeTotal, getExpenseTotal, getHealthScore, getWellbeingScore]);

  return (
    <div className="space-y-6">
      {/* Header with Notifications */}
      <div className="flex items-center justify-between mb-4">
        <WelcomeMessage />
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 bg-gray-800 rounded-lg relative"
          >
            <Bell className="h-6 w-6 text-gray-400" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                {notifications.length}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-700">
              <div className="p-3 border-b border-gray-700">
                <h3 className="font-medium text-white">Notificações</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-3 border-b border-gray-700 hover:bg-gray-700/50 transition-colors ${
                        notification.type === 'alert' ? 'border-l-4 border-l-red-500' :
                        notification.type === 'warning' ? 'border-l-4 border-l-yellow-500' :
                        notification.type === 'success' ? 'border-l-4 border-l-green-500' :
                        'border-l-4 border-l-blue-500'
                      }`}
                    >
                      <h4 className="font-medium text-white text-sm">{notification.title}</h4>
                      <p className="text-gray-400 text-xs mt-1">{notification.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    Nenhuma notificação
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview with Comparisons */}
      <StatsOverview />

      {/* Progress Summary */}
      <ProgressSummary />

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Calendar with Important Events */}
          <Card title="Calendário de Eventos">
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
                  <div key={index} className="text-center text-sm text-gray-400">
                    {day}
                  </div>
                ))}
                
                {Array.from({ length: 35 }).map((_, index) => {
                  const date = new Date();
                  date.setDate(date.getDate() - date.getDay() + index);
                  const dateStr = date.toISOString().split('T')[0];
                  const isToday = new Date().toISOString().split('T')[0] === dateStr;
                  const hasEvents = activities.some(a => a.date === dateStr);
                  
                  return (
                    <div 
                      key={index}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm relative ${
                        isToday 
                          ? 'bg-blue-500/20 text-blue-500 font-medium border border-blue-500' 
                          : hasEvents
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-800/50 text-gray-400'
                      }`}
                    >
                      {date.getDate()}
                      {hasEvents && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-300">Próximos Eventos</h4>
                {dailyActivities.slice(0, 3).map((activity, index) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-700 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{activity.title}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => window.location.href = '/dashboard/activities'}
                >
                  Ver Todos os Eventos
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <QuickActions />

          {/* Community and News */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CommunityHighlights />
            <NewsDigest />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Next Goal Widget */}
          <NextGoalWidget />
          
          {/* Mood Widget */}
          <MoodWidget />
          
          {/* Financial Health */}
          <FinancialHealth />
          
          {/* Investment Chart */}
          <InvestmentChart />
        </div>
      </div>
    </div>
  );
};