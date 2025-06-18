import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, DollarSign, Calendar, Clock, Tag, FileText, Repeat, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useFinancial } from '../../contexts/FinancialContext';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingTransaction?: any;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  editingTransaction
}) => {
  const { addTransaction, updateTransaction, categories, loading } = useFinancial();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    type: editingTransaction?.type || 'expense',
    description: editingTransaction?.description || '',
    amount: editingTransaction?.amount?.toString() || '',
    category: editingTransaction?.category || '',
    date: editingTransaction?.date || new Date().toISOString().split('T')[0],
    time: editingTransaction?.time || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    isRecurring: editingTransaction?.isRecurring || false,
    frequency: editingTransaction?.frequency || 'monthly',
    notes: editingTransaction?.notes || '',
    tags: editingTransaction?.tags?.join(', ') || ''
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const transactionData = {
        type: formData.type as 'income' | 'expense',
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        time: formData.time,
        isRecurring: formData.isRecurring,
        frequency: formData.frequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
        notes: formData.notes.trim(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };

      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }

      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isRecurring: false,
      frequency: 'monthly',
      notes: '',
      tags: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    onClose();
    if (!editingTransaction) {
      resetForm();
    }
  };

  const availableCategories = categories.filter(c => c.type === formData.type);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold text-white mb-6">
          {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
              className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-colors ${
                formData.type === 'expense'
                  ? 'bg-red-500/20 border-red-500'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <DollarSign className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium">Despesa</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
              className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-colors ${
                formData.type === 'income'
                  ? 'bg-green-500/20 border-green-500'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Receita</span>
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Descrição *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3 py-2 bg-gray-700 rounded-lg border text-white placeholder-gray-400 focus:ring-1 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
              }`}
              placeholder="Ex: Aluguel, Salário, Supermercado..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Valor *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">R$</span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className={`w-full pl-10 pr-3 py-2 bg-gray-700 rounded-lg border text-white placeholder-gray-400 focus:ring-1 focus:ring-blue-500 ${
                  errors.amount ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                }`}
                placeholder="0,00"
                step="0.01"
                min="0"
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Categoria *
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full pl-10 pr-3 py-2 bg-gray-700 rounded-lg border text-white focus:ring-1 focus:ring-blue-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                }`}
              >
                <option value="">Selecione uma categoria</option>
                {availableCategories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Data *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full pl-10 pr-3 py-2 bg-gray-700 rounded-lg border text-white focus:ring-1 focus:ring-blue-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.date && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.date}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Hora
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Recurring Transaction */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.isRecurring}
              onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="recurring" className="text-sm text-gray-300 flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              É uma transação recorrente?
            </label>
          </div>

          {formData.isRecurring && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Frequência
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="daily">Diária</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
                <option value="yearly">Anual</option>
              </select>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tags (separadas por vírgula)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Ex: essencial, trabalho, lazer"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Observações
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows={3}
                placeholder="Adicione notas ou detalhes sobre a transação..."
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Salvando...
                </div>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {editingTransaction ? 'Atualizar' : 'Adicionar'}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};