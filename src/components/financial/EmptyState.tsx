import React from 'react';
import { PiggyBank, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  onAddTransaction: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddTransaction }) => {
  return (
    <div className="text-center py-12">
      <PiggyBank className="h-16 w-16 text-blue-500/50 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">
        Comece sua jornada financeira
      </h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        Registre sua primeira transação para começar a acompanhar suas finanças de forma inteligente.
      </p>
      <Button
        onClick={onAddTransaction}
        className="bg-gradient-to-r from-blue-600 to-purple-600"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Primeira Transação
      </Button>
    </div>
  );
};