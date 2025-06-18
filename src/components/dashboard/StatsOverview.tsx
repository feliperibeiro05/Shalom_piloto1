import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Heart, Brain, ArrowUp, ArrowDown } from 'lucide-react';
import { useActivities } from '../../contexts/ActivitiesContext';
import { useFinancial } from '../../contexts/FinancialContext';
import { useHealth } from '../../contexts/HealthContext';
import { useEmotional } from '../../contexts/EmotionalContext';

export const StatsOverview: React.FC = () => {
  const { getCompletionRate } = useActivities();
  const { getBalance, getIncomeTotal, getExpenseTotal } = useFinancial();
  const { getHealthScore } = useHealth();
  const { getWellbeingScore } = useEmotional();
  
  const completionRate = getCompletionRate();
  const healthScore = getHealthScore();
  const wellbeingScore = getWellbeingScore();
  const financialBalance = getBalance();
  const monthlyIncome = getIncomeTotal('month');
  const monthlyExpenses = getExpenseTotal('month');
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

  const stats = [
    {
      icon: Activity,
      label: 'Atividades Concluídas',
      value: `${completionRate.completed}/${completionRate.total}`,
      color: 'text-green-500',
      change: '+12%',
      isPositive: true
    },
    {
      icon: TrendingUp,
      label: 'Saúde Financeira',
      value: `${Math.round(savingsRate)}%`,
      color: 'text-blue-500',
      change: savingsRate > 15 ? '+5%' : '-3%',
      isPositive: savingsRate > 15
    },
    {
      icon: Heart,
      label: 'Bem-estar',
      value: `${healthScore}%`,
      color: 'text-red-500',
      change: '+8%',
      isPositive: true
    },
    {
      icon: Brain,
      label: 'Foco Mental',
      value: `${wellbeingScore}%`,
      color: 'text-purple-500',
      change: '+15%',
      isPositive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map(({ icon: Icon, label, value, color, change, isPositive }, index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 p-6 relative overflow-hidden"
        >
          <div className="flex items-center gap-4">
            <Icon className={`h-8 w-8 ${color}`} />
            <div>
              <p className="text-sm text-gray-400">{label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-white">{value}</p>
                <span className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  {isPositive ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
                  {change}
                </span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/50 to-blue-500/0"></div>
        </motion.div>
      ))}
    </div>
  );
};