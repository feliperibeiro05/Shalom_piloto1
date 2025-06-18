import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Activity, Heart, Brain, PiggyBank } from 'lucide-react';
import { useActivities } from '../../contexts/ActivitiesContext';
import { useHealth } from '../../contexts/HealthContext';
import { useEmotional } from '../../contexts/EmotionalContext';
import { useFinancial } from '../../contexts/FinancialContext';

export const ProgressSummary: React.FC = () => {
  const { getCompletionRate } = useActivities();
  const { getHealthScore } = useHealth();
  const { getWellbeingScore } = useEmotional();
  const { getIncomeTotal, getExpenseTotal } = useFinancial();
  
  const completionRate = getCompletionRate();
  const healthScore = getHealthScore();
  const wellbeingScore = getWellbeingScore();
  const monthlyIncome = getIncomeTotal('month');
  const monthlyExpenses = getExpenseTotal('month');
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
  
  const progressFactors = [
    { 
      name: 'Atividades', 
      icon: Activity,
      color: 'text-green-500',
      value: completionRate.total > 0 ? (completionRate.completed / completionRate.total) * 100 : 0, 
      weight: 0.25 
    },
    { 
      name: 'Saúde', 
      icon: Heart,
      color: 'text-red-500',
      value: healthScore, 
      weight: 0.25 
    },
    { 
      name: 'Bem-estar', 
      icon: Brain,
      color: 'text-purple-500',
      value: wellbeingScore, 
      weight: 0.25 
    },
    { 
      name: 'Finanças', 
      icon: PiggyBank,
      color: 'text-blue-500',
      value: savingsRate > 20 ? 100 : savingsRate * 5, 
      weight: 0.25 
    }
  ];
  
  const overallProgress = progressFactors.reduce((sum, factor) => sum + (factor.value * factor.weight), 0);

  return (
    <Card title="Progresso Geral">
      <div className="flex flex-col md:flex-row items-center gap-6">
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
              className="text-blue-500"
              strokeWidth="8"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="56"
              cx="64"
              cy="64"
              strokeDasharray={`${overallProgress * 3.51} 351`}
              transform="rotate(-90 64 64)"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-3xl font-bold text-white">{Math.round(overallProgress)}%</span>
          </div>
        </div>
        
        <div className="flex-1 space-y-4">
          {progressFactors.map(factor => (
            <div key={factor.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <factor.icon className={`h-4 w-4 ${factor.color}`} />
                  <span className="text-gray-400">{factor.name}</span>
                </div>
                <span className="text-white">{Math.round(factor.value)}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.value}%` }}
                  className={`h-full rounded-full ${
                    factor.name === 'Atividades' ? 'bg-green-500' :
                    factor.name === 'Saúde' ? 'bg-red-500' :
                    factor.name === 'Bem-estar' ? 'bg-purple-500' :
                    'bg-blue-500'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};