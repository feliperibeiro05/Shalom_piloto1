import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, AlertCircle, Calendar, 
  DollarSign, ArrowUp, ArrowDown, Brain, Clock,
  PieChart, Zap, ShoppingBag, CreditCard, Wallet
} from 'lucide-react';
import { useSophia } from '../../contexts/SophiaContext';
import { useFinancial } from '../../contexts/FinancialContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const DailySummary: React.FC = () => {
  const { transactions, getTransactionsByCategory } = useFinancial();
  const { userState } = useSophia();
  
  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  // Calculate today's transactions
  const todayTransactions = transactions.filter(t => t.date === today);
  const todayExpenses = todayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (typeof t.amount === 'number' ? t.amount : 0), 0);
  const todayIncome = todayTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (typeof t.amount === 'number' ? t.amount : 0), 0);
  
  // Calculate yesterday's transactions for comparison
  const yesterdayExpenses = transactions
    .filter(t => t.date === yesterday && t.type === 'expense')
    .reduce((sum, t) => sum + (typeof t.amount === 'number' ? t.amount : 0), 0);
  
  // Calculate expense difference percentage
  const expenseDiff = todayExpenses - yesterdayExpenses;
  const expenseDiffPercentage = yesterdayExpenses 
    ? ((expenseDiff / yesterdayExpenses) * 100).toFixed(1)
    : '0';

  // Get most spent category today
  const todayCategories = getTransactionsByCategory()
    .filter(c => todayTransactions.some(t => t.category === c.category))
    .sort((a, b) => (typeof b.total === 'number' ? b.total : 0) - (typeof a.total === 'number' ? a.total : 0));
  const mostSpentCategory = todayCategories[0];

  // Analyze spending patterns for the last 3 days
  const last3DaysExpenses = transactions
    .filter(t => {
      const date = new Date(t.date);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return date >= threeDaysAgo && t.type === 'expense';
    })
    .reduce((acc, t) => {
      const amount = typeof t.amount === 'number' ? t.amount : 0;
      acc[t.category] = (acc[t.category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

  // Find categories with high spending
  const highSpendingCategories = Object.entries(last3DaysExpenses)
    .filter(([_, amount]) => amount > 100)
    .sort(([_, a], [__, b]) => b - a);

  // Get upcoming payments (next 7 days)
  const upcomingPayments = transactions
    .filter(t => {
      const dueDate = new Date(t.date);
      const daysDiff = Math.floor((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysDiff > 0 && daysDiff <= 7 && t.type === 'expense';
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Generate smart insights based on spending patterns
  const getSmartInsights = () => {
    const insights = [];

    // High spending category alert
    if (highSpendingCategories.length > 0) {
      const [category, amount] = highSpendingCategories[0];
      insights.push({
        type: 'alert',
        icon: ShoppingBag,
        title: 'Alto Gasto Detectado',
        message: `Seus gastos com ${category.toLowerCase()} somam R$ ${amount.toFixed(2)} nos últimos 3 dias. Que tal estabelecer um limite?`
      });
    }

    // Daily comparison insight
    if (expenseDiff !== 0) {
      insights.push({
        type: expenseDiff > 0 ? 'warning' : 'success',
        icon: expenseDiff > 0 ? TrendingUp : TrendingDown,
        title: 'Comparativo Diário',
        message: expenseDiff > 0
          ? `Você gastou ${expenseDiffPercentage}% mais que ontem. Vamos revisar esses gastos?`
          : `Ótimo! Você economizou ${Math.abs(Number(expenseDiffPercentage))}% em relação a ontem!`
      });
    }

    // Productive hours suggestion
    insights.push({
      type: 'tip',
      icon: Clock,
      title: 'Horário Produtivo',
      message: `Seu melhor horário para gestão financeira é pela ${userState.energyPattern}. Aproveite para planejar seus gastos!`
    });

    return insights;
  };

  const smartInsights = getSmartInsights();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      {/* Daily Overview */}
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-medium text-white">Resumo do Dia</h3>
            </div>
            <span className="text-sm text-gray-400">
              {format(new Date(), "dd 'de' MMMM", { locale: ptBR })}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowDown className="h-4 w-4 text-red-500" />
                <span className="text-gray-300">Gastos Hoje</span>
              </div>
              <span className="text-lg font-medium text-white">
                R$ {todayExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Receitas Hoje</span>
              </div>
              <span className="text-lg font-medium text-white">
                R$ {todayIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {mostSpentCategory && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-purple-500" />
                  <span className="text-gray-300">Categoria Mais Gasta</span>
                </div>
                <span className="text-lg font-medium text-white">
                  {mostSpentCategory.category}
                </span>
              </div>
            )}

            {expenseDiff !== 0 && (
              <div className={`flex items-center gap-2 mt-4 p-3 rounded-lg ${
                expenseDiff > 0 
                  ? 'bg-red-500/10 text-red-500' 
                  : 'bg-green-500/10 text-green-500'
              }`}>
                {expenseDiff > 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                <span>
                  {expenseDiff > 0 
                    ? `Gastou ${expenseDiffPercentage}% mais que ontem`
                    : `Economizou ${Math.abs(Number(expenseDiffPercentage))}% em relação a ontem`
                  }
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Payments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-medium text-white">Próximos Vencimentos</h3>
            </div>
          </div>

          {upcomingPayments.length > 0 ? (
            <div className="space-y-4">
              {upcomingPayments.slice(0, 3).map((payment, index) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{payment.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(payment.date), "dd/MM")}</span>
                    </div>
                  </div>
                  <span className="text-red-500 font-medium">
                    R$ {(typeof payment.amount === 'number' ? payment.amount : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">
              Nenhum pagamento próximo
            </p>
          )}
        </motion.div>
      </div>

      {/* Smart Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-4 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl p-6 border border-blue-500/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium text-white">Insights da Sophia</h3>
        </div>

        <div className="space-y-4">
          {smartInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                insight.type === 'alert'
                  ? 'bg-red-500/10 border-red-500/20'
                  : insight.type === 'warning'
                  ? 'bg-yellow-500/10 border-yellow-500/20'
                  : insight.type === 'success'
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-blue-500/10 border-blue-500/20'
              }`}
            >
              <div className={`flex items-center gap-2 mb-2 ${
                insight.type === 'alert'
                  ? 'text-red-500'
                  : insight.type === 'warning'
                  ? 'text-yellow-500'
                  : insight.type === 'success'
                  ? 'text-green-500'
                  : 'text-blue-500'
              }`}>
                <insight.icon className="h-5 w-5" />
                <span className="font-medium">{insight.title}</span>
              </div>
              <p className="text-gray-300 text-sm">
                {insight.message}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};