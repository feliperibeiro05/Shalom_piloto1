import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, X, Edit2, Trash2, Save, FolderPlus, ChevronLeft, 
  ChevronRight, Calendar, Receipt, ArrowLeft, ArrowRight 
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CategoryExpense {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  notes?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  expenses: CategoryExpense[];
  currentPage: number;
  isCustom?: boolean;
}

const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'expenses' | 'currentPage'>[] = [
  { name: 'Moradia', icon: '🏠', color: 'blue' },
  { name: 'Transporte', icon: '🚗', color: 'green' },
  { name: 'Alimentação', icon: '🍽️', color: 'orange' },
  { name: 'Assinaturas e Serviços', icon: '📱', color: 'purple' },
  { name: 'Compras Pessoais', icon: '🛍️', color: 'pink' },
  { name: 'Cuidado Pessoal', icon: '💆‍♂️', color: 'teal' },
  { name: 'Educação e Desenvolvimento', icon: '📚', color: 'indigo' },
  { name: 'Doações e Ajuda', icon: '🤝', color: 'yellow' },
  { name: 'Saúde e Bem-estar', icon: '⚕️', color: 'red' },
  { name: 'Lazer e Viagens', icon: '✈️', color: 'cyan' },
  { name: 'Investimentos', icon: '📈', color: 'emerald' },
  { name: 'Gastos Imprevistos', icon: '⚡', color: 'amber' },
  { name: 'Impostos e Burocracias', icon: '📄', color: 'gray' },
  { name: 'Cartão de Crédito', icon: '💳', color: 'rose' }
];

export const CategoryManager: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [showExpenseForm, setShowExpenseForm] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const ITEMS_PER_PAGE = 5;

  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '📁',
    color: 'blue'
  });

  const [newExpense, setNewExpense] = useState<Omit<CategoryExpense, 'id'>>({
    description: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    isPaid: false,
    notes: ''
  });

  const addCategory = (category: Omit<Category, 'id' | 'expenses' | 'currentPage'>) => {
    const newCat: Category = {
      id: crypto.randomUUID(),
      ...category,
      expenses: [],
      currentPage: 0
    };
    setSelectedCategories(prev => [...prev, newCat]);
  };

  const removeCategory = (id: string) => {
    setSelectedCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const addExpense = (categoryId: string) => {
    setSelectedCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        const newExpenses = [...cat.expenses, { id: crypto.randomUUID(), ...newExpense }];
        const totalPages = Math.ceil(newExpenses.length / ITEMS_PER_PAGE);
        const currentPage = totalPages - 1;
        
        return {
          ...cat,
          expenses: newExpenses,
          currentPage
        };
      }
      return cat;
    }));
    setShowExpenseForm(null);
    setNewExpense({
      description: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      isPaid: false,
      notes: ''
    });
  };

  const removeExpense = (categoryId: string, expenseId: string) => {
    setSelectedCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        const newExpenses = cat.expenses.filter(exp => exp.id !== expenseId);
        const totalPages = Math.ceil(newExpenses.length / ITEMS_PER_PAGE);
        const currentPage = Math.min(cat.currentPage, Math.max(0, totalPages - 1));
        
        return {
          ...cat,
          expenses: newExpenses,
          currentPage
        };
      }
      return cat;
    }));
  };

  const toggleExpensePaid = (categoryId: string, expenseId: string) => {
    setSelectedCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          expenses: cat.expenses.map(exp => {
            if (exp.id === expenseId) {
              return { ...exp, isPaid: !exp.isPaid };
            }
            return exp;
          })
        };
      }
      return cat;
    }));
  };

  const changePage = (categoryId: string, newPage: number) => {
    setSelectedCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, currentPage: newPage };
      }
      return cat;
    }));
  };

  const getPaginatedExpenses = (category: Category) => {
    const start = category.currentPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return category.expenses.slice(start, end);
  };

  const getTotalPages = (expenses: CategoryExpense[]) => {
    return Math.ceil(expenses.length / ITEMS_PER_PAGE);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
    
    setSelectedCategories(prev => prev.map(cat => ({
      ...cat,
      expenses: [],
      currentPage: 0
    })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <h3 className="text-xl font-medium text-white">
            {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
          </h3>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <Button
          onClick={() => setShowCategorySelector(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Categoria
        </Button>
      </div>

      <AnimatePresence>
        {showCategorySelector && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Escolha as Categorias</h3>
                <button
                  onClick={() => setShowCategorySelector(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {DEFAULT_CATEGORIES.map(category => {
                  const isSelected = selectedCategories.some(c => c.name === category.name);
                  return (
                    <button
                      key={category.name}
                      onClick={() => {
                        if (!isSelected) {
                          addCategory(category);
                        }
                      }}
                      disabled={isSelected}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-blue-500/20 border-blue-500 cursor-not-allowed'
                          : 'border-gray-700 hover:border-blue-500/50 hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="text-sm font-medium text-white">{category.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                <Button
                  onClick={() => {
                    setShowCategorySelector(false);
                    setShowNewCategoryForm(true);
                  }}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <FolderPlus className="h-4 w-4" />
                  Criar Nova Categoria
                </Button>
                <Button
                  onClick={() => setShowCategorySelector(false)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Concluir
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewCategoryForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Nova Categoria</h3>
                <button
                  onClick={() => setShowNewCategoryForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nome da Categoria
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                    placeholder="Ex: Academia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Ícone
                  </label>
                  <input
                    type="text"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                    placeholder="Ex: 🏋️‍♂️"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Cor
                  </label>
                  <select
                    value={newCategory.color}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                  >
                    <option value="blue">Azul</option>
                    <option value="green">Verde</option>
                    <option value="red">Vermelho</option>
                    <option value="yellow">Amarelo</option>
                    <option value="purple">Roxo</option>
                    <option value="pink">Rosa</option>
                    <option value="indigo">Índigo</option>
                    <option value="cyan">Ciano</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => setShowNewCategoryForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      if (newCategory.name) {
                        addCategory({ ...newCategory, isCustom: true });
                        setShowNewCategoryForm(false);
                        setNewCategory({
                          name: '',
                          icon: '📁',
                          color: 'blue'
                        });
                      }
                    }}
                    disabled={!newCategory.name}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Criar Categoria
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectedCategories.length === 0 ? (
          <div className="col-span-full">
            <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
              <Receipt className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Nenhuma categoria adicionada
              </h3>
              <p className="text-gray-400 mb-6">
                Adicione categorias para começar a gerenciar suas despesas mensais
              </p>
              <Button
                onClick={() => setShowCategorySelector(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Categoria
              </Button>
            </div>
          </div>
        ) : (
          selectedCategories.map(category => (
            <Card key={category.id} className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="text-lg font-medium text-white">{category.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeCategory(category.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {category.expenses.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma despesa registrada para este mês</p>
                  </div>
                ) : (
                  <>
                    {getPaginatedExpenses(category).map(expense => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-white">{expense.description}</span>
                            <span className="text-red-500">
                              R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>Vence: {new Date(expense.dueDate).toLocaleDateString()}</span>
                            <button
                              onClick={() => toggleExpensePaid(category.id, expense.id)}
                              className={`px-2 py-1 rounded-full text-xs ${
                                expense.isPaid
                                  ? 'bg-green-500/20 text-green-500'
                                  : 'bg-yellow-500/20 text-yellow-500'
                              }`}
                            >
                              {expense.isPaid ? 'Pago' : 'Pendente'}
                            </button>
                          </div>
                          {expense.notes && (
                            <p className="text-sm text-gray-400 mt-1">{expense.notes}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeExpense(category.id, expense.id)}
                          className="ml-4 p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {category.expenses.length > ITEMS_PER_PAGE && (
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <button
                          onClick={() => changePage(category.id, category.currentPage - 1)}
                          disabled={category.currentPage === 0}
                          className="p-1 rounded-lg bg-gray-700 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="text-sm text-gray-400">
                          Página {category.currentPage + 1} de {getTotalPages(category.expenses)}
                        </span>
                        <button
                          onClick={() => changePage(category.id, category.currentPage + 1)}
                          disabled={category.currentPage >= getTotalPages(category.expenses) - 1}
                          className="p-1 rounded-lg bg-gray-700 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </>
                )}

                {showExpenseForm === category.id ? (
                  <div className="p-4 bg-gray-800/50 rounded-lg space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Descrição
                      </label>
                      <input
                        type="text"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                        placeholder="Ex: Aluguel"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Valor
                        </label>
                        <input
                          type="number"
                          value={newExpense.amount}
                          onChange={(e) => setNewExpense(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                          className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                          placeholder="0,00"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Vencimento
                        </label>
                        <input
                          type="date"
                          value={newExpense.dueDate}
                          onChange={(e) => setNewExpense(prev => ({ ...prev, dueDate: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Observações (opcional)
                      </label>
                      <textarea
                        value={newExpense.notes}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                        rows={2}
                        placeholder="Adicione notas ou detalhes..."
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPaid"
                        checked={newExpense.isPaid}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, isPaid: e.target.checked }))}
                        className="rounded border-gray-600 bg-gray-700 text-blue-500"
                      />
                      <label htmlFor="isPaid" className="text-sm text-gray-300">
                        Já está pago
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <Button
                        variant="secondary"
                        onClick={() => setShowExpenseForm(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => addExpense(category.id)}
                        disabled={!newExpense.description || newExpense.amount <= 0}
                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowExpenseForm(category.id)}
                    className="w-full p-3 rounded-lg border border-dashed border-gray-700 hover:border-blue-500 hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2 text-gray-400 hover:text-blue-500"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Despesa
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};