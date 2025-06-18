import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, TrendingUp, PiggyBank, Target, Plus,
  Wallet, ArrowUpRight, Menu, AlertCircle, CheckCircle,
  Download, Upload, Settings, RefreshCw
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TransactionList } from '../components/financial/TransactionList';
import { SmartTips } from '../components/financial/SmartTips';
import { TransactionForm } from '../components/financial/TransactionForm';
import { FinancialGoalForm } from '../components/financial/FinancialGoalForm';
import { DailySummary } from '../components/financial/DailySummary';
import { CategoryManager } from '../components/financial/CategoryManager';
import { FinancialCharts } from '../components/financial/FinancialCharts';
import { useFinancial } from '../contexts/FinancialContext';

export const Financial: React.FC = () => {
  const { 
    getBalance,
    getIncomeTotal,
    getExpenseTotal,
    loading,
    error,
    exportData,
    clearAllData
  } = useFinancial();

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const balance = getBalance();
  const totalIncome = getIncomeTotal('month');
  const totalExpenses = getExpenseTotal('month');
  const savings = Math.max(0, totalIncome - totalExpenses);

  const handleExportData = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financeiro-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleClearData = async () => {
    try {
      await clearAllData();
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 right-4 z-50 bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 flex items-center gap-3"
          >
            <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
            <span className="text-blue-500">Processando...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-500">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Gestão Financeira</h1>
          <p className="text-gray-400 text-sm md:text-base">Acompanhe e gerencie suas finanças de forma inteligente</p>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            variant="secondary"
            className="w-full"
          >
            <Menu className="h-5 w-5 mr-2" />
            Menu
          </Button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            onClick={handleExportData}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          
          <Button
            onClick={() => setShowClearConfirm(true)}
            variant="secondary"
            className="flex items-center gap-2 text-red-500 hover:text-red-400"
          >
            <Settings className="h-4 w-4" />
            Limpar Dados
          </Button>
          
          <Button 
            onClick={() => setShowTransactionForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden space-y-2 mb-6 p-4 bg-gray-800/50 rounded-lg"
          >
            <Button 
              onClick={() => {
                setShowTransactionForm(true);
                setShowMobileMenu(false);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nova Transação
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleExportData}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar
              </Button>
              
              <Button
                onClick={() => setShowClearConfirm(true)}
                variant="secondary"
                className="flex items-center gap-2 text-red-500"
              >
                <Settings className="h-4 w-4" />
                Limpar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overview Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Wallet className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
            </div>
            <span className="text-xs md:text-sm text-gray-400">Saldo Total</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-bold text-white">
              R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
            <p className={`text-sm ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {balance >= 0 ? 'Positivo' : 'Negativo'}
            </p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
            </div>
            <span className="text-xs md:text-sm text-gray-400">Receitas (Mês)</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-bold text-white">
              R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">Entrada</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-red-500" />
            </div>
            <span className="text-xs md:text-sm text-gray-400">Despesas (Mês)</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-bold text-white">
              R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="h-4 w-4 text-red-500 rotate-180" />
              <span className="text-sm text-red-500">Saída</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <PiggyBank className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" />
            </div>
            <span className="text-xs md:text-sm text-gray-400">Economia (Mês)</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-bold text-white">
              R$ {savings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-sm text-yellow-500">
              {totalIncome > 0 ? `${((savings / totalIncome) * 100).toFixed(1)}%` : '0%'} da receita
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Daily Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DailySummary />
      </motion.div>

      {/* Monthly Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card title="Despesas do Mês">
          <CategoryManager />
        </Card>
      </motion.div>

      {/* Financial Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <FinancialCharts />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Left Column */}
        <div className="lg:col-span-8">
          <Card title="Transações">
            <TransactionList onAddTransaction={() => setShowTransactionForm(true)} />
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Smart Tips */}
          <Card title="Dicas Financeiras">
            <SmartTips />
          </Card>
        </div>
      </motion.div>

      {/* Floating Action Button for Mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setShowTransactionForm(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg flex items-center justify-center p-0"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Modals */}
      <TransactionForm
        isOpen={showTransactionForm}
        onClose={() => setShowTransactionForm(false)}
      />

      <FinancialGoalForm
        isOpen={showGoalForm}
        onClose={() => setShowGoalForm(false)}
        onSubmit={() => {}}
      />

      {/* Clear Data Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
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
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <h3 className="text-xl font-semibold text-white">Confirmar Limpeza</h3>
              </div>
              
              <p className="text-gray-400 mb-6">
                Tem certeza que deseja limpar todos os dados financeiros? Esta ação não pode ser desfeita.
              </p>
              
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleClearData}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Limpar Dados
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};