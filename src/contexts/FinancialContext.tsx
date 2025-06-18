import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
  time: string;
  isRecurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  notes?: string;
  isPaid?: boolean;
  dueDate?: string;
  monthlyExpenseId?: string;
  tags?: string[];
}

export interface FinancialGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  description?: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget?: number;
  type: 'income' | 'expense';
  isCustom?: boolean;
}

export interface MonthlyExpense {
  id: string;
  categoryId: string;
  description: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  notes?: string;
  month: string; // Format: YYYY-MM
  transactionId?: string;
  isRecurring: boolean;
}

interface FinancialContextType {
  transactions: Transaction[];
  goals: FinancialGoal[];
  categories: Category[];
  monthlyExpenses: MonthlyExpense[];
  loading: boolean;
  error: string | null;
  
  // Transaction methods
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Goal methods
  addGoal: (goal: Omit<FinancialGoal, 'id' | 'current' | 'createdAt'>) => Promise<void>;
  updateGoal: (id: string, goal: Partial<FinancialGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  updateGoalProgress: (id: string, amount: number) => Promise<void>;
  
  // Category methods
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Monthly expense methods
  addMonthlyExpense: (expense: Omit<MonthlyExpense, 'id'>) => Promise<void>;
  updateMonthlyExpense: (id: string, expense: Partial<MonthlyExpense>) => Promise<void>;
  deleteMonthlyExpense: (id: string) => Promise<void>;
  toggleExpensePaid: (id: string) => Promise<void>;
  
  // Calculation methods
  getBalance: () => number;
  getIncomeTotal: (period?: 'day' | 'week' | 'month' | 'year') => number;
  getExpenseTotal: (period?: 'day' | 'week' | 'month' | 'year') => number;
  getTransactionsByCategory: (period?: 'day' | 'week' | 'month' | 'year') => { category: string; total: number; count: number }[];
  getMonthlyExpensesByCategory: (month: string) => { category: string; total: number; count: number }[];
  getGoalProgress: (id: string) => number;
  getDailySpending: () => number;
  getUpcomingPayments: (days?: number) => Transaction[];
  getCashFlow: (period?: 'week' | 'month' | 'year') => { date: string; income: number; expenses: number; balance: number }[];
  getBudgetStatus: () => { category: string; spent: number; budget: number; percentage: number }[];
  
  // Utility methods
  exportData: () => string;
  importData: (data: string) => Promise<void>;
  clearAllData: () => Promise<void>;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

// Default categories
const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  // Income categories
  { name: 'Salário', icon: '💼', color: 'green', type: 'income' },
  { name: 'Freelance', icon: '💻', color: 'blue', type: 'income' },
  { name: 'Investimentos', icon: '📈', color: 'purple', type: 'income' },
  { name: 'Outros', icon: '💰', color: 'gray', type: 'income' },
  
  // Expense categories
  { name: 'Moradia', icon: '🏠', color: 'blue', type: 'expense' },
  { name: 'Transporte', icon: '🚗', color: 'green', type: 'expense' },
  { name: 'Alimentação', icon: '🍽️', color: 'orange', type: 'expense' },
  { name: 'Assinaturas e Serviços', icon: '📱', color: 'purple', type: 'expense' },
  { name: 'Compras Pessoais', icon: '🛍️', color: 'pink', type: 'expense' },
  { name: 'Cuidado Pessoal', icon: '💆‍♂️', color: 'teal', type: 'expense' },
  { name: 'Educação e Desenvolvimento', icon: '📚', color: 'indigo', type: 'expense' },
  { name: 'Doações e Ajuda', icon: '🤝', color: 'yellow', type: 'expense' },
  { name: 'Saúde e Bem-estar', icon: '⚕️', color: 'red', type: 'expense' },
  { name: 'Lazer e Viagens', icon: '✈️', color: 'cyan', type: 'expense' },
  { name: 'Investimentos', icon: '📈', color: 'emerald', type: 'expense' },
  { name: 'Gastos Imprevistos', icon: '⚡', color: 'amber', type: 'expense' },
  { name: 'Impostos e Burocracias', icon: '📄', color: 'gray', type: 'expense' },
  { name: 'Cartão de Crédito', icon: '💳', color: 'rose', type: 'expense' }
];

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize default categories
  useEffect(() => {
    const initializeCategories = () => {
      const savedCategories = localStorage.getItem('financial_categories');
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      } else {
        const defaultCats = DEFAULT_CATEGORIES.map(cat => ({
          ...cat,
          id: uuidv4()
        }));
        setCategories(defaultCats);
        localStorage.setItem('financial_categories', JSON.stringify(defaultCats));
      }
    };

    initializeCategories();
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedTransactions = localStorage.getItem('financial_transactions');
        const savedGoals = localStorage.getItem('financial_goals');
        const savedMonthlyExpenses = localStorage.getItem('financial_monthly_expenses');

        if (savedTransactions) {
          setTransactions(JSON.parse(savedTransactions));
        }
        if (savedGoals) {
          setGoals(JSON.parse(savedGoals));
        }
        if (savedMonthlyExpenses) {
          setMonthlyExpenses(JSON.parse(savedMonthlyExpenses));
        }
      } catch (err) {
        console.error('Error loading financial data:', err);
        setError('Erro ao carregar dados financeiros');
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('financial_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('financial_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('financial_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('financial_monthly_expenses', JSON.stringify(monthlyExpenses));
  }, [monthlyExpenses]);

  // Transaction methods
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      setLoading(true);
      const newTransaction: Transaction = {
        ...transaction,
        id: uuidv4(),
        time: transaction.time || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isPaid: transaction.isPaid ?? true
      };

      setTransactions(prev => [newTransaction, ...prev]);

      // If it's a recurring transaction, create future instances
      if (transaction.isRecurring && transaction.frequency) {
        const futureTransactions = generateRecurringTransactions(newTransaction);
        setTransactions(prev => [...prev, ...futureTransactions]);
      }

      // Update goal progress if it's an income towards a goal
      if (transaction.type === 'income' && transaction.notes?.includes('meta:')) {
        const goalId = transaction.notes.split('meta:')[1];
        await updateGoalProgress(goalId, transaction.amount);
      }

      setError(null);
    } catch (err) {
      setError('Erro ao adicionar transação');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      setLoading(true);
      setTransactions(prev => prev.map(t => 
        t.id === id ? { ...t, ...updates } : t
      ));
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar transação');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      setLoading(true);
      setTransactions(prev => prev.filter(t => t.id !== id));
      setError(null);
    } catch (err) {
      setError('Erro ao excluir transação');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Goal methods
  const addGoal = async (goal: Omit<FinancialGoal, 'id' | 'current' | 'createdAt'>) => {
    try {
      setLoading(true);
      const newGoal: FinancialGoal = {
        ...goal,
        id: uuidv4(),
        current: 0,
        createdAt: new Date().toISOString()
      };
      setGoals(prev => [newGoal, ...prev]);
      setError(null);
    } catch (err) {
      setError('Erro ao adicionar meta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async (id: string, updates: Partial<FinancialGoal>) => {
    try {
      setLoading(true);
      setGoals(prev => prev.map(g => 
        g.id === id ? { ...g, ...updates } : g
      ));
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar meta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      setLoading(true);
      setGoals(prev => prev.filter(g => g.id !== id));
      setError(null);
    } catch (err) {
      setError('Erro ao excluir meta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGoalProgress = async (id: string, amount: number) => {
    try {
      setGoals(prev => prev.map(g => 
        g.id === id ? { ...g, current: Math.min(g.current + amount, g.target) } : g
      ));
    } catch (err) {
      console.error('Error updating goal progress:', err);
    }
  };

  // Category methods
  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      setLoading(true);
      const newCategory: Category = {
        ...category,
        id: uuidv4(),
        isCustom: true
      };
      setCategories(prev => [...prev, newCategory]);
      setError(null);
    } catch (err) {
      setError('Erro ao adicionar categoria');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      setLoading(true);
      setCategories(prev => prev.map(c => 
        c.id === id ? { ...c, ...updates } : c
      ));
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar categoria');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setLoading(true);
      const category = categories.find(c => c.id === id);
      if (category && !category.isCustom) {
        throw new Error('Não é possível excluir categorias padrão');
      }
      setCategories(prev => prev.filter(c => c.id !== id));
      setError(null);
    } catch (err) {
      setError('Erro ao excluir categoria');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Monthly expense methods
  const addMonthlyExpense = async (expense: Omit<MonthlyExpense, 'id'>) => {
    try {
      setLoading(true);
      const newExpense: MonthlyExpense = {
        ...expense,
        id: uuidv4()
      };
      setMonthlyExpenses(prev => [...prev, newExpense]);

      // Create corresponding transaction if paid
      if (expense.isPaid) {
        const category = categories.find(c => c.id === expense.categoryId);
        if (category) {
          await addTransaction({
            type: 'expense',
            description: expense.description,
            amount: expense.amount,
            category: category.name,
            date: expense.dueDate,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            isRecurring: expense.isRecurring,
            isPaid: true,
            notes: expense.notes,
            monthlyExpenseId: newExpense.id
          });
        }
      }

      setError(null);
    } catch (err) {
      setError('Erro ao adicionar despesa mensal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMonthlyExpense = async (id: string, updates: Partial<MonthlyExpense>) => {
    try {
      setLoading(true);
      setMonthlyExpenses(prev => prev.map(e => 
        e.id === id ? { ...e, ...updates } : e
      ));
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar despesa mensal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMonthlyExpense = async (id: string) => {
    try {
      setLoading(true);
      const expense = monthlyExpenses.find(e => e.id === id);
      if (expense?.transactionId) {
        await deleteTransaction(expense.transactionId);
      }
      setMonthlyExpenses(prev => prev.filter(e => e.id !== id));
      setError(null);
    } catch (err) {
      setError('Erro ao excluir despesa mensal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleExpensePaid = async (id: string) => {
    try {
      const expense = monthlyExpenses.find(e => e.id === id);
      if (!expense) return;

      const newPaidStatus = !expense.isPaid;
      await updateMonthlyExpense(id, { isPaid: newPaidStatus });

      if (newPaidStatus && !expense.transactionId) {
        // Create transaction when marking as paid
        const category = categories.find(c => c.id === expense.categoryId);
        if (category) {
          await addTransaction({
            type: 'expense',
            description: expense.description,
            amount: expense.amount,
            category: category.name,
            date: expense.dueDate,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            isRecurring: expense.isRecurring,
            isPaid: true,
            notes: expense.notes,
            monthlyExpenseId: id
          });
        }
      } else if (!newPaidStatus && expense.transactionId) {
        // Remove transaction when marking as unpaid
        await deleteTransaction(expense.transactionId);
        await updateMonthlyExpense(id, { transactionId: undefined });
      }
    } catch (err) {
      setError('Erro ao atualizar status da despesa');
      throw err;
    }
  };

  // Calculation methods
  const getBalance = () => {
    return transactions
      .filter(t => t.isPaid)
      .reduce((acc, t) => {
        return t.type === 'income' ? acc + t.amount : acc - t.amount;
      }, 0);
  };

  const getIncomeTotal = (period?: 'day' | 'week' | 'month' | 'year') => {
    const filteredTransactions = filterTransactionsByPeriod(transactions, period);
    return filteredTransactions
      .filter(t => t.type === 'income' && t.isPaid)
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getExpenseTotal = (period?: 'day' | 'week' | 'month' | 'year') => {
    const filteredTransactions = filterTransactionsByPeriod(transactions, period);
    return filteredTransactions
      .filter(t => t.type === 'expense' && t.isPaid)
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getTransactionsByCategory = (period?: 'day' | 'week' | 'month' | 'year') => {
    const filteredTransactions = filterTransactionsByPeriod(transactions, period);
    const categoryMap = new Map<string, { total: number; count: number }>();

    filteredTransactions
      .filter(t => t.isPaid)
      .forEach(transaction => {
        const current = categoryMap.get(transaction.category) || { total: 0, count: 0 };
        categoryMap.set(transaction.category, {
          total: current.total + transaction.amount,
          count: current.count + 1
        });
      });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count
    }));
  };

  const getMonthlyExpensesByCategory = (month: string) => {
    const expensesByCategory = monthlyExpenses
      .filter(e => e.month === month)
      .reduce((acc, expense) => {
        const category = categories.find(c => c.id === expense.categoryId)?.name || 'Outros';
        const current = acc.get(category) || { total: 0, count: 0 };
        acc.set(category, {
          total: current.total + expense.amount,
          count: current.count + 1
        });
        return acc;
      }, new Map<string, { total: number; count: number }>());

    return Array.from(expensesByCategory.entries()).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count
    }));
  };

  const getGoalProgress = (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return 0;
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getDailySpending = () => {
    const today = new Date().toISOString().split('T')[0];
    return transactions
      .filter(t => t.type === 'expense' && t.date === today && t.isPaid)
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getUpcomingPayments = (days: number = 7) => {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    
    return transactions
      .filter(t => {
        const dueDate = new Date(t.dueDate || t.date);
        return t.type === 'expense' && 
               dueDate >= today && 
               dueDate <= futureDate &&
               !t.isPaid;
      })
      .sort((a, b) => new Date(a.dueDate || a.date).getTime() - new Date(b.dueDate || b.date).getTime());
  };

  const getCashFlow = (period: 'week' | 'month' | 'year' = 'month') => {
    const data: { date: string; income: number; expenses: number; balance: number }[] = [];
    const sortedTransactions = [...transactions]
      .filter(t => t.isPaid)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let runningBalance = 0;
    const dateMap = new Map<string, { income: number; expenses: number }>();

    sortedTransactions.forEach(transaction => {
      const date = transaction.date;
      const current = dateMap.get(date) || { income: 0, expenses: 0 };
      
      if (transaction.type === 'income') {
        current.income += transaction.amount;
        runningBalance += transaction.amount;
      } else {
        current.expenses += transaction.amount;
        runningBalance -= transaction.amount;
      }
      
      dateMap.set(date, current);
    });

    dateMap.forEach((value, date) => {
      data.push({
        date,
        income: value.income,
        expenses: value.expenses,
        balance: runningBalance
      });
    });

    return data;
  };

  const getBudgetStatus = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlySpending = getTransactionsByCategory('month');
    
    return categories
      .filter(c => c.budget && c.budget > 0)
      .map(category => {
        const spent = monthlySpending.find(s => s.category === category.name)?.total || 0;
        return {
          category: category.name,
          spent,
          budget: category.budget!,
          percentage: (spent / category.budget!) * 100
        };
      });
  };

  // Utility methods
  const exportData = () => {
    const data = {
      transactions,
      goals,
      categories,
      monthlyExpenses,
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = async (data: string) => {
    try {
      setLoading(true);
      const parsed = JSON.parse(data);
      
      if (parsed.transactions) setTransactions(parsed.transactions);
      if (parsed.goals) setGoals(parsed.goals);
      if (parsed.categories) setCategories(parsed.categories);
      if (parsed.monthlyExpenses) setMonthlyExpenses(parsed.monthlyExpenses);
      
      setError(null);
    } catch (err) {
      setError('Erro ao importar dados');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = async () => {
    try {
      setLoading(true);
      setTransactions([]);
      setGoals([]);
      setMonthlyExpenses([]);
      
      // Reset to default categories
      const defaultCats = DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        id: uuidv4()
      }));
      setCategories(defaultCats);
      
      setError(null);
    } catch (err) {
      setError('Erro ao limpar dados');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <FinancialContext.Provider value={{
      transactions,
      goals,
      categories,
      monthlyExpenses,
      loading,
      error,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addGoal,
      updateGoal,
      deleteGoal,
      updateGoalProgress,
      addCategory,
      updateCategory,
      deleteCategory,
      addMonthlyExpense,
      updateMonthlyExpense,
      deleteMonthlyExpense,
      toggleExpensePaid,
      getBalance,
      getIncomeTotal,
      getExpenseTotal,
      getTransactionsByCategory,
      getMonthlyExpensesByCategory,
      getGoalProgress,
      getDailySpending,
      getUpcomingPayments,
      getCashFlow,
      getBudgetStatus,
      exportData,
      importData,
      clearAllData
    }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

// Helper functions
function filterTransactionsByPeriod(transactions: Transaction[], period?: 'day' | 'week' | 'month' | 'year') {
  if (!period) return transactions;

  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case 'day':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }

  return transactions.filter(t => new Date(t.date) >= startDate);
}

function generateRecurringTransactions(baseTransaction: Transaction): Transaction[] {
  const transactions: Transaction[] = [];
  const startDate = new Date(baseTransaction.date);
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1); // Generate for next year

  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    switch (baseTransaction.frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
      default:
        return transactions;
    }

    if (currentDate <= endDate) {
      transactions.push({
        ...baseTransaction,
        id: uuidv4(),
        date: currentDate.toISOString().split('T')[0],
        isPaid: false // Future transactions start as unpaid
      });
    }
  }

  return transactions;
}