import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Area, AreaChart, BarChart, Bar } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon, Filter } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useFinancial } from '../../contexts/FinancialContext';

const COLORS = {
  'Moradia': '#3B82F6',
  'Transporte': '#10B981',
  'Alimentação': '#F59E0B',
  'Assinaturas e Serviços': '#8B5CF6',
  'Compras Pessoais': '#EC4899',
  'Cuidado Pessoal': '#14B8A6',
  'Educação e Desenvolvimento': '#6366F1',
  'Doações e Ajuda': '#EAB308',
  'Saúde e Bem-estar': '#EF4444',
  'Lazer e Viagens': '#06B6D4',
  'Investimentos': '#10B981',
  'Gastos Imprevistos': '#F59E0B',
  'Impostos e Burocracias': '#6B7280',
  'Cartão de Crédito': '#EC4899',
  'Salário': '#10B981',
  'Freelance': '#3B82F6',
  'Outros': '#6B7280'
};

const CHART_TYPES = {
  CATEGORY_PIE: 'category_pie',
  CASH_FLOW: 'cash_flow',
  MONTHLY_COMPARISON: 'monthly_comparison',
  TREND_ANALYSIS: 'trend_analysis'
} as const;

export const FinancialCharts: React.FC = () => {
  const { transactions, getTransactionsByCategory, getCashFlow, getIncomeTotal, getExpenseTotal } = useFinancial();
  const [selectedChart, setSelectedChart] = useState<keyof typeof CHART_TYPES>('CATEGORY_PIE');
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [chartType, setChartType] = useState<'simple' | 'detailed'>('simple');

  // Prepare data for category spending chart
  const categoryData = useMemo(() => {
    const data = getTransactionsByCategory(period);
    return data
      .filter(item => item.total > 0)
      .map(({ category, total }) => ({
        name: category,
        value: total,
        color: COLORS[category as keyof typeof COLORS] || '#6B7280'
      }))
      .sort((a, b) => b.value - a.value);
  }, [getTransactionsByCategory, period]);

  // Prepare data for cash flow chart
  const cashFlowData = useMemo(() => {
    const data = getCashFlow(period);
    return data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      })
    }));
  }, [getCashFlow, period]);

  // Prepare monthly comparison data
  const monthlyComparisonData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getFullYear() === currentYear && date.getMonth() === index && t.isPaid;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month,
        income,
        expenses,
        balance: income - expenses
      };
    });
  }, [transactions]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalIncome = getIncomeTotal(period);
    const totalExpenses = getExpenseTotal(period);
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
      isPositive: balance >= 0
    };
  }, [getIncomeTotal, getExpenseTotal, period]);

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
            <span className="text-white font-medium">
              R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </motion.div>
    );
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0].payload;
    const percentage = ((data.value / categoryData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg"
      >
        <p className="font-medium text-white mb-1">{data.name}</p>
        <p className="text-sm text-gray-400">
          R$ {data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({percentage}%)
        </p>
      </motion.div>
    );
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'CATEGORY_PIE':
        return (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={chartType === 'detailed' ? 80 : 60}
                  outerRadius={chartType === 'detailed' ? 140 : 120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                {chartType === 'detailed' && (
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    formatter={(value: string) => (
                      <span className="text-sm text-gray-300">{value}</span>
                    )}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case 'CASH_FLOW':
        return (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'simple' ? (
                <AreaChart data={cashFlowData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    name="Receitas"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#EF4444"
                    fillOpacity={1}
                    fill="url(#colorExpenses)"
                    name="Despesas"
                  />
                </AreaChart>
              ) : (
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10B981"
                    name="Receitas"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#EF4444"
                    name="Despesas"
                    strokeWidth={3}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#3B82F6"
                    name="Saldo"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        );

      case 'MONTHLY_COMPARISON':
        return (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
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
                  dataKey="income"
                  fill="#10B981"
                  name="Receitas"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  fill="#EF4444"
                  name="Despesas"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  const getChartTitle = () => {
    switch (selectedChart) {
      case 'CATEGORY_PIE':
        return 'Gastos por Categoria';
      case 'CASH_FLOW':
        return 'Fluxo de Caixa';
      case 'MONTHLY_COMPARISON':
        return 'Comparativo Mensal';
      default:
        return 'Análise Financeira';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Summary Cards */}
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Receitas</p>
              <p className="text-2xl font-bold text-green-500">
                R$ {summaryStats.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <ArrowUpRight className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Despesas</p>
              <p className="text-2xl font-bold text-red-500">
                R$ {summaryStats.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <ArrowDownRight className="h-8 w-8 text-red-500" />
          </div>
        </Card>

        <Card className={`bg-gradient-to-br ${
          summaryStats.isPositive 
            ? 'from-blue-500/10 to-cyan-500/10 border-blue-500/20'
            : 'from-red-500/10 to-pink-500/10 border-red-500/20'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Saldo</p>
              <p className={`text-2xl font-bold ${
                summaryStats.isPositive ? 'text-blue-500' : 'text-red-500'
              }`}>
                R$ {Math.abs(summaryStats.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <TrendingUp className={`h-8 w-8 ${
              summaryStats.isPositive ? 'text-blue-500' : 'text-red-500'
            }`} />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Taxa de Poupança</p>
              <p className="text-2xl font-bold text-purple-500">
                {summaryStats.savingsRate.toFixed(1)}%
              </p>
            </div>
            <BarChart2 className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Main Chart */}
      <div className="lg:col-span-8">
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-lg font-medium text-white">{getChartTitle()}</h3>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Chart Type Selector */}
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setSelectedChart('CATEGORY_PIE')}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedChart === 'CATEGORY_PIE'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Gastos por Categoria"
                >
                  <PieChartIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedChart('CASH_FLOW')}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedChart === 'CASH_FLOW'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Fluxo de Caixa"
                >
                  <LineChartIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedChart('MONTHLY_COMPARISON')}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedChart === 'MONTHLY_COMPARISON'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Comparativo Mensal"
                >
                  <BarChart2 className="h-4 w-4" />
                </button>
              </div>

              {/* Period Selector */}
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as typeof period)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="week">Última Semana</option>
                <option value="month">Último Mês</option>
                <option value="year">Último Ano</option>
              </select>

              {/* Chart Style Toggle */}
              <Button
                variant="secondary"
                onClick={() => setChartType(prev => prev === 'simple' ? 'detailed' : 'simple')}
                className="text-sm"
              >
                {chartType === 'simple' ? 'Detalhado' : 'Simples'}
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedChart}-${period}-${chartType}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderChart()}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>

      {/* Side Panel */}
      <div className="lg:col-span-4 space-y-6">
        {/* Top Categories */}
        <Card title="Maiores Gastos">
          <div className="space-y-3">
            {categoryData.slice(0, 5).map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-gray-300 text-sm">{category.name}</span>
                </div>
                <span className="text-white font-medium text-sm">
                  R$ {category.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Financial Health Score */}
        <Card title="Score Financeiro">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  className="text-gray-700"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="48"
                  cy="48"
                />
                <circle
                  className={summaryStats.savingsRate > 20 ? 'text-green-500' : 
                           summaryStats.savingsRate > 10 ? 'text-yellow-500' : 'text-red-500'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="48"
                  cy="48"
                  strokeDasharray={`${Math.min(summaryStats.savingsRate * 2.51, 251)} 251`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {Math.round(Math.min(summaryStats.savingsRate * 10, 100))}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {summaryStats.savingsRate > 20 ? 'Excelente' :
               summaryStats.savingsRate > 10 ? 'Bom' : 'Precisa melhorar'}
            </p>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card title="Estatísticas Rápidas">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Transações este mês</span>
              <span className="text-white font-medium">
                {transactions.filter(t => {
                  const date = new Date(t.date);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Maior gasto</span>
              <span className="text-white font-medium">
                R$ {Math.max(...transactions.filter(t => t.type === 'expense').map(t => t.amount), 0)
                  .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Maior receita</span>
              <span className="text-white font-medium">
                R$ {Math.max(...transactions.filter(t => t.type === 'income').map(t => t.amount), 0)
                  .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};