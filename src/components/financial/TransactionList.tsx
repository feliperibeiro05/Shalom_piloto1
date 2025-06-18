import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ChevronDown, Calendar, Tag,
  DollarSign, TrendingUp, Clock, AlertCircle, Plus,
  Edit2, Trash2, Eye, EyeOff, Download, Upload,
  MoreVertical, CheckCircle, X
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFinancial } from '../../contexts/FinancialContext';
import { EmptyState } from './EmptyState';
import { TransactionForm } from './TransactionForm';
import { Button } from '../ui/Button';

interface TransactionListProps {
  onAddTransaction: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ onAddTransaction }) => {
  const { 
    transactions, 
    categories, 
    deleteTransaction, 
    updateTransaction,
    loading,
    error,
    exportData,
    importData
  } = useFinancial();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [showPaidOnly, setShowPaidOnly] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      // Search filter
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = !selectedCategory || transaction.category === selectedCategory;

      // Type filter
      const matchesType = selectedType === 'all' || transaction.type === selectedType;

      // Period filter
      const matchesPeriod = (() => {
        if (selectedPeriod === 'all') return true;
        
        const transactionDate = new Date(transaction.date);
        const today = new Date();
        
        switch (selectedPeriod) {
          case 'today':
            return transactionDate.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return transactionDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return transactionDate >= monthAgo;
          default:
            return true;
        }
      })();

      // Paid filter
      const matchesPaid = !showPaidOnly || transaction.isPaid;

      return matchesSearch && matchesCategory && matchesType && matchesPeriod && matchesPaid;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [transactions, searchTerm, selectedCategory, selectedType, selectedPeriod, showPaidOnly, sortBy, sortOrder]);

  const handleSelectTransaction = (id: string) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTransactions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTransactions.size === filteredAndSortedTransactions.length) {
      setSelectedTransactions(new Set());
    } else {
      setSelectedTransactions(new Set(filteredAndSortedTransactions.map(t => t.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir ${selectedTransactions.size} transações?`)) {
      try {
        await Promise.all(Array.from(selectedTransactions).map(id => deleteTransaction(id)));
        setSelectedTransactions(new Set());
      } catch (error) {
        console.error('Error deleting transactions:', error);
      }
    }
  };

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleTogglePaid = async (transaction: any) => {
    try {
      await updateTransaction(transaction.id, { isPaid: !transaction.isPaid });
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleExport = () => {
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
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result as string;
          await importData(data);
        } catch (error) {
          console.error('Error importing data:', error);
          alert('Erro ao importar dados. Verifique o formato do arquivo.');
        }
      };
      reader.readAsText(file);
    }
  };

  if (transactions.length === 0) {
    return <EmptyState onAddTransaction={onAddTransaction} />;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar transações..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-600 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {selectedTransactions.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {selectedTransactions.size} selecionadas
              </span>
              <Button
                onClick={handleBulkDelete}
                variant="secondary"
                size="sm"
                className="text-red-500 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Exportar dados"
            >
              <Download className="h-4 w-4" />
            </button>
            <label className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer" title="Importar dados">
              <Upload className="h-4 w-4" />
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-gray-800 rounded-lg space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-sm"
                >
                  <option value="all">Todos</option>
                  <option value="income">Receitas</option>
                  <option value="expense">Despesas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-sm"
                >
                  <option value="">Todas</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Período</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-sm"
                >
                  <option value="all">Todo período</option>
                  <option value="today">Hoje</option>
                  <option value="week">Última semana</option>
                  <option value="month">Último mês</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ordenar por</label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="flex-1 px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-sm"
                  >
                    <option value="date">Data</option>
                    <option value="amount">Valor</option>
                    <option value="category">Categoria</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-sm hover:bg-gray-600 transition-colors"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={showPaidOnly}
                  onChange={(e) => setShowPaidOnly(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-700 text-blue-500"
                />
                Apenas pagas
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions */}
      {filteredAndSortedTransactions.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={selectedTransactions.size === filteredAndSortedTransactions.length}
              onChange={handleSelectAll}
              className="rounded border-gray-600 bg-gray-700 text-blue-500"
            />
            Selecionar todas ({filteredAndSortedTransactions.length})
          </label>
          
          <div className="text-sm text-gray-400">
            Total: R$ {filteredAndSortedTransactions
              .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)
              .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAndSortedTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group gap-4 sm:gap-0 ${
                selectedTransactions.has(transaction.id) ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={selectedTransactions.has(transaction.id)}
                  onChange={() => handleSelectTransaction(transaction.id)}
                  className="mt-1 rounded border-gray-600 bg-gray-700 text-blue-500"
                />

                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  transaction.type === 'income' 
                    ? 'bg-green-500/20' 
                    : 'bg-red-500/20'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <DollarSign className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-medium truncate ${
                      transaction.isPaid ? 'text-white' : 'text-gray-400'
                    }`}>
                      {transaction.description}
                    </h4>
                    {!transaction.isPaid && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full">
                        Pendente
                      </span>
                    )}
                    {transaction.isRecurring && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-500 text-xs rounded-full">
                        Recorrente
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mt-1">
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>{transaction.category}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(transaction.date), "dd 'de' MMMM", { locale: ptBR })}</span>
                    </div>
                    {transaction.time && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{transaction.time}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {transaction.tags && transaction.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {transaction.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {transaction.notes && (
                    <p className="text-sm text-gray-400 mt-2 truncate">
                      {transaction.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                <span className={`font-medium text-lg ${
                  transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleTogglePaid(transaction)}
                    className={`p-1 rounded transition-colors ${
                      transaction.isPaid 
                        ? 'text-green-500 hover:text-green-400' 
                        : 'text-gray-400 hover:text-green-500'
                    }`}
                    title={transaction.isPaid ? 'Marcar como pendente' : 'Marcar como pago'}
                  >
                    {transaction.isPaid ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                    title="Editar transação"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Excluir transação"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAndSortedTransactions.length === 0 && searchTerm && (
          <div className="text-center py-8 text-gray-400">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma transação encontrada para "{searchTerm}"</p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-500 hover:text-blue-400 mt-2"
            >
              Limpar busca
            </button>
          </div>
        )}
      </div>

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={showTransactionForm}
        onClose={() => {
          setShowTransactionForm(false);
          setEditingTransaction(null);
        }}
        editingTransaction={editingTransaction}
      />
    </div>
  );
};