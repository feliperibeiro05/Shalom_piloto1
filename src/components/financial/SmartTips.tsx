import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, AlertCircle, TrendingUp, PiggyBank,
  DollarSign, Target 
} from 'lucide-react';
import { useFinancial } from '../../contexts/FinancialContext';

export const SmartTips: React.FC = () => {
  const { 
    getBalance,
    getIncomeTotal,
    getExpenseTotal,
    getTransactionsByCategory,
    transactions
  } = useFinancial();

  const balance = getBalance();
  const totalIncome = getIncomeTotal();
  const totalExpenses = getExpenseTotal();
  const expensesByCategory = getTransactionsByCategory();

  // Calculate spending patterns
  const monthlySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0) / 3; // Average over 3 months

  // Find highest expense category
  const highestExpenseCategory = expensesByCategory
    .sort((a, b) => b.total - a.total)[0];

  return (
    <div className="space-y-4">
      {/* Balance Alert */}
      {balance < 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
        >
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Alerta de Saldo Negativo</span>
          </div>
          <p className="text-sm text-gray-300">
            Seu saldo está negativo. Considere reduzir gastos não essenciais e 
            priorize o pagamento de dívidas.
          </p>
        </motion.div>
      )}

      {/* Spending Pattern */}
      {totalExpenses > totalIncome * 0.8 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
        >
          <div className="flex items-center gap-2 text-yellow-500 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="font-medium">Alto Nível de Gastos</span>
          </div>
          <p className="text-sm text-gray-300">
            Suas despesas representam {Math.round((totalExpenses / totalIncome) * 100)}% 
            da sua receita. O ideal é manter abaixo de 80%.
          </p>
        </motion.div>
      )}

      {/* Savings Opportunity */}
      {balance > monthlySpending * 0.2 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
        >
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <PiggyBank className="h-5 w-5" />
            <span className="font-medium">Oportunidade de Investimento</span>
          </div>
          <p className="text-sm text-gray-300">
            Você tem R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} disponíveis.
            Considere investir parte desse valor para seu futuro.
          </p>
        </motion.div>
      )}

      {/* Category Insight */}
      {highestExpenseCategory && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg"
        >
          <div className="flex items-center gap-2 text-purple-500 mb-2">
            <Target className="h-5 w-5" />
            <span className="font-medium">Análise de Categoria</span>
          </div>
          <p className="text-sm text-gray-300">
            Sua maior despesa é com {highestExpenseCategory.category}, 
            representando {Math.round((highestExpenseCategory.total / totalExpenses) * 100)}% 
            dos seus gastos totais.
          </p>
        </motion.div>
      )}
    </div>
  );
};