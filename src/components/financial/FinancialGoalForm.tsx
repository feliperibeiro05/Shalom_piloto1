import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Target } from 'lucide-react';
import { Button } from '../ui/Button';

interface FinancialGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: any) => void;
}

export const FinancialGoalForm: React.FC<FinancialGoalFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    deadline: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-xl p-6 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold text-white mb-6">Nova Meta Financeira</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nome da Meta
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
              placeholder="Ex: Fundo de Emergência"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Valor Alvo
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">R$</span>
              <input
                type="number"
                value={formData.target}
                onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                placeholder="0,00"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Data Limite
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
              rows={3}
              placeholder="Descreva sua meta financeira..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Target className="h-4 w-4 mr-2" />
              Criar Meta
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};