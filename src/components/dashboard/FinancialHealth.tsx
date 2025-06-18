import React from 'react';
import { DollarSign, TrendingUp, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useFinancial } from '../../contexts/FinancialContext';
import { motion } from 'framer-motion';

export const FinancialHealth: React.FC = () => {
  const { getBalance, getIncomeTotal, getExpenseTotal, getTransactionsByCategory } = useFinancial();
  
  const balance = getBalance();
  const monthlyIncome = getIncomeTotal('month');
  const monthlyExpenses = getExpenseTotal('month');
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
  
  // Get top expense categories
  const categories = getTransactionsByCategory('month')
    .filter(cat => cat.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);
  
  const getSavingsColor = () => {
    if (savingsRate >= 20) return 'text-green-500';
    if (savingsRate >= 10) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card title="Saúde Financeira">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Score Financeiro</span>
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-2xl font-bold ${getSavingsColor()}`}
          >
            {Math.round(savingsRate > 20 ? 85 : savingsRate > 10 ? 65 : 45)}/100
          </motion.span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Saldo</span>
              {balance >= 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <span className={`text-lg font-semibold ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
              R$ {Math.abs(balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Economia</span>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <span className="text-lg font-semibold text-white">
              {savingsRate.toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Gastos Essenciais</span>
            <span className="text-white">45%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '45%' }}
              className="h-full bg-blue-500 rounded-full" 
            />
          </div>
        </div>
        
        {categories.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Principais Categorias</h4>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{category.category}</span>
                  <span className="text-white">
                    R$ {category.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button 
          className="w-full mt-4 flex items-center justify-center gap-1"
          variant="secondary"
        >
          Ver Detalhes Financeiros
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};